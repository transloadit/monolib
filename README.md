# monolib

A **private** monorepo with **public**ly published single-file JavaScript utils that we can re-use in our different projects.

## Rules

- Bundle a Jest test with your function
- If the function isn't pure, back to the drawing board

## How to Consume these functions?

```bash
# yarn
yarn add @transloadit/analyzeStep

# npm
npm i @transloadit/analyzeStep --save-exact
```

## What functions are available right now?

Check <https://github.com/transloadit/monolib/tree/master/packages>

## How to add functions?

- Write in `./packages/<name>/` as you would any other module, but make sure it has appropriate values for the `name`, `repository`, `publishConfig`, `private` properties inside the `package.json` (probably just clone & tweak an existing package)
- Commit
- Run `npm run pub` to publish



