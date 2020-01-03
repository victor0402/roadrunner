const NewPRParser = require('./NewPRParser');
const NewCommentParser = require('./NewCommentParser');
const ClosedPRParser = require('./ClosedPRParser');
const NewChangePushedParser = require('./NewChangePushedParser')

const getParser = (json) => {
  if (
    json.action === 'opened' && !json.pull_request.draft ||
    json.action === 'ready_for_review'
  ) {
    return NewPRParser;
  } else if (json.action === 'created' && json.comment && json.comment.url) {
    return NewCommentParser;
  } else if (json.action === 'closed') {
    return ClosedPRParser;
  } else if (json.ref) {
    return NewChangePushedParser;
  }
}

exports.getParser = getParser;