import { SlackRepository, Slack } from '@services'

class NotifyDeploymentFlow {
  constructor(data) {
    this.data = data;
  }

  async run() {
    const { app } = this.data;
    const repositoryData = SlackRepository.getRepositoryDataByServer(app)

    if (repositoryData) {
      const { deployChannel } = repositoryData;
      Slack.getInstance().sendMessage({
        message: `The deploy was finished with success!`,
        channel: deployChannel
      });
    } else {
      Slack.getInstance().sendDirectMessage({
        message: JSON.stringify(this.data),
        username: SlackRepository.getAdminSlackUser()
      });
    }
  };

  isFlow() {
    return !!this.data.app;
  };
}

export default NotifyDeploymentFlow;