const Slack = require('../../Slack')
const SlackRepository = require('../../SlackRepository');
const PullRequest = require('../../models/PullRequest').default
const SlackMessage = require('../../models/SlackMessage').default
const pullRequestParser = require('../../parsers/pullRequestParser');
const GitHub = require('../../Github')
const Commit = require('../../models/Commit').default
const SendChangelogFlow = require('../SendChangelogFlow');

const start = async (json) => {
  const pr = await new PullRequest(pullRequestParser.parse(json)).load();

  if (!pr.id && pr.isClosed()) {
    return;
  } else if (pr.isDeployPR()) {
    SendChangelogFlow.start(pr)
    return;
  }

  const mainSlackMessage = await SlackMessage.findByPRId(pr.id);

  const repositoryData = SlackRepository.getRepositoryData(pr.repositoryName)

  const { channel } = repositoryData;

  const message = "This PR is closed :merged:"

  Slack.sendMessage({
    message,
    slackChannel: channel,
    threadID: mainSlackMessage.ts
  });

  pr.close()

  await pr.update()

  const commits = await GitHub.getCommits(pr.ghId)
  commits.forEach(c => {
    const commit = new Commit(pr.id, c.sha, c.commit.message)
    commit.create()
  })
};

exports.start = start;