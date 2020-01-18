import Github from './src/Github.mjs';
import bodyParser from 'body-parser';
import express from 'express';
import SlackRepository from './SlackRepository.mjs';
import PullRequest from './models/PullRequest.mjs'
import SlackMessage from './models/SlackMessage.mjs';
import Flows from './Flows/index.mjs';
import dotenv from 'dotenv'

dotenv.config()

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

  Flow.start(json)

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
  const newPRJson = require('./payload-examples/newFullPR.json')
  processFlowRequest({
    body: newPRJson,
  }, res)
})

app.get('/test-new-pr-comment', async (req, res) => {
  const newPRJson = require('./payload-examples/newPRComment.json')
  processFlowRequest({
    body: newPRJson,
  }, res)
})

app.get('/test-close-pr', async (req, res) => {
  const newPRJson = require('./payload-examples/closePR.json')
  processFlowRequest({
    body: newPRJson,
  }, res)
})

app.get('/test-new-change', async (req, res) => {
  const newPRJson = require('./payload-examples/newPush.json')
  processFlowRequest({
    body: newPRJson,
  }, res)
})

app.get('/test-submit-review-changes-requested', async (req, res) => {
  const newPRJson = require('./payload-examples/submitReviewChangesRequested.json')
  processFlowRequest({
    body: newPRJson,
  }, res)
})
app.get('/test-submit-review-changes-requested', async (req, res) => {
  const newPRJson = require('./payload-examples/submitReviewChangesRequested.json')
  processFlowRequest({
    body: newPRJson,
  }, res)
})

app.get('/test-submit-review-changes-approved', async (req, res) => {
  const newPRJson = require('./payload-examples/submitReviewChangesApproved.json')
  processFlowRequest({
    body: newPRJson,
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