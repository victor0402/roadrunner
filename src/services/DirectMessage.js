import Slack from './Slack';
import SlackReaction from '@enums/SlackReaction';
import SlackRepository from './SlackRepository';

class DirectMessage {
  constructor(ghUsername) {
    this.ghUsername = ghUsername;
  }

  async notifyCIFailure(pr) {
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