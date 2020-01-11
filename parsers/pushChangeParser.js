const parse = (json) => {
  return {
    branchName: json.ref.match(/refs\/heads\/(.*)/)[1],
    pullRequestId: json.repository.open_issues,
    repositoryName: json.repository.name
  }
}

exports.parse = parse