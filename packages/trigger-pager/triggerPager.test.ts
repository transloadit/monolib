// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'api'.
const { api } = require('@pagerduty/pdjs')
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'triggerPag... Remove this comment to see the full error message
const triggerPager = require('./triggerPager')

const LOREM = `Lorem ipsum dolor sit amet, consectetur adipiscing elit,
sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
culpa qui officia deserunt mollit anim id est laborum.`

const LOREM3 = `${LOREM} ${LOREM} ${LOREM}`

// @ts-expect-error TS(2304): Cannot find name 'jest'.
jest.mock('@pagerduty/pdjs')

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('triggerPager', () => {
  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('main', async () => {
    // @ts-expect-error TS(2304): Cannot find name 'jest'.
    const post = jest.fn(async (endpoint: any, payload: any) => {
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(endpoint).toBe('/incidents')
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(payload).toMatchSnapshot()
      return { data: { error: null } }
    })
    api.mockReturnValue({ post })
    await triggerPager({
      title      : LOREM3,
      description: LOREM3,
      serviceId  : 'SERVICE_ID',
    })
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(post.mock.calls.length).toBe(1)
  })

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('error', async () => {
    // @ts-expect-error TS(2304): Cannot find name 'jest'.
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

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect((err as any).message).toBe('oh no - oh; no');
  })

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('duplicate incident', async () => {
    // @ts-expect-error TS(2304): Cannot find name 'jest'.
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
