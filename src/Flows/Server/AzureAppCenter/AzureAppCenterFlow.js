import NotifyBuildResultFlow from './NotifyBuildResultFlow';

class AzureAppCenterFlow {
  constructor(data) {
    this.data = data;
  }

  getFlow() {
    const flows = [NotifyBuildResultFlow];
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