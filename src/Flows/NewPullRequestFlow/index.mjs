import Slack from '../../Slack.mjs'
import SlackRepository from '../../SlackRepository.mjs'
import PullRequest from '../../models/PullRequest.mjs'
import pullRequestParser from '../../parsers/pullRequestParser.mjs'

class NewPullRequestFlow {
  static async start(json) {
    const data = pullRequestParser.parse(json);
    const pr = new PullRequest(data)

    const repositoryData = SlackRepository.getRepositoryData(pr.repositoryName)

    const { devGroup, channel } = repositoryData;

    await pr.create()

    const message = `${devGroup} :point_right:  please review this new PR: ${pr.link}`;

    Slack.sendMessage({
      message,
      slackChannel: channel,
      branchName: pr.branchName,
      repositoryName: pr.repositoryName,
      callbackIdentifier: pr.id,
      callbackURL: 'http://gh-notifications.codelitt.dev/slack-callback'
    });
  };

  static isFlow(json) {
    if (json.action !== 'opened' && json.action !== 'ready_for_review') {
      return false;
    }

    const data = pullRequestParser.parse(json);
    const pr = new PullRequest(data)

    return !pr.draft && !pr.isDeployPR()
  };
}

export default NewPullRequestFlow;