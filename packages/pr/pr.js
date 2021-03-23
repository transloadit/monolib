const util = require('util')

module.exports = function pr (...args) {
  for (const arg of args) {
    console.log(util.inspect(arg, false, null, true))
  }

  return args
}
