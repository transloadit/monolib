# :house_with_garden: monolib

A **private** monorepo with **public**ly published single-file JavaScript utils that we can re-use in our different projects.

To many small functions that just don't belong, it's the place they call home.

Modules are public so they can be re-used without configuring registries and setting tokens for anybody consuming them. This allows the modules to be used in e.g. Uppy or the Node SDK. While the world can consume the modules, that's mostly a tool to make life easier for us, we won't encourage people to use them in their own projects. Hence, the license is AGPL-3.0-only, and we issue unwelcoming READMEs with disclaimers.

## Rules

- Bundle a Jest test with your function
- If the function isn't pure, back to the drawing board

## Examples

- Uppy has its own way of reporting bytes. If we'd put that `formatBytes` function here, now we can easily use it in our node-sdk, React outputting bytes in /c/, etc.
- We had an `analyzeStep` function in the content repo's `_script` dir, that takes a Step object and outputs a human readable string ("Encode video to iPad format"). We use it describe demos. After adding it to monolib, we can now use `@transloadit/analyze-step` in the new Visual Template Editor, too.

## What functions are available right now?

Check <https://github.com/transloadit/monolib/tree/master/packages>.

|     File     |                                                                Example                                                                 |                           Output                            |
|:------------:|:--------------------------------------------------------------------------------------------------------------------------------------:|:-----------------------------------------------------------:|
| `fileExists` |                                                     `await fileExists('foo.jpg')`                                                      |                           `true`                            |
|    `abbr`    | `abbr('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ')` | `'Lorem ipsum dolor sit ame[...] et dolore magna aliqua. '` |

## How to consume these functions?

In your project, type:

```bash
# yarn
yarn add @transloadit/analyzeStep

# npm
npm i @transloadit/analyzeStep --save-exact
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

## How to iterate quickly inside a consuming project without publishing 100 versions?

```bash
$ cd ~/code/monolib/packages/analyze-step
$ yarn link
yarn link v1.22.4
success Registered "@transloadit/analyze-step".
info You can now run `yarn link "@transloadit/analyze-step"` in the projects where you want to use this package and it will be used instead.
Done in 0.04s.

$ cd ~/code/content
$ yarn link @transloadit/analyze-step
yarn link v1.22.4
success Using linked package for "@transloadit/analyze-step".
Done in 0.04s.
```
