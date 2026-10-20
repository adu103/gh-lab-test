import type {
  NewServiceRequest,
  RequestPriority,
  RequestStatus,
  ServiceRequest,
} from '../types'

export type RequestFilters = {
  status?: RequestStatus
  priority?: RequestPriority
}

export const initialRequests: ServiceRequest[] = [
  {
    id: 1042,
    title: 'Unable to access the travel portal',
    description: 'The sign-in page returns an authorization error after MFA.',
    category: 'Access',
    status: 'Open',
    priority: 'High',
    submittedAt: '2026-10-14T13:20:00.000Z',
  },
  {
    id: 1041,
    title: 'Update office location',
    description: 'My profile still shows the previous duty station.',
    category: 'Profile',
    status: 'In progress',
    priority: 'Medium',
    submittedAt: '2026-10-13T16:45:00.000Z',
  },
  {
    id: 1040,
    title: 'Request access to analytics dashboard',
    description: 'Need read-only access for monthly program reporting.',
    category: 'Access',
    status: 'Open',
    priority: 'Low',
    submittedAt: '2026-10-12T09:10:00.000Z',
  },
  {
    id: 1039,
    title: 'Incorrect phone number in directory',
    description: 'The directory lists an old desk number.',
    category: 'Profile',
    status: 'Resolved',
    priority: 'Low',
    submittedAt: '2026-10-10T14:05:00.000Z',
  },
]

export function createRequest(
  input: NewServiceRequest,
  existingRequests: ServiceRequest[],
): ServiceRequest {
  const highestId = existingRequests.reduce(
    (current, request) => Math.max(current, request.id),
    1000,
  )

  return {
    ...input,
    id: highestId + 1,
    status: 'Open',
    submittedAt: new Date().toISOString(),
  }
}

export function filterRequests(
  requests: ServiceRequest[],
  filters: RequestFilters,
): ServiceRequest[] {
  return requests.filter(
    (request) =>
      (!filters.status || request.status === filters.status) &&
      (!filters.priority || request.priority === filters.priority),
  )
}

export function summarizeRequests(requests: ServiceRequest[]) {
  return {
    total: requests.length,
    open: requests.filter((request) => request.status === 'Open').length,
    inProgress: requests.filter((request) => request.status === 'In progress')
      .length,
    resolved: requests.filter((request) => request.status === 'Resolved').length,
  }
}
