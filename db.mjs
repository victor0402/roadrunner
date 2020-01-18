import mongo from 'mongodb';

const DATABASE_NAME = 'keys';

class Database {
  static async getCollection(collectionName) {
    const url = process.env.MONGO_URL;
    const client = await mongo.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })

    const database = client.db(DATABASE_NAME);

    return database.collection(collectionName)
  }
}

export default Database;