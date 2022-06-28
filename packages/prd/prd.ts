// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'pr'.
const pr = require('@transloadit/pr')

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function prd (...args: any[]) {
  pr(...args)
  const err = new Error('Halt via prd')
  console.error(err)
  // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
  process.exit(1)
}
