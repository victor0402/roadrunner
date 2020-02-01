import Slack from './Slack';
import SlackReaction from '@enums/SlackReaction';

class ChannelMessage {
  constructor(channel, ts) {
    this.channel = channel;
    this.ts = ts;
  }

  async requestReview(devGroup, link) {
    const message = `${devGroup} :point_right:  please review this new PR: ${link}`;
    return await this.send(message)
  }

  async closePullRequest(devGroup, link) {
    const message = `~${devGroup} :point_right:  please review this new PR: ${link} .~`;
    return await this.update(message)
  }

  async notifyChangesRequest() {
    const message = `${SlackReaction.warning.forMessage()} changes requested!`;
    return await this.send(message)
  }

  async notifyNewMessage() {
    const message = `${SlackReaction.speech_balloon.forMessage()} There is a new message!`;
    return await this.send(message)
  }

  async notifyNewChange() {
    const message = `${SlackReaction.pencil.forMessage()} There is a new change!`;
    return await this.send(message)
  }

  async send(message) {
    return await Slack.getInstance().sendMessage({
      message,
      slackChannel: this.channel,
      ts: this.ts
    });
  }

  async update(message) {
    return await Slack.getInstance().updateMessage({
      message,
      channel: this.channel,
      ts: this.ts
    });
  }
}

export default ChannelMessage;