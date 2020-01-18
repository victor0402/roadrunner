import axios from 'axios';

const SLACK_PUSHER_URL = process.env.ZAPIER_WEBHOOK_URL;

class Slack {
  static sendMessage({ message, slackChannel, threadID, callbackIdentifier, callbackURL }) {
    const payload = {
      message,
      slackChannel,
      threadID,
      callbackIdentifier,
      callbackURL
    }

    axios.post(SLACK_PUSHER_URL, payload)
  };
}

export default Slack;