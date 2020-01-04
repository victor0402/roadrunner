const bodyParser = require('body-parser');
const express = require('express');
const DB = require('./db');

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
    status: 200
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

app.post('/slack-callback', (req, res) => {
  const json = req.body;
  console.log('slack callback')
  console.log('body', json)
  const { callbackIdentifier, slackThreadTS } = json;
  DB.save(callbackIdentifier, slackThreadTS)

  res.sendStatus(200)
})

app.listen(PORT, () => console.log(`App listening on port ${PORT}!`))