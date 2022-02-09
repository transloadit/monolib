const { api } = require('@pagerduty/pdjs')
const triggerPager = require('./triggerPager')

jest.mock('@pagerduty/pdjs')

describe('triggerPager', () => {
  test('main', async () => {
    const post = jest.fn(async (endpoint, payload) => {
      expect(endpoint).toBe('/incidents')
      expect(payload).toMatchSnapshot()
      return { data: { error: null } }
    })
    api.mockReturnValue({ post })
    await triggerPager({
      title      : 'us-east-1 down',
      description: 'this happens every 2 years',
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

    expect(err.message).toBe('oh no - oh; no')
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
