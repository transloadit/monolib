const sortObjectByPrio = require('@transloadit/sort-object-by-prio')
const sortResult = require('@transloadit/sort-result')

module.exports = function sortAssembly (assembly) {
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
