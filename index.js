const axios = require('axios')
const bodyParser = require('body-parser');
const express = require('express')

const Parsers = require('./Parsers')

const app = express()
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000

const ZAPIER_WEBHOOK_URL = process.env.ZAPIER_WEBHOOK_URL;

app.post('/', (req, res) => {
  const json = req.body;
  console.log(json)
  const Parser = Parsers.getParser(json)
  const content = Parser.getContent(json)
  console.log(content)

  axios.post(ZAPIER_WEBHOOK_URL, content)

  res.send(200)
})

app.get('/', (req, res) => {
  res.send({
    status: 200
  })
})

app.listen(PORT, () => console.log(`App listening on port ${PORT}!`))