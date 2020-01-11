const db = require('../db');

const collectionName = 'commits';

class Commit {
  constructor(prId, sha, message) {
    this.prId = prId;
    this.sha = sha;
    this.message = message;
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

  static async findByPRId(prId) {
    const collection = await db.getCollection(collectionName);
    const result = await collection.findOne({
      prId
    });
    return new Commit(result.prId, result.sha, result.message)
  }
};

exports.default = Commit;