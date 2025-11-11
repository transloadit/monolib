import type { SevLogger } from './SevLogger'

type MethodSignature<Method extends keyof SevLogger> = SevLogger[Method] extends (
  ...args: infer Params
) => infer Result
  ? (...args: Params) => Result
  : never

export interface SevLoggerLike {
  emerg: MethodSignature<'emerg'>
  alert: MethodSignature<'alert'>
  crit: MethodSignature<'crit'>
  err: MethodSignature<'err'>
  warn: MethodSignature<'warn'>
  notice: MethodSignature<'notice'>
  info: MethodSignature<'info'>
  debug: MethodSignature<'debug'>
  trace: MethodSignature<'trace'>
  log: MethodSignature<'log'>
  event: MethodSignature<'event'>
  update: MethodSignature<'update'>
  announceMotd: MethodSignature<'announceMotd'>
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
