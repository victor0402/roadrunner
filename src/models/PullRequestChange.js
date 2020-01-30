import { BaseModel } from '@models';

class PullRequestChange extends BaseModel {
  static collectionName = 'pullRequestChanges';

  static async findByPRId(prId) {
    return await PullRequestChange.list({ prId });
  }

  toJson() {
    return {
      prId: this.prId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    }
  }
};

export default PullRequestChange;