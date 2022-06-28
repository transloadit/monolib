// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function abbr (str: any, maxLength = 55, divider = `[...]`) {
  if (str !== `${str}`) {
    return str
  }

  let abbreviated = str
  if (abbreviated.length > maxLength) {
    const firstLen = Math.ceil((maxLength - divider.length) / 2)
    const lastLen = Math.floor((maxLength - divider.length) / 2)
    abbreviated = `${abbreviated.substr(0, firstLen)}${divider}${abbreviated.substr(abbreviated.length - lastLen)}`
  }

  return abbreviated
}
