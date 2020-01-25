import SlackMessage from './models/SlackMessage'
import SlackApi from '@slack/web-api';
import SlackReaction from './enums/SlackReaction';

class Slack {
  static async sendDirectMessage({ message, slackUsername }) {
    const token = process.env.SLACK_API_KEY;

    const slackClient = new SlackApi.WebClient(token);

    const usersList = await slackClient.users.list({
      limit:  1000
    });
    const members = usersList.members

    const user = members.find(s => s.name === slackUsername)

    const res = await slackClient.chat.postMessage({
      channel: user.id,
      text: message,
      unfurl_links: false,
      parse: 'full',
      as_user: true
    });

    return res.ts;
  };

  static async sendMessage({ message, slackChannel, prId, threadID }) {
    const token = process.env.SLACK_API_KEY;

    const slackClient = new SlackApi.WebClient(token);

    const response = await slackClient.channels.list({
      limit: 500
    });

    let channels = response.channels.sort((a, b) => a.created < b.created)
    const channel = channels.find(c => c.name === slackChannel)

    const res = await slackClient.chat.postMessage({
      channel: channel.id,
      text: message,
      thread_ts: threadID,
      unfurl_links: false,
      parse: 'full'
    });

    return res.ts;
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