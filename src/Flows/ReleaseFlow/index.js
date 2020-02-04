import { SlackRepository, Github, Slack } from '@services'

class ReleaseFlow {
  static async start(json) {
    const { head, base, repo, owner } = json;
    const repositoryData = SlackRepository.getRepositoryData(repo);

    let pullRequest;
    let pullRequestCreationError;

    try {
      pullRequest = await Github.createPullRequest({
        owner,
        repo,
        title: `Release ${head} to ${base}`,
        head,
        base
      });
    } catch (e) {
      pullRequestCreationError = e.errors[0].message;
    }

    if (pullRequestCreationError) {
      if (pullRequestCreationError === 'No commits between qa and develop') {
        const message = "The server already has the latest updates";
        Slack.getInstance().sendMessage({
          message,
          channel: repositoryData.deployChannel
        })
      } else {
        const message = `${pullRequestCreationError} - ${JSON.stringify(json)}`;
        Slack.getInstance().sendDirectMessage({
          message,
          username: SlackRepository.getAdminSlackUser()
        });
      }

      return;
    }

    const { number } = pullRequest;

    let merge;
    let mergeError;
    try {
      merge = await Github.mergePullRequest({
        owner,
        repo,
        number
      });
    } catch (e) {
      mergeError = e.errors[0].message;
    }

    if (mergeError) {
      Slack.getInstance().sendDirectMessage({
        message: `${mergeError} - ${JSON.stringify(json)}`,
        username: SlackRepository.getAdminSlackUser()
      });
    } else {
      Slack.getInstance().sendMessage({
        message: "The deployment just started, it will be done is a few minutes.",
        channel: repositoryData.deployChannel
      })
    }
  };

  static async isFlow(json) {
    return json.flow === 'release';
  };
}

export default ReleaseFlow;