import fs from 'node:fs'
import { hostname, userInfo } from 'node:os'
import path, { basename, relative, resolve } from 'node:path'
import { inspect } from 'node:util'
import { abbr } from '@transloadit/abbr'

const GENERIC_TOKEN_PATTERN = /\b[A-Za-z0-9+=]{32,}\b/g
const GENERIC_SLASHY_TOKEN_PATTERN = /[A-Za-z0-9+/=]{32,}/g
const AWS_SECRET_PATTERN = /\b[A-Za-z0-9/+=]{40}\b/g

// Define the LogEvent interface needed for the event() method
export interface LogEvent {
  event: string
  error?: Error | Record<string, unknown> | string // Allow Error or serialized-like object
  err?: Error | Record<string, unknown> | string
  [key: string]: unknown
}

// Define explicit SharedState type
export interface SharedState {
  maxTimestampLength: number
  maxHostnameLength: number
  maxBreadcrumbLength: number
}

export interface SevLoggerParams {
  /** Custom separator for nested breadcrumbs. Defaults to ':'. */
  nestDivider?: string
  /** Initial breadcrumbs for this logger instance. */
  breadcrumbs?: string[]
  /** Minimum log level to output (inclusive). Uses SevLogger.LEVEL constants. Defaults to SevLogger.LEVEL.NOTICE. */
  level?: number
  /** A map to shorten breadcrumb strings in the output. */
  abbreviations?: Record<string, string>
  /** Format for timestamps in logs. 'iso' | 'ss.ms' | 'ms' | false. Defaults to false. */
  timestampFormat?: 'iso' | 'ss.ms' | 'ms' | false
  /** Add hostname ([user@host]) to standard formatted logs? Defaults based on env vars (usually false). See `LOG_HOSTNAME`. */
  addHostname?: boolean
  /** Add callsite ([file:line]) to standard formatted logs? Defaults based on env vars (usually true unless CI/production). See `LOG_CALLSITE`, `NODE_ENV`, `CI`. */
  addCallsite?: boolean
  /** Make file paths clickable in standard formatted logs? Defaults based on env vars (usually true unless CI/production). See `LOG_CLICKABLES`, `NODE_ENV`, `CI`. */
  addClickables?: boolean
  /** Custom stream for standard output (levels NOTICE and below). Defaults to process.stdout. */
  stdout?: NodeJS.WriteStream
  /** Custom stream for error output (levels WARN and above). Defaults to process.stderr. */
  stderr?: NodeJS.WriteStream
  /** If set, logs will be appended to this file instead of stdout/stderr. */
  filepath?: string
  /** Shared state object for coordinating max prefix length across nested loggers. */
  sharedState?: SharedState
  /** Custom color functions for standard formatted logs. */
  colors?: SevLogger['colors']
  /** Custom color functions for log level names in standard formatted logs. */
  levelColors?: SevLogger['levelColors']
  /** Custom color functions for %s/%r/%c specifiers in standard formatted logs. */
  formatColors?: SevLogger['formatColors']
  /** A map to shorten field names in the JSON payload of event() logs when log level is less verbose than DEBUG. */
  eventFieldAbbreviations?: Record<string, string>
  /** Redaction settings. When true (default), common secrets/tokens are masked in messages and event payloads. */
  redact?: boolean | RedactConfig
}

export interface RedactConfig {
  /** Enable/disable redaction. Default: true */
  enabled?: boolean
  /** Replacement text for redacted values. Default: "[redacted]" */
  replacement?: string
  /** How many trailing characters to keep visible. Default: 4 */
  keepLast?: number
  /** Field-name matches (case-insensitive) that should always be redacted. */
  fields?: string[]
  /** Additional regex patterns to redact from any string. */
  patterns?: RegExp[]
  /** Custom redaction hooks for advanced cases. */
  custom?: RedactHook[]
  /** Enable high-entropy fallback masking. Default: true */
  entropy?: boolean
}

// <-- Start: Type definitions for format string parsing -->
export type SevLoggerSpec = 's' | 'r' | 'c'
export type SevLoggerSpecType<S extends SevLoggerSpec> = S extends 's'
  ? unknown // %s accepts anything
  : S extends 'r'
    ? string // %r requires a string (filepath)
    : S extends 'c'
      ? string // %c requires a string (filepath)
      : never

// Recursively parses the format string to determine the expected argument types
export type ParseLogArgs<
  Fmt extends string,
  Acc extends unknown[] = [],
> = Fmt extends `${string}%%${infer Rest}` // Higher priority: ignore %% escape
  ? ParseLogArgs<Rest, Acc> // Recurse on the rest, keep accumulator
  : Fmt extends `${string}%${infer S extends SevLoggerSpec}${infer Rest}` // Match %s, %r, %c
    ? ParseLogArgs<Rest, [...Acc, SevLoggerSpecType<S>]> // Add type to accumulator, recurse on rest
    : Acc // Base case: No more %specifiers found, return accumulator
// <-- End: Type definitions -->

export type LogImplementation = (level: number, message: unknown, ...args: unknown[]) => void

export type RedactHook = (value: unknown, path: string[]) => unknown

/**
 * @class SevLogger
 * A flexible logger supporting multiple severity levels, printf-style formatting (%s, %r, %c),
 * structured event logging (.event()), breadcrumbs for context, nesting,
 * configurable timestamps, callsite information, clickable file paths,
 * log file output, and customizable colors.
 *
 * Inspired by syslog severity levels. Provides methods like .info(), .warn(), .error(), etc.
 * Also provides a .event() method for logging structured data similar to traditional event loggers.
 *
 * Configuration is passed via the constructor or the .update() method using the SevLoggerParams interface.
 * Nested loggers inherit and share configuration (like max prefix length) from their parent.
 *
 * Behavior can be influenced by the following environment variables:
 * - `NO_COLOR=1`: Disables colored output.
 * - `LOG_HOSTNAME=1` / `LOG_HOSTNAME=true`: Enables hostname logging by default.
 * - `LOG_CALLSITE=0` / `LOG_CALLSITE=false`: Disables callsite logging by default.
 * - `LOG_CLICKABLES=0` / `LOG_CLICKABLES=false`: Disables clickable file paths by default.
 * - `NODE_ENV=production`: Disables callsite and clickables by default.
 * - `CI=1` / `CI=true`: Disables callsite and clickables by default.
 *
 * @example
 * ```typescript
 * import { SevLogger } from '@transloadit/sev-logger';
 *
 * // Basic usage
 * const log = new SevLogger({ level: SevLogger.LEVEL.INFO });
 * log.info('Hello, world!');
 * log.warn('Something might be wrong.');
 *
 * // With formatting
 * // a filepath (turned into a relative path from the current working directory)
 * log.info('Processing file %r', '/path/to/data.txt');
 *
 * // a filepath (turned into a clickable hyperlink (if terminal supports it)
 * // to the relative path from the current working directory), where each individual subdirectory
 * // can also be clicked and opened
 * log.info('Processing file %c', '/path/to/data.txt');
 *
 * // will color the variable, and turn it into a string representation. strings,
 * // numbers, objects, are all allowed as arguments.
 * log.info('Processing file %s', {any: 'object'});
 *
 * // With breadcrumbs and abbreviations
 * const rootLog = new SevLogger({ abbreviations: { 'WebApp': 'WA' } });
 * const appLog = rootLog.nest({ breadcrumbs: ['WebApp'] });
 * const userLog = appLog.nest({ breadcrumbs: ['UserAuth'] });
 * userLog.debug('User %s logged in.', 'Alice'); // Outputs with WA:UserAuth prefix
 *
 * // Event logging
 * log.event(SevLogger.LEVEL.NOTICE, {
 *   event: 'UserLogin',
 *   userId: 123,
 *   ipAddress: '192.168.1.100',
 * });
 *
 * // Error logging with Error object
 * try {
 *   // ... some operation ...
 *   throw new Error('Something failed!');
 * } catch (error) {
 *   log.err('Operation failed: %s', { error }); // Pass error object in payload
 * }
 * ```
 */
