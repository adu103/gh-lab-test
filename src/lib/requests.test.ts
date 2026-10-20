import { describe, expect, it } from 'vitest'
import { createRequest, filterRequests, summarizeRequests } from './requests'
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
  {
    id: 1003,
    title: 'Third request',
    description: 'Example',
    category: 'Equipment',
    status: 'In progress',
    priority: 'Medium',
    submittedAt: '2026-10-12T10:00:00.000Z',
  },
]

describe('request helpers', () => {
  it('summarizes requests by status', () => {
    expect(summarizeRequests(requests)).toEqual({
      total: 3,
      open: 1,
      inProgress: 1,
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
      id: 1004,
      title: 'New request',
      status: 'Open',
      priority: 'Medium',
    })
  })

  it('returns all requests when no filters are selected', () => {
    expect(filterRequests(requests, {})).toEqual(requests)
  })

  it.each(['Open', 'In progress', 'Resolved'] as const)(
    'filters requests by %s status',
    (status) => {
      expect(filterRequests(requests, { status })).toEqual(
        requests.filter((request) => request.status === status),
      )
    },
  )

  it('filters requests by each priority', () => {
    for (const priority of ['Low', 'Medium', 'High'] as const) {
      expect(filterRequests(requests, { priority })).toEqual(
        requests.filter((request) => request.priority === priority),
      )
    }
  })

  it('combines status and priority filters', () => {
    expect(
      filterRequests(requests, { status: 'Open', priority: 'High' }),
    ).toEqual([requests[0]])
  })

  it('returns no requests when a filter combination does not match', () => {
    expect(
      filterRequests(requests, { status: 'Resolved', priority: 'High' }),
    ).toEqual([])
  })
})
