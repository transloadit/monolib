/* eslint-disable max-len */
module.exports = {
  extends: [
    'transloadit',
  ],
  parser  : '@typescript-eslint/parser',
  plugins : ['@typescript-eslint'],
  settings: {
    'import/resolver': {
      typescript: {},
      node      : {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  parserOptions: {
    requireConfigFile: false,
  },
  rules: {
    // rules we had to turn off just to get a pass, but we'd
    // like to turn on one by one with separate PRs
    /// /////////////////////////////////////////////////////////
    'guard-for-in'            : ['warn'],
    'no-param-reassign'       : ['warn'],
    'no-restricted-globals'   : ['warn'],
    'no-restricted-properties': ['warn'],
    'no-restricted-syntax'    : ['warn'],
    'import/extensions'       : [
      'error',
      'ignorePackages',
      {
        js : 'never',
        jsx: 'never',
        ts : 'never',
        tsx: 'never',
      },
    ],
  },
}
