# @transloadit/analyze-step

## 2.0.0

### Major Changes

- 8efa1e5: Move monolib packages to ESM-only output and refresh dependencies.

  This is a breaking change for CommonJS consumers: import these packages from ESM code or use dynamic import from CommonJS.
  The supported Node.js floor is now 22, package exports are explicit, and TypeScript checks are stricter.

### Patch Changes

- Updated dependencies [8efa1e5]
  - @transloadit/format-duration-ms@2.0.0
  - @transloadit/prettier-bytes@2.0.0

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
  - @transloadit/format-duration-ms@1.0.0
  - @transloadit/prettier-bytes@1.0.0

## 0.4.3

### Patch Changes

- 07ca1ed: Switch to turbo
- Updated dependencies [07ca1ed]
  - @transloadit/format-duration-ms@0.4.3
  - @transloadit/prettier-bytes@0.3.5
