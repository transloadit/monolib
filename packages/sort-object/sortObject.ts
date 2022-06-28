// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function sortObject (obj: any, sortFunc: any) {
  // yeah i know, sorting objects in js doesn't work :)
  return Object.keys(obj).sort(sortFunc).reduce((result, key) => {
    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    result[key] = obj[key]
    return result
  }, {})
}
