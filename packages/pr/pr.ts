// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const util = require('util')

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function pr (...args: any[]) {
  for (const arg of args) {
    console.log(util.inspect(arg, false, null, true))
  }

  return args
}
