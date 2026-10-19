export type RequestStatus = 'Open' | 'In progress' | 'Resolved'

export type RequestPriority = 'Low' | 'Medium' | 'High'

export type ServiceRequest = {
  id: number
  title: string
  description: string
  category: string
  status: RequestStatus
  priority: RequestPriority
  submittedAt: string
}

export type NewServiceRequest = Pick<
  ServiceRequest,
  'title' | 'description' | 'category' | 'priority'
>
