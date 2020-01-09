const Utils = require('../../Utils')
const DB = require('../../db')
const Slack = require('../../Slack')
const SlackRepository = require('../../SlackRepository');

const getContent = (json) => (
  {
    pullRequestId: json.pull_request.number,
    repositoryName: json.repository.name,
    branchName: json.pull_request.head.ref,
    state: json.review.state,
    message: json.review.body
  }
);

const start = async (json) => {
  const content = getContent(json);
  const { pullRequestId, repositoryName, branchName, message, state } = content;

  const slackTSHash = Utils.getSlackTSHash({
    branchName,
    repositoryName,
    pullRequestId
  });

  const slackThreadTS = await DB.retrieve(slackTSHash)
  const repositoryData = SlackRepository.getRepositoryData(repositoryName)
  const { channel } = repositoryData;

  let slackMessage = null;

  if (state === 'changes_requested') {
    slackMessage = ":warning: changes requested!"
  } else if (message !== '') {
    slackMessage = ':speech_balloon: There is a new message!'
  }

  if (slackMessage) {
    Slack.sendMessage({
      message: slackMessage,
      slackChannel: channel,
      threadID: slackThreadTS
    })
  }
};

exports.start = start;