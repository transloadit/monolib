export default function sortObject (obj: any, sortFunc?: any) {
  // yeah i know, sorting objects in js doesn't work :)
  return Object.keys(obj).sort(sortFunc).reduce((result: any, key) => {
    result[key] = obj[key]
    return result
  }, {})
}
