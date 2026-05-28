---
'@transloadit/abbr': major
'@transloadit/analyze-step': major
'@transloadit/file-exists': major
'@transloadit/format-duration-ms': major
'@transloadit/has-property': major
'@transloadit/post': major
'@transloadit/pr': major
'@transloadit/prd': major
'@transloadit/prettier-bytes': major
'@transloadit/sev-logger': major
'@transloadit/slugify': major
'@transloadit/sort-assembly': major
'@transloadit/sort-object': major
'@transloadit/sort-object-by-prio': major
'@transloadit/sort-result': major
'@transloadit/sort-result-meta': major
'@transloadit/trigger-pager': major
---

Move monolib packages to ESM-only output and refresh dependencies.

This is a breaking change for CommonJS consumers: import these packages from ESM code or use dynamic import from CommonJS.
The supported Node.js floor is now 22, package exports are explicit, and TypeScript checks are stricter.
