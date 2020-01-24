import SlackRepository from '../../SlackRepository.mjs'
import PullRequest from '../../models/PullRequest.mjs'
import pushChangeParser from '../../parsers/pushChangeParser.mjs'

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

    const ChannelMessage = new ChannelMessage(channel, slackThreadTS)
    channel.notifyNewChange()
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