const Utils = require('../../Utils')
const DB = require('../../db')
const Slack = require('../../Slack')
const SlackRepository = require('../../SlackRepository');

const getContent = (json) => ({
  repositoryName: json.repository.name,
  pullRequestId: json.pull_request.number,
  branchName: json.pull_request.head.ref
});

const start = async (json) => {
  const content = getContent(json);
  const { pullRequestId, repositoryName, branchName } = content;

  const slackTSHash = Utils.getSlackTSHash({
    branchName,
    repositoryName,
    pullRequestId
  });

  const slackThreadTS = await DB.retrieve(slackTSHash)
  const repositoryData = SlackRepository.getRepositoryData(repositoryName)
  const { channel } = repositoryData;

  const message = "This PR is closed :merged:"

  Slack.sendMessage({
    message,
    slackChannel: channel,
    threadID: slackThreadTS
  })
};

exports.start = start;