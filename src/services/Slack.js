import SlackReaction from '@enums/SlackReaction';
import axios from 'axios';

const getUrl = (path) => {
  const SLACK_API_URL = process.env.SLACK_API_URL;
  return `${SLACK_API_URL}/${path}`;
};

class Slack {
  static async sendDirectMessage({ message, slackUsername }) {
    const res = await axios.post(getUrl('direct-messages'), {
      message,
      username: slackUsername,
      bot: 'roadrunner'
    })

    return res.data.ts;
  };

  static async sendMessage({ message, slackChannel, threadID }) {
    const res = await axios.post(getUrl('channel-messages'), {
      message,
      channel: slackChannel,
      ts: threadID,
      bot: 'roadrunner'
    })

    return res.data.ts;
  };

  static async updateMessage({ message, slackChannel, threadID }) {
    const res = await axios.patch(getUrl('channel-messages'), {
      message,
      channel: slackChannel,
      ts: threadID,
      bot: 'roadrunner'
    });

    return res.data.ts;
  };

  static async sendReaction({ slackChannel, reaction, messageTs }) {
    const res = await axios.post(getUrl('reactions'), {
      channel: slackChannel,
      reaction,
      ts: messageTs,
      bot: 'roadrunner'
    })

    return res.data;
  };

  static async toggleReaction({ slackChannel, reaction, messageTs }) {
    const reactionsToRemove = SlackReaction.listSimpleRemoving(reaction)
    reactionsToRemove.forEach(reaction => {
      Slack.removeReaction({
        slackChannel,
        reaction,
        messageTs
      })
    });

    Slack.sendReaction({
      slackChannel,
      reaction,
      messageTs
    })
  };

  static async removeReaction({ slackChannel, reaction, messageTs }) {
    const res = await axios.post(getUrl('reactions/delete'), {
      channel: slackChannel,
      reaction,
      ts: messageTs,
      bot: 'roadrunner'
    })

    return res.data;
  };
}

export default Slack;