import HerokuFlow from './Heroku/HerokuFlow';
import { FlowNotFoundError } from '@errors';

class ServerFlow {
  constructor(data) {
    this.data = data;
  }

  run() {
    this.getFlow().run();
  }

  getFlow() {
    const instance = new HerokuFlow(this.data);
    const flow = instance.getFlow();
    if (flow) {
      return flow;
    }

    throw new FlowNotFoundError(this.data);
  }
};

export default ServerFlow;