const analyzeStep = require('./analyzeStep')
// const util = require('util')

describe('analyzeStep', () => {
  test('main', async () => {
    const robots = {
      '/image/resize': {
        rname        : '/image/resize',
        purpose_words: 'foobar',
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
  })
})
