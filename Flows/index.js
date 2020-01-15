const NewPRFlow = require('./NewPRFlow');
const ClosePRFlow = require('./ClosePRFlow')
const NewPushFlow = require('./NewPushFlow')
const NewReviewSubmissionFlow = require('./NewReviewSubmissionFlow')

const getFlow = (json) => {
  if (
    json.action === 'opened' || json.action === 'ready_for_review'
  ) {
    console.log('new pr flow')
    return NewPRFlow;
  } else if (json.action === 'created') {
    // @TODO: update flow
    //return NewPRCommentFlow;
  } else if (json.action === 'closed') {
    console.log('close pr flow')
    return ClosePRFlow;
  } else if (json.action === 'submitted') {
    console.log('review submission flow')
    return NewReviewSubmissionFlow;
  } else if (!json.action && json.ref) {
    console.log('new push flow')
    return NewPushFlow;
  }
}

exports.getFlow = getFlow;