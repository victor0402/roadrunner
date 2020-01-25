import { BaseModel } from '@models';

class SlackMessage extends BaseModel {
  static collectionName = 'slackMessages';

  static async findByPRId(prId) {
    return await SlackMessage.findBy({ prId });
  }

  toJson() {
    return {
      prId: this.prId,
      ts: this.ts,
    };
  }
};

export default SlackMessage;