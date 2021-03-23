const prettyMS = require('pretty-ms')

module.exports = function formatDurationMs (ms) {
  let human = prettyMS(ms)

  human = human.replace(/(\d+)\.\d+s/g, '$1s')
  human = human.replace(/\s+/g, '')

  return human
}
