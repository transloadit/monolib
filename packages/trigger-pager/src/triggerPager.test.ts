const { api } = require('@pagerduty/pdjs')
import triggerPager from './triggerPager'

const LOREM = `Lorem ipsum dolor sit amet, consectetur adipiscing elit,
sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
culpa qui officia deserunt mollit anim id est laborum.`

const LOREM3 = `${LOREM} ${LOREM} ${LOREM}`

jest.mock('@pagerduty/pdjs')

describe('triggerPager', () => {
    test('main', async () => {
        const post = jest.fn(async (endpoint: any, payload: any) => {
            expect(endpoint).toBe('/incidents')
            expect(payload).toMatchSnapshot()
      return { data: { error: null } }
    })
    api.mockReturnValue({ post })
    await triggerPager({
      title      : LOREM3,
      description: LOREM3,
      serviceId  : 'SERVICE_ID',
    })
        expect(post.mock.calls.length).toBe(1)
  })

    test('error', async () => {
        const post = jest.fn(async () => {
      return {
        data: {
          error: {
            message: 'oh no',
            errors : ['oh', 'no'],
          },
        },
      }
    })
    api.mockReturnValue({ post })

    let err
    try {
      await triggerPager({
        title      : '',
        description: '',
      })
    } catch (_err) {
      err = _err
    }

        expect((err as any).message).toBe('oh no - oh; no');
  })

    test('duplicate incident', async () => {
        const post = jest.fn(async () => {
      return {
        data: {
          error: {
            message: 'matching dedup key already exists',
            errors : [],
          },
        },
      }
    })
    api.mockReturnValue({ post })

    await triggerPager({
      title      : '',
      description: '',
    })
  })
})
