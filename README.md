# monolib

A **private** monorepo with **public**ly published single-file JavaScript utils that we can re-use in our different projects.

## Rules

- Bundle a Jest test with your function
- If the function isn't pure, back to the drawing board

## How to Consume these functions?

In your project, type:

```bash
# yarn
yarn add @transloadit/analyzeStep

# npm
npm i @transloadit/analyzeStep --save-exact
```

## What functions are available right now?

Check <https://github.com/transloadit/monolib/tree/master/packages>

## How to add functions?

- Easiest is to duplicate a directory in `./packages/` and tweak it to your liking
- Commit
- Run `npm run pub` to publish (that's just an alias to [`lerna publish`](https://lerna.js.org/#command-publish))

## How to run tests?

```bash
make test-watch

# yarn
yarn test:watch

# npm
npm run test:watch
```

## How to check out this repo locally?

```bash
cd code
git clone git@github.com:transloadit/monolib.git
cd monolib
git pull
yarn
yarn lernaBootstrap
```

## How to iterate quickly inside a consuming project without publishing 100 versions?

```bash
cd ~/code/monorepo/packages/analyze-step
yarn link

cd ~/code/content
yarn link @transloadit/analyze-step
```
