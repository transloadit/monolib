import sortObjectByPrio from '@transloadit/sort-object-by-prio'
import sortResult from '@transloadit/sort-result'
import { hasProperty } from '@transloadit/has-property'

export default function sortAssembly<T extends Record<string, unknown>>(assembly: T): T {
  const sorted = sortObjectByPrio(assembly, {
    _: ['assembly_id', 'ok', 'message', 'warnings', 'error'],
    z: ['uploads', 'results'],
  })

  if ('results' in sorted && typeof sorted.results === 'object') {
    for (const stepName of Object.keys(sorted.results)) {
      if (!hasProperty(sorted.results, stepName)) continue
      const result = sorted.results[stepName]
      for (const i of Object.keys(result)) {
        if (!hasProperty(result, i)) continue
        result[i] = sortResult(result[i])
      }
    }
  }

  if ('uploads' in sorted) {
    for (const i of Object.keys(sorted.uploads)) {
      if (!hasProperty(sorted.uploads, i)) continue
      sorted.uploads[i] = sortResult(sorted.uploads[i])
    }
  }

  return sorted
}
