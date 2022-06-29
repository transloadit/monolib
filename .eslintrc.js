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
  overrides: [
    {
      files: ['*.ts'],
      rules: {
        // We strongly recommend that you do not use the no-undef lint rule on TypeScript projects. The checks it provides are already provided by TypeScript without the need for configuration - TypeScript just does this significantly better.
        // https://stackoverflow.com/a/67412847/151666
        'no-undef': ['off'],
      },
    },
  ],
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
