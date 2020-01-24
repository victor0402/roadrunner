import Slack from '../Slack.mjs';
import SlackReaction from '../enums/SlackReaction.mjs';
import SlackRepository from '../SlackRepository.mjs';

class DirectMessage {
  constructor(ghUsername) {
    this.ghUsername = ghUsername;
  }

  async notifyCIFailure() {
    const message = `${SlackReaction.rotating_light.forMessage()} CI Failed for PR: ${pr.link}`
    return await this.send(message)
  }

  async send(message) {
    return await Slack.sendDirectMessage({
      message,
      slackUsername: SlackRepository.getSlackUser(pr.ghUsername),
    });
  }
}

export default DirectMessage;