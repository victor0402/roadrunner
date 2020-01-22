import Slack from '../../Slack.mjs';
import SlackRepository from '../../SlackRepository.mjs'
import SlackMessage from '../../models/SlackMessage.mjs'
import Commit from '../../models/Commit.mjs';

class CheckRunFlow {
  static async start(json) {
    const { sha, state } = json;
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

    let message;
    let reactji;

    if (state === 'success') {
      reactji = 'white_check_mark'
    } else {
      message = ":rotating_light: CI Failed!"
      reactji = 'rotating_light'
    }

    if (message) {
      Slack.sendMessage({
        message,
        slackChannel: channel,
        threadID: mainSlackMessage.ts
      });
    }

    pr.updateCIState(state)

    const possibleReactions = ['white_check_mark', 'rotating_light', 'hourglass']
    let reactionToAdd = reactji;
    let reactionsToRemove = possibleReactions.filter(r => r !== reactionToAdd);


    Slack.toggleReaction({
      slackChannel: channel,
      reactionToAdd: reactji,
      reactionsToRemove,
      messageTs: mainSlackMessage.ts
    });
  };

  static async isFlow(json) {
    return json.commit && (json.state === 'success' || json.state === 'failure');
  };
}

export default CheckRunFlow;