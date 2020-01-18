const parse = (json) => {
  return {
    branchName: json.pull_request.head.ref,
    link: json.pull_request.html_url,
    ghId: json.pull_request.number,
    repositoryName: json.repository.name,
    title: json.pull_request.title,
    draft: json.pull_request.draft,
    state: json.pull_request.state,
    owner: json.pull_request.head.repo.owner.login,
  }
} 

exports.parse = parse