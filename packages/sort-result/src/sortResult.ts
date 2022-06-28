import sortObjectByPrio from '@transloadit/sort-object-by-prio'
import sortResultMeta from '@transloadit/sort-result-meta'

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
