import SlackApi from '@slack/web-api';
import SlackReaction from '@enums/SlackReaction';
import axios from 'axios';

class Slack {
  static async sendDirectMessage({ message, slackUsername }) {
    const SLACK_API_URL = process.env.SLACK_API_URL;

    const res = await axios.post(`${SLACK_API_URL}/direct-message`, {
      message,
      username: slackUsername,
      bot: 'roadrunner'
    })

    return res.data.ts;
  };

  static async sendMessage({ message, slackChannel, threadID }) {
    const SLACK_API_URL = process.env.SLACK_API_URL;

    const res = await axios.post(`${SLACK_API_URL}/channel-message`, {
      message,
      channel: slackChannel,
      ts: threadID,
      bot: 'roadrunner'
    })

    return res.data.ts;
  };

  static async updateMessage({ message, slackChannel, threadID }) {
    const SLACK_API_URL = process.env.SLACK_API_URL;

    const res = await axios.patch(`${SLACK_API_URL}/channel-message`, {
      message,
      channel: slackChannel,
      ts: threadID,
      bot: 'roadrunner'
    });

    return res.data.ts;
  };

  static async sendReaction({ slackChannel, reaction, messageTs }) {
    const SLACK_API_URL = process.env.SLACK_API_URL;

    const res = await axios.post(`${SLACK_API_URL}/reactions`, {
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
    const SLACK_API_URL = process.env.SLACK_API_URL;

    const res = await axios.post(`${SLACK_API_URL}/reactions/delete`, {
      channel: slackChannel,
      reaction,
      ts: messageTs,
      bot: 'roadrunner'
    })

    return res.data;
  };
}

export default Slack;