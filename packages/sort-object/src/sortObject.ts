export default function sortObject (obj: $TSFixMe, sortFunc?: $TSFixMe) {
  // yeah i know, sorting objects in js doesn't work :)
  return Object.keys(obj).sort(sortFunc).reduce((result: $TSFixMe, key) => {
    result[key] = obj[key]
    return result
  }, {})
}
