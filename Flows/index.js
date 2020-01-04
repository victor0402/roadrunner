const NewPRFlow = require('./NewPRFlow');
const NewPRCommentFlow = require('./NewPRCommentFlow')
const ClosePRFlow = require('./ClosePRFlow')
const NewPushFlow = require('./NewPushFlow')

const getFlow = (json) => {
  if (
    json.action === 'opened' && !json.pull_request.draft ||
    json.action === 'ready_for_review'
  ) {
    return NewPRFlow;
  } else if (json.action === 'created') {
    return NewPRCommentFlow;
  } else if (json.action === 'closed') {
    return ClosePRFlow;
  } else if (!json.action && json.ref) {
    return NewPushFlow;
  }
}

exports.getFlow = getFlow;