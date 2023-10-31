import { describe, test } from 'node:test'
import assert from 'node:assert'
import sortObject from './sortObject'

describe('sortObject', () => {
  test('main', () => {
    assert.deepStrictEqual(
      Object.keys(
        sortObject({
          generated_upload_required: true,
          title: 'Automatic Face Detection Service',
          run_instructions: 'Please upload an image with faces to run the demo.',
          redirect_from: '/demos/image-manipulation/detect-faces-in-images/',
          generated_hash: '136d8a55e5aedae8071b12378cbfc851',
        })
      ),
      ['generated_hash', 'generated_upload_required', 'redirect_from', 'run_instructions', 'title']
    )
  })
})
