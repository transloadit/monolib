const sortResultMeta = require('./sortResultMeta')

describe('sortResultMeta', () => {
  test('main', () => {
    expect(Object.keys(sortResultMeta({
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
    }))).toStrictEqual([
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
  })
})
