import { describe, test } from 'node:test'
import assert from 'node:assert'

const abbr = require('./abbr')

describe('abbr', () => {
  test('main', async () => {
    assert.strictEqual(
      abbr(
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. '
      ),
      'Lorem ipsum dolor sit ame[...] et dolore magna aliqua. '
    )
    assert.strictEqual(abbr('Lorem ipsum dolor sit amet', 10, ' .. '), 'Lor .. met')
  })
})
