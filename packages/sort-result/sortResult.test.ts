// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sortResult... Remove this comment to see the full error message
const sortResult = require('./sortResult')

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('sortResult', () => {
  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('main', () => {
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(Object.keys(sortResult({
      id               : 'b8d12f6c517541ca86bf50c537cedb27',
      name             : 'joe-gardner-149699.jpg',
      basename         : 'joe-gardner-149699',
      ext              : 'jpg',
      size             : 141822,
      mime             : 'image/jpeg',
      type             : 'image',
      field            : 'file',
      md5hash          : '2a5cd917f4281b9438956e489c63dfd2',
      original_id      : 'a30bd0776e7f4ac3817b056d102e8219',
      original_basename: 'joe-gardner-149699',
      original_name    : 'joe-gardner-149699.jpg',
      original_path    : '/',
      original_md5hash : 'fb205cb04b6998fe7ba364f70227cfa1',
      from_batch_import: false,
      is_tus_file      : false,
      tus_upload_url   : null,
      url              : 'http://demos.transloadit.com.s3.amazonaws.com/b8/d12f6c517541ca86bf50c537cedb27/joe-gardner-149699.jpg',
      ssl_url          : 'https://s3.amazonaws.com/demos.transloadit.com/b8/d12f6c517541ca86bf50c537cedb27/joe-gardner-149699.jpg',
      meta             : {
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
      },
      queue    : 'live',
      queueTime: 0,
      execTime : 0.83,
      cost     : 627606,
    }))).toStrictEqual([
      'id',
      'basename',
      'cost',
      'execTime',
      'ext',
      'field',
      'from_batch_import',
      'is_tus_file',
      'md5hash',
      'mime',
      'name',
      'original_basename',
      'original_id',
      'original_md5hash',
      'original_name',
      'original_path',
      'queue',
      'queueTime',
      'size',
      'ssl_url',
      'tus_upload_url',
      'type',
      'url',
      'meta',
    ])
  })
})
