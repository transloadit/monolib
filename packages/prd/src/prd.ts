import { pr } from '@transloadit/pr'

export function prd<T>(...args: T[]): void {
  pr(...args)
  const err = new Error('Halt via prd')
  console.error(err)
  process.exit(1)
}
