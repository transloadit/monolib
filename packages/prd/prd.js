const pr = require('@transloadit/pr')

function areWeTestingWithJest () {
  return process.env.JEST_WORKER_ID !== undefined
}
module.exports = function prd (...args) {
  const ret      = pr(...args)
  const err      = new Error('Halt via prd')
  const exitCode = 1
  console.error(err)

  if (!areWeTestingWithJest) {
    process.exit(exitCode)
  } else {
    ret.push({ exitCode })
  }

  return ret
}
