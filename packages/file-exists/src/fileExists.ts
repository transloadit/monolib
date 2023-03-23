import fs from 'fs'

export default function fileExists(s: $TSFixMe) {
  // eslint-disable-next-line no-unused-vars
  return new Promise((resolve, reject) => {
    // @ts-expect-error
    fs.access(s, fs.F_OK, (err: $TSFixMe) => {
      resolve(!err)
    })
  })
}
