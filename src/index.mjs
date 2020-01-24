import dotenv from 'dotenv'
dotenv.config()

import bodyParser from 'body-parser';
import express from 'express';
import SlackRepository from './SlackRepository.mjs';
import PullRequest from './models/PullRequest.mjs'
import Github from './Github.mjs';
import SlackMessage from './models/SlackMessage.mjs';
import Flows from './Flows/index.mjs';

import checkRunPendingJson from './payload-examples/checkRunPending.json';
import checkRunFailureJson from './payload-examples/checkRunFailure.json';
import closePrJson from './payload-examples/closePR.json';
import newFullPrJson from './payload-examples/newFullPR.json';
import newChangeJson from './payload-examples/newPush.json';
import submitReviewChangesApproved from './payload-examples/submitReviewChangesApproved.json';
import submitReviewChangesRequested from './payload-examples/submitReviewChangesRequested.json';


const app = express()
app.use(bodyParser.json());

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
  prs = prs.filter(pr => pr.repositoryName !== 'gh-hooks-repo-test')
  //  prs = prs.filter(pr => pr.id === '5e2a59210b72038460276690')
  await Promise.all(prs.map(pr => {
    return pr.getReviews();
  }))
  return prs.map(pr => {
    const approvedReviews = pr.reviews.filter(r => r.state === 'approved')
    const reprovedReviews = pr.reviews.filter(r => r.state === 'changes_requested')

    return {
      title: pr.title,
      link: pr.link,
      ci_state: pr.ciState,
      approved_by: approvedReviews.map(r => r.username),
      reproved_by: reprovedReviews.map(r => r.username),
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
  let prs = await PullRequest.list({ state: 'open' })
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

app.get('/test-github-status', async (req, res) => {
  const commit = await Github.getStatus('test-pr', 'codelittinc', 'codelitt-v2')

  res.send(commit)
})



app.listen(PORT, () => console.log(`App listening on port ${PORT}!`))