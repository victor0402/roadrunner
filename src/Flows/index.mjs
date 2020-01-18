import NewPullRequestFlow from './NewPullRequestFlow/index.mjs'
import ClosePullRequestFlow from './ClosePullRequestFlow/index.mjs'
import NewPushFlow from './NewPushFlow/index.mjs'
import NewReviewSubmissionFlow from './NewReviewSubmissionFlow/index.mjs'

const getFlow = async (json) => {
  if (NewPullRequestFlow.isFlow(json)) {
    console.log('new pr flow')
    return NewPullRequestFlow;
  } else if (json.action === 'created') {
    // @TODO: update flow
    //return NewPRCommentFlow;
  } else if (ClosePullRequestFlow.isFlow(json)) {
    console.log('close pr flow')
    return ClosePullRequestFlow;
  } else if (json.action === 'submitted') {
    console.log('review submission flow')
    return NewReviewSubmissionFlow;
  } else if (await NewPushFlow.isANewValidPush(json)) {
    console.log('new push flow')
    return NewPushFlow;
  }
}

export default {
  getFlow,
}