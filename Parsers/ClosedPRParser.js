const getContent = (json) => {
  const content = {
    action_type: json.action,
    link: json.pull_request.html_url,
    repository_name: json.repository.name,
    pull_request_id: json.pull_request.number,
  }

  return content;
}

exports.getContent = getContent;