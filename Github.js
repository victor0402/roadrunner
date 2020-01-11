const Octokit = require("@octokit/rest");

const octokit = new Octokit({
  auth: process.env.GIT_AUTH
});

const getCommits = async (pullRequestId) => {
  const commits = await octokit.pulls.listCommits({
    owner: 'kaiomagalhaes',
    repo: 'gh-hooks-repo-test',
    pull_number: pullRequestId
  })

  return commits.data;
}

const getPR = async (pullRequestId) => {
  const commits = await octokit.pulls.get({
    owner: 'kaiomagalhaes',
    repo: 'gh-hooks-repo-test',
    pull_number: pullRequestId
  })

  return commits.data;
}

exports.getCommits = getCommits;
exports.getPR = getPR;

// (async () => {
// const commits = await octokit.repos.listCommits({
//   owner: 'kaiomagalhaes',
//   repo: 'gh-hooks-repo-test',
// })
// console.log(commits)
// })()

