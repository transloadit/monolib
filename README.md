# :house_with_garden: monolib

An internal monorepo with publicly published single-file TypeScript utils that we can re-use across our different projects.

It's the home to many small functions that just don't belong.

For example, Uppy has its own way of reporting bytes. We moved that function here, so now we can easily add it to our node-sdk, API, and content repo where React would be outputting bytes in /c/.

Modules are public so they can be re-used without configuring registries and setting tokens for anybody consuming them. This allows the modules to be used in e.g. Uppy or the Node SDK. 

While the world _can_ consume the modules, this is mostly to make life easier for us, we won't encourage people to use these modules in their own projects. We may break SemVer with no regard to external projects. Hence, the license is AGPL-3.0-only, and we add unwelcoming READMEs with disclaimers to the modules.

## Rules

- Bundle a Jest test with your function
- Pure functions only please

## Examples

| Module                             | Example                                                                      | Result                                                                      |
|:-----------------------------------|:-----------------------------------------------------------------------------|:----------------------------------------------------------------------------|
| `@transloadit/abbr`                | `abbr('Lorem ipsum dolor sit amet', 10, ' .. '))`                            | `'Lor .. met'`                                                              |
| `@transloadit/analyze-step`        | `analyzeStep({ robot: '/image/resize', width: '75', height: '75' }, ROBOTS)` | `'Resize images to 75×75'`                                                  |
| `@transloadit/enrich-tweet`        | `await enrichTweet(TWEET)`                                                   | The text of the tweet, linked, short URLs expanded                          |
| `@transloadit/file-exists`         | `await fileExists('foo.jpg')`                                                | `true`                                                                      |
| `@transloadit/format-duration-ms`  | `formatDurationMs(10000000)`                                                 | `'2h46m40s'`                                                                |
| `@transloadit/post`                | `$ post [subdir]`                                                            | Asks questions and creates a markdown post, by default in subdir `./_posts` |
| `@transloadit/pr`                  | `pr({ a: 1 })`                                                               | Dumps `{a: 1}` on the console, used for debugging                           |
| `@transloadit/prd`                 | `prd({ a: 1 })`                                                              | Dumps `{a: 1}` on the console and exits program, used for debugging         |
| `@transloadit/prettier-bytes`      | `prettierBytes(235555520)`                                                   | `'225 MB'`                                                                  |
| `@transloadit/slugify`             | `slugify('--This is My App !~')`                                             | `'this-is-my-app'`                                                          |
| `@transloadit/sort-object`         | `sortObject({b: 'a', a: 'b'})`                                               | `{a: 'b', b: 'a'}`                                                          |
| `@transloadit/sort-object-by-prio` | `sortObjectByPrio({b: 'a', a: 'b'}, {_: ['b']})`                             | `{b: 'a', a: 'b'}`                                                          |
| `@transloadit/sort-assembly`       | `sortAssembly(ASSEMBLY_OBJECT)`                                              | Sorted Assembly Object                                                      |
| `@transloadit/sort-result-meta`    | `sortResultMeta(ASSEMBLY_RESULT_META_OBJECT)`                                | Sorted Assembly Object                                                      |
| `@transloadit/sort-result`         | `sortResult(ASSEMBLY_RESULT_OBJECT)`                                         | Sorted Assembly Object                                                      |

Check <https://github.com/transloadit/monolib/tree/master/packages>.

## How to consume these functions?

In your project, type:

```bash
# yarn
yarn add @transloadit/analyze-step

# npm
npm i @transloadit/analyze-step --save-exact
```

## How to check out this repo locally?

```bash
cd code
git clone git@github.com:transloadit/monolib.git
cd monolib
git pull
yarn
```

## How to add functions?

- Easiest is run `make new` (this will ask for the new module name (e.g. `prd`), then duplicate `./template-package` to a directory in `./packages/<name>` and replace any `replace-me` or `replaceMe` respectively)
- Traverse into `./packages/<name>/` and `yarn add` whichever dependency you need like you would normally
- Write your function & test (`yarn test:watch`)
- Add an example to the table in this `README.md`
- Commit
- Run `yarn pub` to publish (that's an alias to [`lerna publish`](https://lerna.js.org/#command-publish))

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
