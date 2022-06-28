// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const prettyMS = require('pretty-ms')

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function formatDurationMs (ms: any) {
  let human = prettyMS(ms)

  human = human.replace(/(\d+)\.\d+s/g, '$1s')
  human = human.replace(/\s+/g, '')

  return human
}
