import * as util from 'util'

export default function pr (...args: $TSFixMe[]) {
  for (const arg of args) {
    console.log(util.inspect(arg, false, null, true))
  }

  return args
}
