// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sortObject... Remove this comment to see the full error message
const sortObject = require('@transloadit/sort-object')

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function sortObjectByPrio (obj: any, prefixes: any) {
  return sortObject(obj, (a: any, b: any) => {
    for (const prefix in prefixes) {
      for (const i in prefixes[prefix]) {
        const matcher     = prefixes[prefix][i]
        // @ts-expect-error TS(2345): Argument of type 'string | number' is not assignab... Remove this comment to see the full error message
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
  });
}
