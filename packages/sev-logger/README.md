> Even though this module is publicly accessible, we do not recommend using it in projects outside of [Transloadit](https://transloadit.com). We won't make any guarantees about its workings and can change things at any time, we won't adhere strictly to SemVer.

> This module is maintained from a monorepo called [monolib](https://github.com/transloadit/monolib).

## Overview

`@transloadit/sev-logger` is a lightweight, printf-style logger with:

- syslog-like levels (`EMERG`..`TRACE`) and breadcrumbs
- breadcrumb nesting that auto-pads prefixes so multi-logger output aligns
- structured events (`logger.event`) alongside formatted lines
- optional timestamps, hostnames, callsites, and clickable paths (each path segment is clickable)
- built-in redaction of secrets (enabled by default)
- ESM/CJS friendly, no runtime deps beyond Node
- Node.js only (browser not supported today)

### Install

```bash
yarn add @transloadit/sev-logger
# or
npm install @transloadit/sev-logger
```

### Quickstart

```ts
import { SevLogger } from '@transloadit/sev-logger'

const log = new SevLogger({ breadcrumbs: ['api'] })
log.info('listening on %s', 'http://localhost:3000')

log.event(SevLogger.LEVEL.NOTICE, {
  event: 'user.login',
  userId: 42,
})
```

## Redaction (on by default)

Secrets are masked before anything is written to stdout/stderr/files. Defaults include:

- Field names: `token`, `secret`, `password`, `pass`, `authorization`, `auth`, `api_key`, `x-api-key`, `cookie`, `session`, `bearer`, …
- Patterns: Slack tokens, Bearer/JWT-like strings, AWS AKIA/ASIA keys, 40+ char base64ish strings
- High-entropy fallback for token-like strings
- Works for formatted logs *and* `event()` payloads, even when fields are abbreviated.

Repeated references and cycles are preserved (no stack overflows, shared refs stay shared). Non-plain objects such as `Date`, `URL`, `RegExp`, `Map`, `Set`, custom classes, and `Error`/`AggregateError` causes are retained.

Basic usage (default redaction on):

```ts
const log = new SevLogger({ breadcrumbs: ['botty'] })
log.info('token: %s', process.env.SLACK_BOT_TOKEN) // => token: [redacted]
log.event(SevLogger.LEVEL.INFO, {
  event: 'botty.start',
  headers: { Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}` },
}) // => headers.Authorization: "[redacted]"
```

Configuration (override defaults):

```ts
const log = new SevLogger({
  redact: {
    enabled: true,          // default true
    replacement: '[redacted]',
    keepLast: 4,            // tail to keep visible, default 4
    fields: ['sessionId'],  // extra field names to always mask (case-insensitive)
    patterns: [/SUPERSECRET\w+/g], // extra regexes
    entropy: true,          // mask random high-entropy strings
    custom: [(
      value, path, // path = ['payload', 'headers', 'authorization'] etc.
    ) => (typeof value === 'string' ? value.replace(/abc/g, '***') : value)],
  },
})

// Opt-out completely
const noRedact = new SevLogger({ redact: false })
```

## Events vs formatted lines

- `logger.info('File %s', '/tmp/foo')` — printf-style with `%s/%r/%c` for strings/paths/clickables.
- `logger.event(level, { event: 'upload.finished', userId, size })` — emits `event` name + JSON payload (with optional key abbreviations).

## Testing

```bash
cd packages/sev-logger
yarn test
```
