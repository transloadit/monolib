# @transloadit/post

## 2.0.1

### Patch Changes

- dc408d7: Refresh the inquirer dependency and repo tooling patch versions.

## 2.0.0

### Major Changes

- 8efa1e5: Move monolib packages to ESM-only output and refresh dependencies.

  This is a breaking change for CommonJS consumers: import these packages from ESM code or use dynamic import from CommonJS.
  The supported Node.js floor is now 22, package exports are explicit, and TypeScript checks are stricter.

### Patch Changes

- Updated dependencies [8efa1e5]
  - @transloadit/file-exists@2.0.0
  - @transloadit/slugify@2.0.0

## 1.0.2

### Patch Changes

- Upgrade title to v4 and use its built-in types.

## 1.0.1

### Patch Changes

- Refresh compatible dependency versions.

## 1.0.0

### Major Changes

- 7c09755: Switch to named exports

### Patch Changes

- 7a1b66f: Fix CI releases - part I
- Updated dependencies [7c09755]
- Updated dependencies [7a1b66f]
  - @transloadit/file-exists@1.0.0
  - @transloadit/slugify@1.0.0

## 0.4.3

### Patch Changes

- 07ca1ed: Switch to turbo
- Updated dependencies [07ca1ed]
  - @transloadit/file-exists@0.3.4
  - @transloadit/slugify@0.3.4
