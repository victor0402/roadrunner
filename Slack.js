const axios = require('axios');

const SLACK_PUSHER_URL = process.env.SLACK_PUSHER_URL || 'https://hooks.zapier.com/hooks/catch/4254966/otwcxkc';

const sendMessage = ({
  message,
  slackChannel,
  threadID,
  callbackIdentifier,
  callbackURL
}) => {
  const payload = {
    message,
    slackChannel,
    threadID,
    callbackIdentifier,
    callbackURL
  }

  axios.post(SLACK_PUSHER_URL, payload)
};

exports.sendMessage = sendMessage;