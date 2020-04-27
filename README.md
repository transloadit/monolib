# monolib

A private monorepo with publicly published single-file JavaScript utils that we can re-use in our different projects.

## How to: Consume these functions

Check: <https://github.com/transloadit/team-internals/blob/master/_howtos/2020-02-17-github-packages-registry.md>

## How to: Add functions

- Write in `./packages/<name>/` as you would any other module, but make sure it has appropriate values for the `name`, `repository`, `publishConfig` properties inside the `package.json` (steal from an existing package, changing just the names where appropriate)
- Commit
- Run `npm run pub` to publish