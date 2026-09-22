import { useEffect, useState } from 'react'
import { KanbanSquare } from 'lucide-react'
import { Card, FadeIn, Button, Field, Stat, EmptyState } from '../components/ui/Primitives'
import { GuidedPageHeader } from '../components/ui/GuidedPageHeader'
import { apiGet, apiSend } from '../lib/api'
import { useToast } from '../context/ToastContext'

const STAGES = ['Saved', 'Applied', 'Interviewing', 'Offer', 'Rejected'] as const

type Job = {
  id: number
  company: string
  role_title: string
  stage: string
  location: string
  workplace_type: string
  salary: string
  priority: string
  notes: string
}

type Tracker = {
  applications: Job[]
  metrics: Record<string, number>
}

const blank = {
  company: '',
  role_title: '',
  location: '',
  workplace_type: 'Remote',
  salary: '',
  stage: 'Saved',
  priority: 'Medium',
  notes: '',
}

const pageSteps = [
  { title: 'Add a role', description: 'Company, title, details' },
  { title: 'Track stages', description: 'Saved → Applied → Offer' },
  { title: 'Monitor stats', description: 'Interview rate & pipeline' },
]

export function TrackerPage() {
  const toast = useToast()
  const [data, setData] = useState<Tracker | null>(null)
  const [form, setForm] = useState(blank)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)

  async function load() {
    setData(await apiGet<Tracker>('/tracker'))
  }

  useEffect(() => {
    load().catch((err: unknown) => setError(err instanceof Error ? err.message : 'Could not load tracker.'))
  }, [])

  async function addJob() {
    try {
      await apiSend('/tracker', 'POST', form)
      setForm(blank)
      setShowForm(false)
      await load()
      toast.push('Role added to the pipeline.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not add role.')
    }
  }

  async function move(id: number, stage: string) {
    await apiSend(`/tracker/${id}`, 'PATCH', { stage })
    await load()
  }

  async function remove(id: number) {
    await apiSend(`/tracker/${id}`, 'DELETE')
    await load()
    toast.push('Role removed.')
  }

  const metrics = data?.metrics || {}
  const hasRoles = !!data?.applications.length
  const currentStep = hasRoles && (metrics.applied ?? 0) > 0 ? 2 : hasRoles ? 1 : 0

  return (
    <div>
      <GuidedPageHeader
        icon={KanbanSquare}
        kicker="Career"
        title="Keep every application in one pipeline"
        subtitle="Add a role once, then move it from saved to offer. Your metrics update automatically from your real data."
        color="#10b981"
        gradient="linear-gradient(135deg, #10b981, #059669)"
        steps={pageSteps}
        currentStep={currentStep}
      />

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
        <Button onClick={() => setShowForm((v) => !v)}>{showForm ? 'Close form' : 'Add a role'}</Button>
      </div>

      <div className="grid grid-5" style={{ marginBottom: '1rem' }}>
        <Stat value={metrics.total ?? 0} label="Total roles" />
        <Stat value={metrics.applied ?? 0} label="Applied" />
        <Stat value={metrics.interviewing ?? 0} label="Interviewing" />
        <Stat value={metrics.offer ?? 0} label="Offers" />
        <Stat value={`${metrics.interview_rate ?? 0}%`} label="Interview rate" />
      </div>

      {showForm ? (
        <FadeIn>
          <Card>
            <h3>Add a role</h3>
            <div className="grid grid-3">
              <Field label="Company"><input className="input" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} /></Field>
              <Field label="Role"><input className="input" value={form.role_title} onChange={(e) => setForm({ ...form, role_title: e.target.value })} /></Field>
              <Field label="Location"><input className="input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></Field>
              <Field label="Workplace">
                <select className="input" value={form.workplace_type} onChange={(e) => setForm({ ...form, workplace_type: e.target.value })}>
                  <option>Remote</option>
                  <option>Hybrid</option>
                  <option>On-site</option>
                </select>
              </Field>
              <Field label="Salary"><input className="input" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} /></Field>
              <Field label="Priority">
                <select className="input" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </Field>
            </div>
            <Field label="Notes">
              <textarea className="input" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </Field>
            {error ? <p style={{ color: 'var(--danger)' }}>{error}</p> : null}
            <Button style={{ marginTop: '0.8rem' }} onClick={() => void addJob()}>Track this role</Button>
          </Card>
        </FadeIn>
      ) : null}

      {!data?.applications.length ? (
        <Card style={{ marginTop: '1rem' }}>
          <EmptyState title="Your board is empty" copy="Add the first internship or job. Then drag cards across Saved, Applied, Interviewing, Offer, and Rejected." />
        </Card>
      ) : (
        <div className="kanban" style={{ marginTop: '1rem' }}>
          {STAGES.map((stage) => (
            <div
              key={stage}
              className="kanban-col"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                const id = Number(e.dataTransfer.getData('id'))
                if (id) void move(id, stage)
              }}
            >
              <h4>
                {stage}
                <span className="badge">{data.applications.filter((j) => j.stage === stage).length}</span>
              </h4>
              {data.applications.filter((j) => j.stage === stage).map((job) => (
                <div
                  key={job.id}
                  className="job-card"
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData('id', String(job.id))}
                >
                  <h5>{job.role_title}</h5>
                  <p>{job.company}</p>
                  <p>{[job.location, job.workplace_type, job.salary].filter(Boolean).join(' · ')}</p>
                  <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.5rem' }}>
                    <select className="input" value={job.stage} onChange={(e) => void move(job.id, e.target.value)}>
                      {STAGES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                    <button className="btn ghost" onClick={() => void remove(job.id)}>Remove</button>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
