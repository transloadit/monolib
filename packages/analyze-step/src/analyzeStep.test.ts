import assert from 'node:assert'
import { describe, test } from 'node:test'
import analyzeStep from './analyzeStep'

const ROBOTS = {
  '/image/resize': {
    rname: '/image/resize',
    purpose_words: 'Convert, resize, or watermark images',
  },
  '/file/filter': {
    rname: '/file/filter',
    purpose_words: 'Filter files',
  },
  '/image/describe': {
    rname: '/image/describe',
    purpose_words: 'Recognize objects in images',
  },
  '/video/encode': {
    rname: '/video/encode',
    purpose_words: 'Transcode, resize, or watermark videos',
  },
}

describe('analyzeStep', () => {
  test('/image/resize', async () => {
    assert.strictEqual(
      analyzeStep(
        {
          robot: '/image/resize',
          width: '75',
          height: '75',
          resize_strategy: 'pad',
          imagemagick_stack: 'v2.0.7',
        },
        ROBOTS,
      ),
      'Resize images to 75×75 using the pad strategy',
    )

    assert.strictEqual(
      analyzeStep(
        {
          use: ':original',
          robot: '/video/encode',
          result: true,
          preset: 'empty',
          ffmpeg_stack: 'v3.3.3',
        },
        ROBOTS,
      ),
      'Transcode videos to original codec Settings',
    )

    assert.strictEqual(
      analyzeStep(
        {
          use: ':original',
          robot: '/video/encode',
          result: true,
          preset: 'empty',
          ffmpeg_stack: 'v3.3.3',
          rotate: false,
          ffmpeg: {
            filter_complex: '[0:v]setpts=2.0*PTS[v];[0:a]atempo=0.5[a]',
            map: ['[v]', '[a]'],
          },
        },
        ROBOTS,
      ),
      'Change video speed',
    )

    assert.strictEqual(
      analyzeStep(
        {
          robot: '/image/resize',
          width: '75',
          height: '75',
        },
        ROBOTS,
      ),
      'Resize images to 75×75',
    )

    assert.strictEqual(
      analyzeStep(
        {
          robot: '/image/resize',
          resize_strategy: 'crop',
          crop: {
            x1: 150,
            y1: 100,
            x2: 225,
            y2: 175,
          },
          gravity: 'center',
          imagemagick_stack: 'v2.0.7',
        },
        ROBOTS,
      ),
      'Crop images to 75×75 starting at 150×100 from the top left',
    )
  })

  test('/image/describe', async () => {
    assert.strictEqual(
      analyzeStep(
        {
          robot: '/file/filter',
          accepts: [['${file.meta.descriptions}', 'includes', 'Bridge']],
        },
        ROBOTS,
      ),
      'Pick files that include descriptions of a Bridge',
    )
    assert.strictEqual(
      analyzeStep(
        {
          robot: '/image/describe',
          provider: 'aws',
          format: 'meta',
          granularity: 'list',
        },
        ROBOTS,
      ),
      'Recognize objects in images',
    )
  })

  test('/file/filter', async () => {
    assert.strictEqual(
      analyzeStep(
        {
          robot: '/file/filter',
          accepts: '${file.meta.width > file.meta.height}',
        },
        ROBOTS,
      ),
      'Pick Filter by code evaluation',
    )

    assert.strictEqual(
      analyzeStep(
        {
          robot: '/file/filter',
          accepts: [['${file.mime}', 'regex', 'image/jpe?g']],
          error_on_decline: false,
        },
        ROBOTS,
      ),
      'Pick jpeg images',
    )

    assert.strictEqual(
      analyzeStep(
        {
          robot: '/file/filter',
          accepts: [['${file.type}', '===', 'video']],
        },
        ROBOTS,
      ),
      'Pick videos',
    )

    assert.strictEqual(
      analyzeStep(
        {
          robot: '/file/filter',
          declines: [['${file.meta.audio_bitrate}', '<', '65536']],
        },
        ROBOTS,
      ),
      'Exclude files with an audio bitrate below 64 Kbit/s',
    )

    assert.strictEqual(
      analyzeStep(
        {
          robot: '/file/filter',
          declines: [
            ['${file.meta.width}', '!=', '1920'],
            ['${file.meta.height}', '!=', '1080'],
          ],
          condition_type: 'and',
        },
        ROBOTS,
      ),
      'Exclude files without a width of 1920 and a height of 1080',
    )

    assert.strictEqual(
      analyzeStep(
        {
          robot: '/file/filter',
          accepts: [['${file.mime}', 'regex', 'image']],
          error_on_decline: true,
        },
        ROBOTS,
      ),
      'Pick images',
    )

    assert.strictEqual(
      analyzeStep(
        {
          robot: '/file/filter',
          accepts: [
            ['${file.mime}', 'regex', 'image'],
            ['${file.mime}', 'regex', 'video'],
          ],
          error_on_decline: true,
        },
        ROBOTS,
      ),
      'Pick images and videos',
    )

    assert.strictEqual(
      analyzeStep(
        {
          robot: '/file/filter',
          accepts: [['${file.size}', '>=', '1024']],
        },
        ROBOTS,
      ),
      'Pick files with a filesize of 1 KB or higher',
    )

    assert.strictEqual(
      analyzeStep(
        {
          robot: '/file/filter',
          accepts: [
            ['${file.meta.aspect_ratio}', '>', '1.0'],
            ['${file.mime}', 'regex', 'image'],
          ],
          condition_type: 'and',
        },
        ROBOTS,
      ),
      'Pick files with a aspect ratio above 1.0 and images',
    )

    assert.strictEqual(
      analyzeStep(
        {
          robot: '/file/filter',
          declines: [
            ['${file.size}', '>', '20971520'],
            ['${file.meta.duration}', '>=', '300'],
          ],
          error_on_decline: true,
        },
        ROBOTS,
      ),
      'Exclude files bigger than 20 MB and files with a duration of 5m or higher',
    )

    assert.strictEqual(
      analyzeStep(
        {
          robot: '/file/filter',
          accepts: [
            ['${file.meta.width}', '<=', '2048'],
            ['${file.meta.height}', '<=', '2048'],
          ],
          condition_type: 'or',
        },
        ROBOTS,
      ),
      'Pick files with a width of 2048 or lower or a height of 2048 or lower',
    )

    assert.strictEqual(
      analyzeStep(
        {
          robot: '/file/filter',
          declines: [
            [
              '${file.mime}',
              'regex',
              'application/(rar|x-7z-compressed|x-cab|x-cpio|x-debian-package|x-gtar-compressed|x-gzip|x-lzh|x-redhat-package-manager|x-tar|zip)',
            ],
          ],
          error_on_decline: false,
        },
        ROBOTS,
      ),
      'Exclude archives',
    )

    assert.strictEqual(
      analyzeStep(
        {
          robot: '/file/filter',
          declines: [['${file.meta.audio_bitrate}', '==', '']],
          error_on_decline: true,
        },
        ROBOTS,
      ),
      'Exclude files without an audio bitrate',
    )

    assert.strictEqual(
      analyzeStep(
        {
          robot: '/file/filter',
          accepts: [
            ['${file.type}', '===', 'image'],
            ['${file.type}', '===', 'video'],
          ],
        },
        ROBOTS,
      ),
      'Pick images and videos',
    )
  })
})
