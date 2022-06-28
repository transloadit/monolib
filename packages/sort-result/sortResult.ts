// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sortObject... Remove this comment to see the full error message
const sortObjectByPrio = require('@transloadit/sort-object-by-prio')
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sortResult... Remove this comment to see the full error message
const sortResultMeta = require('@transloadit/sort-result-meta')

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function sortResult (result: any) {
  const sorted = sortObjectByPrio(result, {
    _: [
      'id',
    ],
    z: [
      'meta',
    ],
  })

  if ('meta' in sorted) {
    sorted.meta = sortResultMeta(sorted.meta)
  }

  return sorted
}
