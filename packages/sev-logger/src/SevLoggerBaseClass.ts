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

  constructor(opts: { logger: SevLoggerLike }) {
    this._logger = opts.logger
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
