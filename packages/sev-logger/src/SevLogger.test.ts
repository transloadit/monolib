import { fileURLToPath } from 'node:url'

import assert from 'node:assert'
import { beforeEach, describe, it } from 'node:test'

import { SevLogger } from './SevLogger'

// const __filename = fileURLToPath(import.meta.url)
const { LEVEL } = SevLogger

const colors = {
  red: (s: string) => `red(${s})`,
  green: (s: string) => `green(${s})`,
  yellow: (s: string) => `yellow(${s})`,
  blue: (s: string) => `blue(${s})`,
  magenta: (s: string) => `magenta(${s})`,
  cyan: (s: string) => `cyan(${s})`,
  white: (s: string) => `white(${s})`,
  gray: (s: string) => `gray(${s})`,
  brightGreen: (s: string) => `brightGreen(${s})`,
  brightYellow: (s: string) => `brightYellow(${s})`,
  brightBlue: (s: string) => `brightBlue(${s})`,
  brightMagenta: (s: string) => `brightMagenta(${s})`,
  brightCyan: (s: string) => `brightCyan(${s})`,
  boldRed: (s: string) => `boldRed(${s})`,
  dim: (s: string) => `dim(${s})`,
} as const

const debugLevelColors = {
  EMERG: (s: string) => `boldRed(${s})`,
  ALERT: (s: string) => `boldRed(${s})`,
  CRIT: (s: string) => `boldRed(${s})`,
  ERR: (s: string) => `red(${s})`,
  WARN: (s: string) => `yellow(${s})`,
  NOTICE: (s: string) => `green(${s})`,
  INFO: (s: string) => `blue(${s})`,
  DEBUG: (s: string) => `gray(${s})`,
  TRACE: (s: string) => `gray(${s})`,
} as const

const debugFormatColors = {
  s: (s: string) => `magenta(${s})`,
  r: (s: string) => `cyan(${s})`,
  c: (s: string) => `cyan(${s})`,
} as const

