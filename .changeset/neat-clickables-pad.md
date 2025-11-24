---
'@transloadit/sev-logger': patch
---

Fix clickable path fallback for non-TTY logs and ensure shared padding only grows when visible log lines are emitted, preventing runaway indentation in nested loggers.
