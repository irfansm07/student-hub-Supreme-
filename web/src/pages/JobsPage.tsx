import { useEffect, useState } from 'react'
import { ExternalLink, Search } from 'lucide-react'
import { Card, FadeIn, Button, Field, EmptyState } from '../components/ui/Primitives'
import { GuidedPageHeader } from '../components/ui/GuidedPageHeader'
import { apiGet, apiSend } from '../lib/api'
import { useToast } from '../context/ToastContext'

type Meta = {
  suggestions: { text: string }[]
  locations: { text: string }[]
  companies: { name: string; description: string; careers_url: string; categories: string[]; color?: string }[]
  insights: {
    trending_skills?: { name: string; growth: string }[]
    top_locations?: { name: string; jobs: string }[]
    salary_insights?: { role: string; range: string; experience?: string }[]
  }
}

type SearchResult = { portal: string; title: string; url: string; color: string }

const pageSteps = [
  { title: 'Enter criteria', description: 'Role, location, experience' },
  { title: 'Open portals', description: 'Browse matching listings' },
  { title: 'Save & track', description: 'Add to your pipeline' },
]

export function JobsPage() {
  const toast = useToast()
  const [meta, setMeta] = useState<Meta | null>(null)
  const [title, setTitle] = useState('Software Engineer')
  const [location, setLocation] = useState('Bangalore')
  const [experience, setExperience] = useState('all')
  const [results, setResults] = useState<SearchResult[]>([])
  const [error, setError] = useState('')

  const currentStep = results.length ? 2 : title && location ? 1 : 0

  useEffect(() => {
    apiGet<Meta>('/jobs/meta').then(setMeta).catch((err: unknown) => {
      setError(err instanceof Error ? err.message : 'Could not load job data.')
    })
  }, [])

  async function search() {
    try {
      const data = await apiSend<{ results: SearchResult[] }>('/jobs/search', 'POST', {
        title,
        location,
        experience_id: experience,
      })
      setResults(data.results)
      toast.push('Portal links are ready.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed.')
    }
  }

  return (
    <div>
      <GuidedPageHeader
        icon={Search}
        kicker="Career"
        title="Search internships and jobs in one place"
        subtitle="Start from a role and city. Aurelia opens the right listings across LinkedIn, Naukri, Indeed, and more — all from one search."
        color="#10b981"
        gradient="linear-gradient(135deg, #10b981, #059669)"
        steps={pageSteps}
        currentStep={currentStep}
      />

      <FadeIn>
        <Card>
          <div className="grid grid-3">
            <Field label="Role">
              <input className="input" list="roles" value={title} onChange={(e) => setTitle(e.target.value)} />
              <datalist id="roles">
                {meta?.suggestions.map((s) => <option key={s.text} value={s.text} />)}
              </datalist>
            </Field>
            <Field label="Location">
              <input className="input" list="cities" value={location} onChange={(e) => setLocation(e.target.value)} />
              <datalist id="cities">
                {meta?.locations.map((s) => <option key={s.text} value={s.text} />)}
              </datalist>
            </Field>
            <Field label="Experience">
              <select className="input" value={experience} onChange={(e) => setExperience(e.target.value)}>
                <option value="all">All levels</option>
                <option value="fresher">Fresher</option>
                <option value="0-1">0-1 years</option>
                <option value="1-3">1-3 years</option>
                <option value="3-5">3-5 years</option>
              </select>
            </Field>
          </div>
          {error ? <p style={{ color: 'var(--danger)' }}>{error}</p> : null}
          <Button style={{ marginTop: '0.9rem' }} onClick={() => void search()}>Open portal results</Button>
        </Card>
      </FadeIn>

      <div className="grid grid-3" style={{ marginTop: '1rem' }}>
        {results.map((r) => (
          <a key={r.portal} className="card tool-card" href={r.url} target="_blank" rel="noreferrer">
            <span className="kicker">{r.portal}</span>
            <h3>{r.title}</h3>
            <span className="card-cta">Open listings <ExternalLink size={14} /></span>
          </a>
        ))}
      </div>
      {!results.length ? (
        <Card style={{ marginTop: '1rem' }}>
          <EmptyState title="No portals opened yet" copy="Choose a role and city, then open listings. Results appear as cards you can jump to." />
        </Card>
      ) : null}

      <div className="section-title"><h3>Market snapshot</h3></div>
      <div className="grid grid-3">
        <Card>
          <h3>Trending skills</h3>
          {(meta?.insights.trending_skills || []).slice(0, 6).map((s) => (
            <div key={s.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.45rem 0', borderBottom: '1px solid var(--line)' }}>
              <span>{s.name}</span>
              <span className="badge ok">{s.growth}</span>
            </div>
          ))}
        </Card>
        <Card>
          <h3>Top locations</h3>
          {(meta?.insights.top_locations || []).slice(0, 6).map((s) => (
            <div key={s.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.45rem 0', borderBottom: '1px solid var(--line)' }}>
              <span>{s.name}</span>
              <strong>{s.jobs}</strong>
            </div>
          ))}
        </Card>
        <Card>
          <h3>Salary ranges</h3>
          {(meta?.insights.salary_insights || []).slice(0, 6).map((s) => (
            <div key={s.role} style={{ display: 'flex', justifyContent: 'space-between', gap: '0.6rem', padding: '0.45rem 0', borderBottom: '1px solid var(--line)' }}>
              <span>{s.role}</span>
              <strong>{s.range}</strong>
            </div>
          ))}
        </Card>
      </div>

      <div className="section-title"><h3>Featured companies</h3></div>
      <div className="grid grid-3">
        {(meta?.companies || []).slice(0, 9).map((c) => (
          <a key={c.name} className="card tool-card" href={c.careers_url} target="_blank" rel="noreferrer">
            <h3>{c.name}</h3>
            <p className="soft">{c.description}</p>
            <div className="chip-row">
              {c.categories.slice(0, 3).map((cat) => <span className="chip" key={cat}>{cat}</span>)}
            </div>
            <span className="card-cta">Careers page <ExternalLink size={14} /></span>
          </a>
        ))}
      </div>
    </div>
  )
}
