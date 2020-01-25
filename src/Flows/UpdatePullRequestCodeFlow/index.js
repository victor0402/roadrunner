import SlackRepository from '../../SlackRepository'
import { PullRequest } from '../../models';
import ChannelMessage from '../../services/ChannelMessage'
import pushChangeParser from '../../parsers/pushChangeParser'

class UpdatePullRequestCodeFlow {
  static async start(json) {
    const content = pushChangeParser.parse(json);
    const { repositoryName, branchName } = content;

    const query = {
      branchName: branchName,
      repositoryName: repositoryName
    };

    const pr = await PullRequest.findBy(query)

    const mainSlackMessage = await pr.getMainSlackMessage();
    if (!mainSlackMessage) {
      console.log('Flow aborted!')
      return;
    }

    const slackThreadTS = mainSlackMessage.ts;

    const repositoryData = SlackRepository.getRepositoryData(repositoryName)
    const { channel } = repositoryData;

    const channelMessage = new ChannelMessage(channel, slackThreadTS)
    channelMessage.notifyNewChange()
  };

  static async isFlow(json) {
    if (!json.ref) {
      return;
    }

    const content = pushChangeParser.parse(json);
    const { repositoryName, branchName } = content;

    if (branchName === 'master' || branchName === 'development' || branchName === 'develop' || branchName === 'qa') {
      return;
    }

    const query = {
      branchName: branchName,
      repositoryName: repositoryName
    }

    const pr = await PullRequest.findBy(query)
    return pr && !pr.isClosed();
  };
}

export default UpdatePullRequestCodeFlow;