import Slack from '../../Slack.mjs';
import SlackRepository from '../../SlackRepository.mjs'
import SlackMessage from '../../models/SlackMessage.mjs'
import Commit from '../../models/Commit.mjs';
import CheckRun from '../../models/CheckRun.mjs';
import SlackReaction from '../../enums/SlackReaction.mjs';
import Reactji from '../../services/Reactji.mjs';

class CheckRunFlow {
  static async start(json) {
    const { sha, state } = json;

    await new CheckRun({ commitSha: sha, state }).createOrLoadByCommitSha();

    const commit = await Commit.findBySha(sha)
    if (!commit || state === 'pending') {
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

    if (state === 'failure') {
      message = `${SlackReaction.rotating_light.forMessage()} CI Failed for PR: ${pr.link}`
      Slack.sendDirectMessage({
        message,
        slackUsername: SlackRepository.getSlackUser(pr.username),
      });
    }

    pr.updateCIState(state)

    const reactji = new Reactji(mainSlackMessage.ts, state, channel)
    reactji.react(true)
  };

  static async isFlow(json) {
    return json.commit && (json.state === 'success' || json.state === 'failure' || json.state === 'pending');
  };
}

export default CheckRunFlow;