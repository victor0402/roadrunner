const repositoriesIdentifiers = {
  'gh-hooks-repo-test': {
    devGroup: '@nicetag',
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
  },
  'zonda': {
    devGroup: '@zonda-devs',
    channel: 'team-zonda-dev'
  },
  'ay-design-library': {
    devGroup: '@ay-devs',
    channel: 'team-ay-dev'
  },
  'ay-design-library': {
    devGroup: '@ay-devs',
    channel: 'team-ay-dev'
  },
  'ay-properties-api': {
    devGroup: '@ay-devs',
    channel: 'team-ay-dev'
  },
  'ay-the-hub': {
    devGroup: '@ay-devs',
    channel: 'team-ay-dev'
  },
  'ay-excel-import-api': {
    devGroup: '@ay-devs',
    channel: 'team-ay-dev'
  },
  'ay-property-intelligence': {
    devGroup: '@ay-devs',
    channel: 'team-ay-dev'
  },
  'team-maker': {
    devGroup: '@team-maker-devs',
    channel: 'team-teammaker-dev'
  },

}

const getRepositoryData = (repositoryName) => repositoriesIdentifiers[repositoryName];

exports.getRepositoryData = getRepositoryData;
