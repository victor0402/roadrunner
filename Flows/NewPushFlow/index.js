const Slack = require('../../Slack')
const SlackRepository = require('../../SlackRepository');
const PullRequest = require('../../models/PullRequest').default
const pushChangeParser = require('../../parsers/pushChangeParser');

const start = async (json) => {
  const content = pushChangeParser.parse(json);
  const { pullRequestId, repositoryName, branchName} = content;

  if (
    branchName === 'master' ||
    branchName === 'development' ||
    branchName === 'develop'
  ) {
    return;
  }

  const query = {
    ghId: pullRequestId,
    branchName: branchName,
    repositoryName: repositoryName
  }
  const pr = await PullRequest.findBy(query)

  const slackThreadTS = await pr.getMainSlackMessage().ts;

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