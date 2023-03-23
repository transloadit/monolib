import abbr from './abbr'

describe('abbr', () => {
  test('main', async () => {
    expect(
      abbr(
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. '
      )
    ).toBe('Lorem ipsum dolor sit ame[...] et dolore magna aliqua. ')
    expect(abbr('Lorem ipsum dolor sit amet', 10, ' .. ')).toBe('Lor .. met')
  })
})
