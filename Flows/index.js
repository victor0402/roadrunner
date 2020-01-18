const PullRequest = require('../models/PullRequest').default
const pushChangeParser = require('../parsers/pushChangeParser');
const NewPRFlow = require('./NewPRFlow');
const ClosePRFlow = require('./ClosePRFlow')
const NewPushFlow = require('./NewPushFlow')
const NewReviewSubmissionFlow = require('./NewReviewSubmissionFlow')

const getFlow = async (json) => {
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
  } else if (await isANewValidPush(json)) {
    console.log('new push flow')
    return NewPushFlow;
  }
}

const isANewValidPush = async (json) => {
  const content = pushChangeParser.parse(json);
  const { repositoryName, branchName} = content;

  if (branchName === 'master' || branchName === 'development' || branchName === 'develop') {
    return;
  }

  const query = {
    branchName: branchName,
    repositoryName: repositoryName
  }

  const pr = await PullRequest.findBy(query)
  return pr && !pr.isClosed();
};

exports.getFlow = getFlow;