import SlackRepository from '../../SlackRepository';
import { PullRequestReview, PullRequest } from '../../models';
import pullRequestParser from '../../parsers/pullRequestParser'
import ChannelMessage from '../../services/ChannelMessage';

const getContent = (json) => (
  {
    state: json.review.state,
    message: json.review.body,
    username: json.review.user.login
  }
);

class NewReviewSubmissionFlow {
  static async start(json) {
    const pr = await new PullRequest(pullRequestParser.parse(json)).load();

    const content = getContent(json);
    const { message, state, username } = content;
    const mainSlackMessage = await pr.getMainSlackMessage();

    if (!mainSlackMessage) {
      console.log('Flow aborted!')
      return;
    }

    await new PullRequestReview({
      prId: pr.id,
      username,
      state 
    }).createOrLoadByUsernameAndPR()

    const slackThreadTS = mainSlackMessage.ts;
    const repositoryData = SlackRepository.getRepositoryData(pr.repositoryName)
    const { channel } = repositoryData;

    const channelMessage = new ChannelMessage(channel, slackThreadTS);
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