export class SevLogger {
  // Initialize static member directly
  static #crcTable: number[] | null = null

  static #pathFromStack() {
    // A getDirname that works in CJS and ESM, since Alphalib is shared
    // across both kinds of projects.
    // We can remove this once we've migrated all consumers to ESM.
    const { stack } = new Error()
    if (!stack) {
      throw new Error('Could not get stack')
    }
    const lines = stack.split('\n')

    for (const line of lines) {
      if (line.includes(' (/')) {
        const location = line.split(' (')[1]
        if (!location) {
          throw new Error('Could not get location')
        }
        const filepath = location.split(':')[0]
        if (!filepath) {
          throw new Error('Could not get filepath')
        }
        const dirpath = path.dirname(filepath)
        return { dirpath, filepath }
      }
    }

    throw new Error('Could not get dirname')
  }

  static #getCallSite() {
    // Define Trace interface locally if not needed outside
    interface CallSiteTrace {
      functionName: string
      filePath: string | null
      lineNumber: number | null
    }
    const err = new Error()
    const traces: CallSiteTrace[] = (err?.stack?.split('\n').slice(1) || [])
      .map((line: string) => {
        if (typeof line === 'string' && line && line.match(/^\s*[-]{4,}$/)) {
          return {
            functionName: '',
            filePath: line,
            lineNumber: 0,
          }
        }
        const lineMatch = line.match(/at (?:(.+?)\s+\()?(?:(.+?):(\d+)(?::(\d+))?|([^)]+))\)?/)
        if (!lineMatch) {
          return undefined
        }

        const x = {
          functionName: lineMatch[1] || '',
          filePath: lineMatch[2] || null,
          lineNumber: lineMatch[3] ? Number.parseInt(lineMatch[3], 10) : null,
        }

        return x
      })
      .filter((trace: CallSiteTrace | undefined) => trace !== undefined) as CallSiteTrace[]

    const callSite = traces.find(
      (trace) =>
        trace.filePath !== SevLogger.#pathFromStack().filepath &&
        trace.filePath &&
        basename(trace.filePath) !== `SevLogger.ts` &&
        basename(trace.filePath) !== `SevLogger.js` &&
        !trace.functionName?.includes('.event') && // Add event here
        !trace.functionName?.endsWith('.log') && // Add log here
        !trace.functionName?.endsWith('.emerg') &&
        !trace.functionName?.endsWith('.alert') &&
        !trace.functionName?.endsWith('.crit') &&
        !trace.functionName?.endsWith('.err') &&
        !trace.functionName?.endsWith('.warn') &&
        !trace.functionName?.endsWith('.notice') &&
        !trace.functionName?.endsWith('.info') &&
        !trace.functionName?.endsWith('.debug') &&
        !trace.functionName?.endsWith('.trace'),
    )

    return callSite
  }

  static #makeCrcTable() {
    let c: number // Explicitly type c as number
    const crcTable: number[] = [] // Explicitly type crcTable
    for (let n = 0; n < 256; n++) {
      c = n
      for (let k = 0; k < 8; k++) {
        // eslint-disable-next-line no-bitwise
        c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
      }
      crcTable[n] = c
    }
    return crcTable
  }

  static #crc32(str: string) {
    // eslint-disable-next-line no-bitwise
    let crc = 0 ^ -1
    // Assign to local constant and assert non-null
    if (!SevLogger.#crcTable) {
      SevLogger.#crcTable = SevLogger.#makeCrcTable()
    }
    const crcTable = SevLogger.#crcTable

    for (let i = 0; i < str.length; i++) {
      // eslint-disable-next-line no-bitwise
      const charCode = str.charCodeAt(i)
      const index = (crc ^ charCode) & 0xff
      if (!(index in crcTable) || crcTable[index] === undefined) {
        console.error(crcTable)
        throw new Error(`Invalid index ${index} in crcTable`)
      }
      crc = (crc >>> 8) ^ crcTable[index]
    }

    // eslint-disable-next-line no-bitwise
    return (crc ^ -1) >>> 0
  }

  /** Provides severity level constants compatible with Syslog Severity Levels
   * https://en.wikipedia.org/wiki/Syslog#Severity_level
   * (EMERG, ALERT, CRIT, ERR, WARN, NOTICE, INFO, DEBUG, TRACE).
   **/
  static LEVEL = {
    EMERG: 0,
    ALERT: 1,
    CRIT: 2,
    ERR: 3,
    WARN: 4,
    NOTICE: 5,
    INFO: 6,
    DEBUG: 7,
    TRACE: 8,
  } as const

  /** Default log level (NOTICE) used if no level is specified during initialization. */
  static LEVEL_DEFAULT = 5 // NOTICE

  #level!: number

  #timestampFormat!: 'iso' | 'ss.ms' | 'ms' | false

  #addHostname!: boolean

  #addCallsite!: boolean

  #addClickables!: boolean

  #nestDivider!: string

  #sharedState!: SharedState

  #rawBreadcrumbs: string[] = []

  #params!: SevLoggerParams

  stdout!: NodeJS.WriteStream

  stderr!: NodeJS.WriteStream

  colors = {
    red: (s: string) => (process.env.NO_COLOR === '1' ? s : `\u001b[31m${s}\u001b[0m`),
    green: (s: string) => (process.env.NO_COLOR === '1' ? s : `\u001b[32m${s}\u001b[0m`),
    yellow: (s: string) => (process.env.NO_COLOR === '1' ? s : `\u001b[33m${s}\u001b[0m`),
    blue: (s: string) => (process.env.NO_COLOR === '1' ? s : `\u001b[34m${s}\u001b[0m`),
    magenta: (s: string) => (process.env.NO_COLOR === '1' ? s : `\u001b[35m${s}\u001b[0m`),
    cyan: (s: string) => (process.env.NO_COLOR === '1' ? s : `\u001b[36m${s}\u001b[0m`),
    white: (s: string) => (process.env.NO_COLOR === '1' ? s : `\u001b[37m${s}\u001b[0m`),
    gray: (s: string) => (process.env.NO_COLOR === '1' ? s : `\u001b[90m${s}\u001b[0m`),
    brightGreen: (s: string) => (process.env.NO_COLOR === '1' ? s : `\u001b[92m${s}\u001b[0m`),
    brightYellow: (s: string) => (process.env.NO_COLOR === '1' ? s : `\u001b[93m${s}\u001b[0m`),
    brightBlue: (s: string) => (process.env.NO_COLOR === '1' ? s : `\u001b[94m${s}\u001b[0m`),
    brightMagenta: (s: string) => (process.env.NO_COLOR === '1' ? s : `\u001b[95m${s}\u001b[0m`),
    brightCyan: (s: string) => (process.env.NO_COLOR === '1' ? s : `\u001b[96m${s}\u001b[0m`),
    boldRed: (s: string) => (process.env.NO_COLOR === '1' ? s : `\u001b[1m\u001b[31m${s}\u001b[0m`),
    dim: (s: string) => (process.env.NO_COLOR === '1' ? s : `\u001b[2m${s}\u001b[0m`),
  } as const

  levelColors = {
    EMERG: this.colors.boldRed,
    ALERT: this.colors.boldRed,
    CRIT: this.colors.boldRed,
    ERR: this.colors.red,
    WARN: this.colors.yellow,
    NOTICE: this.colors.green,
    INFO: this.colors.blue,
    DEBUG: this.colors.gray,
    TRACE: this.colors.gray,
  } as const

  formatColors = {
    s: this.colors.magenta,
    r: this.colors.cyan,
    c: this.colors.cyan,
  } as const

  #abbreviations: Record<string, string> = {}

  #eventFieldAbbreviations: Record<string, string> = {}

  static #defaultRedactFields = [
    'token',
    'secret',
    'password',
    'pass',
    'authorization',
    'auth',
    'api_key',
    'apikey',
    'x-api-key',
    'access_key',
    'accesskey',
    'session',
    'cookie',
    'bearer',
  ]

  static #defaultRedactPatterns: RegExp[] = [
    /xox[abprs]-[0-9A-Za-z-]+/g, // Slack tokens
    /Bearer\s+[A-Za-z0-9._~+/-]{20,}/gi, // Bearer tokens
    /\b[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/g, // JWT-like
    /\bAKIA[0-9A-Z]{16}\b/g, // AWS access key
    /\bASIA[0-9A-Z]{16}\b/g, // AWS temp key
    /\bA3T[A-Z0-9]{16}\b/g,
    AWS_SECRET_PATTERN, // AWS secret-style
    GENERIC_TOKEN_PATTERN, // Generic token without path separators
    GENERIC_SLASHY_TOKEN_PATTERN, // Generic token that may contain a slash
  ]

  #redactEnabled = true
  #redactReplacement = '[redacted]'
  #redactKeepLast = 4
  #redactFieldSet = new Set<string>(SevLogger.#defaultRedactFields)
  #redactPatterns: RegExp[] = [...SevLogger.#defaultRedactPatterns]
  #redactCustom: RedactHook[] = []
  #redactEntropy = true
  #entropyMinLength = 32

  filepath?: string

  constructor(params: SevLoggerParams = {}) {
    this.reset(params)
  }

  colorByName(name: string) {
    const absCrc = SevLogger.#crc32(name)

    const onlyNicelyReadable = Object.fromEntries(
      Object.entries(this.colors).filter(
        ([key]) => !['dim', 'white', 'gray', 'red', 'boldRed'].includes(key),
      ),
    ) as Omit<typeof this.colors, 'dim' | 'white' | 'gray' | 'red' | 'boldRed'>

    // Handle case where no colors are left after filtering
    if (Object.keys(onlyNicelyReadable).length === 0) {
      return (s: string) => s // Return identity function as default
    }

    const colorValues = Object.values(onlyNicelyReadable)
    const colorKeys = Object.keys(onlyNicelyReadable) as (keyof typeof onlyNicelyReadable)[]

    const colorIndex = absCrc % colorValues.length
    const colorName = colorKeys[colorIndex]

    // Add explicit check for colorName before indexing
    if (colorName && colorName in onlyNicelyReadable) {
      return onlyNicelyReadable[colorName]
    }

    // Fallback if colorName is somehow invalid (should not happen)
    return (s: string) => s
  }

  #configureRedaction(redact: SevLoggerParams['redact'] = true) {
    const cfg: RedactConfig =
      typeof redact === 'boolean' ? { enabled: redact } : (redact as RedactConfig) || {}

    this.#redactEnabled = cfg.enabled ?? true
    this.#redactReplacement = cfg.replacement ?? '[redacted]'
    this.#redactKeepLast = cfg.keepLast ?? 4
    const fieldList = [...SevLogger.#defaultRedactFields]
    if (cfg.fields) {
      fieldList.push(...cfg.fields)
    }
    this.#redactFieldSet = new Set(fieldList.map((f) => f.toLowerCase()))
    this.#redactPatterns = [...SevLogger.#defaultRedactPatterns, ...(cfg.patterns ?? [])]
    this.#redactCustom = cfg.custom ?? []
    this.#redactEntropy = cfg.entropy ?? true
  }

  #shouldMaskField(field: string) {
    return this.#redactFieldSet.has(field.toLowerCase())
  }

  #maskToken(token: string) {
    if (this.#redactKeepLast <= 0 || token.length <= this.#redactKeepLast) {
      return this.#redactReplacement
    }
    const tail = token.slice(-this.#redactKeepLast)
    return `${this.#redactReplacement}${tail}`
  }

  #looksSecret(str: string) {
    if (!this.#redactEntropy) return false
    if (str.length < this.#entropyMinLength) return false
    // Avoid masking sentences or paths; focus on token-like strings
    if (str.trim().includes(' ')) return false
    if (str.includes('/') || str.includes('\\') || str.includes('.')) return false

    const counts = new Map<string, number>()
    for (const ch of str) {
      counts.set(ch, (counts.get(ch) ?? 0) + 1)
    }
    const len = str.length
    let entropy = 0
    for (const count of counts.values()) {
      const p = count / len
      entropy -= p * Math.log2(p)
    }
    return entropy >= 3.5 && counts.size >= 8
  }

  #redactString(str: string) {
    if (!this.#redactEnabled) return str
    let redacted = str

    const slashCount = (str.match(/[\\/]/g) ?? []).length
    const isPathish =
      slashCount >= 2 ||
      str.startsWith('/') ||
      str.startsWith('~/') ||
      /^[A-Za-z]:\\/.test(str) ||
      str.includes('/home/') ||
      str.includes('/Users/')

    for (const pattern of this.#redactPatterns) {
      const isGeneric = pattern === GENERIC_TOKEN_PATTERN
      const isSlashyGeneric = pattern === GENERIC_SLASHY_TOKEN_PATTERN
      const isAwsSecret = pattern === AWS_SECRET_PATTERN
      if (isPathish && (isGeneric || isSlashyGeneric || isAwsSecret)) {
        continue
      }
      if (isSlashyGeneric && slashCount > 1) {
        continue // avoid path-like strings with multiple separators
      }
      redacted = redacted.replace(pattern, (match) => this.#maskToken(match))
    }
    if (this.#looksSecret(redacted)) {
      redacted = this.#maskToken(redacted)
    }
    return redacted
  }

  #applyCustom(value: unknown, path: string[]) {
    return this.#redactCustom.reduce<unknown>((current, hook) => {
      try {
        return hook(current, path)
      } catch (_err) {
        // Custom hook failed; ignore and continue with current value
        return current
      }
    }, value)
  }

  #redactDeep(value: unknown, path: string[], seen = new WeakMap<object, unknown>()): unknown {
    if (!this.#redactEnabled) return value

    const applyCustom = (v: unknown) => this.#applyCustom(v, path)

    if (value && typeof value === 'object') {
      const cached = seen.get(value as object)
      if (cached !== undefined) {
        return applyCustom(cached)
      }
    }

    if (typeof value === 'string') {
      return applyCustom(this.#redactString(value))
    }

    if (Array.isArray(value)) {
      const cloned: unknown[] = []
      seen.set(value, cloned)
      value.forEach((v, i) => {
        cloned[i] = this.#redactDeep(v, [...path, String(i)], seen)
      })
      return applyCustom(cloned)
    }

    if (value instanceof Date || value instanceof URL || value instanceof RegExp) {
      seen.set(value, value)
      return applyCustom(value)
    }

    if (value instanceof Map) {
      const cloned = new Map()
      seen.set(value, cloned)
      for (const [k, v] of value.entries()) {
        const newKey = typeof k === 'string' ? this.#redactString(k) : k
        cloned.set(newKey, this.#redactDeep(v, [...path, 'map'], seen))
      }
      return applyCustom(cloned)
    }

    if (value instanceof Set) {
      const cloned = new Set()
      seen.set(value, cloned)
      for (const v of value.values()) {
        cloned.add(this.#redactDeep(v, [...path, 'set'], seen))
      }
      return applyCustom(cloned)
    }

    if (value instanceof Error) {
      const cloned = Object.create(Object.getPrototypeOf(value)) as Error
      seen.set(value, cloned)

      const descriptors = Object.getOwnPropertyDescriptors(value)
      for (const [key, desc] of Object.entries(descriptors)) {
        if (!('value' in desc)) {
          Object.defineProperty(cloned, key, desc)
          continue
        }
        let v = desc.value
        if (typeof v === 'string' && (key === 'message' || key === 'stack')) {
          v = this.#redactString(v)
        } else {
          v = this.#redactDeep(v, [...path, key], seen)
        }
        Object.defineProperty(cloned, key, { ...desc, value: v })
      }

      for (const sym of Object.getOwnPropertySymbols(value)) {
        const desc = Object.getOwnPropertyDescriptor(value, sym)
        if (!desc) continue
        if ('value' in desc) {
          const v = this.#redactDeep(desc.value, [...path, sym.toString()], seen)
          Object.defineProperty(cloned, sym, { ...desc, value: v })
        } else {
          Object.defineProperty(cloned, sym, desc)
        }
      }

      return applyCustom(cloned)
    }

    if (value && typeof value === 'object') {
      const proto = Object.getPrototypeOf(value)
      const isPlain = proto === Object.prototype || proto === null
      if (!isPlain) {
        seen.set(value, value)
        return applyCustom(value)
      }

      const cloned: Record<string, unknown> = {}
      seen.set(value, cloned)
      for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
        if (this.#shouldMaskField(k)) {
          cloned[k] = this.#maskToken(typeof v === 'string' ? v : this.#redactReplacement)
          continue
        }
        cloned[k] = this.#redactDeep(v, [...path, k], seen)
      }
      return applyCustom(cloned)
    }

    return applyCustom(value)
  }

  reset(params: SevLoggerParams = {}) {
    let defaultAddClickables = true
    let defaultAddCallsite = true
    if (
      process.env.LOG_CLICKABLES === '0' ||
      process.env.LOG_CLICKABLES === 'false' ||
      process.env.NOD_ENV === 'production' ||
      process.env.CI === '1' ||
      process.env.CI === 'true'
    ) {
      defaultAddClickables = false
    }
    if (
      process.env.LOG_CALLSITE === '0' ||
      process.env.LOG_CALLSITE === 'false' ||
      process.env.NOD_ENV === 'production' ||
      process.env.CI === '1' ||
      process.env.CI === 'true'
    ) {
      defaultAddCallsite = false
    }
    let defaultAddHostname = false
    if (process.env.LOG_HOSTNAME === '1' || process.env.LOG_HOSTNAME === 'true') {
      defaultAddHostname = true
    }
    // Default timestamp format is false (no timestamp)
    const defaultTimestampFormat: SevLoggerParams['timestampFormat'] = false

    this.#level = params.level ?? SevLogger.LEVEL_DEFAULT

    this.#abbreviations = params.abbreviations ?? {}
    this.#eventFieldAbbreviations = params.eventFieldAbbreviations ?? {}
    this.#configureRedaction(params.redact ?? true)
    this.#nestDivider = params.nestDivider ?? ':'
    this.#timestampFormat = params.timestampFormat ?? defaultTimestampFormat
    this.#addHostname = params.addHostname ?? defaultAddHostname
    this.#addCallsite = params.addCallsite ?? defaultAddCallsite
    this.#addClickables = params.addClickables ?? defaultAddClickables
    this.stdout = params.stdout ?? process.stdout
    this.stderr = params.stderr ?? process.stderr
    this.filepath = params.filepath ?? undefined
    this.#sharedState = params.sharedState ?? {
      maxTimestampLength: 0,
      maxHostnameLength: 0,
      maxBreadcrumbLength: 0,
    }

    if (this.filepath) {
      this.#addClickables = false
      this.#addCallsite = false
      // Force ISO timestamp for file logs if none was specified
      if (this.#timestampFormat === false) {
        this.#timestampFormat = 'iso'
      }
      fs.mkdirSync(path.dirname(this.filepath), { recursive: true })
      // Disable colors for file output
      this.colors = Object.fromEntries(
        Object.keys(this.colors).map((k) => [k, (s: string) => s]),
      ) as typeof this.colors
      this.levelColors = Object.fromEntries(
        Object.keys(this.levelColors).map((k) => [k, (s: string) => s]),
      ) as typeof this.levelColors
      this.formatColors = Object.fromEntries(
        Object.keys(this.formatColors).map((k) => [k, (s: string) => s]),
      ) as typeof this.formatColors
    } else {
      this.colors = params.colors ?? this.colors
      this.levelColors = params.levelColors ?? this.levelColors
      this.formatColors = params.formatColors ?? this.formatColors
    }

    this.#params = params

    this.#rawBreadcrumbs = params.breadcrumbs ?? []

    return this
  }

  update(params: SevLoggerParams = {}) {
    return this.reset({ ...this.#params, ...params })
  }

  getLevelName(level: number = this.#level) {
    return Object.keys(SevLogger.LEVEL).find(
      (key) => SevLogger.LEVEL[key as keyof typeof SevLogger.LEVEL] === level,
    )
  }

  link(text: string, url: string) {
    const OSC = '\u001B]'
    const BEL = '\u0007'
    const SEP = ';'

    if (!this.stdout.isTTY) {
      return `${text} (${url})`
    }

    return [OSC, '8', SEP, SEP, url, BEL, text, OSC, '8', SEP, SEP, BEL].join('')
  }

  clickableFileParts(filepath: string) {
    const fmtColorFunc = this.formatColors.c
    const resolved = resolve(filepath)
    const relativePath = relative(process.cwd(), resolved)

    if (this.#addClickables === false || !this.stdout?.isTTY) {
      return fmtColorFunc(relativePath)
    }

    const parts = relativePath.split('/')

    let curFullPath = `${process.cwd()}/`

    return parts
      .map((part, i) => {
        if (i === parts.length - 1) {
          curFullPath += part
          return this.link(fmtColorFunc(part), `file://${resolve(curFullPath)}`)
        }
        curFullPath += `${part}/`
        return this.link(fmtColorFunc(part), `file://${resolve(curFullPath)}`)
      })
      .join('/')
  }

  stripAnsi(string: string) {
    if (typeof string !== 'string') {
      throw new TypeError(`Expected a \`string\`, got \`${typeof string}\``)
    }

    const pattern = [
      '[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)',
      '(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))',
    ].join('|')

    const regex = new RegExp(pattern, 'g')

    return string.replace(regex, '')
  }

  lengthWithoutAnsi(string: string) {
    return this.stripAnsi(string).length
  }

  formatter(level: number, ...messages: unknown[]) {
    const redactedMessages = messages.map((msg) => this.#redactDeep(msg, [], new WeakMap()))
    const prefixOutputParts: string[] = [] // Hold prefix parts (timestamp, host, crumbs, level)

    // 1. Timestamp + Padding
    let timestampStr = ''
    let currentTsLen = 0
    const now = new Date()
    if (this.#timestampFormat === 'iso') {
      timestampStr = this.colors.gray(now.toISOString())
      currentTsLen = this.lengthWithoutAnsi(timestampStr)
    } else if (this.#timestampFormat === 'ss.ms') {
      const minStr = String(now.getMinutes()).padStart(2, '0')
      const secStr = String(now.getSeconds()).padStart(2, '0')
      const msStr = String(now.getMilliseconds()).padStart(3, '0')
      timestampStr = this.colors.gray(`${minStr}:${secStr}.${msStr}`)
      currentTsLen = this.lengthWithoutAnsi(timestampStr)
    } else if (this.#timestampFormat === 'ms') {
      const msStr = String(now.getMilliseconds()).padStart(3, '0')
      timestampStr = this.colors.gray(`.${msStr}`)
      currentTsLen = this.lengthWithoutAnsi(timestampStr)
    }
    if (currentTsLen > 0) {
      this.#sharedState.maxTimestampLength = Math.max(
        this.#sharedState.maxTimestampLength,
        currentTsLen,
      )
    }
    // Only add timestamp and its padding if the section is potentially active globally
    if (this.#sharedState.maxTimestampLength > 0) {
      const tsPadding = ' '.repeat(Math.max(0, this.#sharedState.maxTimestampLength - currentTsLen))
      prefixOutputParts.push(timestampStr + tsPadding)
    }

    // 2. Hostname + Padding
    let hostnameStr = ''
    let currentHostLen = 0
    if (this.#addHostname) {
      hostnameStr = this.colors.dim(
        `[${userInfo().username}@${hostname()
          .replace(/\\.localdomain$/, '')
          .replace(/^(mbp\\d+)-\\d+/, '$1')
          .replace(/\\.local$/, '')}]`,
      )
      currentHostLen = this.lengthWithoutAnsi(hostnameStr)
    }
    if (currentHostLen > 0) {
      this.#sharedState.maxHostnameLength = Math.max(
        this.#sharedState.maxHostnameLength,
        currentHostLen,
      )
    }
    // Only add hostname and its padding if the section is potentially active globally
    if (this.#sharedState.maxHostnameLength > 0) {
      const hostPadding = ' '.repeat(
        Math.max(0, this.#sharedState.maxHostnameLength - currentHostLen),
      )
      prefixOutputParts.push(hostnameStr + hostPadding)
    }

    // 3. Breadcrumbs + Padding
    let breadcrumbStr = ''
    let currentCrumbLen = 0
    if (this.#rawBreadcrumbs.length > 0) {
      const coloredBreadcrumbs = this.#rawBreadcrumbs.map((b) => {
        const abbrev = this.#abbreviations[b] ?? b
        const colorFunc = this.colorByName(b) // Get color func
        return colorFunc(abbrev) // Apply color func
      })
      breadcrumbStr = this.colors.dim(coloredBreadcrumbs.join(this.#nestDivider))
      currentCrumbLen = this.lengthWithoutAnsi(breadcrumbStr)
    }
    if (currentCrumbLen > 0) {
      this.#sharedState.maxBreadcrumbLength = Math.max(
        this.#sharedState.maxBreadcrumbLength,
        currentCrumbLen,
      )
    }
    // Only add breadcrumbs and padding if the section is potentially active globally
    if (this.#sharedState.maxBreadcrumbLength > 0) {
      const crumbPadding = ' '.repeat(
        Math.max(0, this.#sharedState.maxBreadcrumbLength - currentCrumbLen),
      )
      prefixOutputParts.push(breadcrumbStr + crumbPadding)
    }

    // 4. Level Name
    const levelName = this.getLevelName(level) || 'UNKNOWN'
    const lvlColorFunc = this.levelColors[levelName as keyof typeof this.levelColors]
    prefixOutputParts.push(lvlColorFunc(`[${levelName.padStart(7, ' ')}]`))

    // Combine prefix parts
    const prefixStr = prefixOutputParts.filter((p) => p).join(' ')

    // --- Calculate Subject Alignment Padding --- TODO: Refine this calculation
    const currentPrefixLength = this.lengthWithoutAnsi(prefixStr)
    const levelNameLength = 9 // `[ LEVEL ]` length is fixed
    let numActivePrefixComponents = 1 // Level is always active
    if (this.#sharedState.maxTimestampLength > 0) numActivePrefixComponents++
    if (this.#sharedState.maxHostnameLength > 0) numActivePrefixComponents++
    if (this.#sharedState.maxBreadcrumbLength > 0) numActivePrefixComponents++
    const maxPrefixSpaces = Math.max(0, numActivePrefixComponents - 1)

    const maxPossiblePrefixLength =
      this.#sharedState.maxTimestampLength +
      this.#sharedState.maxHostnameLength +
      this.#sharedState.maxBreadcrumbLength +
      levelNameLength +
      maxPrefixSpaces

    const subjectAlignmentPaddingLength = Math.max(0, maxPossiblePrefixLength - currentPrefixLength)
    const subjectAlignmentPadding = ' '.repeat(subjectAlignmentPaddingLength)
    // --- End Subject Alignment Padding ---

    // 5. Subject Formatting
    let subject = ''
    const originalMessages = [...redactedMessages] // Clone messages for potential reuse if formatting fails
    const workingMessages = [...redactedMessages]
    const m = typeof workingMessages?.[0] === 'string' && workingMessages[0].match(/%[scr]/g)
    if (m && m.length > 0 && m.length + 1 === workingMessages.length) {
      const base = workingMessages.shift()
      if (typeof base !== 'string') {
        // Should not happen due to initial check, but safeguard
        subject = inspect(base, false, null, true)
      } else {
        // Perform replacement - Type errors inside callback WILL throw
        subject = base.replace(
          /(\s|'|"|\[|=|:^|\()?(%[scr])(\s|\]|\/'|"$|\)|ms|s|TB|GB|MB)?/gms,
          (match, m1, _m2, m3, pos, full) => {
            const arg = workingMessages.shift()
            if (arg === undefined) {
              // Not enough arguments provided, treat as literal (error check later)
              workingMessages.unshift(undefined) // Put placeholder back for count check
              return match // Return original match, don't replace
            }
            let hasBoundaries = false
            if (m1 !== undefined) hasBoundaries = true
            if (m3 !== undefined) hasBoundaries = true
            if (pos === 0) hasBoundaries = true
            if (pos + match.length === full.length) hasBoundaries = true

            if (hasBoundaries) {
              if (match.includes('%s')) {
                const fmtColorFunc = this.formatColors.s
                if (typeof arg === 'string' || typeof arg === 'number') {
                  return match.replace('%s', fmtColorFunc(String(arg)))
                }
                return match.replace('%s', inspect(arg, false, null, true)) // Use inspect for non-string/num %s
              }
              if (match.includes('%r')) {
                if (typeof arg !== 'string') {
                  // Let this throw, as expected by tests
                  throw new Error(`Expected string for %r, got ${typeof arg}`)
                }
                const fmtColorFunc = this.formatColors.r
                const resolved = resolve(arg)
                const relativePath = relative(process.cwd(), resolved)
                return match.replace('%r', fmtColorFunc(relativePath))
              }
              if (match.includes('%c')) {
                if (typeof arg !== 'string') {
                  // Let this throw, as expected by tests
                  throw new Error(`Expected string for %c, got ${typeof arg}`)
                }
                return match.replace('%c', this.clickableFileParts(arg))
              }
            }
            // If not handled (e.g., no boundaries or wrong specifier), put arg back and return original match
            workingMessages.unshift(arg)
            return match
          },
        )
        subject = subject.replace(/%%/g, '%')

        // Check for argument count mismatches AFTER replacement attempt
        if (workingMessages.includes(undefined) || workingMessages.length > 0) {
          const errorMsg = workingMessages.includes(undefined)
            ? `Missing argument(s) for format string`
            : `Too many arguments provided for format string`
          console.error(`SevLogger Formatting Warning: ${errorMsg}`, originalMessages)
          // Fallback: Use original messages inspected
          subject = originalMessages
            .map((msg) => (typeof msg === 'string' ? msg : inspect(msg, false, null, true)))
            .join(' ')
          subject = subject.replace(/%%/g, '%') // Still handle escapes in the fallback
        }
      }
    } else {
      // No format specifiers or mismatch count, inspect all messages
      subject = redactedMessages
        .map((msg) => (typeof msg === 'string' ? msg : inspect(msg, false, null, true)))
        .join(' ')
      subject = subject.replace(/%%/g, '%')
    }
    subject = this.#redactString(subject)
    // --- End Subject Logic ---

    // Multiline Handling
    let firstLineSubject = subject
    let saveForLater = ''
    const newlineIndex = subject.indexOf('\n')
    if (newlineIndex !== -1) {
      firstLineSubject = subject.substring(0, newlineIndex)
      if (level > SevLogger.LEVEL.INFO) {
        firstLineSubject += this.colors.dim(' .. multiline log below .. ')
      } else {
        firstLineSubject += ' .. multiline log below .. '
      }
      saveForLater = `\n${subject.substring(newlineIndex + 1)}\n` // Keep the rest
    }

    // Combine prefix, alignment padding, and the first line of the subject
    const mainContentStr = `${prefixStr}${subjectAlignmentPadding} ${firstLineSubject}`.trimEnd()

    // 6. Callsite and Padding Calculation
    let callsiteStr = ''
    let padding = ''
    if (this.#addCallsite) {
      const callSite = SevLogger.#getCallSite()
      if (callSite?.filePath) {
        // Format the callsite string first
        callsiteStr = this.colors.blue(
          `${relative(process.cwd(), resolve(callSite.filePath))}:${callSite.lineNumber}`,
        )

        // Calculate lengths needed for padding
        const mainContentLength = this.lengthWithoutAnsi(mainContentStr)
        const callsiteLength = this.lengthWithoutAnsi(callsiteStr)
        // Use this.stdout first as it might be a mocked stream in tests
        const terminalWidth = this.stdout?.columns || process.stdout?.columns || 80 // Default 80 if no TTY info

        // Calculate padding, ensure at least one space
        const paddingLength = Math.max(1, terminalWidth - mainContentLength - callsiteLength)
        padding = ' '.repeat(paddingLength)
      }
    }

    // 7. Assemble final string components
    let baseStr = mainContentStr + padding + callsiteStr // Add padding and callsite

    // 8. Apply Dimming to the entire line (excluding multiline part)
    if (level > SevLogger.LEVEL.INFO) {
      baseStr = this.colors.dim(baseStr)
    }

    // 9. Append any saved multiline content
    const finalStr = baseStr + saveForLater

    return finalStr
  }

  // <-- Start: Strict Overloads for log ONLY -->
  log<Fmt extends string>(level: number, message: Fmt, ...args: ParseLogArgs<Fmt>): void
  log(level: number, message: unknown): void

  // Implementation signature (internal only)
  log(level: number, message: unknown, ...args: unknown[]) {
    if (level > this.#level) {
      return
    }
    const fullStr = this.formatter(level, message, ...args)
    const stream = level <= SevLogger.LEVEL.NOTICE ? this.stdout : this.stderr // NOTICE and below to stdout

    if (this.filepath) {
      try {
        // Add error handling for file append
        fs.appendFileSync(this.filepath, `${fullStr}\n`)
      } catch (err) {
        // Fallback to stderr if file writing fails
        process.stderr.write(`SevLogger: Failed to write to log file ${this.filepath}: ${err}\n`)
        process.stderr.write(`${fullStr}\n`)
      }
    } else {
      stream.write(`${fullStr}\n`)
    }
  }

  // <-- Start: Strict overloads for level methods -->
  emerg<Fmt extends string>(message: Fmt, ...args: ParseLogArgs<Fmt>): void
  emerg(message: unknown): void

  emerg(message: unknown, ...args: unknown[]) {
    ;(this.log as LogImplementation).apply(this, [SevLogger.LEVEL.EMERG, message, ...args])

    const err = new Error(`Emerg was called, exiting process. Please inspect the logs above.`)
    const errStr = `${err.message}`
    const stackStr = err.stack ? `${err.stack}` : undefined
    this.log(SevLogger.LEVEL.EMERG, errStr)
    if (stackStr) {
      this.log(SevLogger.LEVEL.EMERG, stackStr)
    }
    process.exit(1)
  }

  alert<Fmt extends string>(message: Fmt, ...args: ParseLogArgs<Fmt>): void
  alert(message: unknown): void

  alert(message: unknown, ...args: unknown[]) {
    ;(this.log as LogImplementation).apply(this, [SevLogger.LEVEL.ALERT, message, ...args])
  }

  crit<Fmt extends string>(message: Fmt, ...args: ParseLogArgs<Fmt>): void
  crit(message: unknown): void

  crit(message: unknown, ...args: unknown[]) {
    ;(this.log as LogImplementation).apply(this, [SevLogger.LEVEL.CRIT, message, ...args])
  }

  err<Fmt extends string>(message: Fmt, ...args: ParseLogArgs<Fmt>): void
  err(message: unknown): void

  err(message: unknown, ...args: unknown[]) {
    ;(this.log as LogImplementation).apply(this, [SevLogger.LEVEL.ERR, message, ...args])
  }

  error<Fmt extends string>(message: Fmt, ...args: ParseLogArgs<Fmt>): void
  error(message: unknown): void

  error(message: unknown, ...args: unknown[]) {
    ;(this.log as LogImplementation).apply(this, [SevLogger.LEVEL.ERR, message, ...args])
  }

  warn<Fmt extends string>(message: Fmt, ...args: ParseLogArgs<Fmt>): void
  warn(message: unknown): void

  warn(message: unknown, ...args: unknown[]) {
    ;(this.log as LogImplementation).apply(this, [SevLogger.LEVEL.WARN, message, ...args])
  }

  notice<Fmt extends string>(message: Fmt, ...args: ParseLogArgs<Fmt>): void
  notice(message: unknown): void

  notice(message: unknown, ...args: unknown[]) {
    ;(this.log as LogImplementation).apply(this, [SevLogger.LEVEL.NOTICE, message, ...args])
  }

  info<Fmt extends string>(message: Fmt, ...args: ParseLogArgs<Fmt>): void
  info(message: unknown): void

  info(message: unknown, ...args: unknown[]) {
    ;(this.log as LogImplementation).apply(this, [SevLogger.LEVEL.INFO, message, ...args])
  }

  debug<Fmt extends string>(message: Fmt, ...args: ParseLogArgs<Fmt>): void
  debug(message: unknown): void

  debug(message: unknown, ...args: unknown[]) {
    ;(this.log as LogImplementation).apply(this, [SevLogger.LEVEL.DEBUG, message, ...args])
  }

  trace<Fmt extends string>(message: Fmt, ...args: ParseLogArgs<Fmt>): void
  trace(message: unknown): void

  trace(message: unknown, ...args: unknown[]) {
    ;(this.log as LogImplementation).apply(this, [SevLogger.LEVEL.TRACE, message, ...args])
  }

  // <-- End: Strict overloads for level methods -->

  /**
   * Logs a structured event object.
   * Formatting differs from standard log methods. Output is typically:
   * TIMESTAMP? BREADCRUMBS?: EVENT_NAME {JSON_PAYLOAD}
   * Error objects in the payload are inspected, and their stack traces may be folded.
   * Payload field names may be abbreviated based on logger level and `eventFieldAbbreviations`.
   *
   * @param level The severity level of the event.
   * @param data The event data, must include an 'event' property (string name).
   */
  event(level: number, data: LogEvent): void {
    if (level > this.#level) {
      return
    }
    if (!data || typeof data.event !== 'string') {
      // Use apply with LogImplementation type for this internal call
      ;(this.log as LogImplementation).apply(this, [
        SevLogger.LEVEL.ERR,
        'SevLogger.event() called without valid event name in data',
        data,
      ])
      return
    }

    const parts: string[] = []
    const now = new Date()

    // 1. Timestamp
    if (this.#timestampFormat === 'iso') {
      parts.push(this.colors.gray(now.toISOString()))
    } else if (this.#timestampFormat === 'ss.ms') {
      const minStr = String(now.getMinutes()).padStart(2, '0')
      const secStr = String(now.getSeconds()).padStart(2, '0')
      const msStr = String(now.getMilliseconds()).padStart(3, '0')
      parts.push(this.colors.gray(`${minStr}:${secStr}.${msStr}`))
    } else if (this.#timestampFormat === 'ms') {
      const msStr = String(now.getMilliseconds()).padStart(3, '0')
      parts.push(this.colors.gray(`.${msStr}`))
    }

    // 2. Breadcrumbs
    if (this.#rawBreadcrumbs.length > 0) {
      const breadcrumbStr = this.#rawBreadcrumbs
        .map((b) => this.#abbreviations[b] ?? b)
        .join(this.#nestDivider) // Use configured divider
      // Apply color based on hash of the *full* breadcrumb string for consistency
      const colorFunc = this.colorByName(this.#rawBreadcrumbs.join(':')) // Get color func
      parts.push(colorFunc(breadcrumbStr)) // Apply color func
    }

    // 3. Event Name
    const { event: eventName, ...payload } = data // Destructure event name
    parts.push(eventName) // Event name is not colored by default

    // 4. Payload Processing
    const processedPayload: Record<string, unknown> = {}
    const abbreviate =
      this.#level < SevLogger.LEVEL.DEBUG && Object.keys(this.#eventFieldAbbreviations).length > 0

    // Handle err alias and create payload copy
    let finalPayload: Record<string, unknown> = { ...payload }
    if ('err' in finalPayload && !('error' in finalPayload)) {
      finalPayload.error = finalPayload.err
      // Create new object excluding 'err' instead of deleting
      const { err: _ignoredErr, ...restPayload } = finalPayload
      finalPayload = restPayload // Reassign to the object without 'err'
    }

    for (const [key, value] of Object.entries(finalPayload)) {
      // Iterate over the modified copy
      // Abbreviate keys if needed
      const finalKey = abbreviate ? (this.#eventFieldAbbreviations[key] ?? key) : key
      const shouldMaskKey =
        this.#redactEnabled && (this.#shouldMaskField(key) || this.#shouldMaskField(finalKey))

      // Process error objects
      if (key === 'error' && value instanceof Error) {
        const simplifiedError: Record<string, unknown> = { message: value.message }
        if (value.stack) {
          simplifiedError.stack = abbr(value.stack, 5000, '...')
        }
        // Add other common non-enumerable props if needed? e.g., code?
        if ('code' in value) simplifiedError.code = value.code
        processedPayload[finalKey] = shouldMaskKey
          ? this.#maskToken(JSON.stringify(simplifiedError))
          : simplifiedError
      } else if (key === 'error' && value && typeof value === 'object' && !Array.isArray(value)) {
        // Handle pre-serialized errors or other objects under 'error' key
        // Basic folding for potential large strings (stdout/stderr in legacy)
        const potentiallyFoldedValue: Record<string, unknown> = {}
        for (const [errKey, errValue] of Object.entries(value)) {
          if (typeof errValue === 'string' && (errKey === 'stdout' || errKey === 'stderr')) {
            potentiallyFoldedValue[errKey] = abbr(errValue, 5000, '...')
          } else {
            potentiallyFoldedValue[errKey] = errValue
          }
        }
        processedPayload[finalKey] = shouldMaskKey
          ? this.#maskToken(JSON.stringify(potentiallyFoldedValue))
          : potentiallyFoldedValue
      } else {
        if (shouldMaskKey) {
          processedPayload[finalKey] =
            typeof value === 'string' ? this.#maskToken(value) : this.#redactReplacement
        } else {
          processedPayload[finalKey] = value
        }
      }
    }

    const safePayload = this.#redactDeep(processedPayload, [], new WeakMap()) as Record<
      string,
      unknown
    >

    // Stringify payload
    if (Object.keys(safePayload).length > 0) {
      let stringified = ''
      try {
        stringified = JSON.stringify(safePayload)
      } catch (error) {
        stringified = `{"error":"EVENT_DATA_TOO_LARGE_FOR_STRINGIFY"}`
        if (error instanceof Error) {
          stringified = `{"error":"EVENT_DATA_TOO_LARGE_FOR_STRINGIFY", "reason":${JSON.stringify(error.message)}}`
        }
      }
      parts.push(stringified)
    }

    // Join parts and write to stream
    const fullStr = parts.join(' ') // Simple space join for event format
    const stream = level <= SevLogger.LEVEL.NOTICE ? this.stdout : this.stderr

    if (this.filepath) {
      try {
        fs.appendFileSync(this.filepath, `${fullStr}\n`)
      } catch (err) {
        process.stderr.write(
          `SevLogger: Failed to write event to log file ${this.filepath}: ${err}\n`,
        )
        process.stderr.write(`${fullStr}\n`)
      }
    } else {
      stream.write(`${fullStr}\n`)
    }
  }

  /** Announces the initial configuration message upon logger creation (if applicable). */
  announceMotd() {
    if (this.filepath) return // Don't announce MOTD for file logs
    if (this.#level < SevLogger.LEVEL.NOTICE) return // Only announce if level is NOTICE or higher

    const parts = []

    // Add timestamp based on new format
    const now = new Date()
    if (this.#timestampFormat === 'iso') {
      parts.push(this.colors.gray(now.toISOString()))
    } // No ms/ss.ms timestamp for MOTD

    parts.push(`Starting ${this.#rawBreadcrumbs[0] ?? 'Logger'} at ${new Date().toISOString()}. `) // Keep ISO here for clarity

    if (process.env.NODE_ENV) {
      parts.push(`Node env: '${process.env.NODE_ENV}'. `)
    }

    parts.push(`Log level: ${this.#level} (${this.getLevelName()}). `)

    if (this.#level === SevLogger.LEVEL_DEFAULT) {
      parts.push(`Change with e.g. --log-level=7. `)
    }
    if (this.#level >= SevLogger.LEVEL.TRACE) {
      parts.push(this.colors.red(`WARNING, log level includes full details. `))
    }

    parts.push(`See --help for more options. `)

    this.stdout.write(`${parts.join('')}\n`)
  }

  /** Creates a new logger instance nested within the current one. */
  nest(breadcrumb: string, params?: SevLoggerParams): SevLogger
  nest(breadcrumbs: string[], params?: SevLoggerParams): SevLogger
  nest(params?: SevLoggerParams): SevLogger
  nest(
    breadcrumbsOrParams?: string | string[] | SevLoggerParams,
    maybeParams?: SevLoggerParams,
  ): SevLogger {
    let params: SevLoggerParams
    if (typeof breadcrumbsOrParams === 'string') {
      params = {
        ...(maybeParams ?? {}),
        breadcrumbs: [breadcrumbsOrParams, ...(maybeParams?.breadcrumbs ?? [])],
      }
    } else if (Array.isArray(breadcrumbsOrParams)) {
      params = {
        ...(maybeParams ?? {}),
        breadcrumbs: [...breadcrumbsOrParams, ...(maybeParams?.breadcrumbs ?? [])],
      }
    } else {
      params = (breadcrumbsOrParams ?? maybeParams ?? {}) as SevLoggerParams
    }

    const currentLevelRawBreadcrumbs = params.breadcrumbs ?? []
    return new SevLogger({
      ...this.#params,
      ...params,
      breadcrumbs: [...this.#rawBreadcrumbs, ...currentLevelRawBreadcrumbs],
      sharedState: this.#sharedState, // Ensure shared state is passed
    })
  }
}
