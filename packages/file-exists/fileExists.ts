const fs = require('fs')

module.exports = function fileExists (s) {
  // eslint-disable-next-line no-unused-vars
  return new Promise((resolve, reject) => {
    fs.access(s, fs.F_OK, (err) => {
      resolve(!err)
    })
  })
}
