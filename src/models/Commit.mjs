import db from '../db.mjs'
import PullRequest from './PullRequest.mjs'

const collectionName = 'commits';

class Commit {
  constructor(prId, sha, message) {
    this.prId = prId;
    this.sha = sha;
    this.message = message;
  }

  async getPullRequest() {
    this.pullRequest = await PullRequest.findById(this.prId)
    return this.pullRequest;
  }

  async create() {
    const collection = await db.getCollection(collectionName);

    const commit = await collection.insertOne({
      prId: this.prId,
      sha: this.sha,
      message: this.message,
    });

    this.id = commit.ops[0]._id

    console.log(`creating commit with sha ${this.sha}`)
    return this;
  }

  static async findBySha(sha) {
    const collection = await db.getCollection(collectionName);
    const result = await collection.findOne({
      sha
    });

    if(!result) {
      console.log(`Couldn't find commit with sha ${sha}`)
      return;
    }
    return new Commit(result.prId, result.sha, result.message)
  }

  static async findByPRId(prId) {
    const collection = await db.getCollection(collectionName);
    const result = await collection.findOne({
      prId
    });
    if(!result) {
      console.log(`Couldn't find commit with prId ${prId}`)
      return;
    }
    return new Commit(result.prId, result.sha, result.message)
  }
};

export default Commit;