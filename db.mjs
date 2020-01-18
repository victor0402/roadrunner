import mongo from 'mongodb';

class Database {
  async getClient() {
    const url = process.env.MONGO_URL;
    const client = await mongo.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })

    client.db('keys');

    return client.db('keys');
  }

  async getCollection(collectionName) {
    const url = process.env.MONGO_URL;
    const client = await mongo.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })

    const database = client.db('keys');

    return database.collection(collectionName)
  }

  async save(key, value) {
    const client = await getClient();
    const db = client.db('keys')

    const collection = db.collection('keys')

    collection.insertOne({
      key,
      value
    })
  }

  async retrieve(key) {
    const client = await getClient();
    const db = client.db('keys')

    const collection = db.collection('keys')
    const result = await collection.findOne({ key })
    return result.value
  }

  async destroy(key) {
    const client = await getClient();
    const db = client.db('keys')

    const collection = db.collection('keys')
    const result = await collection.deleteOne({ key })
    return result.value
  }
}

export default Database;