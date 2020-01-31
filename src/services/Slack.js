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
    const token = process.env.SLACK_API_KEY;
    const slackClient = new SlackApi.WebClient(token);

    const response = await slackClient.channels.list({
      limit: 500
    });

    let channels = response.channels.sort((a, b) => a.created < b.created)
    const channel = channels.find(c => c.name === slackChannel)

    const t = {
      channel: channel.id,
      name: reaction,
      timestamp: messageTs
    };

    await slackClient.reactions.add(t);
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
    const token = process.env.SLACK_API_KEY;
    const slackClient = new SlackApi.WebClient(token);

    const response = await slackClient.channels.list({
      limit: 500
    });

    let channels = response.channels.sort((a, b) => a.created < b.created)
    const channel = channels.find(c => c.name === slackChannel)

    const t = {
      channel: channel.id,
      name: reaction,
      timestamp: messageTs
    };

    try {
      await slackClient.reactions.remove(t);
    } catch (err) { }
  };
}

export default Slack;