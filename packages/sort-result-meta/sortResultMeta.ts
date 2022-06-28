// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sortObject... Remove this comment to see the full error message
const sortObjectByPrio = require('@transloadit/sort-object-by-prio')

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function sortResultMeta (meta: any) {
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
