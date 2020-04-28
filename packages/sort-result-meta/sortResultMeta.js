const sortObjectByPrio = require('@transloadit/sort-object-by-prio')

module.exports = function sortResultMeta (meta) {
  if ('faces' in meta) {
    for (const i in meta.faces) {
      meta.faces[i] = sortObjectByPrio(meta.faces[i], {
        _: [
        ],
        z: [
          'x1',
          'y1',
          'x2',
          'y2',
        ],
      })
    }
  }

  return sortObjectByPrio(meta, {
    _: [
    ],
    z: [
    ],
  })
}
