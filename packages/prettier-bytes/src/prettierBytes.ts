// Adapted from https://github.com/Flet/prettier-bytes/
// Changing 1000 bytes to 1024, so we can keep uppercase KB vs kB
// ISC License (c) Dan Flettre https://github.com/Flet/prettier-bytes/blob/master/LICENSE

const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'] as const

export type Unit = (typeof units)[number]

export function prettierBytes(input: number, unit?: Unit): string {
  if (typeof input !== 'number' || Number.isNaN(input)) {
    throw new TypeError(`Expected a number, got ${typeof input}`)
  }

  const neg = input < 0
  let num = Math.abs(input)

  if (neg) {
    num = -num
  }

  if (num === 0) {
    return '0 B'
  }

  const exponent = unit
    ? units.indexOf(unit)
    : Math.min(Math.floor(Math.log(num) / Math.log(1024)), units.length - 1)
  const value = Number(num / 1024 ** exponent)
  const displayUnit = units[exponent]

  // For GB and larger units, show 2 decimals if not whole, otherwise round
  if (exponent >= 3) {
    return value % 1 === 0
      ? `${Math.round(value)} ${displayUnit}`
      : `${value.toFixed(2)} ${displayUnit}`
  }

  // For B, KB, MB: show 1 decimal if < 10 and not whole, otherwise round
  return `${value >= 10 || value % 1 === 0 ? Math.round(value) : value.toFixed(1)} ${displayUnit}`
}
