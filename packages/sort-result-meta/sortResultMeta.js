const sortObjectByPrio = require('../sort-object-by-prio')

module.exports = function sortResultMeta (meta) {
  return sortObjectByPrio(meta, {
    _: [
    ],
    z: [
    ],
  })
}
