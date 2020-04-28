const abbr = require('./abbr')
// const util = require('util')

describe('abbr', () => {
  test('main', async () => {
    expect(abbr('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ')).toMatch('Lorem ipsum dolor sit ame[...] et dolore magna aliqua. ')
  })
})
