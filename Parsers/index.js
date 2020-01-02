const NewPRParser = require('./NewPRParser');

const getParser = (json) => {
  if (json.action === 'opened') {
    return NewPRParser;
  }
}

exports.getParser = getParser;