import { describe, expect, it } from 'vitest'
import { createRequest, summarizeRequests } from './requests'
import type { ServiceRequest } from '../types'

const requests: ServiceRequest[] = [
  {
    id: 1001,
    title: 'First request',
    description: 'Example',
    category: 'Access',
    status: 'Open',
    priority: 'High',
    submittedAt: '2026-10-10T10:00:00.000Z',
  },
  {
    id: 1002,
    title: 'Second request',
    description: 'Example',
    category: 'Profile',
    status: 'Resolved',
    priority: 'Low',
    submittedAt: '2026-10-11T10:00:00.000Z',
  },
]

describe('request helpers', () => {
  it('summarizes requests by status', () => {
    expect(summarizeRequests(requests)).toEqual({
      total: 2,
      open: 1,
      inProgress: 0,
      resolved: 1,
    })
  })

  it('creates an open request with the next id', () => {
    const request = createRequest(
      {
        title: 'New request',
        description: 'Needs attention',
        category: 'Other',
        priority: 'Medium',
      },
      requests,
    )

    expect(request).toMatchObject({
      id: 1003,
      title: 'New request',
      status: 'Open',
      priority: 'Medium',
    })
  })
})
