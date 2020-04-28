
const sortObject = require('@transloadit/sort-object')

module.exports = function sortObjectByPrio (obj, prefixes) {
  return sortObject(obj, (a, b) => {
    for (const prefix in prefixes) {
      for (const i in prefixes[prefix]) {
        const matcher     = prefixes[prefix][i]
        const modifier    = parseInt((prefix === '_') ? prefixes[prefix].length - i : i, 10)
        const numOfPrefix = 3 + modifier
        const strPref     = new Array(numOfPrefix).join(prefix)

        if (matcher instanceof RegExp) {
          if (matcher.test(a)) {
            a = `${strPref}${a}`
          }
          if (matcher.test(b)) {
            b = `${strPref}${b}`
          }
        } else {
          if (a === matcher) {
            a = `${strPref}${a}`
          }
          if (b === matcher) {
            b = `${strPref}${b}`
          }
        }
      }
    }

    return a.localeCompare(b)
  })
}
