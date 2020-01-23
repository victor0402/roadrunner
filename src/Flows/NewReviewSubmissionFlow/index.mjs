import Slack from '../../Slack.mjs'
import SlackRepository from '../../SlackRepository.mjs'
import PullRequest from '../../models/PullRequest.mjs'
import pullRequestParser from '../../parsers/pullRequestParser.mjs'
import SlackReaction from '../../enums/SlackReaction.mjs';

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

    let slackMessage = null;

    if (state === 'changes_requested') {
      slackMessage = `${SlackReaction.warning.simple()} changes requested!`
    } else if (message !== '') {
      slackMessage = `${SlackReaction.speech_balloon.simple()} There is a new message!`
    }

    if (slackMessage) {
      Slack.sendMessage({
        message: slackMessage,
        slackChannel: channel,
        threadID: slackThreadTS
      })
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