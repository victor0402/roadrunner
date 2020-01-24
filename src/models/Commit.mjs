import db from '../Database.mjs'
import PullRequest from './PullRequest.mjs'

const collectionName = 'commits';

class Commit {
  constructor(data) {
    this.prId = data.prId;
    this.sha = data.sha;
    this.message = data.message;
    this.createdAt = data.createdAt;
    this.authorName = data.authorName;
    this.authorEmail = data.authorEmail;
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
      createdAt: this.createdAt,
      authorName: this.authorName,
      authorEmail: this.authorEmail
    });

    this.id = commit.ops[0]._id

    return this;
  }

  static async findBySha(sha) {
    const collection = await db.getCollection(collectionName);
    const result = await collection.findOne({
      sha
    });

    if(!result) {
      return;
    }

    return new Commit(result)
  }

  static async findByPRId(prId) {
    const collection = await db.getCollection(collectionName);
    const result = await collection.findOne({
      prId
    });

    if(!result) {
      return;
    }
    return new Commit(result.prId, result.sha, result.message)
  }
};

export default Commit;