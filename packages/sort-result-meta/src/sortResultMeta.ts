import sortObjectByPrio from '@transloadit/sort-object-by-prio'
import { hasProperty } from '@transloadit/has-property'

type Meta = {
  faces?: Record<string, unknown>
}

function isObject(obj: unknown): obj is Record<string, unknown> {
  return (
    typeof obj === 'object' && obj !== null && Object.keys(obj).every((x) => typeof x === 'string')
  )
}

export default function sortResultMeta<T extends Meta>(meta: T): T {
  if (meta.faces) {
    for (const key of Object.keys(meta.faces)) {
      if (!hasProperty(meta.faces, key)) continue

      const obj = meta.faces[key]
      if (!isObject(obj)) continue

      meta.faces[key] = sortObjectByPrio(obj, {
        _: [],
        z: ['x1', 'y1', 'x2', 'y2'],
      })
    }
  }

  return sortObjectByPrio(meta, {
    _: [],
    z: [],
  })
}
