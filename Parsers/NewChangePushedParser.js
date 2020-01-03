const getContent = (json) => {
  const content = {
    action_type: 'new_change_pushed',
    branch_name: json.ref.match(/[^\/]*$/)[0],
    pull_request_id: json.repository.open_issues,
    repository_name: json.repository.name
  }

  return content;
}

exports.getContent = getContent;