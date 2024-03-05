/* eslint-disable no-undef */
/**
 * @type {import('semantic-release').GlobalConfig}
 */
module.exports = {
  branches: ['setup_release_for_cli'],
  extends: 'semantic-release-monorepo',
  plugins: ['@semantic-release/npm', '@semantic-release/github']
};
