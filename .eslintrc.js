/* eslint-disable max-len */
module.exports = {
  extends: [
    'transloadit',
  ],
  parserOptions: {
    requireConfigFile: false,
  },
  rules: {
    // we're actually okay with these
    /// /////////////////////////////////////////////////////////
    // 'no-console'                 : ['off'], // <-- we are console.log heavy in the api
    // 'node/no-path-concat'        : ['off'], // we won't run the api on windows soon
    // 'import/no-unresolved'       : ['off', { commonjs: true }], // <-- node_modules live inside vbox /nix so can't be accessed from workstation. we re-enable it further down for vboxes and such
    // 'no-template-curly-in-string': ['off'], // our Assembly Variable interpolation makes heavy use of this: `r: '${file.meta.framerate}'`

    // rules we had to turn off just to get a pass, but we'd
    // like to turn on one by one with separate PRs
    /// /////////////////////////////////////////////////////////
    'guard-for-in': ['warn'],
  },
}
