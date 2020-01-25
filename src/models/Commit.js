import Database from '@services/Database'
import { BaseModel, PullRequest } from '@models';

const collectionName = 'commits';

class Commit extends BaseModel {
  async getPullRequest() {
    this.pullRequest = await PullRequest.findById(this.prId)
    return this.pullRequest;
  }

  async create() {
    const collection = await Database.getCollection(collectionName);

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
    const collection = await Database.getCollection(collectionName);
    const result = await collection.findOne({
      sha
    });

    if(!result) {
      return;
    }

    return new Commit(result)
  }

  static async findByPRId(prId) {
    const collection = await Database.getCollection(collectionName);
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