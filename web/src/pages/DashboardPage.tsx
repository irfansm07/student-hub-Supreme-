import { useEffect, useState } from 'react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { BarChart3 } from 'lucide-react'
import { Card, FadeIn, Stat, EmptyState, Skeleton } from '../components/ui/Primitives'
import { GuidedPageHeader } from '../components/ui/GuidedPageHeader'
import { apiGet } from '../lib/api'

type Dash = {
  resumes: number
  analyses: number
  average_ats: number
  average_keyword: number
  recent_scores: { date: string; score: number }[]
  pipeline: Record<string, number>
}

const pipelineKeys = [
  ['total', 'Tracked roles'],
  ['applied', 'Applied'],
  ['interviewing', 'Interviewing'],
  ['offer', 'Offers'],
  ['rejected', 'Rejected'],
] as const

const pageSteps = [
  { title: 'Review scores', description: 'ATS & keyword trends' },
  { title: 'Check pipeline', description: 'Application stage breakdown' },
  { title: 'Improve', description: 'Use insights to get better' },
]

export function DashboardPage() {
  const [data, setData] = useState<Dash | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    apiGet<Dash>('/dashboard').then(setData).catch((err: unknown) => {
      setError(err instanceof Error ? err.message : 'Could not load dashboard.')
    })
  }, [])

  const chart = (data?.recent_scores || []).map((row, i) => ({
    name: row.date ? String(row.date).slice(5, 10) : `#${i + 1}`,
    score: row.score || 0,
  })).reverse()

  const hasScores = chart.length > 0
  const hasPipeline = (data?.pipeline?.total ?? 0) > 0
  const currentStep = hasPipeline ? 2 : hasScores ? 1 : 0

  return (
    <div>
      <GuidedPageHeader
        icon={BarChart3}
        kicker="Insights"
        title="A quiet view of your career progress"
        subtitle="ATS scores from resume reviews and the health of your application pipeline, all in one place. The more you use Aurelia, the richer this view becomes."
        color="#6366f1"
        gradient="linear-gradient(135deg, #6366f1, #8b5cf6)"
        steps={pageSteps}
        currentStep={currentStep}
      />

      {error ? <p style={{ color: 'var(--danger)' }}>{error}</p> : null}
      {!data && !error ? <Skeleton lines={6} /> : null}
      <div className="grid grid-4">
        <Stat value={data?.resumes ?? 0} label="Resumes stored" />
        <Stat value={data?.analyses ?? 0} label="Analyses run" />
        <Stat value={data?.average_ats ?? 0} label="Average ATS" />
        <Stat value={data?.average_keyword ?? 0} label="Keyword match" />
      </div>
      <div className="grid grid-2" style={{ marginTop: '1rem' }}>
        <FadeIn>
          <Card>
            <h3>Recent ATS scores</h3>
            {chart.length ? (
              <div style={{ height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chart}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Area type="monotone" dataKey="score" stroke="#4338ca" fill="#c7d2fe" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <EmptyState title="No analyses yet" copy="Run the Resume Analyzer once and the score trend will appear here." />
            )}
          </Card>
        </FadeIn>
        <FadeIn delay={0.08}>
          <Card>
            <h3>Pipeline</h3>
            {pipelineKeys.map(([key, label]) => (
              <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.55rem 0', borderBottom: '1px solid var(--line)' }}>
                <span>{label}</span>
                <strong>{data?.pipeline?.[key] ?? 0}</strong>
              </div>
            ))}
          </Card>
        </FadeIn>
      </div>
    </div>
  )
}
