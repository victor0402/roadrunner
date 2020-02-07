import { SlackRepository, Slack } from '@services'

class NotifyDeploymentFlow {
  static async start(json) {
    const { app } = json;
    const repositoryData = SlackRepository.getRepositoryDataByServer(app)

    if (repositoryData) {
      const { deployChannel } = repositoryData;
      Slack.getInstance().sendMessage({
        message: `The deploy was finished with success!`,
        channel: deployChannel
      });
    } else {
      Slack.getInstance().sendDirectMessage({
        message: JSON.stringify(json),
        username: SlackRepository.getAdminSlackUser()
      });
    }
  };

  static async isFlow(json) {
    return json.app;
  };
}

export default NotifyDeploymentFlow;