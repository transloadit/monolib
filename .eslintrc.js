/* eslint-disable max-len */
module.exports = {
  extends: [
    'transloadit',
  ],
  parser : '@typescript-eslint/parser',
  plugins: [
    '@babel/eslint-plugin',
    'jest',
    'node',
    'prefer-import',
    'promise',
    // extra:
    '@typescript-eslint',
  ],
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
    // Plenty of cli tools in here so we do not care about console.log usage:
    'no-console'              : ['off'],
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
