import SlackNotificationsClient from 'slack-notifications-client';

class Slack {
  static getInstance() {
    if (!Slack.client) {
      Slack.client = new SlackNotificationsClient({
        bot: 'roadrunner',
        apiKey: 'no-key',
        apiURI: process.env.SLACK_API_URL,
      });
    }

    return Slack.client;
  }
}

export default Slack;