const parse = (json) => {
  return {
    branchName: json.ref.match(/refs\/heads\/(.*)/)[1],
    repositoryName: json.repository.name
  }
}

export default {
  parse
}