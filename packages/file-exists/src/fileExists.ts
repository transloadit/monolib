import fs from 'fs'

export default function fileExists (s: any) {
  // eslint-disable-next-line no-unused-vars
  return new Promise((resolve, reject) => {
    // @ts-expect-error
    fs.access(s, fs.F_OK, (err: any) => {
      resolve(!err)
    })
  })
}
