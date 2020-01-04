const Utils = require('../../Utils')
const DB = require('../../db')
const Slack = require('../../Slack')
const SlackRepository = require('../../SlackRepository');

const getContent = (json) => (
  {
    pullRequestId: json.pull_request.number,
    repositoryName: json.repository.name,
    branchName: json.pull_request.head.ref
  }
);

const start = async (json) => {
  const content = getContent(json);
  const { pullRequestId, repositoryName, branchName} = content;

  const slackTSHash = Utils.getSlackTSHash({
    branchName,
    repositoryName,
    pullRequestId
  });

  console.log('New Comment content', content);
  console.log('New Comment Slack hash', slackTSHash);
  const slackThreadTS = await DB.retrieve(slackTSHash)
  const repositoryData = SlackRepository.getRepositoryData(repositoryName)
  const { channel } = repositoryData;

  const message = ":speech_balloon: There is a new message!"

  Slack.sendMessage({
    message,
    slackChannel: channel,
    threadID: slackThreadTS
  })
};

exports.start = start;