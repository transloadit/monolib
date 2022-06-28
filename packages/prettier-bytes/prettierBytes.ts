// Adapted from https://github.com/Flet/prettier-bytes/
// Changing 1000 bytes to 1024, so we can keep uppercase KB vs kB
// ISC License (c) Dan Flettre https://github.com/Flet/prettier-bytes/blob/master/LICENSE
// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function prettierBytes (num: any) {
  if (typeof num !== 'number' || isNaN(num)) {
    throw new TypeError(`Expected a number, got ${typeof num}`)
  }

  const neg = num < 0
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  if (neg) {
    num = -num
  }

  if (num < 1) {
    return `${(neg ? '-' : '') + num} B`
  }

  const exponent = Math.min(Math.floor(Math.log(num) / Math.log(1024)), units.length - 1)
  num = Number(num / Math.pow(1024, exponent))
  const unit = units[exponent]

  if (num >= 10 || num % 1 === 0) {
    // Do not show decimals when the number is two-digit, or if the number has no
    // decimal component.
    return `${(neg ? '-' : '') + num.toFixed(0)} ${unit}`
  }
  return `${(neg ? '-' : '') + num.toFixed(1)} ${unit}`
}
