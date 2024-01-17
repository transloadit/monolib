import sortObjectByPrio = require('@transloadit/sort-object-by-prio')

type Meta = {
  faces?: Record<string, unknown>[]
}

function isObject(obj: unknown): obj is Record<string, unknown> {
  return (
    typeof obj === 'object' && obj !== null && Object.keys(obj).every((x) => typeof x === 'string')
  )
}

export = function sortResultMeta<T extends Meta>(meta: T): T {
  if (meta.faces) {
    for (let i = 0; i < meta.faces.length; i++) {
      const el = meta.faces[i]
      if (!isObject(el)) continue
      if (!meta.faces) continue

      meta.faces[i] = sortObjectByPrio(el, {
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
