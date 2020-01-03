const NewPRParser = require('./NewPRParser');
const NewCommentParser = require('./NewCommentParser');
const ClosedPRParser = require('./ClosedPRParser');

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
  }
}

exports.getParser = getParser;