import { api as pagerdutyApi } from '@pagerduty/pdjs'

export interface PagerdutyApiResponse {
  data: {
    error?: {
      errors?: string[]
      message?: string
    } | null
  }
}

export type PagerdutyApi = (params: { token?: string }) => {
  post(endpoint: string, payload: unknown): Promise<PagerdutyApiResponse>
}

const PRIORITY_P1 = 'PUTY3A1'
const DUPLICATE_INCIDENT_MESSAGE = 'matching dedup key already exists'

export interface TriggerPagerOptions {
  description: string
  from?: string
  incidentKey?: string
  serviceId?: string
  title?: string
  token?: string
  urgency?: 'low' | 'high'
}

export type TriggerPager = (options: TriggerPagerOptions) => Promise<void>

export function createTriggerPager(api: PagerdutyApi = pagerdutyApi): TriggerPager {
  return async function triggerPagerWithApi({
    description,
    from = 'tim.koschuetzki@transloadit.com',
    incidentKey,
    serviceId,
    title,
    token,
    urgency = 'high',
  }: TriggerPagerOptions): Promise<void> {
    const incidentTitle = title ?? incidentKey ?? ''
    const res = await api({ token }).post('/incidents', {
      headers: {
        from,
      },
      data: {
        incident: {
          type: 'incident',
          incident_key: incidentKey,
          urgency,
          title: incidentTitle.length >= 1024 ? `${incidentTitle.slice(0, 1022)}…` : incidentTitle,
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
            details: description.slice(0, 1024), // no pager is sent otherwise
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
}

export const triggerPager = createTriggerPager()
