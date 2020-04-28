const sortObjectByPrio = require('@transloadit/sort-object-by-prio')

module.exports = function sortResultMeta (meta) {
  return sortObjectByPrio(meta, {
    _: [
    ],
    z: [
    ],
  })
}
