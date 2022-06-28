const sortObjectByPrio = require('@transloadit/sort-object-by-prio')
const sortResultMeta = require('@transloadit/sort-result-meta')

export default function sortResult (result: any) {
  const sorted = sortObjectByPrio(result, {
    _: [
      'id',
    ],
    z: [
      'meta',
    ],
  })

  if ('meta' in sorted) {
    sorted.meta = sortResultMeta(sorted.meta)
  }

  return sorted
}