describe('SevLogger', () => {
  describe('formatter', () => {
    it('should not fail on random %s', () => {
      const logger = new SevLogger({
        level: LEVEL.TRACE,
        colors,
        levelColors: debugLevelColors,
        formatColors: debugFormatColors,
        addCallsite: false,
      })
      const { EMERG: colEmerg } = logger.levelColors

      assert.strictEqual(
        logger.formatter(LEVEL.EMERG, `your password is 124%s*!`, `hi`),
        // Fallback behavior: append extra args when specifier isn't well-formed
        `${colEmerg(`[  EMERG]`)} your password is 124%s*! hi`,
      )
    })

    it('should update', () => {
      const logger = new SevLogger({
        level: LEVEL.TRACE,
        breadcrumbs: ['Foo'],
        colors,
        levelColors: debugLevelColors,
        formatColors: debugFormatColors,
        addCallsite: false,
      })

      assert.strictEqual(
        logger.formatter(LEVEL.EMERG, `hi`),
        `dim(brightGreen(Foo)) boldRed([  EMERG]) hi`,
      )

      logger.update({ breadcrumbs: ['Bar'] })
      assert.strictEqual(
        logger.formatter(LEVEL.EMERG, `hi`),
        `dim(blue(Bar)) boldRed([  EMERG]) hi`,
      )
    })

    it('should support nesting prefixes, and padding to longest prefix', () => {
      const logger = new SevLogger({
        level: LEVEL.TRACE,
        breadcrumbs: ['Foo'],
        colors,
        levelColors: debugLevelColors,
        formatColors: debugFormatColors,
        addCallsite: false,
        nestDivider: '>',
      })

      const childLogger = logger.nest({
        breadcrumbs: ['Bar'],
      })

      assert.strictEqual(
        logger.formatter(LEVEL.EMERG, `hi`),
        'dim(brightGreen(Foo)) boldRed([  EMERG]) hi',
      )
      assert.strictEqual(
        childLogger.formatter(LEVEL.EMERG, `hi`),
        'dim(brightGreen(Foo)>blue(Bar)) boldRed([  EMERG]) hi',
      )
      assert.strictEqual(
        logger.formatter(LEVEL.EMERG, `hi`),
        'dim(brightGreen(Foo)) boldRed([  EMERG]) hi',
      )
    })

    it('should handle deeper nesting and dynamic padding correctly', () => {
      const logger1 = new SevLogger({
        level: LEVEL.TRACE,
        breadcrumbs: ['L1'],
        colors,
        levelColors: debugLevelColors,
        formatColors: debugFormatColors,
        addCallsite: false,
      })

      // Initial log from logger1 (max length = 2)
      assert.strictEqual(
        logger1.formatter(LEVEL.INFO, `msg1`),
        `dim(brightYellow(L1)) blue([   INFO]) msg1`,
      )
      // Nest logger2 (max length becomes 5: L1:L2 with new default)
      const logger2 = logger1.nest({ breadcrumbs: ['L2'] })
      assert.strictEqual(
        logger2.formatter(LEVEL.WARN, `msg2`),
        `dim(brightYellow(L1):blue(L2)) yellow([   WARN]) msg2`,
      )
      // Log from logger1 again (should be padded to length 5)
      assert.strictEqual(
        logger1.formatter(LEVEL.INFO, `msg1 again`),
        'dim(brightYellow(L1)) blue([   INFO]) msg1 again',
      )

      // Nest logger3 (max length becomes 10: L1:L2:L3L3)
      const logger3 = logger2.nest({ breadcrumbs: ['L3L3'] })
      assert.strictEqual(
        logger3.formatter(LEVEL.ERR, `msg3`),
        `dim(brightYellow(L1):blue(L2):brightBlue(L3L3)) red([    ERR]) msg3`,
      )
      // Log from logger1 again (should be padded to length 10)
      assert.strictEqual(
        logger1.formatter(LEVEL.INFO, `msg1 final`),
        'dim(brightYellow(L1)) blue([   INFO]) msg1 final',
      )

      // Log from logger2 again (should be padded to length 10)
      assert.strictEqual(
        logger2.formatter(LEVEL.WARN, `msg2 final`),
        'dim(brightYellow(L1):blue(L2)) yellow([   WARN]) msg2 final',
      )
    })

    it('should add datetime', () => {
      const logger = new SevLogger({
        level: LEVEL.TRACE,
        breadcrumbs: ['Foo'],
        timestampFormat: 'iso',
        colors,
        levelColors: debugLevelColors,
        formatColors: debugFormatColors,
      })

      // 2024-01-08T23:00:15.941Z
      assert.match(
        logger.formatter(LEVEL.EMERG, `hi`),
        /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/,
      )
    })

    it('should replace placeholders', () => {
      const logger = new SevLogger({
        level: LEVEL.TRACE,
        colors,
        levelColors: debugLevelColors,
        formatColors: debugFormatColors,
        addCallsite: false,
      })

      assert.strictEqual(logger.formatter(LEVEL.EMERG, `hi`), `boldRed([  EMERG]) hi`)
      assert.strictEqual(
        logger.formatter(LEVEL.NOTICE, `foo %s`, `bar`),
        `green([ NOTICE]) foo magenta(bar)`,
      )
      assert.match(
        logger.formatter(LEVEL.DEBUG, `foo %s %r`, 1, __filename),
        /dim\\(gray\\[ DEBUG\\]\\) foo magenta\\(1\\) cyan\\(.*\\/SevLogger\\.test\\.(js|ts)\\)/,
      )
    })

    it('should add callsite when enabled', () => {
      // Note: This test relies on process.stdout.columns for padding calculation,
      // which might not be reliably set in all test environments.
      // We also match flexibly as line numbers can change.
      const logger = new SevLogger({
        level: LEVEL.TRACE,
        breadcrumbs: ['TestCrumb'],
        addCallsite: true,
        colors,
        levelColors: debugLevelColors,
        formatColors: debugFormatColors,
      })

      // The call site should be this test file and right-aligned
      const expectedPattern = /\s+blue\(.*\/SevLogger\.test\.(js|ts):\d+\)$/

      const formatted = logger.formatter(LEVEL.INFO, 'Callsite test')

      // Check if the callsite pattern exists somewhere in the formatted string
      assert.match(formatted, expectedPattern)
    })
  })

  // Add a new describe block for type tests
  describe('Type Safety', () => {
    // Mock streams to capture output
    let capturedOutput = ''
    const mockStream = {
      write: (chunk: string) => {
        capturedOutput += chunk
      },
      isTTY: false, // Set isTTY characteristics if needed for specific formatting tests
    }
    const logger = new SevLogger({
      level: LEVEL.TRACE,
      stdout: mockStream as unknown as NodeJS.WriteStream,
      stderr: mockStream as unknown as NodeJS.WriteStream,
      addCallsite: false, // Disable callsite for predictable output
      colors: undefined, // Use default non-colored output for simplicity
      levelColors: undefined,
      formatColors: undefined,
    })

    beforeEach(() => {
      // Reset captured output before each test in this block
      capturedOutput = ''
    })

    it('should allow correct types and counts for log()', () => {
      logger.log(LEVEL.INFO, 'Hello')
      logger.log(LEVEL.WARN, 'String: %s, Number: %s, Object: %s', 'world', 123, { a: 1 })
      logger.log(LEVEL.ERR, 'File: %r, Clickable: %c', '/path/to/file.ts', '/other/file.js')
      logger.log(LEVEL.INFO, 'Escaped %%s')
      logger.log(LEVEL.CRIT, 'String: %s, File: %r', 'data', '/path/file')
    })

    it('should error on incorrect argument types for log()', () => {
      assert.throws(
        // @ts-expect-error Intentionally testing incorrect type (number instead of string)
        () => logger.log(LEVEL.NOTICE, 'File: %r', 123),
        /Expected string for %r, got number/,
      )
      assert.throws(
        // @ts-expect-error Intentionally testing incorrect type (object instead of string)
        () => logger.log(LEVEL.CRIT, 'Clickable: %c', { path: '/file' }),
        /Expected string for %c, got object/,
      )
      assert.throws(
        // @ts-expect-error Intentionally testing incorrect type (boolean instead of string)
        () => logger.log(LEVEL.INFO, 'Info: %s, Path: %r', 'some info', true),
        /Expected string for %r, got boolean/,
      )
    })

    it('should error on incorrect argument counts for log()', () => {
      // Test case for missing argument - Check actual output instead of throwing
      capturedOutput = ''
      // @ts-expect-error Intentionally testing missing argument
      logger.log(LEVEL.WARN, 'Value: %s')
      assert.ok(
        logger.stripAnsi(capturedOutput).includes('[   WARN] Value: %s'), // Assuming it prints %s literally
        'Expected missing argument to result in literal %s in output',
      )

      assert.throws(
        // @ts-expect-error Intentionally testing extra argument
        () => logger.log(LEVEL.ERR, 'Name: %s', 'Test', 'Extra'),
        /Too many arguments for %s/,
      )
      // @ts-expect-error Intentionally testing missing arguments
      assert.throws(() => logger.log(LEVEL.DEBUG, 'Files: %r %c'), /Missing arg for %c/)
      // @ts-expect-error Intentionally testing missing argument
      assert.throws(() => logger.log(LEVEL.TRACE, 'Paths: %r %c', '/file1'), /Missing arg for %c/)
      assert.throws(
        // @ts-expect-error Intentionally testing extra arguments
        () => logger.log(LEVEL.ALERT, 'Paths: %r %c', '/file1', '/file2', 'extra'),
        /Too many args for %r %c/,
      )
    })

    it('should allow correct types and counts for notice()', () => {
      capturedOutput = ''
      logger.notice('Notice Hello')
      let strippedOutput = logger.stripAnsi(capturedOutput)
      assert.ok(strippedOutput.includes('[ NOTICE] Notice Hello'))

      capturedOutput = ''
      logger.notice('String: %s, Number: %s, Object: %s', 'world', 123, { a: 1 })
      strippedOutput = logger.stripAnsi(capturedOutput)
      assert.ok(strippedOutput.includes('[ NOTICE] String: world, Number: 123, Object: { a: 1 }'))

      capturedOutput = ''
      logger.notice('File: %r, Clickable: %c', '/path/to/file.ts', '/other/file.js')
      strippedOutput = logger.stripAnsi(capturedOutput)
      assert.ok(strippedOutput.includes('[ NOTICE]'))
      assert.ok(strippedOutput.includes('File:'))
      assert.ok(strippedOutput.includes('file.ts'))
      assert.ok(strippedOutput.includes('Clickable:'))
      assert.ok(strippedOutput.includes('file.js'))

      capturedOutput = ''
      logger.notice('Escaped %%s')
      strippedOutput = logger.stripAnsi(capturedOutput)
      assert.ok(strippedOutput.includes('[ NOTICE] Escaped %s'))

      capturedOutput = ''
      logger.notice('String: %s, File: %r', 'data', '/path/file')
      strippedOutput = logger.stripAnsi(capturedOutput)
      assert.ok(strippedOutput.includes('[ NOTICE] String: data, '))
      assert.ok(strippedOutput.includes('File: '))
      assert.ok(strippedOutput.includes('/path/file'))
    })

    it('should error on incorrect argument types for notice()', () => {
      // @ts-expect-error Intentionally testing incorrect type (number instead of string)
      assert.throws(() => logger.notice('File: %r', 123), /Expected string for %r, got number/)
      assert.throws(
        // @ts-expect-error Intentionally testing incorrect type (object instead of string)
        () => logger.notice('Clickable: %c', { path: '/file' }),
        /Expected string for %c, got object/,
      )
      assert.throws(
        // @ts-expect-error Intentionally testing incorrect type (boolean instead of string)
        () => logger.notice('Info: %s, Path: %r', 'some info', true),
        /Expected string for %r, got boolean/,
      )
    })

    it('should error on incorrect argument counts for wrapper methods', () => {
      // Test case for missing argument - Check actual output instead of throwing
      capturedOutput = ''
      // @ts-expect-error Intentionally testing missing argument
      logger.notice('Value: %s')
      assert.ok(
        logger.stripAnsi(capturedOutput).includes('[ NOTICE] Value: %s'), // Assuming it prints %s literally
        'Expected missing argument to result in literal %s in output for notice()',
      )

      // @ts-expect-error Intentionally testing extra argument
      assert.throws(() => logger.notice('Name: %s', 'Test', 'Extra'), /Too many arguments for %s/)
      // @ts-expect-error Intentionally testing missing arguments
      assert.throws(() => logger.notice('Files: %r %c'), /Missing args for %r and %c/)
      // @ts-expect-error Intentionally testing missing argument
      assert.throws(() => logger.notice('Paths: %r %c', '/file1'), /Missing arg for %c/)
      assert.throws(
        // @ts-expect-error Intentionally testing extra arguments
        () => logger.notice('Paths: %r %c', '/file1', '/file2', 'extra'),
        /Too many args for %r %c/,
      )

      const e = new Error(`foo`)
      assert.throws(
        // @ts-expect-error Intentionally testing extra argument
        () => logger.info('Info without check', e),
        /Too many args for method without format string/,
      )
      assert.throws(
        // @ts-expect-error Intentionally testing incorrect specifier
        () => logger.info('Info without check %d', e),
        /Unrecognized specifier %d - primary test is compile-time error/,
      )
      assert.strictEqual(logger.info('Info without check %s', e), 'Info without check foo')
    })
  })
})
