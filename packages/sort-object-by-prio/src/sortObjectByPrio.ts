import sortObject from '@transloadit/sort-object'

type Prefixes = {
  [prefix: string]: Array<string | RegExp>
}

export default function sortObjectByPrio(obj: $TSFixMe, prefixes: Prefixes) {
  return sortObject(obj, (argA: string, argB: string) => {
    let a = argA
    let b = argB
    for (const [prefix, items] of Object.entries(prefixes)) {
      let i = 0
      for (const matcher of items) {
        const modifier = parseInt(String(prefix === '_' ? prefixes[prefix].length - i : i), 10)
        const numOfPrefix = 3 + modifier
        const strPref = new Array(numOfPrefix).join(prefix)

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
        i++
      }
    }

    return a.localeCompare(b)
  })
}
