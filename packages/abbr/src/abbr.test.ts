import { describe, test } from 'node:test'
import assert from 'node:assert/strict'

import abbr from './abbr'

describe('abbr', () => {
  test('main', async () => {
    assert.equal(
      abbr(
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. '
      ),
      'Lorem ipsum dolor sit ame[...] et dolore magna aliqua. '
    )
    assert.equal(abbr('Lorem ipsum dolor sit amet', 10, ' .. '), 'Lor .. met')
  })
})
