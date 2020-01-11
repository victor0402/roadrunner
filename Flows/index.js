const NewPRFlow = require('./NewPRFlow');
const ClosePRFlow = require('./ClosePRFlow')
const NewPushFlow = require('./NewPushFlow')
const NewReviewSubmissionFlow = require('./NewReviewSubmissionFlow')

const getFlow = (json) => {
  if (
    json.action === 'opened' || json.action === 'ready_for_review'
  ) {
    return NewPRFlow;
  } else if (json.action === 'created') {
    // @TODO: update flow
    //return NewPRCommentFlow;
  } else if (json.action === 'closed') {
    return ClosePRFlow;
  } else if (json.action === 'submitted') {
    return NewReviewSubmissionFlow;
  } else if (!json.action && json.ref) {
    return NewPushFlow;
  }
}

exports.getFlow = getFlow;