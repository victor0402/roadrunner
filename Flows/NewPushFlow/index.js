const Slack = require('../../Slack')
const SlackRepository = require('../../SlackRepository');
const PullRequest = require('../../models/PullRequest').default
const pushChangeParser = require('../../parsers/pushChangeParser');

const start = async (json) => {
  const content = pushChangeParser.parse(json);
  const { repositoryName, branchName} = content;

  if (
    branchName === 'master' ||
    branchName === 'development' ||
    branchName === 'develop'
  ) {
    return;
  }

  const query = {
    branchName: branchName,
    repositoryName: repositoryName
  }

  const pr = await PullRequest.findBy(query)
  if (!pr) {
    return;
  }
  const mainSlackMessage = await pr.getMainSlackMessage();

  const slackThreadTS = mainSlackMessage.ts;

  console.log('ts', slackThreadTS)

  const repositoryData = SlackRepository.getRepositoryData(repositoryName)
  const { channel } = repositoryData;

  const message = ":pencil2: There is a new change!"

  Slack.sendMessage({
    message,
    slackChannel: channel,
    threadID: slackThreadTS
  })
};

exports.start = start;