import { SlackRepository, Github, Slack } from '@services'

const config = {
  update: {
    prod: {
      head: 'qa',
      base: 'master',
    },
    qa: {
      head: 'develop',
      base: 'qa'
    },
  }
};

class ReleaseFlow {
  static async start(json) {
    const { channel_name, text, user_name } = json;
    const repositoryData = SlackRepository.getRepositoryDataByDeployChannel(channel_name);
    const { deployChannel, owner, repository } = repositoryData;

    const [event, environment] = text.split(' ');

    const { head, base } = config[event][environment];

    let pullRequest;
    let pullRequestCreationError;

    try {
      pullRequest = await Github.createPullRequest({
        owner,
        repo: repository,
        title: `Release ${head} to ${base}`,
        head,
        base
      });
    } catch (e) {
      if (e.errors) {
        pullRequestCreationError = e.errors[0].message;
      } else {
        pullRequestCreationError = e.toString();
      }
    };

    if (pullRequestCreationError) {
      if (pullRequestCreationError === 'No commits between qa and develop') {
        return "The server already has the latest updates";
      } else {
        const message = `${pullRequestCreationError} - ${JSON.stringify(json)}`;
        Slack.getInstance().sendDirectMessage({
          message,
          username: SlackRepository.getAdminSlackUser()
        });

        return "There was an error with the deployment. I've notified @kaio and he will reach out to you soon.";
      }

      return;
    }

    const { number } = pullRequest;

    let merge;
    let mergeError;
    try {
      merge = await Github.mergePullRequest({
        owner,
        repo: repository,
        number
      });
    } catch (e) {
      if (e.errors) {
        pullRequestCreationError = e.errors[0].message;
      } else {
        pullRequestCreationError = e.toString();
      }
    }

    if (mergeError) {
      Slack.getInstance().sendDirectMessage({
        message: `${mergeError} - ${JSON.stringify(json)}`,
        username: SlackRepository.getAdminSlackUser()
      });

      return "There was an error with the deployment. I've notified @kaio and he will reach out to you soon.";
    } else {
      Slack.getInstance().sendMessage({
        message: `The deployment was started by @${user_name}, it will be done is a few minutes.`,
        channel: deployChannel
      });

      return "OK";
    };
  };

  static async isFlow(json) {
    return json.text === 'update qa';
  };
}

export default ReleaseFlow;