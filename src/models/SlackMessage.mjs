import db from '../Database.mjs';

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

    if (!result) {
      console.log("Couldn't find Slack message for ts: ", prId);
      return null;
    }
    return new SlackMessage(result.prId, result.ts)
  }
};

export default SlackMessage;