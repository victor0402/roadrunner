const devToQATitle = 'development to qa'
const QAToMasterTitle = 'qa to master'

const isDeployPR = (title) => (
  title === devToQATitle || title === QAToMasterTitle
);
const isValid = (json) => {
  const { pull_request } = json
  const { draft, title } = pull_request;

  return !draft && !isDeployPR(title.toLowerCase())
}

exports.isValid = isValid;