---
'@transloadit/sev-logger': patch
---

Expose the `error`, `stdout`, and `stderr` members on SevLoggerLike so downstream code can continue to use those properties without casts.
