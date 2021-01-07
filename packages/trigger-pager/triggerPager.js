'use strict'

const { api } = require('pdjs')
const assert = require('assert')

const triggerPager = async ({
  incidentKey,
  description,
  pd = api({
    token  : process.env.PAGERDUTY_SERVICE_KEY,
    headers: {
      from: 'billing@transloadit.com',
    },
  }),
} = {}) => {
  assert(incidentKey, '.incidentKey required')
  assert(description, '.description required')

  const incident = {
    type        : 'incident',
    title       : incidentKey,
    incident_key: incidentKey,
    service     : {
      type: 'service_reference',
      id  : 'PTCUYKZ', // https://transloadit.pagerduty.com/services/PTCUYKZ
    },
    priority: {
      type: 'priority_reference',
      id  : 'PUTY3A1', // P1
    },
    body: {
      type   : 'incident_body',
      // PagerDuty only allows 1024 chars max
      details: description.substr(0, 1024),
    },
  }

  let res
  try {
    res = await pd.post('/incidents', { data: { incident } })
  } catch (err) {
    if (err.message.includes('Open incident with matching dedup key already exists on this service')) {
      return
    }
    throw err
  }

  let leadErr
  if (res && res.body && res.body.error) {
    leadErr = res.body.error.message
  }
  let errs = ''
  if (res && res.body && res.body.error && res.body.error.errors) {
    errs = res.body.error.errors.join('; ')
  }
  if (leadErr || errs) {
    console.error(`${leadErr} - ${errs}`)
    if (errs.includes('Open incident with matching dedup key already exists on this service')) {
      return
    }
    throw new Error(`${leadErr} - ${errs}`)
  }
}

module.exports = triggerPager
