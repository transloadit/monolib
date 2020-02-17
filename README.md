# monolib

A private monorepo with pure single-file javascripts functions that can be re-used in private projects

All functions in this repository are supposed to be _Pure_(tm), meaning same input always generates same output, and there are no side-effects (don't touch db, don't modify passed in objects, etc).

## How to: Consume these functions

Check: <https://github.com/transloadit/team-internals/blob/master/_howtos/2020-02-17-github-packages-registry.md>

## How to: Add simple functions (with no dependencies)

- Write in `./simple/<name>.js` and its Jest tests in `./simple/<name>.test.js`
- Run `npm run pub` to convert them into real packages under `/packages/<name>/` and have them published

## How to: Add functions with dependencies

- Write in `./packages/<name>/` as you would any other module, but make sure it has appropriate values for the `name`, `private`, `repository`, `publishConfig` properties inside the `package.json` (steal from an existing package, changing just the names where appropriate)
- Run `npm run pub` to publish