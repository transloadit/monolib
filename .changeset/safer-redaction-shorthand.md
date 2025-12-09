---
'@transloadit/sev-logger': patch
---

- Prevent path-like strings from being redacted by generic token patterns while still masking long slashy tokens (and add coverage for both).
- Add nest() shorthand overloads (string/array) and keep tests for clickable fallback and padding fixes.
