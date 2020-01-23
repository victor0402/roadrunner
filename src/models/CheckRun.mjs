import db from '../Database.mjs'

const collectionName = 'checkRuns';

class CheckRun {
  constructor(data) {
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

  async createOrLoadByCommitSha() {
    const checkRun = await CheckRun.findByCommitSha(this.commitSha);
    
    if (checkRun) {
      return checkRun;
    }

    return await this.create()
  }

  static async findByCommitSha(commitSha) {
    console.log('looking')
    const collection = await db.getCollection(collectionName);

    const response = await collection.findOne({
      commitSha,
    });

    if (!response) {
      return null;
    }

    return new CheckRun(response)
  };

};

export default CheckRun;