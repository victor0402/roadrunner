import NewPullRequestFlow from './NewPullRequestFlow';
import ClosePullRequestFlow from './ClosePullRequestFlow';
import UpdatePullRequestCodeFlow from './UpdatePullRequestCodeFlow';
import NewReviewSubmissionFlow from './NewReviewSubmissionFlow';
import SendChangelogFlow from './SendChangelogFlow';
import CheckRunFlow from './CheckRunFlow';

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