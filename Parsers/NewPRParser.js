const getContent = (json) => {
  const content = {
    action_type: json.action,
    link: json.pull_request.html_url
  }

  return content;
}

exports.getContent = getContent;