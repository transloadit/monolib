# @transloadit/sev-logger

## 0.0.12

### Patch Changes

- 49a7c09: Broaden SevLoggerLike method signatures so they match the full logger API, ensuring TypeScript accepts format strings with additional arguments.

## 0.0.11

### Patch Changes

- 741c4d4: Expose a structural `SevLoggerLike` interface so SevLoggerBaseClass can accept loggers from multiple installs without private-field conflicts.
- 5f86559: Expose a structural `SevLoggerLike`

## 0.0.10

### Patch Changes

- Bind `trace` on `SevLoggerBaseClass` so inheriting classes have access to the low-level severity helper.

## 0.0.9

### Patch Changes

- 65bba8b: Introduce SevLoggerBaseClass
- b2de490: Add more comments

## 0.0.8

### Patch Changes

- 699e85c: Fix crcTable bug

## 0.0.7

### Patch Changes

- d7e61e3: Use abbr

## 0.0.6

### Patch Changes

- 275a67f: Tweak motd

## 0.0.5

### Patch Changes

- d7518ea: Allow logging arbitrary values

## 0.0.4

### Patch Changes

- 473ec42: Export types

## 0.0.3

### Patch Changes

- bf5e5cb: fix module

## 0.0.2

### Patch Changes

- 045aa6f: Graduate SevLogger
