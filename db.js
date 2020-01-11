const mongo = require('mongodb').MongoClient

const getClient = async () => {
  const url = process.env.MONGO_URL;
  const client = await mongo.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })

  client.db('keys');

  return client.db('keys');
}

const getCollection = async (collectionName) => {
  const url = process.env.MONGO_URL;
  const client = await mongo.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })

  const database = client.db('keys');

  return database.collection(collectionName)
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

const destroy = async (key) => {
  const client = await getClient();
  const db = client.db('keys')

  const collection = db.collection('keys')
  const result = await collection.deleteOne({ key })
  return result.value
}

exports.save = save;
exports.retrieve = retrieve;
exports.destroy = destroy
exports.getClient = getClient
exports.getCollection = getCollection