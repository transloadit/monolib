import { SevLogger } from './SevLogger'

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

class ShimLogger extends SevLogger {
  constructor(base: Partial<SevLoggerLike>) {
    super()

    const bindOr = <K extends keyof SevLoggerLike>(name: K, fallback: SevLoggerLike[K]) => {
      const candidate = base[name]
      if (typeof candidate === 'function') {
        return (candidate as unknown as (...args: unknown[]) => unknown).bind(base) as SevLoggerLike[K]
      }
      return fallback
    }

    this.emerg = bindOr('emerg', this.emerg)
    this.alert = bindOr('alert', this.alert)
    this.crit = bindOr('crit', this.crit)
    this.err = bindOr('err', this.err)
    this.error = bindOr('error', this.error)
    this.warn = bindOr('warn', this.warn)
    this.notice = bindOr('notice', this.notice)
    this.info = bindOr('info', this.info)
    this.debug = bindOr('debug', this.debug)
    this.trace = bindOr('trace', this.trace)
    this.log = bindOr('log', this.log)
    this.event = bindOr('event', this.event)
    if (typeof base.update === 'function') {
      this.update = (...args: Parameters<SevLogger['update']>): this => {
        ;(base.update as (...args: unknown[]) => unknown).apply(base, args)
        return this
      }
    }
    this.announceMotd = bindOr('announceMotd', this.announceMotd)

    if (base.stdout) this.stdout = base.stdout
    if (base.stderr) this.stderr = base.stderr

    // If base provided a nest, it won't type-match the overloads cleanly; rely on SevLogger.nest.
  }
}

const normalizeLogger = (logger: SevLoggerInput): SevLogger => {
  if (logger instanceof SevLogger) {
    return logger
  }
  const partial = logger ?? {}
  return new ShimLogger(partial)
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
  _logger: SevLogger
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
