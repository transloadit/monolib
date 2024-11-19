import fs from 'node:fs'

export function fileExists(path: string): Promise<boolean> {
  return new Promise((resolve) => {
    fs.access(path, fs.constants.F_OK, (err) => {
      resolve(!err)
    })
  })
}
