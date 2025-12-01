import type { SevLogger } from './SevLogger'

type MethodType<Name extends keyof SevLogger> = SevLogger[Name]

export interface SevLoggerLike {
  emerg: MethodType<'emerg'>
  alert: MethodType<'alert'>
  crit: MethodType<'crit'>
  err: MethodType<'err'>
  error: MethodType<'error'>
  warn: MethodType<'warn'>
  notice: MethodType<'notice'>
  info: MethodType<'info'>
  debug: MethodType<'debug'>
  trace: MethodType<'trace'>
  log: MethodType<'log'>
  event: MethodType<'event'>
  update: MethodType<'update'>
  announceMotd: MethodType<'announceMotd'>
  stdout: SevLogger['stdout']
  stderr: SevLogger['stderr']
  nest: (...args: Parameters<SevLogger['nest']>) => SevLoggerLike
}

export type SevLoggerInput = SevLogger | Partial<SevLoggerLike>

const normalizeLogger = (logger: SevLoggerInput): SevLoggerLike => {
  const base = logger ?? {}
  const fallbackLog = (...args: unknown[]) => console.log(...args)
  const fallbackErr = (...args: unknown[]) => console.error(...args)

  const ensure = <Name extends keyof SevLoggerLike>(
    name: Name,
    fallback: SevLoggerLike[Name],
  ): SevLoggerLike[Name] => {
    const candidate = (base as Record<string, unknown>)[name]
    if (typeof candidate === 'function') {
      return (candidate as (...args: unknown[]) => unknown).bind(base) as SevLoggerLike[Name]
    }
    return fallback
  }

  const normalized: Partial<SevLoggerLike> = {
    emerg: ensure('emerg', fallbackErr),
    alert: ensure('alert', fallbackErr),
    crit: ensure('crit', fallbackErr),
    err: ensure('err', fallbackErr),
    error: ensure('error', fallbackErr),
    warn: ensure('warn', fallbackErr),
    notice: ensure('notice', fallbackLog),
    info: ensure('info', fallbackLog),
    debug: ensure('debug', fallbackLog),
    trace: ensure('trace', fallbackLog),
    log: ensure('log', fallbackLog),
    event: ensure('event', fallbackLog as SevLoggerLike['event']),
    update: ensure('update', fallbackLog as SevLoggerLike['update']),
    announceMotd: ensure('announceMotd', fallbackLog as SevLoggerLike['announceMotd']),
    stdout: (base as SevLoggerLike).stdout ?? process.stdout,
    stderr: (base as SevLoggerLike).stderr ?? process.stderr,
  }

  normalized.nest = (...args: Parameters<SevLogger['nest']>): SevLoggerLike => {
    const candidate = (base as SevLoggerLike).nest
    if (typeof candidate === 'function') {
      return candidate.apply(base, args)
    }
    return normalized as SevLoggerLike
  }

  return normalized as SevLoggerLike
}

/**
 * A convience base class that you can extend to have all logging methods
 * locally available.
 *
 * @example
 * ```ts
 * class Github extends SevLoggerBaseClass {
 *   constructor(opts: { logger: SevLogger }) {
 *     super(opts)
 *   }
 *
 *   getUser(username: string) {
 *     this.info('Getting user %s', username)
 *     //^-- this.info is available locally thanks to inheritance.
 *     //    You can still inject the logger into the class so you can configure
 *     //    the logger as needed.
 *   }
 * }
 **/
export class SevLoggerBaseClass {
  _logger: SevLoggerLike
  emerg: SevLoggerLike['emerg']
  alert: SevLoggerLike['alert']
  crit: SevLoggerLike['crit']
  err: SevLoggerLike['err']
  warn: SevLoggerLike['warn']
  notice: SevLoggerLike['notice']
  info: SevLoggerLike['info']
  debug: SevLoggerLike['debug']
  trace: SevLoggerLike['trace']

  constructor(opts: { logger: SevLoggerInput }) {
    this._logger = normalizeLogger(opts.logger)
    this.emerg = this._logger.emerg.bind(this._logger)
    this.alert = this._logger.alert.bind(this._logger)
    this.crit = this._logger.crit.bind(this._logger)
    this.err = this._logger.err.bind(this._logger)
    this.warn = this._logger.warn.bind(this._logger)
    this.notice = this._logger.notice.bind(this._logger)
    this.info = this._logger.info.bind(this._logger)
    this.debug = this._logger.debug.bind(this._logger)
    this.trace = this._logger.trace.bind(this._logger)
  }
}
