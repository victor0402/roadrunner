import Octokit from '@octokit/rest';

const octokit = new Octokit({
  auth: process.env.GIT_AUTH
});

class Github {
  static async getCommits (pullRequestId, owner, repository) {
    console.log('getting commits', pullRequestId, owner, repository)
    const commits = await octokit.pulls.listCommits({
      owner,
      repo: repository,
      pull_number: pullRequestId
    })

    return commits.data;
  }
}

export default Github;