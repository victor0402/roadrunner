import Slack from './Slack';
import SlackReaction from '@enums/SlackReaction';
import SlackRepository from './SlackRepository';

class DirectMessage {
  constructor(ghUsername) {
    this.ghUsername = ghUsername;
  }

  async notifyPRConflicts(pr) {
    const message = `${SlackReaction.boom.forMessage()} there are conflicts on this Pull Request: ${pr.link}`
    return await this.send(message)
  }

  async notifyCIFailure(pr) {
    const message = `${SlackReaction.rotating_light.forMessage()} CI Failed for Pull Request: ${pr.link}`
    return await this.send(message)
  }

  async notifyPRMerge(pr) {
    const message = `${SlackReaction.merge.forMessage()} Pull Request closed: ${pr.link}`
    return await this.send(message)
  }

  async send(message) {
    return await Slack.getInstance().sendDirectMessage({
      message,
      username: SlackRepository.getSlackUser(this.ghUsername),
    });
  }
}

export default DirectMessage;