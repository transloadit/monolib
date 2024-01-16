import util = require('util')

export = function pr<T>(...args: T[]): T[] {
  for (const arg of args) {
    console.log(util.inspect(arg, false, null, true))
  }

  return args
}
