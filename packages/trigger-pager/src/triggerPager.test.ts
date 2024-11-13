import assert from 'node:assert'
import crypto from 'node:crypto'
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import { describe, mock, test } from 'node:test'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mockRequire(specifier: string, replacer: (actual: any) => any) {
  const actualPath = require.resolve(specifier)
  if (arguments.length === 1) {
    require.cache[actualPath] = require(`../__mocks__/${specifier}`)
  } else {
    const actual = require(specifier)
    const Module = require('node:module')
    require.cache[actualPath] = new Module(actualPath, module)
    Object.defineProperties(require.cache[actualPath], {
      exports: {
        // @ts-expect-error -  Object literal may only specify known properties, and '__proto__' does not exist in type 'PropertyDescriptor'
        __proto__: null,
        value: replacer(actual),
      },
      // @ts-expect-error -  Object literal may only specify known properties, and '__proto__' does not exist in type 'PropertyDescriptor'
      resetFn: { __proto__: null, value: replacer.bind(null, actual) },
    })
  }
}

const mockPost = mock.fn(async (endpoint: string, payload: unknown) => {
  throw Error('mock post for each test')
})

mockRequire('@pagerduty/pdjs', () => {
  return { api: () => ({ post: mockPost }) }
})

const triggerPager = require('./triggerPager')

const LOREM_LONG = `Lorem ipsum dolor sit amet, consectetur adipiscing elit,
sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
culpa qui officia deserunt mollit anim id est laborum.`

const LOREM_SHORT = `Lorem ipsum dolor sit amet, consectetur adipiscing elit,
sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`

describe('triggerPager', () => {
  test('main', async () => {
    mockPost.mock.mockImplementationOnce(async (endpoint: string, payload: unknown) => {
      return { data: { error: null } }
    })

    const serviceId = crypto.randomUUID()

    await triggerPager({
      title: LOREM_SHORT,
      description: LOREM_LONG,
      serviceId,
    })

    assert.strictEqual(mockPost.mock.callCount(), 1)
    assert.strictEqual(mockPost.mock.calls[0].arguments[0], '/incidents')
    assert.deepStrictEqual(mockPost.mock.calls[0].arguments[1], {
      headers: {
        from: 'tim.koschuetzki@transloadit.com',
      },
      data: {
        incident: {
          body: {
            details: LOREM_LONG,
            type: 'incident_body',
          },
          incident_key: undefined,
          priority: {
            id: 'PUTY3A1',
            type: 'priority_reference',
          },
          service: {
            id: serviceId,
            type: 'service_reference',
          },
          title: LOREM_SHORT,
          type: 'incident',
          urgency: 'high',
        },
      },
    })
  })

  test('error', async () => {
    mockPost.mock.mockImplementationOnce(async () => {
      return {
        data: {
          error: {
            message: 'oh no',
            errors: ['oh', 'no'],
          },
        },
      }
    })

    let err
    try {
      await triggerPager({
        title: '',
        description: '',
      })
    } catch (_err) {
      err = _err
    }

    assert.strictEqual(err.message, 'oh no - oh; no')
  })

  test('duplicate incident', async () => {
    mockPost.mock.mockImplementationOnce(async () => {
      return {
        data: {
          error: {
            message: 'matching dedup key already exists',
            errors: [],
          },
        },
      }
    })

    await assert.doesNotReject(
      triggerPager({
        title: '',
        description: '',
      }),
    )
  })
})
