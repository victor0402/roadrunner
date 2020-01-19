import Octokit from '@octokit/rest';


class Github {
  static async getCommits(pullRequestId, owner, repository) {
    const octokit = new Octokit({
      auth: process.env.GIT_AUTH
    });
    const commits = await octokit.pulls.listCommits({
      owner,
      repo: repository,
      pull_number: pullRequestId
    })

    return commits.data;
  }
}

export default Github;