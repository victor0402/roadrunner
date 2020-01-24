import Slack from '../Slack.mjs';
import SlackReaction from '../enums/SlackReaction.mjs';

const STATES = {
  ciSuccess: SlackReaction.white_check_mark.simple(),
  ciFailure: SlackReaction.rotating_light.simple(),
  ciPending: SlackReaction.hourglass.simple(),
}

class Reactji {
  constructor(ts, state, channel, type, stateFallBack) {
    this.ts = ts;
    this.state = state || stateFallBack;
    this.channel = channel;
    this.type = type;
  }

  react(cleanReactions) {
    const reactionKey = `${this.type}${this.state[0].toUpperCase()}${this.state.slice(1)}`
    const reaction = STATES[reactionKey]

    const sendFn = cleanReactions ? Slack.toggleReaction : Slack.sendReaction;

    sendFn({
      slackChannel: this.channel,
      reaction,
      messageTs: this.ts
    });
  }
}

export default Reactji;