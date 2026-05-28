# @transloadit/prettier-bytes

## 2.0.0

### Major Changes

- 8efa1e5: Move monolib packages to ESM-only output and refresh dependencies.

  This is a breaking change for CommonJS consumers: import these packages from ESM code or use dynamic import from CommonJS.
  The supported Node.js floor is now 22, package exports are explicit, and TypeScript checks are stricter.

## 1.1.0

### Minor Changes

- 129c5a6: Improve precision for GBs

## 1.0.1

### Patch Changes

- 59ddf73: Add support for explicit units.

## 1.0.0

### Major Changes

- 7c09755: Switch to named exports

### Patch Changes

- 7a1b66f: Fix CI releases - part I

## 0.3.5

### Patch Changes

- 07ca1ed: Switch to turbo
