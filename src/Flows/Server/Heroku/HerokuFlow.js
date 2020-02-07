import NotifyDeploymentFlow from './NotifyDeploymentFlow';

class HerokuFlow {
  constructor(data) {
    this.data = data;
  }

  getFlow() {
    const instance = new NotifyDeploymentFlow(this.data);
    if (instance.isFlow()) {
      return instance;
    }
  }
}

export default HerokuFlow;