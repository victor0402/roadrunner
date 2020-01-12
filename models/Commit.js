const db = require('../db');
const PullRequest = require('./PullRequest').default

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

    const slackMessage = await collection.insertOne({
      prId: this.prId,
      sha: this.sha,
      message: this.message,
    });

    this.id = slackMessage.ops[0]._id
  }

  static async findBySha(sha) {
    const collection = await db.getCollection(collectionName);
    const result = await collection.findOne({
      sha
    });
    return new Commit(result.prId, result.sha, result.message)
  }

  static async findByPRId(prId) {
    const collection = await db.getCollection(collectionName);
    const result = await collection.findOne({
      prId
    });
    return new Commit(result.prId, result.sha, result.message)
  }
};

exports.default = Commit;