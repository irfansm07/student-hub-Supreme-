import { useMemo, useState } from 'react'
import { Plus, FileText } from 'lucide-react'
import { Card, FadeIn, Button, Field } from '../components/ui/Primitives'
import { GuidedPageHeader } from '../components/ui/GuidedPageHeader'
import { apiDownload } from '../lib/api'
import { useToast } from '../context/ToastContext'

const empty = {
  template: 'Modern',
  personal_info: {
    full_name: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    portfolio: '',
  },
  summary: '',
  experience: [{ company: '', position: '', start_date: '', end_date: '', description: '', responsibilities: '' }],
  education: [{ school: '', degree: '', field: '', graduation_date: '', gpa: '' }],
  projects: [{ name: '', technologies: '', description: '', link: '' }],
  skills: { technical: '', soft: '', languages: '', tools: '' },
}

const tabs = ['Profile', 'Experience', 'Education', 'Projects', 'Skills'] as const

function splitList(value: string) {
  return value.split('\n').map((s) => s.trim()).filter(Boolean)
}

const pageSteps = [
  { title: 'Fill profile', description: 'Name, email, headline' },
  { title: 'Add experience', description: 'Work history & projects' },
  { title: 'Download resume', description: 'Get your Word file' },
]

export function BuilderPage() {
  const toast = useToast()
  const [form, setForm] = useState(empty)
  const [tab, setTab] = useState<(typeof tabs)[number]>('Profile')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const person = form.personal_info

  const hasProfile = !!(person.full_name && person.email)
  const hasExperience = form.experience.some((e) => e.position || e.company) || form.education.some((e) => e.school)
  const currentStep = hasExperience ? 2 : hasProfile ? 1 : 0

  const payload = useMemo(() => ({
    ...form,
    experience: form.experience.map((e) => ({
      ...e,
      responsibilities: splitList(e.responsibilities),
    })),
    skills: {
      technical: splitList(form.skills.technical),
      soft: splitList(form.skills.soft),
      languages: splitList(form.skills.languages),
      tools: splitList(form.skills.tools),
    },
  }), [form])

  async function download() {
    setError('')
    setLoading(true)
    try {
      await apiDownload('/builder', payload, `${person.full_name || 'resume'}.docx`)
      toast.push('Resume downloaded.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not generate resume.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <GuidedPageHeader
        icon={FileText}
        kicker="Career"
        title="Build a clean, ATS-friendly resume"
        subtitle="Fill one section at a time. The live preview stays on the right so you always know how the document reads. Download as Word when ready."
        color="#0ea5e9"
        gradient="linear-gradient(135deg, #0ea5e9, #06b6d4)"
        steps={pageSteps}
        currentStep={currentStep}
      />

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
        <Button onClick={() => void download()} disabled={loading}>
          {loading ? 'Preparing file…' : 'Download Word'}
        </Button>
      </div>

      <div className="grid grid-2">
        <FadeIn>
          <Card>
            <div className="tabs">
              {tabs.map((item) => (
                <button key={item} className={item === tab ? 'tab on' : 'tab'} onClick={() => setTab(item)}>{item}</button>
              ))}
            </div>

            {tab === 'Profile' ? (
              <div className="grid">
                <Field label="Template">
                  <select className="input" value={form.template} onChange={(e) => setForm({ ...form, template: e.target.value })}>
                    <option>Modern</option>
                    <option>Professional</option>
                    <option>Minimal</option>
                    <option>Creative</option>
                  </select>
                </Field>
                <div className="grid grid-2">
                  {([
                    ['full_name', 'Full name'],
                    ['title', 'Headline'],
                    ['email', 'Email'],
                    ['phone', 'Phone'],
                    ['location', 'Location'],
                    ['linkedin', 'LinkedIn'],
                    ['portfolio', 'Portfolio'],
                  ] as const).map(([key, label]) => (
                    <Field key={key} label={label}>
                      <input className="input" value={person[key]} onChange={(e) => setForm({
                        ...form,
                        personal_info: { ...person, [key]: e.target.value },
                      })} />
                    </Field>
                  ))}
                </div>
                <Field label="Professional summary">
                  <textarea className="input" value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} />
                </Field>
              </div>
            ) : null}

            {tab === 'Experience' ? (
              <div className="grid">
                {form.experience.map((exp, i) => (
                  <div key={i} className="grid" style={{ gap: '0.55rem' }}>
                    <div className="grid grid-2">
                      <input className="input" placeholder="Role" value={exp.position} onChange={(e) => {
                        const experience = [...form.experience]
                        experience[i] = { ...exp, position: e.target.value }
                        setForm({ ...form, experience })
                      }} />
                      <input className="input" placeholder="Company" value={exp.company} onChange={(e) => {
                        const experience = [...form.experience]
                        experience[i] = { ...exp, company: e.target.value }
                        setForm({ ...form, experience })
                      }} />
                    </div>
                    <div className="grid grid-2">
                      <input className="input" placeholder="Start" value={exp.start_date} onChange={(e) => {
                        const experience = [...form.experience]
                        experience[i] = { ...exp, start_date: e.target.value }
                        setForm({ ...form, experience })
                      }} />
                      <input className="input" placeholder="End" value={exp.end_date} onChange={(e) => {
                        const experience = [...form.experience]
                        experience[i] = { ...exp, end_date: e.target.value }
                        setForm({ ...form, experience })
                      }} />
                    </div>
                    <textarea className="input" placeholder="Responsibilities, one per line" value={exp.responsibilities} onChange={(e) => {
                      const experience = [...form.experience]
                      experience[i] = { ...exp, responsibilities: e.target.value }
                      setForm({ ...form, experience })
                    }} />
                  </div>
                ))}
                <Button variant="secondary" onClick={() => setForm({
                  ...form,
                  experience: [...form.experience, { company: '', position: '', start_date: '', end_date: '', description: '', responsibilities: '' }],
                })}>
                  <Plus size={16} /> Add role
                </Button>
              </div>
            ) : null}

            {tab === 'Education' ? (
              <div className="grid">
                {form.education.map((ed, i) => (
                  <div key={i} className="grid grid-2">
                    <input className="input" placeholder="School" value={ed.school} onChange={(e) => {
                      const education = [...form.education]
                      education[i] = { ...ed, school: e.target.value }
                      setForm({ ...form, education })
                    }} />
                    <input className="input" placeholder="Degree" value={ed.degree} onChange={(e) => {
                      const education = [...form.education]
                      education[i] = { ...ed, degree: e.target.value }
                      setForm({ ...form, education })
                    }} />
                    <input className="input" placeholder="Field" value={ed.field} onChange={(e) => {
                      const education = [...form.education]
                      education[i] = { ...ed, field: e.target.value }
                      setForm({ ...form, education })
                    }} />
                    <input className="input" placeholder="Graduation" value={ed.graduation_date} onChange={(e) => {
                      const education = [...form.education]
                      education[i] = { ...ed, graduation_date: e.target.value }
                      setForm({ ...form, education })
                    }} />
                  </div>
                ))}
                <Button variant="secondary" onClick={() => setForm({
                  ...form,
                  education: [...form.education, { school: '', degree: '', field: '', graduation_date: '', gpa: '' }],
                })}>
                  <Plus size={16} /> Add school
                </Button>
              </div>
            ) : null}

            {tab === 'Projects' ? (
              <div className="grid">
                {form.projects.map((project, i) => (
                  <div key={i} className="grid">
                    <input className="input" placeholder="Project name" value={project.name} onChange={(e) => {
                      const projects = [...form.projects]
                      projects[i] = { ...project, name: e.target.value }
                      setForm({ ...form, projects })
                    }} />
                    <input className="input" placeholder="Technologies" value={project.technologies} onChange={(e) => {
                      const projects = [...form.projects]
                      projects[i] = { ...project, technologies: e.target.value }
                      setForm({ ...form, projects })
                    }} />
                    <textarea className="input" placeholder="What you built" value={project.description} onChange={(e) => {
                      const projects = [...form.projects]
                      projects[i] = { ...project, description: e.target.value }
                      setForm({ ...form, projects })
                    }} />
                  </div>
                ))}
                <Button variant="secondary" onClick={() => setForm({
                  ...form,
                  projects: [...form.projects, { name: '', technologies: '', description: '', link: '' }],
                })}>
                  <Plus size={16} /> Add project
                </Button>
              </div>
            ) : null}

            {tab === 'Skills' ? (
              <div className="grid grid-2">
                <Field label="Technical">
                  <textarea className="input" placeholder="One per line" value={form.skills.technical} onChange={(e) => setForm({ ...form, skills: { ...form.skills, technical: e.target.value } })} />
                </Field>
                <Field label="Tools">
                  <textarea className="input" placeholder="One per line" value={form.skills.tools} onChange={(e) => setForm({ ...form, skills: { ...form.skills, tools: e.target.value } })} />
                </Field>
                <Field label="Languages">
                  <textarea className="input" placeholder="One per line" value={form.skills.languages} onChange={(e) => setForm({ ...form, skills: { ...form.skills, languages: e.target.value } })} />
                </Field>
                <Field label="Soft skills">
                  <textarea className="input" placeholder="One per line" value={form.skills.soft} onChange={(e) => setForm({ ...form, skills: { ...form.skills, soft: e.target.value } })} />
                </Field>
              </div>
            ) : null}

            {error ? <p style={{ color: 'var(--danger)' }}>{error}</p> : null}
          </Card>
        </FadeIn>
        <FadeIn delay={0.08}>
          <div className="preview">
            <h3>{person.full_name || 'Your name'}</h3>
            <p>{person.title || 'Target role'}</p>
            <p style={{ fontSize: '0.9rem', color: '#555' }}>
              {[person.email, person.phone, person.location].filter(Boolean).join(' · ')}
            </p>
            <div className="rule" />
            <p>{form.summary || 'A short professional summary will appear here.'}</p>
            <h4>Experience</h4>
            {form.experience.map((exp, i) => (
              <div key={i}>
                <strong>{exp.position || 'Role'}</strong> · {exp.company || 'Company'}
                <ul>
                  {splitList(exp.responsibilities).map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
            ))}
            <h4>Education</h4>
            {form.education.map((ed, i) => (
              <p key={i}><strong>{ed.school || 'School'}</strong> · {ed.degree} {ed.field}</p>
            ))}
            <h4>Projects</h4>
            {form.projects.map((p, i) => (
              <p key={i}><strong>{p.name || 'Project'}</strong> — {p.description}</p>
            ))}
            <h4>Skills</h4>
            <p>{splitList(form.skills.technical).join(' · ') || 'Add skills in the Skills tab.'}</p>
          </div>
        </FadeIn>
      </div>
    </div>
  )
}
