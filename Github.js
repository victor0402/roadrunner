const Octokit = require("@octokit/rest");

const octokit = new Octokit({
  auth: "c76d91a1c4d06fae579a526828bbebaf70f40523"
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

(async () => {
  const commits = await octokit.pulls.listCommits({
    owner: 'kaiomagalhaes',
    repo: 'gh-hooks-repo-test',
    pull_number: 76
  })
  console.log(commits.data)
})()

// (async () => {
// const commits = await octokit.repos.listCommits({
//   owner: 'kaiomagalhaes',
//   repo: 'gh-hooks-repo-test',
// })
// console.log(commits)
// })()

