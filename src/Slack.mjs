import axios from 'axios';

class Slack {
  static sendMessage({ message, slackChannel, threadID, callbackIdentifier, callbackURL }) {
    const ZAPIER_WEBHOOK_URL = process.env.ZAPIER_WEBHOOK_URL;

    const payload = {
      message,
      slackChannel,
      threadID,
      callbackIdentifier,
      callbackURL
    }

    console.log(ZAPIER_WEBHOOK_URL, payload)
    axios.post(ZAPIER_WEBHOOK_URL, payload)
  };
}

export default Slack;