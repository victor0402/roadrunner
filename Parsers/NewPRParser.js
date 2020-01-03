const getContent = (json) => {
  const content = {
    action_type: 'opened',
    link: json.pull_request.html_url,
    repository_name: json.repository.name,
    pull_request_id: json.pull_request.number,
    branch_name: json.pull_request.head.ref
  }

  return content;
}

exports.getContent = getContent;