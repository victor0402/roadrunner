import dotenv from 'dotenv'
dotenv.config()

import bodyParser from 'body-parser';
import express from 'express';
import SlackRepository from './SlackRepository.mjs';
import PullRequest from './models/PullRequest.mjs'
import Github from './Github.mjs';
import SlackMessage from './models/SlackMessage.mjs';
import Flows from './Flows/index.mjs';


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
    console.log("No flow found!")
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

app.get(`/open-prs/:devGroup`, async (req, res) => {
  const devGroup = req.params.devGroup;
  const repositoryNames = Object.keys(SlackRepository.data);

  const filteredRepositories = repositoryNames.filter(k => SlackRepository.data[k].devGroup === `@${devGroup}`)

  const prs = await PullRequest.list({ state: 'open', repositoryName: { $in: filteredRepositories }})

  res.send({
    status: 200,
    length: prs.length,
    data: prs.map(pr => ({ state: pr.state, link: pr.link, title: pr.title })),
  })
})

app.get('/open-prs', async (req, res) => {
  const prs = await PullRequest.list({ state: 'open' })

  res.send({
    status: 200,
    length: prs.length,
    data: prs.map(pr => ({ state: pr.state, link: pr.link }))
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



app.listen(PORT, () => console.log(`App listening on port ${PORT}!`))