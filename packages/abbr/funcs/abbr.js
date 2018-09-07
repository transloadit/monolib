module.exports = function abbr (str, maxLength = 55, divider = `[...]`) {
  if (str !== `${str}`) {
    return str
  }

  let abbreviated = str
  if (abbreviated.length > maxLength) {
    let firstLen = Math.ceil((maxLength - divider.length) / 2)
    let lastLen = Math.floor((maxLength - divider.length) / 2)
    abbreviated = `${abbreviated.substr(0, firstLen)}${divider}${abbreviated.substr(abbreviated.length - lastLen)}`
  }

  return abbreviated
}
