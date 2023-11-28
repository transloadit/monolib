import { hasProperty } from '@transloadit/has-property'
import sortObjectByPrio from '@transloadit/sort-object-by-prio'
import sortResultMeta from '@transloadit/sort-result-meta'

export default function sortResult<T extends { meta?: unknown }>(result: T): T {
  const sorted = sortObjectByPrio(result, {
    _: ['id'],
    z: ['meta'],
  })

  if (hasProperty(sorted, 'meta')) {
    sorted.meta = sortResultMeta(sorted.meta)
  }

  return sorted
}
