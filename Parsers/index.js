const NewPRParser = require('./NewPRParser');
const NewCommentParser = require('./NewCommentParser');

const getParser = (json) => {
  if (json.action === 'opened' && !json.draft) {
    return NewPRParser;
  } else if(json.action === 'created' && json.comment && json.comment.url) {
    return NewCommentParser;
  }
}

exports.getParser = getParser;