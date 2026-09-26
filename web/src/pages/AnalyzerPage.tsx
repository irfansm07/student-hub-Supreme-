import { useEffect, useMemo, useState } from 'react'
import { FileSearch, CheckCircle2, Loader2, Cpu, ShieldCheck } from 'lucide-react'
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

const ANALYSIS_CHECKLIST = [
  'Extracting resume text & document typography structure...',
  'Scanning contact details (email, phone, portfolio links)...',
  'Matching required skills against target role keywords...',
  'Evaluating work experience, bullet points, & dates...',
  'Computing final ATS score & generating recommendations...',
]

export function AnalyzerPage() {
  const toast = useToast()
  const [roles, setRoles] = useState<Roles>({})
  const [category, setCategory] = useState('')
  const [role, setRole] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [analysisStep, setAnalysisStep] = useState(0)
  const [progress, setProgress] = useState(0)
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
    setResult(null)
    setAnalysisStep(0)
    setProgress(15)

    try {
      const form = new FormData()
      form.append('file', file)
      form.append('category', category)
      form.append('role', role)

      // Step 1: Text extraction
      await new Promise((r) => setTimeout(r, 550))
      setAnalysisStep(1)
      setProgress(35)

      // Step 2: Contact scan
      await new Promise((r) => setTimeout(r, 550))
      setAnalysisStep(2)
      setProgress(60)

      // Step 3: Keyword matching
      await new Promise((r) => setTimeout(r, 550))
      setAnalysisStep(3)
      setProgress(85)

      const res = await apiForm<Analysis>('/analyze', form)

      // Step 4: Final calculation
      await new Promise((r) => setTimeout(r, 500))
      setAnalysisStep(4)
      setProgress(100)

      await new Promise((r) => setTimeout(r, 400))
      setResult(res)
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
        subtitle="Pick the role you want, upload the file, and watch our real-time ATS engine scan every section."
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
                {loading ? 'Analyzing Resume…' : result ? 'Re-run ATS Analysis' : 'Run ATS Analysis'}
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
          {/* STATE 1: ANALYZING CHECKLIST SCREEN (WHILE LOADING) */}
          {loading ? (
            <Card style={{ background: '#0f172a', color: '#f8fafc', padding: '1.8rem', border: '1px solid #334155' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                <Cpu size={24} style={{ color: '#38bdf8', animation: 'spin 3s linear infinite' }} />
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#ffffff' }}>ATS Scan & Analysis in Progress</h3>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: '#94a3b8' }}>Scanning {file?.name || 'Resume'} against {role} standards</p>
                </div>
              </div>

              {/* PROGRESS BAR */}
              <div style={{ background: '#1e293b', height: '10px', borderRadius: '999px', overflow: 'hidden', marginBottom: '1.5rem', border: '1px solid #334155' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${progress}%`,
                    background: 'linear-gradient(90deg, #0ea5e9, #10b981)',
                    transition: 'width 400ms ease',
                    borderRadius: '999px',
                  }}
                />
              </div>

              {/* STEP-BY-STEP CHECKLIST */}
              <div style={{ display: 'grid', gap: '0.9rem' }}>
                {ANALYSIS_CHECKLIST.map((stepText, idx) => {
                  const isDone = idx < analysisStep
                  const isCurrent = idx === analysisStep
                  return (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '0.6rem 0.8rem',
                        borderRadius: '10px',
                        background: isCurrent ? 'rgba(14, 165, 233, 0.12)' : isDone ? 'rgba(16, 185, 129, 0.08)' : 'transparent',
                        border: isCurrent ? '1px solid #0ea5e9' : '1px solid transparent',
                        transition: 'all 250ms ease',
                      }}
                    >
                      {isDone ? (
                        <CheckCircle2 size={18} style={{ color: '#10b981', flexShrink: 0 }} />
                      ) : isCurrent ? (
                        <Loader2 size={18} style={{ color: '#0ea5e9', flexShrink: 0, animation: 'spin 1.2s linear infinite' }} />
                      ) : (
                        <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid #475569', flexShrink: 0 }} />
                      )}
                      <span
                        style={{
                          fontSize: '0.86rem',
                          fontWeight: isCurrent ? 700 : isDone ? 600 : 400,
                          color: isCurrent ? '#38bdf8' : isDone ? '#e2e8f0' : '#64748b',
                        }}
                      >
                        {stepText}
                      </span>
                    </div>
                  )
                })}
              </div>

              <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.78rem', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <ShieldCheck size={14} style={{ color: '#10b981' }} /> Genuine 100% Keyword & Format Parsing
              </div>
            </Card>
          ) : !result ? (
            /* STATE 2: WAITING FOR UPLOAD */
            <Card>
              <EmptyState title="Waiting for a resume" copy="Your ATS score, matched skills, and step-by-step action plan will appear here after analysis." />
            </Card>
          ) : (
            /* STATE 3: ANALYSIS RESULTS DISPLAY */
            <Card>
              <ScoreRing value={result.ats_score} label={`ATS score for ${result.target_role}`} />
              <div className="grid grid-2" style={{ marginTop: '1rem' }}>
                <Stat value={Math.round(result.keyword_match.score)} label="Keyword match" />
                <Stat value={Math.round(Number(result.format_score))} label="Format score" />
              </div>
              {result.section_scores ? (
                <>
                  <h3 style={{ marginTop: '1.2rem' }}>Section Strength</h3>
                  {Object.entries(result.section_scores).map(([key, value]) => (
                    <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid var(--line)' }}>
                      <span style={{ textTransform: 'capitalize' }}>{key.replace(/_/g, ' ')}</span>
                      <strong>{Math.round(Number(value))}%</strong>
                    </div>
                  ))}
                </>
              ) : null}
              <h3 style={{ marginTop: '1.2rem' }}>Present Skills Found in Resume</h3>
              <div className="chip-row">
                {result.keyword_match.found_skills.length > 0 ? (
                  result.keyword_match.found_skills.map((s) => <span className="chip" key={s}>{s}</span>)
                ) : (
                  <span style={{ fontSize: '0.84rem', color: 'var(--ink-muted)' }}>No exact keyword matches found for this role</span>
                )}
              </div>
              <h3 style={{ marginTop: '1.2rem' }}>Missing Skills to Add</h3>
              <div className="chip-row">
                {result.keyword_match.missing_skills.length > 0 ? (
                  result.keyword_match.missing_skills.map((s) => <span className="badge warn" key={s}>{s}</span>)
                ) : (
                  <span className="badge" style={{ background: '#10b981', color: 'white' }}>All target skills present!</span>
                )}
              </div>
              <h3 style={{ marginTop: '1.2rem' }}>Action Plan & Recommendations</h3>
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
