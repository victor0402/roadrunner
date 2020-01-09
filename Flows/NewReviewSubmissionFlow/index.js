const Utils = require('../../Utils')
const DB = require('../../db')
const Slack = require('../../Slack')
const SlackRepository = require('../../SlackRepository');

const getContent = (json) => (
  {
    pullRequestId: json.pull_request.number,
    repositoryName: json.repository.name,
    branchName: json.pull_request.head.ref,
    state: json.review.state
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

  const slackThreadTS = await DB.retrieve(slackTSHash)
  const repositoryData = SlackRepository.getRepositoryData(repositoryName)
  const { channel } = repositoryData;

  const message = ":warning: changes requested!"
  console.log(slackThreadTS)

  Slack.sendMessage({
    message,
    slackChannel: channel,
    threadID: slackThreadTS
  })
};

exports.start = start;