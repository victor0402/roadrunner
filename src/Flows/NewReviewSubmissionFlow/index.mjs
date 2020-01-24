import SlackRepository from '../../SlackRepository.mjs'
import PullRequest from '../../models/PullRequest.mjs'
import pullRequestParser from '../../parsers/pullRequestParser.mjs'
import ChannelMessage from '../../services/ChannelMessage.mjs';

const getContent = (json) => (
  {
    state: json.review.state,
    message: json.review.body
  }
);

class NewReviewSubmissionFlow {
  static async start(json) {
    const pr = await new PullRequest(pullRequestParser.parse(json)).load();

    const content = getContent(json);
    const { message, state } = content;
    const mainSlackMessage = await pr.getMainSlackMessage();

    if (!mainSlackMessage) {
      console.log('Flow aborted!')
      return;
    }

    const slackThreadTS = mainSlackMessage.ts;
    const repositoryData = SlackRepository.getRepositoryData(pr.repositoryName)
    const { channel } = repositoryData;

    const channelMessage = new ChannelMessage(channel, slackThreadTS)
    if (state === 'changes_requested') {
      channelMessage.notifyChangesRequest();
    } else if (message !== '') {
      channelMessage.notifyNewMessage();
    } else {
      console.log('No slack message was set!')
      console.log('Flow aborted!')
    }
  };

  static async isFlow(json) {
    return json.action === 'submitted';
  };
}

export default NewReviewSubmissionFlow;