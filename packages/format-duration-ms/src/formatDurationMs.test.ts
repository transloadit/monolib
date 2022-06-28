import formatDurationMs from './formatDurationMs'

describe('formatDurationMs', () => {
  test('main', async () => {
    expect(formatDurationMs(-10)).toBe('-10ms')
    expect(formatDurationMs(10)).toBe('10ms')
    expect(formatDurationMs(1000)).toBe('1s')
    expect(formatDurationMs(1001)).toBe('1s')
    expect(formatDurationMs(100000)).toBe('1m40s')
    expect(formatDurationMs(10000000)).toBe('2h46m40s')
    expect(formatDurationMs(1000000000)).toBe('11d13h46m40s')
    expect(formatDurationMs(100000000000)).toBe('3y62d9h46m40s')
  })
})
