import Slack from '../../Slack.mjs'
import SlackRepository from '../../SlackRepository.mjs'
import PullRequest from '../../models/PullRequest.mjs'
import pushChangeParser from '../../parsers/pushChangeParser.mjs'

const start = async (json) => {
  const content = pushChangeParser.parse(json);
  const { repositoryName, branchName} = content;

  const query = {
    branchName: branchName,
    repositoryName: repositoryName
  };

  const pr = await PullRequest.findBy(query)

  const mainSlackMessage = await pr.getMainSlackMessage();

  const slackThreadTS = mainSlackMessage.ts;

  const repositoryData = SlackRepository.getRepositoryData(repositoryName)
  const { channel } = repositoryData;

  const message = ":pencil2: There is a new change!"

  Slack.sendMessage({
    message,
    slackChannel: channel,
    threadID: slackThreadTS
  })
};

export default {
  start
}