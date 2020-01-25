import mongodb from 'mongodb';
import db from '../services/Database'

const collectionName = 'checkRuns';

class CheckRun {
  constructor(data) {
    this.id = data.id;
    this.createdAt = data.createdAt;
    this.commitSha = data.commitSha;
    this.state = data.state;
  }

  async create() {
    const collection = await db.getCollection(collectionName);

    const commit = await collection.insertOne({
      createdAt: Date.now(),
      commitSha: this.commitSha,
      state: this.state,
    });

    this.id = commit.ops[0]._id

    return this;
  };

  async update() {
    const collection = await db.getCollection(collectionName);
    const json = {
      state: this.state,
      createdAt: this.createdAt
    };

    const objectID = new mongodb.ObjectID(this.id)
    return await collection.updateOne({ _id: objectID }, { $set: json })
  };

  async createOrLoadByCommitSha() {
    const checkRun = await CheckRun.findByCommitSha(this.commitSha);

    if (checkRun) {
      checkRun.state = this.state;
      await checkRun.update();
      return checkRun;
    }

    return await this.create()
  }

  static async findByCommitSha(commitSha) {
    const collection = await db.getCollection(collectionName);

    const response = await collection.findOne({
      commitSha,
    });

    if (!response) {
      return null;
    }

    return new CheckRun({ ...response, id: response._id })
  };

  static async findLastStateForCommits(commitsSha) {
    const collection = await db.getCollection(collectionName);
    const query = commitsSha.map(s => ({ commitSha: s }))

    const response = await collection.find({ $or: query })
    let array = await response.toArray();
    if (array.length === 0) {
      return null;
    }

    array = array.sort((a, b) => b.createdAt - a.createdAt)
    const checkRun = array[0];

    return new CheckRun({ ...checkRun, id: checkRun._id });
  };
};

export default CheckRun;