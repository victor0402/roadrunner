import Database from '@services/Database'
import { BaseModel } from '@models';

class CheckRun extends BaseModel {
  static collectionName = 'checkRuns';

  async createOrLoadByCommitSha() {
    const checkRun = await CheckRun.findByCommitSha(this.commitSha);

    if (checkRun) {
      checkRun.state = this.state;
      await checkRun.update();
      return checkRun;
    }

    return await this.create()
  }

  static async findByCommitSha(commitSha) {
    return await BaseModel.findBy({ commitSha })
  };

  static async findLastStateForCommits(commitsSha) {
    const collection = await Database.getCollection(CheckRun.collectionName);
    const query = commitsSha.map(s => ({ commitSha: s }))

    const response = await collection.find({ $or: query })
    let array = await response.toArray();
    if (array.length === 0) {
      return null;
    }

    array = array.sort((a, b) => b.createdAt - a.createdAt)
    const checkRun = array[0];

    return new CheckRun({ ...checkRun, id: checkRun._id });
  };

  toJson() {
    return {
      state: this.state,
      createdAt: this.createdAt
    };
  }
};

export default CheckRun;