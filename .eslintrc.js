/* eslint-disable max-len */
module.exports = {
  extends: [
    'transloadit',
  ],
  parserOptions: {
    requireConfigFile: false,
  },
  rules: {
    // rules we had to turn off just to get a pass, but we'd
    // like to turn on one by one with separate PRs
    /// /////////////////////////////////////////////////////////
    'guard-for-in'            : ['warn'],
    'no-await-in-loop'        : ['warn'],
    'no-param-reassign'       : ['warn'],
    'no-restricted-globals'   : ['warn'],
    'no-restricted-properties': ['warn'],
    'no-restricted-syntax'    : ['warn'],
  },
}
