import mongodb from 'mongodb';
import db from '../db.mjs';
import SlackMessage from './SlackMessage.mjs';

const devToQATitle = 'development to qa'
const QAToMasterTitle = 'qa to master'

const collectionName = 'pullRequests';

class PullRequest {
  constructor(data) {
    this.id = data.id || data._id ? data._id.toString() : undefined
    this.branchName = data.branchName;
    this.link = data.link;
    this.ghId = data.ghId;
    this.repositoryName = data.repositoryName;
    this.title = data.title;
    this.draft = data.draft;
    this.state = data.state;
    this.closed = data.closed;
    this.owner = data.owner;
  }

  isDeployPR() {
    return this.title.toLowerCase() === devToQATitle || this.title.toLowerCase() === QAToMasterTitle
  }

  isValid() {
    return !this.draft && !this.isDeployPR()
  }

  isClosed() {
    return !!this.closed;
  }

  async getMainSlackMessage() {
    this.mainSlackMessage = await SlackMessage.findByPRId(this.id)
    return this.mainSlackMessage;
  }

  async create() {
    const collection = await db.getCollection(collectionName);

    const pr = await collection.insertOne(this.toJson());

    this.id = pr.ops[0]._id.toString()
  }

  async close() {
    this.closed = true;
    return await this.update();
  }

  async update() {
    const collection = await db.getCollection(collectionName);
    const json = this.toJson();
    delete json.id
    const objectID = new mongodb.ObjectID(this.id)
    return await collection.updateOne({ _id: objectID }, { $set: json })
  }

  static async findById(id) {
    const objectID = new ObjectID(id)
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
    }
    return this;
  }

  toJson() {
    return {
      branchName: this.branchName,
      link: this.link,
      ghId: this.ghId,
      repositoryName: this.repositoryName,
      title: this.title,
      draft: this.draft,
      state: this.state,
      closed: this.closed,
    }
  }
};

export default PullRequest;