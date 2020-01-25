import { SlackRepository, Reactji, DirectMessage } from '../../services'
import { SlackMessage, PullRequest, CheckRun } from '../../models';

class CheckRunFlow {
  static async start(json) {
    const { sha, state, branches, repository } = json;
    const branchName = branches[0].name;
    const repositoryName = repository.name;

    const currentCheckrun = await new CheckRun({ commitSha: sha, state })
    await currentCheckrun.createOrLoadByCommitSha();

    // Add sort by to get the latest
    const pr = await PullRequest.findBy({ branchName, repositoryName, state: 'open' });

    if (!pr) {

      console.log('No PR found', { branchName, repositoryName, state: 'open' });
      console.log('Flow aborted!')
      return;
    }

    const mainSlackMessage = await SlackMessage.findByPRId(pr.id);
    if (!mainSlackMessage) {
      console.log('Flow aborted!')
      return;
    }

    const repositoryData = SlackRepository.getRepositoryData(pr.repositoryName)

    const { channel } = repositoryData;

    if (state === 'failure') {
      const directMessage = new DirectMessage(pr.username)
      directMessage.notifyCIFailure(pr)
    }

    pr.updateCIState(state)

    const reactji = new Reactji(mainSlackMessage.ts, state, channel, 'ci')
    reactji.react(true)
  };

  static async isFlow(json) {
    console.log(json.state)
    return json.commit && (json.state === 'success' || json.state === 'failure' || json.state === 'pending');
  };
}

export default CheckRunFlow;