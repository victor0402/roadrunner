const getContent = (json) => {
  const content = {
    action_type: json.action,
    pull_request_id: json.pull_request.number,
    repository_name: json.repository.name,
  }

  return content;
}

exports.getContent = getContent;