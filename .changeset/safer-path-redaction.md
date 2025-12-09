---
'@transloadit/sev-logger': patch
---

- Prevent filesystem-like paths from being redacted by generic token/AWS patterns while still masking long slashy tokens; add regression tests.
