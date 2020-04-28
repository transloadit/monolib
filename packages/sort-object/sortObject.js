module.exports = function sortObject (obj, sortFunc) {
  // yeah i know, sorting objects in js doesn't work :)
  return Object.keys(obj).sort(sortFunc).reduce(function (result, key) {
    result[key] = obj[key]
    return result
  }, {})
}
