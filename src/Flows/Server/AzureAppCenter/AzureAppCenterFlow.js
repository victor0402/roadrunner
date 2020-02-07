import NotifyDeploymentFlow from './NotifyDeploymentFlow';

class AzureAppCenterFlow {
  constructor(data) {
    this.data = data;
  }

  getFlow() {
    const flows = [NotifyDeploymentFlow];
    const Flow = flows.find(F => {
      const instance = new F(this.data);
      return instance.isFlow();
    });

    if (Flow) {
      return new Flow(this.data);
    }
  }
}

export default AzureAppCenterFlow;