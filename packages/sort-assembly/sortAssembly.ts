// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sortObject... Remove this comment to see the full error message
const sortObjectByPrio = require('@transloadit/sort-object-by-prio')
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sortResult... Remove this comment to see the full error message
const sortResult = require('@transloadit/sort-result')

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function sortAssembly (assembly: any) {
  const sorted = sortObjectByPrio(assembly, {
    _: [
      'assembly_id',
      'ok',
      'message',
      'warnings',
      'error',
    ],
    z: [
      'uploads',
      'results',
    ],
  })

  if ('results' in sorted) {
    for (const stepName in sorted.results) {
      for (const i in sorted.results[stepName]) {
        sorted.results[stepName][i] = sortResult(sorted.results[stepName][i])
      }
    }
  }

  if ('uploads' in sorted) {
    for (const i in sorted.uploads) {
      sorted.uploads[i] = sortResult(sorted.uploads[i])
    }
  }

  return sorted
}
