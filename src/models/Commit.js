import { BaseModel, PullRequest } from '@models';

class Commit extends BaseModel {
  static collectionName = 'commits';

  async getPullRequest() {
    return await PullRequest.findById(this.prId)
  }

  static async findBySha(sha) {
    return await BaseModel.findBy({ sha });
  }

  static async findByPRId(prId) {
    return await BaseModel.findBy({ prId });
  }

  toJson() {
    return {
      prId: this.prId,
      sha: this.sha,
      message: this.message,
      createdAt: this.createdAt,
      authorName: this.authorName,
      authorEmail: this.authorEmail
    }
  }
};

export default Commit;