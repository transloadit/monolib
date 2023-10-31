import sortObjectByPrio from '@transloadit/sort-object-by-prio'

type Meta = {
  faces?: Record<string, unknown>
}

export default function sortResultMeta<T extends Meta>(meta: T): T {
  if ('faces' in meta) {
    for (const i in meta.faces) {
      meta.faces[i] = sortObjectByPrio(meta.faces[i], {
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
