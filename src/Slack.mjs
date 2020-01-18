import axios from 'axios';

class Slack {
  static async sendMessage({ message, slackChannel, threadID, callbackIdentifier, callbackURL }) {
    const ZAPIER_WEBHOOK_URL = 'https://hooks.zapier.com/hooks/catch/4254966/otwcxkc';

    const payload = {
      message,
      slackChannel,
      threadID,
      callbackIdentifier,
      callbackURL
    }

    await axios.post(ZAPIER_WEBHOOK_URL, payload)
  };
}

export default Slack;