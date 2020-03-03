const fs             = require('fs')
module.exports = function fileExists (s) {
  return new Promise((resolve, reject) => {
    fs.access(s, fs.F_OK, (err) => {
      resolve(!err)
    })
  })
}
