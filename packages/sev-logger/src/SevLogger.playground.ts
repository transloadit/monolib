import { SevLogger } from './SevLogger'
const { DEBUG } = SevLogger.LEVEL

async function main() {
  const logger1 = new SevLogger({
    breadcrumbs: ['logger1'],
    level: 8,
  })
  logger1.alert('foo1')

  const logger2 = logger1.nest({
    breadcrumbs: ['logger2'],
    level: 8,
  })
  logger2.crit('foo2')

  const logger3 = logger2.nest({
    breadcrumbs: ['logger3'],
    level: 8,
  })
  logger3.err('foo3')

  logger1.notice(`foo4`)

  const logger4 = logger3.nest({
    breadcrumbs: ['logger4'],
    level: 8,
  })
  logger4.warn('foo5')

  const logger5 = logger4.nest({
    breadcrumbs: ['logger5'],
    level: 8,
    timestampFormat: 'iso',
    addHostname: true,
  })
  logger5.notice('foo6')

  const logger6 = logger5.nest({
    breadcrumbs: ['logger6'],
    timestampFormat: 'ss.ms',
    level: 8,
  })
  logger6.info('foo7')

  const logger7 = logger6.nest({
    breadcrumbs: ['logger7'],
    level: 8,
  })
  logger7.debug('foo8')

  const logger8 = logger7.nest({
    breadcrumbs: ['logger8'],
    level: 8,
  })
  logger8.trace('foo9')

  logger1.log(8, `foo10`)
  logger1.log(7, `foo11`)

  logger4.log(3, `foo12`)
  logger4.log(3, `foo13`)

  logger4.log(3, `foo14`)
  logger4.log(2, `foo15`)

  logger1.log(5, `foo16`)
  logger1.log(5, `foo17`)

  logger6.log(1, `foo18`)
  logger6.log(1, `foo19\nfoo20\nfoo21\n`)

  logger1.event(DEBUG, {
    foo: 'bar',
    event: 'FOO_22',
  })

  const newLogger = new SevLogger({
    level: 8,
  })
  newLogger.event(DEBUG, {
    event: 'FOO_22',
    f: 'bar',
  })
}

main()
