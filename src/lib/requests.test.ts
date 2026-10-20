import { describe, expect, it } from 'vitest'
import {
  createRequest,
  filterRequests,
  resolveRequest,
  summarizeRequests,
  type RequestFilters,
} from './requests'
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

  describe('resolving requests', () => {
    const queue: ServiceRequest[] = [
      ...requests,
      { ...requests[0], id: 1004, title: 'Another open request' },
    ].map((request) => Object.freeze({ ...request }))

    it.each(['Open', 'In progress'] as const)(
      'resolves an %s request without mutating it or changing other fields',
      (status) => {
        const original: ServiceRequest = Object.freeze({
          ...requests[0],
          status,
        })
        const resolved = resolveRequest(original)

        expect(resolved).toEqual({ ...original, status: 'Resolved' })
        expect(resolved).not.toBe(original)
        expect(original.status).toBe(status)
      },
    )

    it('leaves an already resolved request unchanged', () => {
      const original = queue[1]
      const before = { ...original }

      expect(resolveRequest(original)).toBe(original)
      expect(original).toEqual(before)
    })

    it('updates only the selected request, preserving order and other references', () => {
      const before = queue.map((request) => ({ ...request }))
      const updated = queue.map((request) =>
        request.id === 1001 ? resolveRequest(request) : request,
      )

      expect(updated).toEqual([
        { ...before[0], status: 'Resolved' },
        before[1],
        before[2],
        before[3],
      ])
      expect(updated).toHaveLength(queue.length)
      expect(updated.map((request) => request.id)).toEqual([1001, 1002, 1003, 1004])
      expect(updated[0]).not.toBe(queue[0])
      for (const index of [1, 2, 3]) {
        expect(updated[index]).toBe(queue[index])
      }
      expect(queue).toEqual(before)
    })

    it.each([
      { id: 1001, status: 'Open', open: 1, inProgress: 1 },
      { id: 1003, status: 'In progress', open: 2, inProgress: 0 },
    ])('updates summary counts when resolving $status', ({ id, open, inProgress }) => {
      expect(summarizeRequests(queue)).toEqual({
        total: 4,
        open: 2,
        inProgress: 1,
        resolved: 1,
      })

      const updated = queue.map((request) =>
        request.id === id ? resolveRequest(request) : request,
      )

      expect(summarizeRequests(updated)).toEqual({
        total: 4,
        open,
        inProgress,
        resolved: 2,
      })
    })

    const filterCases: {
      name: string
      id: number
      filters: RequestFilters
      before: number[]
      after: number[]
    }[] = [
      {
        name: 'unfiltered queue',
        id: 1001,
        filters: {},
        before: [1001, 1002, 1003, 1004],
        after: [1001, 1002, 1003, 1004],
      },
      {
        name: 'Open status',
        id: 1001,
        filters: { status: 'Open' },
        before: [1001, 1004],
        after: [1004],
      },
      {
        name: 'In progress status with the last match resolved',
        id: 1003,
        filters: { status: 'In progress' },
        before: [1003],
        after: [],
      },
      {
        name: 'Resolved status',
        id: 1001,
        filters: { status: 'Resolved' },
        before: [1002],
        after: [1001, 1002],
      },
      {
        name: 'priority only',
        id: 1001,
        filters: { priority: 'High' },
        before: [1001, 1004],
        after: [1001, 1004],
      },
      {
        name: 'combined active status and priority',
        id: 1001,
        filters: { status: 'Open', priority: 'High' },
        before: [1001, 1004],
        after: [1004],
      },
      {
        name: 'combined Resolved status and matching priority',
        id: 1001,
        filters: { status: 'Resolved', priority: 'High' },
        before: [],
        after: [1001],
      },
      {
        name: 'combined Resolved status and nonmatching priority',
        id: 1001,
        filters: { status: 'Resolved', priority: 'Low' },
        before: [1002],
        after: [1002],
      },
    ]

    it.each(filterCases)(
      'updates filtered results for $name without changing the total',
      ({ id, filters, before, after }) => {
        expect(filterRequests(queue, filters).map((request) => request.id)).toEqual(
          before,
        )
        const updated = queue.map((request) =>
          request.id === id ? resolveRequest(request) : request,
        )

        expect(
          filterRequests(updated, filters).map((request) => request.id),
        ).toEqual(after)
        expect(summarizeRequests(updated).total).toBe(4)
        expect(updated.find((request) => request.id === id)?.status).toBe('Resolved')
      },
    )

    it('keeps summary and filtered results unchanged on repeated resolution', () => {
      const resolved = queue.map(resolveRequest)
      const repeated = resolved.map(resolveRequest)

      expect(summarizeRequests(repeated)).toEqual({
        total: 4,
        open: 0,
        inProgress: 0,
        resolved: 4,
      })
      expect(summarizeRequests(repeated)).toEqual(summarizeRequests(resolved))
      for (const [index, request] of repeated.entries()) {
        expect(request).toBe(resolved[index])
      }
      expect(filterRequests(repeated, { status: 'Open' })).toEqual([])
      expect(filterRequests(repeated, { status: 'Resolved' })).toEqual(resolved)
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
