const Slack = require('../../Slack')
const SlackRepository = require('../../SlackRepository');
const GitHub = require('../../Github')
const Commit = require('../../models/Commit').default

const start = async (pr) => {
  const repositoryData = SlackRepository.getRepositoryData(pr.repositoryName)

  const { deployChannel } = repositoryData;
  if (!deployChannel) {
    return;
  }

  const ghCommits = await GitHub.getCommits(pr.ghId)
  const commits = await Promise.all(ghCommits.map(async c => Commit.findBySha(c.sha)))

  let pullRequests = await Promise.all(commits.map(async commit => {
    return await commit.getPullRequest();
  }));

  // Remove duplicates
  pullRequests = Object.values(pullRequests.reduce((acc, cur) => Object.assign(acc, { [cur.id]: cur }), {}))

  let message = "*Experimental* Changelog:"

  pullRequests.forEach(pr => {
    message = message + `\n - ${pr.title}`
  })

  Slack.sendMessage({
    message,
    slackChannel: deployChannel,
  });
};

exports.start = start;