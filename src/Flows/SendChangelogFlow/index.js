import { SlackRepository, Slack, Github } from '@services'
// import Commit from '../../models/Commit.mjs'
import { PullRequest } from '@models';
import pullRequestParser from '../../parsers/pullRequestParser'

class SendChangelogFlow {
  static async start(json) {
    const pr = await new PullRequest(pullRequestParser.parse(json)).load();
    const repositoryData = SlackRepository.getRepositoryData(pr.repositoryName)

    const { deployChannel } = repositoryData;

    if (!deployChannel) {
      console.log('No deploy channel found.')
      console.log('Flow aborted!')
      return;
    }

    const ghCommits = await GitHub.getCommits(pr.ghId, pr.owner, pr.repositoryName)
    //    let commits = await Promise.all(ghCommits.map(async c => Commit.findBySha(c.sha)))
    //    commits = commits.filter(c => c)
    //
    //    let pullRequests = (await Promise.all(commits.map(async commit => {
    //      return await commit.getPullRequest();
    //    }))).filter(p => p);
    //
    //    // Remove duplicates
    //    pullRequests = Object.values(pullRequests.reduce((acc, cur) => Object.assign(acc, { [cur.id]: cur }), {}))
    //
    //    if (pullRequests.length === 0) {
    //      console.log("We couldn't find any pull requests on our database for this release", pr);
    //      console.log('Flow aborted!')
    //      return;
    //    }

    let slackMessage = "*Experimental* Changelog:"

    ghCommits.forEach(ghCommit => {
      const { commit } = ghCommit;
      const { message } = commit;

      slackMessage = `${slackMessage} \n - ${message}`
    })

    Slack.sendMessage({
      message: slackMessage,
      slackChannel: deployChannel,
    });
  };

  static async isFlow(json) {
    if (!json.action || json.action !== 'closed') {
      return false;
    };

    const pr = await new PullRequest(pullRequestParser.parse(json)).load();
    return pr.isDeployPR();
  };
}

export default SendChangelogFlow;