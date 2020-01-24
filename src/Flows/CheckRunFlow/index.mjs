import SlackRepository from '../../SlackRepository.mjs'
import SlackMessage from '../../models/SlackMessage.mjs'
import Commit from '../../models/Commit.mjs';
import CheckRun from '../../models/CheckRun.mjs';
import Reactji from '../../services/Reactji.mjs';
import DirectMessage from '../../services/DirectMessage.mjs';

class CheckRunFlow {
  static async start(json) {
    const { sha, state } = json;

    const currentCheckrun = await new CheckRun({ commitSha: sha, state })
    console.log('current', currentCheckrun)
    const newCheckRun = await currentCheckrun.createOrLoadByCommitSha();
    console.log('new checkrun', newCheckRun)


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

    if (state === 'failure') {
      const directMessage = new DirectMessage(pr.username)
      directMessage.notifyCIFailure()
    }

    pr.updateCIState(state)

    const reactji = new Reactji(mainSlackMessage.ts, state, channel, 'ci')
    reactji.react(true)
  };

  static async isFlow(json) {
    return json.commit && (json.state === 'success' || json.state === 'failure' || json.state === 'pending');
  };
}

export default CheckRunFlow;