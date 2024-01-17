import sortObjectByPrio = require('@transloadit/sort-object-by-prio')
import sortResultMeta = require('@transloadit/sort-result-meta')

export = function sortResult<T extends { meta?: unknown }>(result: T): T {
  const sorted = sortObjectByPrio(result, {
    _: ['id'],
    z: ['meta'],
  })

  if (sorted.meta && typeof sorted.meta === 'object') {
    sorted.meta = sortResultMeta(sorted.meta)
  }

  return sorted
}
