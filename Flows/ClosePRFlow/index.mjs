import Slack from  '../../Slack.mjs';
import SlackRepository from '../../SlackRepository.mjs'
import PullRequest from '../../models/PullRequest.mjs'
import SlackMessage from '../../models/SlackMessage.mjs'
import pullRequestParser from '../../parsers/pullRequestParser.mjs'
import SendChangelogFlow from '../SendChangelogFlow/index.mjs'

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
};

const isAValidClosePRFlow = async () => {
  const pr = await new PullRequest(pullRequestParser.parse(json)).load();

  return pr && !pr.isClosed()
};

export default {
  start,
};