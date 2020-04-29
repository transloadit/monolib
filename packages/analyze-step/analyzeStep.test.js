const analyzeStep = require('./analyzeStep.js')
// const util = require('util')

describe('analyzeStep', () => {
  test('main', async () => {
    const robots = {
      '/image/resize': {
        rname        : '/image/resize',
        purpose_words: 'Convert, resize, or watermark images',

      },
      '/file/filter': {
        rname        : '/file/filter',
        purpose_words: 'Filter files',
      },
      '/image/describe': {
        rname        : '/image/describe',
        purpose_words: 'Recognize objects in images',
      },
    }
    expect(analyzeStep({
      use            : ':original',
      robot          : '/image/resize',
      resize_strategy: 'crop',
      crop           : {
        x1: 150,
        y1: 100,
        x2: 225,
        y2: 175,
      },
      gravity          : 'center',
      result           : true,
      imagemagick_stack: 'v2.0.7',
    }, robots)).toMatch('Crop images to 75×75 starting at 150×100 from the top left')

    expect(analyzeStep({
      use              : ':original',
      robot            : '/image/resize',
      width            : '75',
      height           : '75',
      resize_strategy  : 'pad',
      result           : true,
      imagemagick_stack: 'v2.0.7',
    }, robots)).toMatch('Resize images to 75×75 using the pad strategy')

    expect(analyzeStep({
      result : true,
      use    : 'described',
      robot  : '/file/filter',
      accepts: [
        [
          '${file.meta.descriptions}',
          'includes',
          'Bridge',
        ],
      ],
    }, robots)).toMatch('Pick files that include descriptions of a Bridge')

    expect(analyzeStep({
      use    : ':original',
      robot  : '/file/filter',
      accepts: [
        [
          '${file.type}',
          '===',
          'video',
        ],
      ],
    }, robots)).toMatch('Pick videos')

    expect(analyzeStep({
      use     : ':original',
      robot   : '/file/filter',
      declines: [
        [
          '${file.meta.audio_bitrate}',
          '<',
          '65536',
        ],
      ],
      result: true,
    }, robots)).toMatch('Reject files with an audio bitrate below 64 Kbit/s')

    expect(analyzeStep({
      use     : ':original',
      robot   : '/file/filter',
      declines: [
        [
          '${file.meta.width}',
          '!=',
          '1920',
        ],
        [
          '${file.meta.height}',
          '!=',
          '1080',
        ],
      ],
      condition_type: 'and',
      result        : true,
    }, robots)).toMatch('Reject files without a width of 1920 and a height of 1080')

    expect(analyzeStep({
      use    : ':original',
      robot  : '/file/filter',
      result : true,
      accepts: [
        [
          '${file.mime}',
          'regex',
          'image',
        ],
      ],
      error_on_decline: true,
    }, robots)).toMatch('Pick images')

    expect(analyzeStep({
      use    : ':original',
      robot  : '/file/filter',
      result : true,
      accepts: [
        [
          '${file.mime}',
          'regex',
          'image',
        ],
        [
          '${file.mime}',
          'regex',
          'video',
        ],
      ],
      error_on_decline: true,
    }, robots)).toMatch('Pick images and videos')

    expect(analyzeStep({
      use    : ':original',
      robot  : '/file/filter',
      accepts: [
        [
          '${file.size}',
          '>=',
          '1024',
        ],
      ],
      result: true,
    }, robots)).toMatch('Pick files with a filesize of 1 KB or higher')

    expect(analyzeStep({
      use    : ':original',
      robot  : '/file/filter',
      result : true,
      accepts: [
        [
          '${file.meta.aspect_ratio}',
          '>',
          '1.0',
        ],
        [
          '${file.mime}',
          'regex',
          'image',
        ],
      ],
      condition_type: 'and',
    }, robots)).toMatch('Pick files with a aspect ratio above 1.0 and images')

    expect(analyzeStep({
      use     : ':original',
      robot   : '/file/filter',
      result  : true,
      declines: [
        [
          '${file.size}',
          '>',
          '20971520',
        ],
        [
          '${file.meta.duration}',
          '>=',
          '300',
        ],
      ],
      error_on_decline: true,
    }, robots)).toMatch('Reject files bigger than 20 MB and files with a duration of 5m or higher')

    expect(analyzeStep({
      use    : ':original',
      robot  : '/file/filter',
      result : true,
      accepts: [
        [
          '${file.meta.width}',
          '<=',
          '2048',
        ],
        [
          '${file.meta.height}',
          '<=',
          '2048',
        ],
      ],
      condition_type: 'or',
    }, robots)).toMatch('Pick files with a width of 2048 or lower or a height of 2048 or lower')

    expect(analyzeStep({
      use     : ':original',
      robot   : '/file/filter',
      result  : true,
      declines: [
        [
          '${file.mime}',
          'regex',
          'application/(rar|x-7z-compressed|x-cab|x-cpio|x-debian-package|x-gtar-compressed|x-gzip|x-lzh|x-redhat-package-manager|x-tar|zip)',
        ],
      ],
      error_on_decline: false,
    }, robots)).toMatch('Reject archives')

    expect(analyzeStep({
      use     : ':original',
      robot   : '/file/filter',
      result  : true,
      declines: [
        [
          '${file.meta.audio_bitrate}',
          '==',
          '',
        ],
      ],
      error_on_decline: true,
    }, robots)).toMatch('Reject files without an audio bitrate')

    expect(analyzeStep({
      use    : ':original',
      robot  : '/file/filter',
      accepts: [
        [
          '${file.type}',
          '===',
          'image',
        ],
        [
          '${file.type}',
          '===',
          'video',
        ],
      ],
    }, robots)).toMatch('Pick images and videos')

    expect(analyzeStep({
      use        : ':original',
      robot      : '/image/describe',
      provider   : 'aws',
      format     : 'meta',
      granularity: 'list',
      result     : true,
    }, robots)).toMatch('Recognize objects in images')

    expect(analyzeStep({
      robot : '/image/resize',
      width : '75',
      height: '75',
    },
    robots)).toMatch('Resize images to 75×75')
  })
})
