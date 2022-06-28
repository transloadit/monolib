const sortObject = require('@transloadit/sort-object')

export default function sortObjectByPrio (obj: any, prefixes: any) {
  return sortObject(obj, (a: any, b: any) => {
    for (const prefix in prefixes) {
      for (const i in prefixes[prefix]) {
        const matcher     = prefixes[prefix][i]
        const modifier    = parseInt(String((prefix === '_') ? prefixes[prefix].length - Number(i) : i), 10)
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
