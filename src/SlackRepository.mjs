const repositoriesIdentifiers = {
  'gh-hooks-repo-test': {
    devGroup: '@elbigode',
    channel: 'test-gh',
    deployChannel: 'test-gh-deploy'
  },
  'codelitt-v2': {
    devGroup: '@website-devs',
    channel: 'team-website-dev',
    deployChannel: 'team-website-deploy'
  },
  'rolli': {
    devGroup: '@rolli-devs',
    channel: 'team-rolli-dev',
    deployChannel: 'team-rolli-deploy'
  },
  'team-maker': {
    devGroup: '@team-maker-devs',
    channel: 'team-teammaker-dev',
    deployChannel: 'team-teammaker-deploy'
  },
  'zonda': {
    devGroup: '@zonda-devs',
    channel: 'team-zonda-dev',
    deployChannel: 'wg-zonda-deploy'
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
  'ay-excel-import-app': {
    devGroup: '@ay-devs',
    channel: 'team-ay-dev'
  },
  'ay-property-intelligence': {
    devGroup: '@ay-devs',
    channel: 'team-ay-pia-dev'
  },
  'team-maker': {
    devGroup: '@team-maker-devs',
    channel: 'team-teammaker-dev'
  },
}

const ghToSlackUsers = {
  kaiomagalhaes: 'kaiomagalhaes',
  alesmit: 'alex',
  alessandromontividiu03: 'alessandro.alves',
  diogoribeiro: 'diogo',
  gabrielpanga: 'gabriel',
  lua121: 'lua',
  neonima: 'vinny',
  paulohfev: 'paulo',
  presnizky: 'pablo',
  raphaelsattler: 'raphael.sattler',
  tolastarras: 'rafael.sobrino',
  victor0402: 'victor.carvalho'
}

const getRepositoryData = (repositoryName) => repositoriesIdentifiers[repositoryName];
const getSlackUser = (ghUser) => ghToSlackUsers[ghUser.toLowerCase()]

export default {
  getRepositoryData,
  data: repositoriesIdentifiers,
  getSlackUser
}