// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'fs'.
const fs = require('fs')

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function fileExists (s: any) {
  // eslint-disable-next-line no-unused-vars
  return new Promise((resolve, reject) => {
    fs.access(s, fs.F_OK, (err: any) => {
      resolve(!err)
    })
  });
}
