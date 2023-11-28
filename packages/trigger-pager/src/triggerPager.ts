// eslint-disable-next-line @typescript-eslint/no-var-requires
const { api } = require('@pagerduty/pdjs')

const PRIORITY_P1 = 'PUTY3A1'
const DUPLICATE_INCIDENT_MESSAGE = 'matching dedup key already exists'

export type TriggerPagerOptions = {
  description: string
  from?: string
  incidentKey?: string
  serviceId?: string
  title: string
  token?: string
  urgency?: 'low' | 'high'
}

const triggerPager = async ({
  token,
  serviceId,
  incidentKey,
  urgency = 'high',
  from = 'tim.koschuetzki@transloadit.com',
  title = incidentKey,
  description,
}: TriggerPagerOptions): Promise<void> => {
  const res = await api({ token }).post('/incidents', {
    headers: {
      from,
    },
    data: {
      incident: {
        type: 'incident',
        incident_key: incidentKey,
        urgency,
        title: title.length >= 1024 ? `${title.substr(0, 1022)}…` : title,
        service: {
          type: 'service_reference',
          id: serviceId,
        },
        priority: {
          type: 'priority_reference',
          id: PRIORITY_P1,
        },
        body: {
          type: 'incident_body',
          details: description.substr(0, 1024), // no pager is sent otherwise
        },
      },
    },
  })

  if (res.data.error) {
    const msg = [res.data.error.message, (res.data.error.errors || []).join('; ')]
      .filter(Boolean)
      .join(' - ')
    if (!msg.includes(DUPLICATE_INCIDENT_MESSAGE)) {
      throw new Error(msg)
    }
  }
}

export default triggerPager
