import Slack from '../../Slack.mjs';
import SlackRepository from '../../SlackRepository.mjs'
import SlackMessage from '../../models/SlackMessage.mjs'
import Commit from '../../models/Commit.mjs';

class CheckRunFlow {
  static async start(json) {
    const { sha } = json;
    const commit = await Commit.findBySha(sha)
    if (!commit) {
      return
    }
    const pr = await commit.getPullRequest();

    const mainSlackMessage = await SlackMessage.findByPRId(pr.id);
    if (!mainSlackMessage) {
      console.log('Flow aborted!')
      return;
    }

    const repositoryData = SlackRepository.getRepositoryData(pr.repositoryName)

    const { channel } = repositoryData;

    const message = ":rotating_light: CI Failed!"

    Slack.sendMessage({
      message,
      slackChannel: channel,
      threadID: mainSlackMessage.ts
    });

//    Slack.sendReaction({
//      slackChannel: channel,
//      reaction: 'red_circle',
//      messageTs: mainSlackMessage.ts
//    });
  };

  static async isFlow(json) {
    return json.commit && json.state === 'failure';
  };
}

export default CheckRunFlow;