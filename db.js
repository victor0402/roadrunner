const mongo = require('mongodb').MongoClient
const url = 'mongodb+srv://engineering:AtThisPoint@cluster0-xwdex.mongodb.net/test?retryWrites=true&w=majority'

const getClient = async () => {
  const client = await mongo.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })

  return client;
}

const save = async (key, value) => {
  const client = await getClient();
  const db = client.db('keys')

  const collection = db.collection('keys')

  collection.insertOne({
    key,
    value
  })
}

const retrieve = async (key) => {
  const client = await getClient();
  const db = client.db('keys')

  const collection = db.collection('keys')
  const result = await collection.findOne({ key })
  return result.value
}

exports.save = save;
exports.retrieve = retrieve;