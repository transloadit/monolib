import { hasProperty } from '@transloadit/has-property'
import { sortObjectByPrio } from '@transloadit/sort-object-by-prio'
import { sortResult } from '@transloadit/sort-result'

export function sortAssembly<T extends Record<string, unknown>>(assembly: T): T {
  const sorted = sortObjectByPrio(assembly, {
    _: ['assembly_id', 'ok', 'message', 'warnings', 'error'],
    z: ['uploads', 'results'],
  })

  if (sorted.results && typeof sorted.results === 'object') {
    for (const stepName of Object.keys(sorted.results)) {
      if (!hasProperty(sorted.results, stepName)) continue
      const result = sorted.results[stepName]
      if (!result || typeof result !== 'object') continue
      for (const i of Object.keys(result)) {
        if (!hasProperty(result, i)) continue
        const value = result[i]
        if (!value || typeof value !== 'object') continue
        result[i] = sortResult(value)
      }
    }
  }

  if (sorted.uploads) {
    for (const i of Object.keys(sorted.uploads)) {
      if (!hasProperty(sorted.uploads, i)) continue
      const upload = sorted.uploads[i]
      if (!upload || typeof upload !== 'object') continue
      sorted.uploads[i] = sortResult(upload)
    }
  }

  return sorted
}
