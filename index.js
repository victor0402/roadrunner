const bodyParser = require('body-parser');
const express = require('express');
const SlackRepository = require('./SlackRepository')
const PullRequest = require('./models/PullRequest').default
const SlackMessage = require('./models/SlackMessage').default
require('dotenv').config()

const Flows = require('./Flows')

const app = express()
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000

const processFlowRequest = (req, res) => {
  const json = req.body;

  const Flow = Flows.getFlow(json)

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

app.get('/test-github', async (req, res) => {

  // DB.save(`pr-id`, 'test', 'commits')

  //  console.log(await DB.retrieve('pr-id'), 'commits')

  const a = await PullRequest.findById("5e1a308592df068a53c5f01c")


  res.sendCode(200)
})



app.listen(PORT, () => console.log(`App listening on port ${PORT}!`))