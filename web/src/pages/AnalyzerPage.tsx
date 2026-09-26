import { useEffect, useMemo, useState } from 'react'
import { FileSearch } from 'lucide-react'
import { Card, FadeIn, Button, Field, Dropzone, ScoreRing, EmptyState, Stat } from '../components/ui/Primitives'
import { GuidedPageHeader } from '../components/ui/GuidedPageHeader'
import { apiForm, apiGet } from '../lib/api'
import { useToast } from '../context/ToastContext'

type Roles = Record<string, Record<string, { description: string; required_skills: string[] }>>

type Analysis = {
  ats_score: number
  document_type: string
  keyword_match: { score: number; found_skills: string[]; missing_skills: string[] }
  format_score: number
  suggestions: string[]
  required_skills: string[]
  target_role: string
  skills?: string[]
  section_scores?: Record<string, number>
}

const pageSteps = [
  { title: 'Choose role', description: 'Pick your target industry & role' },
  { title: 'Upload resume', description: 'Upload PDF or Word file' },
  { title: 'Action plan', description: 'See score & improvements' },
]

export function AnalyzerPage() {
  const toast = useToast()
  const [roles, setRoles] = useState<Roles>({})
  const [category, setCategory] = useState('')
  const [role, setRole] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<Analysis | null>(null)

  useEffect(() => {
    apiGet<{ roles: Roles }>('/roles').then((data) => {
      setRoles(data.roles)
      const firstCat = Object.keys(data.roles)[0]
      setCategory(firstCat)
      setRole(Object.keys(data.roles[firstCat])[0])
    }).catch((err: unknown) => setError(err instanceof Error ? err.message : 'Could not load roles.'))
  }, [])

  const roleInfo = useMemo(() => (category && role ? roles[category]?.[role] : null), [roles, category, role])
  const roleNames = category ? Object.keys(roles[category] || {}) : []
  const currentStep = result ? 2 : file ? 1 : 0

  async function run() {
    if (!file) {
      setError('Upload a PDF or Word resume first.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      form.append('category', category)
      form.append('role', role)
      setResult(await apiForm<Analysis>('/analyze', form))
      toast.push('ATS analysis complete.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <GuidedPageHeader
        icon={FileSearch}
        kicker="Career"
        title="See how an ATS would read your resume"
        subtitle="Pick the role you want, upload the file, and get a score with missing skills and a short action plan."
        color="#0ea5e9"
        gradient="linear-gradient(135deg, #0ea5e9, #06b6d4)"
        steps={pageSteps}
        currentStep={currentStep}
      />

      <div className="grid grid-2">
        <FadeIn>
          <Card>
            <div className="grid grid-2">
              <Field label="Industry">
                <select
                  className="input"
                  value={category}
                  onChange={(e) => {
                    const newCat = e.target.value
                    setCategory(newCat)
                    setRole(Object.keys(roles[newCat] || {})[0] || '')
                    setResult(null)
                    setError('')
                  }}
                >
                  {Object.keys(roles).map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </Field>
              <Field label="Role">
                <select
                  className="input"
                  value={role}
                  onChange={(e) => {
                    setRole(e.target.value)
                    setResult(null)
                    setError('')
                  }}
                >
                  {roleNames.map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </Field>
            </div>
            {roleInfo ? <p className="soft" style={{ marginTop: '0.8rem' }}>{roleInfo.description}</p> : null}
            <div className="chip-row" style={{ margin: '0.8rem 0' }}>
              {roleInfo?.required_skills.map((s) => <span className="chip" key={s}>{s}</span>)}
            </div>
            <Dropzone
              file={file}
              hint="Upload resume (PDF or DOCX)"
              accept=".pdf,.docx,.doc"
              onFile={(newFile) => {
                setFile(newFile)
                setResult(null)
                setError('')
              }}
            />
            {error ? <p style={{ color: 'var(--danger)', marginTop: '0.6rem' }}>{error}</p> : null}
            <div style={{ display: 'flex', gap: '0.6rem', marginTop: '1rem' }}>
              <Button onClick={() => void run()} disabled={loading}>
                {loading ? 'Analyzing…' : result ? 'Re-run ATS Analysis' : 'Run ATS Analysis'}
              </Button>
              {result && (
                <Button
                  variant="secondary"
                  onClick={() => {
                    setFile(null)
                    setResult(null)
                    setError('')
                  }}
                >
                  Upload Different Resume
                </Button>
              )}
            </div>
          </Card>
        </FadeIn>

        <FadeIn delay={0.08}>
          {!result ? (
            <Card>
              <EmptyState title="Waiting for a resume" copy="Your ATS score, matched skills, and next steps will appear here after analysis." />
            </Card>
          ) : (
            <Card>
              <ScoreRing value={result.ats_score} label={`ATS score for ${result.target_role}`} />
              <div className="grid grid-2" style={{ marginTop: '1rem' }}>
                <Stat value={Math.round(result.keyword_match.score)} label="Keyword match" />
                <Stat value={Math.round(Number(result.format_score))} label="Format score" />
              </div>
              {result.section_scores ? (
                <>
                  <h3>Section strength</h3>
                  {Object.entries(result.section_scores).map(([key, value]) => (
                    <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid var(--line)' }}>
                      <span>{key.replace(/_/g, ' ')}</span>
                      <strong>{Math.round(Number(value))}</strong>
                    </div>
                  ))}
                </>
              ) : null}
              <h3>Present skills</h3>
              <div className="chip-row">
                {result.keyword_match.found_skills.map((s) => <span className="chip" key={s}>{s}</span>)}
              </div>
              <h3>Missing skills</h3>
              <div className="chip-row">
                {result.keyword_match.missing_skills.map((s) => <span className="badge warn" key={s}>{s}</span>)}
              </div>
              <h3>Next steps</h3>
              <ul>
                {result.suggestions.map((s) => <li key={s}>{s}</li>)}
              </ul>
            </Card>
          )}
        </FadeIn>
      </div>
    </div>
  )
}
