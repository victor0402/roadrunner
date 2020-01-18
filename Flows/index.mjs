import NewPRFlow from './NewPRFlow/index.mjs'
import ClosePRFlow from './ClosePRFlow/index.mjs'
import NewPushFlow from './NewPushFlow/index.mjs'
import NewReviewSubmissionFlow from './NewReviewSubmissionFlow/index.mjs'

const getFlow = async (json) => {
  if (
    json.action === 'opened' || json.action === 'ready_for_review'
  ) {
    console.log('new pr flow')
    return NewPRFlow;
  } else if (json.action === 'created') {
    // @TODO: update flow
    //return NewPRCommentFlow;
  } else if (ClosePrFlow.isAValidClosePRFlow(json)) {
    console.log('close pr flow')
    return ClosePRFlow;
  } else if (json.action === 'submitted') {
    console.log('review submission flow')
    return NewReviewSubmissionFlow;
  } else if (await NewPushFlow.isANewValidPush(json)) {
    console.log('new push flow')
    return NewPushFlow;
  }
}

export default getFlow;