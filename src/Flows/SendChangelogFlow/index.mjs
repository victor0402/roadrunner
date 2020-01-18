import Slack from '../../Slack.mjs'
import SlackRepository from '../../SlackRepository.mjs'
import GitHub from '../../Github.mjs'
import Commit from '../../models/Commit.mjs'
import PullRequest from '../../models/PullRequest.mjs'
import pullRequestParser from '../../parsers/pullRequestParser.mjs'

class SendChangelogFlow {
  static async start(json) {
    const pr = await new PullRequest(pullRequestParser.parse(json)).load();
    const repositoryData = SlackRepository.getRepositoryData(pr.repositoryName)

    const { deployChannel } = repositoryData;

    if (!deployChannel) {
      return;
    }

    const ghCommits = await GitHub.getCommits(pr.ghId, pr.owner, pr.repositoryName)
    let commits = await Promise.all(ghCommits.map(async c => Commit.findBySha(c.sha)))
    commits = commits.filter(c => c)

    let pullRequests = (await Promise.all(commits.map(async commit => {
      return await commit.getPullRequest();
    }))).filter(p => p);

    // Remove duplicates
    pullRequests = Object.values(pullRequests.reduce((acc, cur) => Object.assign(acc, { [cur.id]: cur }), {}))

    if (pullRequests.length === 0) {
      console.log("We couldn't find any pull requests on our database for this release", pr);
      return;
    }

    let message = "*Experimental* Changelog:"

    pullRequests.forEach(pr => {
      message = message + `\n - ${pr.title}`
    })

    Slack.sendMessage({
      message,
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