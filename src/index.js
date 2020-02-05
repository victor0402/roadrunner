import dotenv from 'dotenv'
dotenv.config()

import bodyParser from 'body-parser';
import express from 'express';
import { SlackRepository, Github, Slack } from '@services';
import { PullRequest, SlackMessage } from './models';
import Flows from './Flows/index';
import ReleaseFlow from './Flows/ReleaseFlow';

import checkRunPendingJson from './payload-examples/checkRunPending.json';
import checkRunFailureJson from './payload-examples/checkRunFailure.json';
import closePrJson from './payload-examples/closePR.json';
import newFullPrJson from './payload-examples/newFullPR.json';
import newChangeJson from './payload-examples/newPush.json';
import submitReviewChangesApproved from './payload-examples/submitReviewChangesApproved.json';
import submitReviewChangesRequested from './payload-examples/submitReviewChangesRequested.json';

const app = express()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

const PORT = process.env.PORT || 3000

const processFlowRequest = async (req, res) => {
  const json = req.body;

  const Flow = await Flows.getFlow(json)

  if (!Flow) {
    res.sendStatus(200)
    return;
  }

  const flowName = Flow.name;
  console.log(`Start: ${flowName}`)
  await Flow.start(json)
  console.log(`End: ${flowName}`)

  res.sendStatus(200)
}

app.post('/', (req, res) => {
  processFlowRequest(req, res)
})

app.get('/', async (req, res) => {
  res.send({
    status: 200,
    configuration: SlackRepository.data
  })
})

const getPullRequestsJSON = async (prs) => {
  //  prs = prs.filter(pr => pr.repositoryName !== 'gh-hooks-repo-test')

  // prs = [prs[prs.length -1]]
  // prs = prs.filter(pr => pr.id === '5e1a46fa7afaf493c222cb87')

  await Promise.all(prs.map(pr => pr.getReviews()));

  await Promise.all(prs.map(pr => pr.getChanges()));

  return prs.map(pr => {
    const approvedReviews = pr.reviews.filter(r => r.state === 'approved')
    const reprovedReviews = pr.reviews.filter(r => r.state === 'changes_requested')


    const sortedChanges = pr.changes.sort((a, b) => (b.updatedAt || b.createdAt) - (a.updatedAt || a.createdAt));

    const latestChange = sortedChanges.length > 0 ? pr.changes[0] : undefined;

    const reviews = pr.reviews;

    const outdatedReviews = reviews.filter((r) => {
      return (r.updatedAt || r.createdAt) < (latestChange || {}).createdAt
    });

    const outdatedReviewsUsernames = outdatedReviews.map(a => a.username);

    const approvedByList = approvedReviews.map(r => SlackRepository.getSlackUser(r.username));
    const repprovedByList = reprovedReviews.map(r => SlackRepository.getSlackUser(r.username));

    const getListOrFirst = (list) => {
      if (list.length > 1) {
        return list;
      } else if (list.length === 1) {
        return list[0]
      }
    }

    return {
      title: pr.title,
      link: pr.link,
      ci_state: pr.ciState ? pr.ciState : 'unavailable',
      approved_by: getListOrFirst(approvedByList),
      reproved_by: getListOrFirst(repprovedByList),
      new_changes_after_last_review_of: getListOrFirst(outdatedReviewsUsernames)
    }
  })
}
app.get(`/open-prs/:devGroup`, async (req, res) => {
  const devGroup = req.params.devGroup;
  const repositoryNames = Object.keys(SlackRepository.data);

  const filteredRepositories = repositoryNames.filter(k => SlackRepository.data[k].devGroup === `@${devGroup}`)

  const prs = await PullRequest.list({ state: 'open', repositoryName: { $in: filteredRepositories } })

  const data = await getPullRequestsJSON(prs);

  res.send({
    status: 200,
    length: data.length,
    data,
  })
})

app.get('/open-prs', async (req, res) => {
  let prs = await PullRequest.list({ repositoryName: { $ne: 'gh-hooks-repo-test' }, state: 'open' })
  const data = await getPullRequestsJSON(prs);

  res.send({
    status: 200,
    length: data.length,
    data,
  })
})

app.get('/test-new-full-pr', async (req, res) => {
  processFlowRequest({
    body: newFullPrJson,
  }, res)
})

app.get('/test-close-pr', async (req, res) => {
  processFlowRequest({
    body: closePrJson,
  }, res)
})

app.get('/test-new-change', async (req, res) => {
  processFlowRequest({
    body: newChangeJson,
  }, res)
})

app.get('/test-submit-review-changes-requested', async (req, res) => {
  processFlowRequest({
    body: submitReviewChangesRequested,
  }, res)
})

app.get('/test-submit-review-changes-approved', async (req, res) => {
  processFlowRequest({
    body: submitReviewChangesApproved,
  }, res)
})

app.get('/test-checkrun-pending', async (req, res) => {
  processFlowRequest({
    body: checkRunPendingJson,
  }, res)
})

app.get('/test-checkrun-failure', async (req, res) => {
  processFlowRequest({
    body: checkRunFailureJson,
  }, res)
})

app.post('/slack-callback', (req, res) => {
  const json = req.body;
  const { callbackIdentifier, slackThreadTS } = json;

  const slackMessage = new SlackMessage(callbackIdentifier, slackThreadTS)
  slackMessage.create()

  res.sendStatus(200)
})

app.get('/test-github/:prId', async (req, res) => {
  const prId = req.params.prId;
  const commit = await Github.getCommits(prId)

  res.send(commit)
})

app.get('/test-new-message', async (req, res) => {
  const as = await Slack.sendMessage({ message: "POTATO", slackChannel: 'test-gh' })

  res.send(as)
})

app.post('/deploy', async (req, res) => {
  const json = req.body;
  const Flow = ReleaseFlow;

  const flowName = Flow.name;
  console.log(`Start: ${flowName}`)
  const repositoryData = SlackRepository.getRepositoryDataByDeployChannel(json.channel_name);
  let message;

  let stop;
  if (repositoryData && repositoryData.supports_deploy) {
    message = 'ok';
  } else {
    message = "This channel doesn't support automatic deploys";
    stop = true;
  }

  if (json.text !== 'update qa') {
    stop = true;
    if (json.text === 'update prod') {
      message = 'This is an experimental feature. Please notify @kaio before trying again.'
    } else {
      message = 'Please enter valid instructions.'
    }
  }

  if (!stop) {
    Flow.start(json)
  }

  const blocks = {
    "blocks": [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": message,
        }
      }
    ]
  }
  res.send(blocks);
})


app.listen(PORT, () => console.log(`App listening on port ${PORT}!`))