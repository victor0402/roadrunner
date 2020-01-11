const Utils = require('../../Utils')
const DB = require('../../db')
const Slack = require('../../Slack')
const SlackRepository = require('../../SlackRepository');
const PullRequest = require('../../models/PullRequest').default
const SlackMessage = require('../../models/SlackMessage').default
const pullRequestParser = require('../../parsers/pullRequestParser');

const start = async (json) => {
  const pr = await new PullRequest(pullRequestParser.parse(json)).load();

  if (pr.isClosed()) {
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

 await pr.update()
};

exports.start = start;