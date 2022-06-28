// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sortResult... Remove this comment to see the full error message
const sortResultMeta = require('./sortResultMeta')

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('sortResultMeta', () => {
  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('main', () => {
    const sorted = sortResultMeta({
      width             : 621,
      height            : 840,
      date_file_created : '2020/01/09 12:02:09 GMT',
      date_file_modified: '2020/01/09 12:02:12 GMT',
      aspect_ratio      : '0.739',
      has_clipping_path : false,
      frame_count       : 1,
      colorspace        : 'RGB',
      has_transparency  : false,
      average_color     : '#8d654d',
      faces             : [
        {
          x1        : 981,
          y1        : 121,
          x2        : 1550,
          y2        : 891,
          height    : 840,
          width     : 621,
          confidence: 99.99,
        },
      ],
    })

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(Object.keys(sorted)).toStrictEqual([
      'aspect_ratio',
      'average_color',
      'colorspace',
      'date_file_created',
      'date_file_modified',
      'faces',
      'frame_count',
      'has_clipping_path',
      'has_transparency',
      'height',
      'width',
    ])

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(Object.keys(sorted.faces[0])).toStrictEqual([
      'confidence',
      'height',
      'width',
      'x1',
      'y1',
      'x2',
      'y2',
    ])
  })
})
