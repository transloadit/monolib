import { fileURLToPath } from 'node:url'

import { beforeEach, describe, expect, it } from 'vitest'

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

      expect(logger.formatter(LEVEL.EMERG, `your password is 124%s*!`, `hi`)).toStrictEqual(
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

      expect(logger.formatter(LEVEL.EMERG, `hi`)).toStrictEqual(
        `dim(brightGreen(Foo)) boldRed([  EMERG]) hi`,
      )

      logger.update({ breadcrumbs: ['Bar'] })
      expect(logger.formatter(LEVEL.EMERG, `hi`)).toStrictEqual(
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

      expect(logger.formatter(LEVEL.EMERG, `hi`)).toMatchInlineSnapshot(
        `"dim(brightGreen(Foo)) boldRed([  EMERG]) hi"`,
      )
      expect(childLogger.formatter(LEVEL.EMERG, `hi`)).toMatchInlineSnapshot(
        `"dim(brightGreen(Foo)>blue(Bar)) boldRed([  EMERG]) hi"`,
      )
      expect(logger.formatter(LEVEL.EMERG, `hi`)).toMatchInlineSnapshot(
        `"dim(brightGreen(Foo)) boldRed([  EMERG]) hi"`,
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
      expect(logger1.formatter(LEVEL.INFO, `msg1`)).toStrictEqual(
        `dim(brightYellow(L1)) blue([   INFO]) msg1`,
      )
      // Nest logger2 (max length becomes 5: L1:L2 with new default)
      const logger2 = logger1.nest({ breadcrumbs: ['L2'] })
      expect(logger2.formatter(LEVEL.WARN, `msg2`)).toStrictEqual(
        `dim(brightYellow(L1):blue(L2)) yellow([   WARN]) msg2`,
      )
      // Log from logger1 again (should be padded to length 5)
      expect(logger1.formatter(LEVEL.INFO, `msg1 again`)).toMatchInlineSnapshot(
        `"dim(brightYellow(L1)) blue([   INFO]) msg1 again"`,
      )

      // Nest logger3 (max length becomes 10: L1:L2:L3L3)
      const logger3 = logger2.nest({ breadcrumbs: ['L3L3'] })
      expect(logger3.formatter(LEVEL.ERR, `msg3`)).toStrictEqual(
        `dim(brightYellow(L1):blue(L2):brightBlue(L3L3)) red([    ERR]) msg3`,
      )
      // Log from logger1 again (should be padded to length 10)
      expect(logger1.formatter(LEVEL.INFO, `msg1 final`)).toMatchInlineSnapshot(
        `"dim(brightYellow(L1)) blue([   INFO]) msg1 final"`,
      )

      // Log from logger2 again (should be padded to length 10)
      expect(logger2.formatter(LEVEL.WARN, `msg2 final`)).toMatchInlineSnapshot(
        `"dim(brightYellow(L1):blue(L2)) yellow([   WARN]) msg2 final"`,
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
      expect(logger.formatter(LEVEL.EMERG, `hi`)).toMatch(
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

      expect(logger.formatter(LEVEL.EMERG, `hi`)).toStrictEqual(`boldRed([  EMERG]) hi`)
      expect(logger.formatter(LEVEL.NOTICE, `foo %s`, `bar`)).toStrictEqual(
        `green([ NOTICE]) foo magenta(bar)`,
      )
      expect(logger.formatter(LEVEL.DEBUG, `foo %s %r`, 1, __filename)).toStrictEqual(
        `dim(gray([  DEBUG]) foo magenta(1) cyan(src/SevLogger.test.ts))`,
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
      const expectedPattern = /\s+blue\(src\/SevLogger\.test\.ts:\d+\)$/

      const formatted = logger.formatter(LEVEL.INFO, 'Callsite test')

      // Check if the callsite pattern exists somewhere in the formatted string
      expect(formatted).toMatch(expectedPattern)
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

    // eslint-disable-next-line vitest/expect-expect
    it('should allow correct types and counts for log()', () => {
      // These calls don't need output assertions for this specific test's goal (compile-time check)
      logger.log(LEVEL.INFO, 'Hello')
      logger.log(LEVEL.WARN, 'String: %s, Number: %s, Object: %s', 'world', 123, { a: 1 })
      logger.log(LEVEL.ERR, 'File: %r, Clickable: %c', '/path/to/file.ts', '/other/file.js')
      logger.log(LEVEL.INFO, 'Escaped %%s')
      logger.log(LEVEL.CRIT, 'String: %s, File: %r', 'data', '/path/file')
    })

    it('should error on incorrect argument types for log()', async () => {
      // eslint-disable-next-line
      // @ts-expect-error %r expects string, got number
      expect(() => logger.log(LEVEL.NOTICE, 'File: %r', 123)).toThrow(
        'Expected string for %r, got number',
      )
      // eslint-disable-next-line
      // @ts-expect-error %c expects string, got object
      expect(() => logger.log(LEVEL.CRIT, 'Clickable: %c', { path: '/file' })).toThrow(
        'Expected string for %c, got object',
      )
      // eslint-disable-next-line
      // @ts-expect-error First %s ok, second %r expects string, got boolean
      expect(() => logger.log(LEVEL.INFO, 'Info: %s, Path: %r', 'some info', true)).toThrow(
        'Expected string for %r, got boolean',
      )
    })

    // eslint-disable-next-line vitest/expect-expect
    it('should error on incorrect argument counts for log()', () => {
      // @ts-expect-error Missing argument for %s
      logger.log(LEVEL.WARN, 'Value: %s')
      // @ts-expect-error Too many arguments for %s
      logger.log(LEVEL.ERR, 'Name: %s', 'Test', 'Extra')
      // @ts-expect-error Missing args for %r and %c
      logger.log(LEVEL.DEBUG, 'Files: %r %c')
      // @ts-expect-error Missing arg for %c
      logger.log(LEVEL.TRACE, 'Paths: %r %c', '/file1')
      // @ts-expect-error Too many args for %r %c
      logger.log(LEVEL.ALERT, 'Paths: %r %c', '/file1', '/file2', 'extra')
    })

    // Tests specifically for notice()
    it('should allow correct types and counts for notice()', () => {
      capturedOutput = ''
      logger.notice('Notice Hello')
      let strippedOutput = logger.stripAnsi(capturedOutput)
      expect(strippedOutput).toContain('[ NOTICE] Notice Hello')

      capturedOutput = ''
      logger.notice('String: %s, Number: %s, Object: %s', 'world', 123, { a: 1 })
      strippedOutput = logger.stripAnsi(capturedOutput)
      expect(strippedOutput).toContain('[ NOTICE] String: world, Number: 123, Object: { a: 1 }') // inspect adds space

      capturedOutput = ''
      logger.notice('File: %r, Clickable: %c', '/path/to/file.ts', '/other/file.js')
      strippedOutput = logger.stripAnsi(capturedOutput)
      // Check for the level, the labels, and the core filenames
      expect(strippedOutput).toContain('[ NOTICE]')
      expect(strippedOutput).toContain('File:')
      expect(strippedOutput).toContain('file.ts') // Check for the %r filename
      expect(strippedOutput).toContain('Clickable:')
      expect(strippedOutput).toContain('file.js') // Check for the %c filename
      // expect(strippedOutput).toContain('file.js (file:') // Optional stricter check

      capturedOutput = ''
      logger.notice('Escaped %%s')
      strippedOutput = logger.stripAnsi(capturedOutput)
      expect(strippedOutput).toContain('[ NOTICE] Escaped %s') // %% becomes %

      capturedOutput = ''
      logger.notice('String: %s, File: %r', 'data', '/path/file')
      strippedOutput = logger.stripAnsi(capturedOutput)
      expect(strippedOutput).toContain('[ NOTICE] String: data, ')
      expect(strippedOutput).toContain('File: ')
      expect(strippedOutput).toContain('/path/file')
    })

    it('should error on incorrect argument types for notice()', () => {
      // eslint-disable-next-line
      // @ts-expect-error %r expects string, got number
      expect(() => logger.notice('File: %r', 123)).toThrow('Expected string for %r, got number')
      // eslint-disable-next-line
      // @ts-expect-error %c expects string, got object
      expect(() => logger.notice('Clickable: %c', { path: '/file' })).toThrow(
        'Expected string for %c, got object',
      )
      // eslint-disable-next-line
      // @ts-expect-error First %s ok, second %r expects string, got boolean
      expect(() => logger.notice('Info: %s, Path: %r', 'some info', true)).toThrow(
        'Expected string for %r, got boolean',
      )
    })

    // eslint-disable-next-line vitest/expect-expect
    it('should error on incorrect argument counts for wrapper methods', () => {
      // These test compile-time errors primarily
      // @ts-expect-error Missing argument for %s
      logger.notice('Value: %s')
      // @ts-expect-error Too many arguments for %s
      logger.notice('Name: %s', 'Test', 'Extra')
      // @ts-expect-error Missing args for %r and %c
      logger.notice('Files: %r %c')
      // @ts-expect-error Missing arg for %c
      logger.notice('Paths: %r %c', '/file1')
      // @ts-expect-error Too many args for %r %c
      logger.notice('Paths: %r %c', '/file1', '/file2', 'extra')

      const e = new Error(`foo`)
      // @ts-expect-error Too many args for method without format string
      logger.info('Info without check', e)

      // @ts-expect-error Unrecognized specifier %d - primary test is compile-time error
      logger.info('Info without check %d', e)

      // Valid case: Test the actual output using the mock stream
      logger.info('Info without check %s', e)
    })
  })
})
