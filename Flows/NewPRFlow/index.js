const Slack = require('../../Slack');
const SlackRepository = require('../../SlackRepository');
const PullRequest = require('../../models/PullRequest').default
const pullRequestParser = require('../../parsers/pullRequestParser');

const start = async (json) => {
  const data = pullRequestParser.parse(json);
  const pr = new PullRequest(data)

  if (!pr.isValid()) { return; }

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

exports.start = start;