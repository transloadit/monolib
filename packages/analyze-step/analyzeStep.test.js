const analyzeStep = require('./analyzeStep')
const util = require('util')
const readMarkdowns = util.promisify(require('./readMarkdowns'))

describe('analyzeStep', () => {
  test('main', async () => {
    const robots = await readMarkdowns(`${__dirname}/../../_robots/*/*.md`, { nest: 'rname' })
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
    }, robots)).toMatch('Convert, resize, or watermark images')
  })
})
