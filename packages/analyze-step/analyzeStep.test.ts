/* eslint-disable no-template-curly-in-string */
const analyzeStep = require('./analyzeStep')
// const util = require('util')

const ROBOTS = {
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
  '/video/encode': {
    rname        : '/video/encode',
    purpose_words: 'Transcode, resize, or watermark videos',
  },
}

describe('analyzeStep', () => {
  test('/image/resize', async () => {
    expect(analyzeStep({
      robot            : '/image/resize',
      width            : '75',
      height           : '75',
      resize_strategy  : 'pad',
      imagemagick_stack: 'v2.0.7',
    }, ROBOTS)).toMatch('Resize images to 75×75 using the pad strategy')

    expect(analyzeStep({
      use         : ':original',
      robot       : '/video/encode',
      result      : true,
      preset      : 'empty',
      ffmpeg_stack: 'v3.3.3',
    }, ROBOTS)).toMatch('Transcode videos to original codec Settings')

    expect(analyzeStep({
      use         : ':original',
      robot       : '/video/encode',
      result      : true,
      preset      : 'empty',
      ffmpeg_stack: 'v3.3.3',
      rotate      : false,
      ffmpeg      : {
        filter_complex: '[0:v]setpts=2.0*PTS[v];[0:a]atempo=0.5[a]',
        map           : [
          '[v]',
          '[a]',
        ],
      },
    }, ROBOTS)).toMatch('Change video speed')

    expect(analyzeStep({
      robot : '/image/resize',
      width : '75',
      height: '75',
    },
    ROBOTS)).toMatch('Resize images to 75×75')

    expect(analyzeStep({
      robot          : '/image/resize',
      resize_strategy: 'crop',
      crop           : {
        x1: 150,
        y1: 100,
        x2: 225,
        y2: 175,
      },
      gravity          : 'center',
      imagemagick_stack: 'v2.0.7',
    }, ROBOTS)).toMatch('Crop images to 75×75 starting at 150×100 from the top left')
  })

  test('/image/describe', async () => {
    expect(analyzeStep({
      robot  : '/file/filter',
      accepts: [
        [
          '${file.meta.descriptions}',
          'includes',
          'Bridge',
        ],
      ],
    }, ROBOTS)).toMatch('Pick files that include descriptions of a Bridge')
    expect(analyzeStep({
      robot      : '/image/describe',
      provider   : 'aws',
      format     : 'meta',
      granularity: 'list',
    }, ROBOTS)).toMatch('Recognize objects in images')
  })

  test('/filte/filter', async () => {
    expect(analyzeStep({
      robot  : '/file/filter',
      accepts: '${file.meta.width > file.meta.height}',
    }, ROBOTS)).toMatch('Filter by code evaluation')

    expect(analyzeStep({
      robot  : '/file/filter',
      accepts: [
        [
          '${file.mime}',
          'regex',
          'image/jpe?g',
        ],
      ],
      error_on_decline: false,
    }, ROBOTS)).toMatch('Pick jpeg images')

    expect(analyzeStep({
      robot  : '/file/filter',
      accepts: [
        [
          '${file.type}',
          '===',
          'video',
        ],
      ],
    }, ROBOTS)).toMatch('Pick videos')

    expect(analyzeStep({
      robot   : '/file/filter',
      declines: [
        [
          '${file.meta.audio_bitrate}',
          '<',
          '65536',
        ],
      ],
    }, ROBOTS)).toMatch('Exclude files with an audio bitrate below 64 Kbit/s')

    expect(analyzeStep({
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
    }, ROBOTS)).toMatch('Exclude files without a width of 1920 and a height of 1080')

    expect(analyzeStep({
      robot  : '/file/filter',
      accepts: [
        [
          '${file.mime}',
          'regex',
          'image',
        ],
      ],
      error_on_decline: true,
    }, ROBOTS)).toMatch('Pick images')

    expect(analyzeStep({
      robot  : '/file/filter',
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
    }, ROBOTS)).toMatch('Pick images and videos')

    expect(analyzeStep({
      robot  : '/file/filter',
      accepts: [
        [
          '${file.size}',
          '>=',
          '1024',
        ],
      ],
    }, ROBOTS)).toMatch('Pick files with a filesize of 1 KB or higher')

    expect(analyzeStep({
      robot  : '/file/filter',
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
    }, ROBOTS)).toMatch('Pick files with a aspect ratio above 1.0 and images')

    expect(analyzeStep({
      robot   : '/file/filter',
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
    }, ROBOTS)).toMatch('Exclude files bigger than 20 MB and files with a duration of 5m or higher')

    expect(analyzeStep({
      robot  : '/file/filter',
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
    }, ROBOTS)).toMatch('Pick files with a width of 2048 or lower or a height of 2048 or lower')

    expect(analyzeStep({
      robot   : '/file/filter',
      declines: [
        [
          '${file.mime}',
          'regex',
          'application/(rar|x-7z-compressed|x-cab|x-cpio|x-debian-package|x-gtar-compressed|x-gzip|x-lzh|x-redhat-package-manager|x-tar|zip)',
        ],
      ],
      error_on_decline: false,
    }, ROBOTS)).toMatch('Exclude archives')

    expect(analyzeStep({
      robot   : '/file/filter',
      declines: [
        [
          '${file.meta.audio_bitrate}',
          '==',
          '',
        ],
      ],
      error_on_decline: true,
    }, ROBOTS)).toMatch('Exclude files without an audio bitrate')

    expect(analyzeStep({
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
    }, ROBOTS)).toMatch('Pick images and videos')
  })
})
