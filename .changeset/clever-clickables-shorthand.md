---
'@transloadit/sev-logger': patch
---

- Fix clickable path fallback so non-TTY logs print clean relative paths instead of repeated `file:///` segments.
- Update shared padding to grow only when a log line is actually emitted, preventing indentation from jumping when suppressed nested loggers exist.
- Add shorthand overloads for `nest()` so callers can pass a single string or array of breadcrumbs without wrapping them in an object.
