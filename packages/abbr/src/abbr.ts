export function abbr(str: string, maxLength = 55, divider = `[...]`): string {
  if (str !== `${str}`) {
    return str
  }

  let abbreviated = str
  if (abbreviated.length > maxLength) {
    const firstLen = Math.ceil((maxLength - divider.length) / 2)
    const lastLen = Math.floor((maxLength - divider.length) / 2)
    abbreviated = `${abbreviated.slice(0, firstLen)}${divider}${abbreviated.slice(-lastLen)}`
  }

  return abbreviated
}
