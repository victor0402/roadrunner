import Slack from '../../Slack.mjs'
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

    const slackThreadTS = mainSlackMessage.ts;

    const repositoryData = SlackRepository.getRepositoryData(repositoryName)
    const { channel } = repositoryData;

    const message = ":pencil2: There is a new change!"

    Slack.sendMessage({
      message,
      slackChannel: channel,
      threadID: slackThreadTS
    })
  };

  static isFlow(json) {
    if (json.action !== 'opened' && json.action !== 'ready_for_review') {
      return false;
    }

    const data = pullRequestParser.parse(json);
    const pr = new PullRequest(data)

    return !pr.draft && !pr.isDeployPR()
  };
}

export default UpdatePullRequestCodeFlow;