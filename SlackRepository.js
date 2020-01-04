const repositoriesIdentifiers = {
  'gh-hooks-repo-test': {
    devGroup: '@chaos',
    channel: 'gh-notifications'
  },
  'codelitt-v2': {
    devGroup: '@website-devs',
    channel: 'team-website-dev'
  },
  'rolli': {
    devGroup: '@rolli-devs',
    channel: 'team-rolli-dev'
  },
  'team-maker': {
    devGroup: '@team-maker-devs',
    channel: 'team-teammaker-dev'
  }
}

const getRepositoryData = (repositoryName) => repositoriesIdentifiers[repositoryName];

exports.getRepositoryData = getRepositoryData;