import NewPullRequestFlow from './NewPullRequestFlow/index.mjs'
import ClosePullRequestFlow from './ClosePullRequestFlow/index.mjs'
import UpdatePullRequestCodeFlow from './UpdatePullRequestCodeFlow/index.mjs'
import NewReviewSubmissionFlow from './NewReviewSubmissionFlow/index.mjs'
import SendChangelogFlow from './SendChangelogFlow/index.mjs';
import CheckRunFlow from './CheckRunFlow/index.mjs';

const getFlow = async (json) => {
  if (await NewPullRequestFlow.isFlow(json)) {
    return NewPullRequestFlow;
  } else if (await ClosePullRequestFlow.isFlow(json)) {
    return ClosePullRequestFlow;
  } else if (await NewReviewSubmissionFlow.isFlow(json)) {
    return NewReviewSubmissionFlow;
  } else if (await UpdatePullRequestCodeFlow.isFlow(json)) {
    return UpdatePullRequestCodeFlow;
  } else if (await SendChangelogFlow.isFlow(json)) {
    return SendChangelogFlow;
  } else if (await CheckRunFlow.isFlow(json)) {
    return CheckRunFlow;
  }
}

export default {
  getFlow,
}