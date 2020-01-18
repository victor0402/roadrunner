import axios from 'axios';

class Slack {
  static async sendMessage({ message, slackChannel, threadID, callbackIdentifier, callbackURL }) {
    const ZAPIER_WEBHOOK_URL = process.env.ZAPIER_WEBHOOK_URL;

    const payload = {
      message,
      slackChannel,
      threadID,
      callbackIdentifier,
      callbackURL
    }

    console.log(ZAPIER_WEBHOOK_URL, payload)
    const response = await axios.post(ZAPIER_WEBHOOK_URL, payload)
    console.log(response)
  };
}

export default Slack;