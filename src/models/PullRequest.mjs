import mongodb from 'mongodb';
import db from '../Database.mjs';
import SlackMessage from './SlackMessage.mjs';

const collectionName = 'pullRequests';

class PullRequest {
  constructor(data) {
    this.id = data.id || data._id ? data._id.toString() : undefined
    this.branchName = data.branchName;
    this.baseBranchName = data.baseBranchName;
    this.link = data.link;
    this.ghId = data.ghId;
    this.repositoryName = data.repositoryName;
    this.title = data.title;
    this.draft = data.draft;
    this.state = data.state;
    this.owner = data.owner;
    this.createdAt = data.createdAt;
    this.closedAt = data.closedAt;
    this.ciState = data.ciState;
    this.username = data.username;
  }

  isDeployPR() {
    return (this.baseBranchName === 'qa' || this.baseBranchName === 'master') && this.branchName === 'develop'
  }

  isClosed() {
    return !!this.closedAt;
  }

  async getMainSlackMessage() {
    this.mainSlackMessage = await SlackMessage.findByPRId(this.id)
    return this.mainSlackMessage;
  }

  async create() {
    const collection = await db.getCollection(collectionName);
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
    const collection = await db.getCollection(collectionName);
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
    const collection = await db.getCollection(collectionName);
    const response = await collection.findOne(query);
    if (!response) {
      return null;
    }
    return new PullRequest(response)
  }

  static async list(filter = {}) {
    const collection = await db.getCollection(collectionName);
    const response = await collection.find(filter);

    const array = await response.toArray()

    return array.map(doc => new PullRequest(doc))
  }

  async load() {
    const collection = await db.getCollection(collectionName);
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