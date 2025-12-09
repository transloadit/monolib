---
'@transloadit/sev-logger': patch
---

Normalize ESM file:// callsite paths to filesystem paths before formatting, preventing callsite links like file:/home/... and keeping relative paths readable.
