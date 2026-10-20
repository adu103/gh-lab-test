import { useMemo, useRef, useState, type FormEvent } from 'react'
import './App.css'
import {
  createRequest,
  filterRequests,
  initialRequests,
  resolveRequest,
  summarizeRequests,
} from './lib/requests'
import type {
  NewServiceRequest,
  RequestPriority,
  RequestStatus,
  ServiceRequest,
} from './types'

const emptyForm: NewServiceRequest = {
  title: '',
  description: '',
  category: 'Access',
  priority: 'Medium',
}

function App() {
  const [requests, setRequests] = useState(initialRequests)
  const [form, setForm] = useState<NewServiceRequest>(emptyForm)
  const [statusFilter, setStatusFilter] = useState<RequestStatus | ''>('')
  const [priorityFilter, setPriorityFilter] = useState<RequestPriority | ''>('')
  const [resolutionMessage, setResolutionMessage] = useState('')
  const queueHeadingRef = useRef<HTMLHeadingElement>(null)
  const summary = useMemo(() => summarizeRequests(requests), [requests])
  const visibleRequests = useMemo(
    () =>
      filterRequests(requests, {
        status: statusFilter || undefined,
        priority: priorityFilter || undefined,
      }),
    [requests, statusFilter, priorityFilter],
  )

  function submitRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setRequests((current) => [createRequest(form, current), ...current])
    setForm(emptyForm)
  }

  function handleResolve(request: ServiceRequest) {
    setRequests((current) =>
      current.map((item) =>
        item.id === request.id ? resolveRequest(item) : item,
      ),
    )
    setResolutionMessage(`Resolved request #${request.id}: ${request.title}.`)
    queueHeadingRef.current?.focus()
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-mark" aria-hidden="true">
          SR
        </div>
        <div>
          <p className="eyebrow">Service delivery workspace</p>
          <h1>Request tracker</h1>
        </div>
        <span className="environment">Training environment</span>
      </header>

      <main>
        <section className="intro">
          <div>
            <p className="eyebrow">Today&apos;s queue</p>
            <h2>Help people get unstuck</h2>
            <p>
              Track incoming requests, understand their urgency, and keep work
              moving.
            </p>
          </div>
          <button
            className="primary-button"
            type="button"
            onClick={() => document.querySelector<HTMLInputElement>('#title')?.focus()}
          >
            New request
          </button>
        </section>

        <section className="summary-grid" aria-label="Request summary">
          <SummaryCard label="All requests" value={summary.total} />
          <SummaryCard label="Open" value={summary.open} />
          <SummaryCard label="In progress" value={summary.inProgress} />
          <SummaryCard label="Resolved" value={summary.resolved} />
        </section>

        <div className="content-grid">
          <section className="panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Queue</p>
                <h2
                  className="queue-heading"
                  ref={queueHeadingRef}
                  tabIndex={-1}
                >
                  Service requests
                </h2>
              </div>
              <span className="count" aria-live="polite">
                {visibleRequests.length} of {requests.length} shown
              </span>
            </div>

            <div className="queue-filters">
              <div>
                <label htmlFor="status-filter">Filter by status</label>
                <select
                  id="status-filter"
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(event.target.value as RequestStatus | '')
                  }
                >
                  <option value="">All statuses</option>
                  <option>Open</option>
                  <option>In progress</option>
                  <option>Resolved</option>
                </select>
              </div>
              <div>
                <label htmlFor="priority-filter">Filter by priority</label>
                <select
                  id="priority-filter"
                  value={priorityFilter}
                  onChange={(event) =>
                    setPriorityFilter(
                      event.target.value as RequestPriority | '',
                    )
                  }
                >
                  <option value="">All priorities</option>
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>
            </div>

            <p className="resolution-message" role="status">
              {resolutionMessage}
            </p>

            <div className="request-list">
              {visibleRequests.map((request) => (
                <article className="request-card" key={request.id}>
                  <div className="request-card-top">
                    <span className={`priority priority-${request.priority.toLowerCase()}`}>
                      {request.priority}
                    </span>
                    <span className="request-id">#{request.id}</span>
                  </div>
                  <h3>{request.title}</h3>
                  <p>{request.description}</p>
                  <div className="request-meta">
                    <span>{request.category}</span>
                    <span>{request.status}</span>
                    <time dateTime={request.submittedAt}>
                      {new Intl.DateTimeFormat('en-US', {
                        month: 'short',
                        day: 'numeric',
                      }).format(new Date(request.submittedAt))}
                    </time>
                  </div>
                  {request.status !== 'Resolved' && (
                    <div className="request-actions">
                      <button
                        className="primary-button"
                        type="button"
                        aria-label={`Resolve request #${request.id}: ${request.title}`}
                        onClick={() => handleResolve(request)}
                      >
                        Resolve
                      </button>
                    </div>
                  )}
                </article>
              ))}
              {visibleRequests.length === 0 && (
                <p className="empty-state">
                  No requests match these filters. Try changing or clearing a
                  filter.
                </p>
              )}
            </div>
          </section>

          <aside className="panel form-panel">
            <p className="eyebrow">Add to the queue</p>
            <h2>New service request</h2>
            <form onSubmit={submitRequest}>
              <label htmlFor="title">Title</label>
              <input
                id="title"
                value={form.title}
                onChange={(event) =>
                  setForm({ ...form, title: event.target.value })
                }
                required
              />

              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={form.description}
                onChange={(event) =>
                  setForm({ ...form, description: event.target.value })
                }
                rows={4}
                required
              />

              <label htmlFor="category">Category</label>
              <select
                id="category"
                value={form.category}
                onChange={(event) =>
                  setForm({ ...form, category: event.target.value })
                }
              >
                <option>Access</option>
                <option>Profile</option>
                <option>Equipment</option>
                <option>Other</option>
              </select>

              <label htmlFor="priority">Priority</label>
              <select
                id="priority"
                value={form.priority}
                onChange={(event) =>
                  setForm({
                    ...form,
                    priority: event.target.value as RequestPriority,
                  })
                }
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>

              <button className="primary-button submit-button" type="submit">
                Submit request
              </button>
            </form>
          </aside>
        </div>
      </main>
    </div>
  )
}

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <article className="summary-card">
      <strong>{value}</strong>
      <span>{label}</span>
    </article>
  )
}

export default App
