import pr from '@transloadit/pr'

export default function prd(...args: $TSFixMe[]) {
  pr(...args)
  const err = new Error('Halt via prd')
  console.error(err)
  process.exit(1)
}
