import type { SevLogger } from './SevLogger'

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
  emerg: typeof SevLogger.prototype.emerg
  alert: typeof SevLogger.prototype.alert
  crit: typeof SevLogger.prototype.crit
  err: typeof SevLogger.prototype.err
  warn: typeof SevLogger.prototype.warn
  notice: typeof SevLogger.prototype.notice
  info: typeof SevLogger.prototype.info
  debug: typeof SevLogger.prototype.debug
  trace: typeof SevLogger.prototype.trace

  constructor(opts: { logger: SevLogger }) {
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
