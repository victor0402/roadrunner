import HerokuFlow from './Heroku/HerokuFlow';
import AzureAppCenterFlow from './AzureAppCenter/AzureAppCenterFlow';
import { FlowNotFoundError } from '@errors';

class ServerFlow {
  constructor(data) {
    this.data = data;
  }

  run() {
    this.getFlow().run();
  }

  getFlow() {
    const flows = [HerokuFlow, AzureAppCenterFlow];
    const flow = flows.map(F => {
      const instance = new F(this.data);
      return instance.getFlow();
    }).filter(a => a)[0];

    if (flow) {
      return flow;
    }

    throw new FlowNotFoundError(this.data);
  }
};

export default ServerFlow;