import { mock, describe, test } from 'node:test'
import assert from 'node:assert'

import triggerPager from './triggerPager'

const { api } = require('@pagerduty/pdjs')

const LOREM = `Lorem ipsum dolor sit amet, consectetur adipiscing elit,
sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
culpa qui officia deserunt mollit anim id est laborum.`

const LOREM3 = `${LOREM} ${LOREM} ${LOREM}`

// eslint-disable-next-line no-unused-vars
const mockPost = mock.fn(async (endpoint: string, payload: unknown) => {})
// eslint-disable-next-line no-unused-vars
mock.fn(api, ({ token }: { token: string }) => ({ post: mockPost }))

describe('triggerPager', () => {
  test.skip('main', async () => {
    // eslint-disable-next-line no-unused-vars
    mockPost.mock.mockImplementationOnce(async (endpoint: string, payload: unknown) => {
      return { data: { error: null } }
    })

    await triggerPager({
      title: LOREM3,
      description: LOREM3,
      serviceId: 'SERVICE_ID',
    })

    // console.log(mockPost.mock.calls)

    // assert.equal(mockPost.mock.callCount(), 1)
    // assert.equal(mockPost.mock.calls[0].arguments[0], '/incidents')
    // assert.deepStrictEqual(mockPost.mock.calls[0].arguments[1], {
    //   data: {
    //     incident: {
    //       body: {
    //         details:
    //           'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit,  sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ',
    //         type: 'incident_body',
    //       },
    //       incident_key: undefined,
    //       priority: {
    //         id: 'PUTY3A1',
    //         type: 'priority_reference',
    //       },
    //       service: {
    //         id: 'SERVICE_ID',
    //         type: 'service_reference',
    //       },
    //       title:
    //         'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut eni…',
    //       type: 'incident',
    //       urgency: 'high',
    //     },
    //   },
    //   headers: {
    //     from: 'tim.koschuetzki@transloadit.com',
    //   },
    // })
  })

  test.skip('error', async () => {
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

    assert.equal(err.message, 'oh no - oh; no')
  })

  test.skip('duplicate incident', async () => {
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

    await triggerPager({
      title: '',
      description: '',
    })
  })
})
