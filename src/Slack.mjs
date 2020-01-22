import SlackMessage from './models/SlackMessage.mjs'
import SlackApi from '@slack/web-api';

class Slack {
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
    
    if (prId) {
      const slackMessage = new SlackMessage(prId, res.ts)
      slackMessage.create()
    }

    return res.ts;
  };
  /// 

  // 1. Test the new send message class on all the flows
  // 2. Add the sendReaction to the check runs pending/failure/approved
  // 3. Send a private message to the person who failed the PR
  // 4. Only send messages after CI has passed
  // 5. Update the git flow

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

    const msg = await slackClient.reactions.add(t);
    console.log(msg);
  };

}

export default Slack;