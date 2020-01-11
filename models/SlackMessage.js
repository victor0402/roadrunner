const db = require('../db');
const pry = require('pry')

const collectionName = 'slackMessages';

class SlackMessage {
  constructor(prId, ts) {
    this.prId = prId;
    this.ts = ts;
  }

  async create() {
    const collection = await db.getCollection(collectionName);

    const slackMessage = await collection.insertOne({
      prId: this.prId,
      ts: this.ts,
    });

    this.id = slackMessage.ops[0]._id
  }

  static async findByPRId(prId) {
    const collection = await db.getCollection(collectionName);
    const result = await collection.findOne({
      prId
    });
    return new SlackMessage(result.prId, result.ts)
  }
};

exports.default = SlackMessage;