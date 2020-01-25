import mongodb from 'mongodb';
import Database from '@services/Database';
import { BaseModel, SlackMessage, PullRequestReview } from '@models';

const collectionName = 'pullRequests';

class PullRequest extends BaseModel{
  isDeployPR() {
    return (this.baseBranchName === 'qa' || this.baseBranchName === 'master') && (this.branchName === 'develop' || this.branchName === 'qa')
  }

  isClosed() {
    return !!this.closedAt;
  }

  async getMainSlackMessage() {
    this.mainSlackMessage = await SlackMessage.findByPRId(this.id)
    return this.mainSlackMessage;
  }

  async getReviews() {
    this.reviews = await PullRequestReview.findByPRId(this.id)
    return this.reviews;
  }

  async create() {
    const collection = await Database.getCollection(collectionName);
    this.createdAt = Date.now();
    this.ciState = 'pending';

    const json = this.toJson();

    const pr = await collection.insertOne({
      ...json,
     });

    this.id = pr.ops[0]._id.toString()
    return this;
  }

  async close() {
    this.closedAt = Date.now();
    await this.update();
  }

  async update() {
    const collection = await Database.getCollection(collectionName);
    const json = this.toJson();
    delete json.id
    const objectID = new mongodb.ObjectID(this.id)
    return await collection.updateOne({ _id: objectID }, { $set: json })
  }

  static async findById(id) {
    const objectID = new mongodb.ObjectID(id)
    return await this.findBy({ _id: objectID })
  }

  static async findBy(query) {
    const collection = await Database.getCollection(collectionName);
    const response = await collection.findOne(query);
    if (!response) {
      return null;
    }
    return new PullRequest(response)
  }

  static async list(filter = {}) {
    const collection = await Database.getCollection(collectionName);
    const response = await collection.find(filter);

    const array = await response.toArray()

    return array.map(doc => new PullRequest(doc))
  }

  async load() {
    const collection = await Database.getCollection(collectionName);
    const pr = await collection.findOne({
      branchName: this.branchName,
      ghId: this.ghId,
      repositoryName: this.repositoryName,
    });

    if (pr) {
      this.id = pr._id.toString()
      this.createdAt = pr.createdAt;
      this.closedAt = pr.closedAt;
    }
    return this;
  }

  async updateCIState(state) {
    this.ciState = state;
    await this.update()
  }

  toJson() {
    return {
      branchName: this.branchName,
      baseBranchName: this.baseBranchName,
      link: this.link,
      ghId: this.ghId,
      repositoryName: this.repositoryName,
      title: this.title,
      draft: this.draft,
      state: this.state,
      owner: this.owner,
      createdAt: this.createdAt,
      closedAt: this.closedAt,
      ciState: this.ciState,
      username: this.username
    }
  }
};

export default PullRequest;