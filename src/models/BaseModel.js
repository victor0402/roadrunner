class BaseModel {
  constructor(data) {
    Object.assign(this, data);
    this.id = data.id || data._id ? data._id.toString() : undefined
  }
}

export default BaseModel;