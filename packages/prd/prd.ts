const pr = require('@transloadit/pr')

module.exports = function prd (...args) {
  pr(...args)
  const err = new Error('Halt via prd')
  console.error(err)
  process.exit(1)
}
