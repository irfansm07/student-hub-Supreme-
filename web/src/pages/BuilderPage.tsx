import { useMemo, useState } from 'react'
import { Plus, FileText, Check, Sparkles, Target, Layers } from 'lucide-react'
import { Card, FadeIn, Button, Field } from '../components/ui/Primitives'
import { GuidedPageHeader } from '../components/ui/GuidedPageHeader'
import { apiDownload } from '../lib/api'
import { useToast } from '../context/ToastContext'

export interface ResumeTemplateOption {
  id: 'Modern' | 'Professional' | 'Minimal' | 'Creative'
  name: string
  score: number
  badge: string
  bestFor: string
  description: string
  accentColor: string
  fontFamily: string
}

export const TEMPLATE_OPTIONS: ResumeTemplateOption[] = [
  {
    id: 'Modern',
    name: 'Modern ATS Clean',
    score: 98,
    badge: '98 ATS Score',
    bestFor: 'Tech, Software & Data Science',
    description: 'Clean single-column structure with crisp blue accents, high contrast section headers, and standard bullet formatting.',
    accentColor: '#0284c7',
    fontFamily: 'Arial, sans-serif',
  },
  {
    id: 'Professional',
    name: 'Executive Corporate ATS',
    score: 96,
    badge: '96 ATS Score',
    bestFor: 'Finance, Product & Corporate Roles',
    description: 'Classic Calibri formatting with bold section dividers, left-aligned header, and executive spacing for maximum ATS parser compliance.',
    accentColor: '#0369a1',
    fontFamily: 'Calibri, sans-serif',
  },
  {
    id: 'Minimal',
    name: 'Minimalist High-Impact',
    score: 95,
    badge: '95 ATS Score',
    bestFor: 'Entry Level, Academic & Engineering',
    description: 'Dark charcoal typography, clean uppercase headers with generous letter spacing, and high-density content layout.',
    accentColor: '#1e293b',
    fontFamily: 'Helvetica, sans-serif',
  },
  {
    id: 'Creative',
    name: 'Tech Innovator Bold',
    score: 92,
    badge: '92 ATS Score',
    bestFor: 'Design, Product & Modern Startups',
    description: 'Vibrant indigo/violet accent headings, stylish skill badges, and modern visual emphasis without breaking ATS scanners.',
    accentColor: '#7c3aed',
    fontFamily: '"Plus Jakarta Sans", sans-serif',
  },
]

const SAMPLE_PROFILE = {
  template: 'Modern',
  personal_info: {
    full_name: 'Alex Rivers',
    title: 'Senior Full Stack Software Engineer',
    email: 'alex.rivers@university.edu',
    phone: '+1 (555) 234-5678',
    location: 'Bangalore, India (Open to Remote)',
    linkedin: 'linkedin.com/in/alex-rivers-dev',
    portfolio: 'alexrivers.dev',
  },
  summary: 'Results-driven Full Stack Engineer with 3+ years of experience building high-performance web applications using React, TypeScript, Python, and FastAPI. Spearheaded microservice backend optimizations reducing latency by 35% across 100K+ active monthly users.',
  experience: [
    {
      company: 'Apex Tech Solutions',
      position: 'Software Engineering Fellow',
      start_date: 'Jun 2024',
      end_date: 'Present',
      description: 'Architected scalable frontend components and RESTful microservices.',
      responsibilities: 'Architected full-stack features using React, TypeScript, and FastAPI serving 50K+ daily requests.\nOptimized SQL queries and Redis caching, cutting page load times by 42%.\nMentored 4 junior developers and led weekly code reviews following strict CI/CD guidelines.',
    },
    {
      company: 'CloudPulse Labs',
      position: 'Frontend Developer Intern',
      start_date: 'Jan 2024',
      end_date: 'May 2024',
      description: 'Built interactive student analytics dashboard.',
      responsibilities: 'Built responsive UI component library using React, Tailwind CSS, and Recharts.\nIntegrated OAuth2 authentication and state management via Redux Toolkit.',
    }
  ],
  education: [
    {
      school: 'Institute of Technology & Science',
      degree: 'Bachelor of Technology',
      field: 'Computer Science & Artificial Intelligence',
      graduation_date: 'May 2025',
      gpa: '3.9 / 4.0',
    }
  ],
  projects: [
    {
      name: 'Aurelia Student Hub Studio',
      technologies: 'React, TypeScript, FastAPI, Python, SQLite, Vite',
      description: 'Built an AI-powered academic summarizer and resume ATS analyzer platform.',
      link: 'github.com/alexrivers/student-hub',
    },
    {
      name: 'Realtime Code Reviewer AI',
      technologies: 'Node.js, Express, OpenAI API, WebSockets',
      description: 'Created automated GitHub pull request reviewer delivering feedback in under 5 seconds.',
      link: 'github.com/alexrivers/ai-reviewer',
    }
  ],
  skills: {
    technical: 'React\nTypeScript\nJavaScript (ES6+)\nPython\nFastAPI\nNode.js\nPostgreSQL\nDocker',
    tools: 'Git\nVS Code\nPostman\nDocker\nAWS EC2\nFigma\nVercel',
    languages: 'English (Fluent)\nHindi (Native)',
    soft: 'Technical Leadership\nAgile Development\nProblem Solving\nCross-functional Collaboration',
  }
}

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

const tabs = ['Templates', 'Profile', 'Experience', 'Education', 'Projects', 'Skills'] as const

function splitList(value: string) {
  return value.split('\n').map((s) => s.trim()).filter(Boolean)
}

const pageSteps = [
  { title: 'Choose template', description: 'High ATS score layout' },
  { title: 'Fill details', description: 'Experience & skills' },
  { title: 'Download resume', description: 'Export Word / Text' },
]

export function BuilderPage() {
  const toast = useToast()
  const [form, setForm] = useState(empty)
  const [tab, setTab] = useState<(typeof tabs)[number]>('Templates')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const person = form.personal_info
  const selectedTemplate = TEMPLATE_OPTIONS.find((t) => t.id === form.template) || TEMPLATE_OPTIONS[0]

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

  const handleFillSample = () => {
    setForm(SAMPLE_PROFILE)
    toast.push('High-ATS Sample Profile loaded! Select any template to preview.')
  }

  async function download() {
    if (!person.full_name) {
      toast.push('Please enter your full name before downloading.')
      setTab('Profile')
      return
    }
    setError('')
    setLoading(true)
    try {
      await apiDownload('/builder', payload, `${person.full_name.replace(/\s+/g, '_')}_Resume.docx`)
      toast.push(`Resume downloaded using ${selectedTemplate.name}!`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not generate resume file.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <GuidedPageHeader
        icon={FileText}
        kicker="Career Studio"
        title="ATS-Friendly Resume Builder"
        subtitle="Select a high-ATS score template, fill in your experience, and watch your resume build live. Download an ATS-formatted document instantly."
        color="#0ea5e9"
        gradient="linear-gradient(135deg, #0ea5e9, #06b6d4)"
        steps={pageSteps}
        currentStep={currentStep}
      />

      {/* Top Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', gap: '0.8rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
          <Button variant="secondary" onClick={handleFillSample}>
            <Sparkles size={16} style={{ color: '#0ea5e9' }} /> Auto-Fill High-ATS Sample Data
          </Button>
          <span style={{ fontSize: '0.85rem', color: 'var(--ink-muted)' }}>
            Selected: <strong style={{ color: selectedTemplate.accentColor }}>{selectedTemplate.name}</strong> ({selectedTemplate.badge})
          </span>
        </div>
        <Button onClick={() => void download()} disabled={loading}>
          {loading ? 'Generating Resume…' : 'Download Resume File'}
        </Button>
      </div>

      <div className="grid grid-2" style={{ gridTemplateColumns: '1.1fr 0.9fr', gap: '1.2rem' }}>
        <FadeIn>
          <Card style={{ padding: '1.2rem' }}>
            <div className="tabs">
              {tabs.map((item) => (
                <button
                  key={item}
                  className={item === tab ? 'tab on' : 'tab'}
                  onClick={() => setTab(item)}
                >
                  {item === 'Templates' && <Layers size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />}
                  {item}
                </button>
              ))}
            </div>

            {/* TAB 1: TEMPLATES */}
            {tab === 'Templates' ? (
              <div className="grid" style={{ gap: '0.9rem' }}>
                <div style={{ marginBottom: '0.4rem' }}>
                  <h3 style={{ margin: '0 0 0.3rem', fontSize: '1.15rem' }}>Select High-ATS Resume Template</h3>
                  <p style={{ margin: 0, fontSize: '0.86rem', color: 'var(--ink-soft)' }}>
                    All templates are engineered to pass Automated Applicant Tracking Systems (ATS) with 90%+ parse accuracy.
                  </p>
                </div>

                <div className="grid grid-2" style={{ gap: '0.85rem' }}>
                  {TEMPLATE_OPTIONS.map((tmpl) => {
                    const isSelected = form.template === tmpl.id
                    return (
                      <div
                        key={tmpl.id}
                        onClick={() => setForm({ ...form, template: tmpl.id })}
                        style={{
                          padding: '1rem',
                          borderRadius: '16px',
                          border: isSelected
                            ? `2px solid ${tmpl.accentColor}`
                            : '1px solid var(--line)',
                          background: isSelected
                            ? `color-mix(in srgb, ${tmpl.accentColor} 8%, var(--bg-elevated))`
                            : 'var(--bg-elevated)',
                          cursor: 'pointer',
                          transition: 'all 200ms ease',
                          boxShadow: isSelected ? `0 6px 20px color-mix(in srgb, ${tmpl.accentColor} 20%, transparent)` : 'none',
                          position: 'relative',
                        }}
                      >
                        {isSelected && (
                          <div
                            style={{
                              position: 'absolute',
                              top: '10px',
                              right: '10px',
                              width: '22px',
                              height: '22px',
                              borderRadius: '50%',
                              background: tmpl.accentColor,
                              color: 'white',
                              display: 'grid',
                              placeItems: 'center',
                            }}
                          >
                            <Check size={14} />
                          </div>
                        )}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
                          <span
                            style={{
                              padding: '0.2rem 0.55rem',
                              borderRadius: '999px',
                              background: 'color-mix(in srgb, #10b981 14%, transparent)',
                              color: '#059669',
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '3px',
                            }}
                          >
                            <Target size={12} /> {tmpl.badge}
                          </span>
                        </div>

                        <h4 style={{ margin: '0 0 0.25rem', fontSize: '1.02rem', color: isSelected ? tmpl.accentColor : 'inherit' }}>
                          {tmpl.name}
                        </h4>
                        <p style={{ margin: '0 0 0.5rem', fontSize: '0.76rem', color: 'var(--ink-muted)', fontWeight: 600 }}>
                          Best for: {tmpl.bestFor}
                        </p>
                        <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--ink-soft)', lineHeight: 1.45 }}>
                          {tmpl.description}
                        </p>
                      </div>
                    )
                  })}
                </div>

                <div style={{ marginTop: '0.6rem', textAlign: 'right' }}>
                  <Button variant="secondary" onClick={() => setTab('Profile')}>
                    Next: Fill Profile Details →
                  </Button>
                </div>
              </div>
            ) : null}

            {/* TAB 2: PROFILE */}
            {tab === 'Profile' ? (
              <div className="grid">
                <Field label="Active Template">
                  <select
                    className="input"
                    value={form.template}
                    onChange={(e) => setForm({ ...form, template: e.target.value as any })}
                  >
                    {TEMPLATE_OPTIONS.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.badge})
                      </option>
                    ))}
                  </select>
                </Field>

                <div className="grid grid-2">
                  {([
                    ['full_name', 'Full Name *'],
                    ['title', 'Professional Headline'],
                    ['email', 'Email Address *'],
                    ['phone', 'Phone Number'],
                    ['location', 'Location (City, Country)'],
                    ['linkedin', 'LinkedIn URL'],
                    ['portfolio', 'Portfolio / GitHub URL'],
                  ] as const).map(([key, label]) => (
                    <Field key={key} label={label}>
                      <input
                        className="input"
                        placeholder={label.replace(' *', '')}
                        value={person[key]}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            personal_info: { ...person, [key]: e.target.value },
                          })
                        }
                      />
                    </Field>
                  ))}
                </div>

                <Field label="Professional Summary (ATS High-Impact Overview)">
                  <textarea
                    className="input"
                    rows={4}
                    placeholder="Concise 3-4 sentence overview highlighting your core expertise, total years of experience, key technical stack, and top quantitative achievement..."
                    value={form.summary}
                    onChange={(e) => setForm({ ...form, summary: e.target.value })}
                  />
                </Field>

                <div style={{ textAlign: 'right' }}>
                  <Button variant="secondary" onClick={() => setTab('Experience')}>
                    Next: Add Work Experience →
                  </Button>
                </div>
              </div>
            ) : null}

            {/* TAB 3: EXPERIENCE */}
            {tab === 'Experience' ? (
              <div className="grid">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ margin: 0 }}>Work Experience & Roles</h4>
                  <Button
                    variant="secondary"
                    onClick={() =>
                      setForm({
                        ...form,
                        experience: [
                          ...form.experience,
                          { company: '', position: '', start_date: '', end_date: '', description: '', responsibilities: '' },
                        ],
                      })
                    }
                  >
                    <Plus size={16} /> Add Role
                  </Button>
                </div>

                {form.experience.map((exp, i) => (
                  <div key={i} className="card" style={{ background: 'var(--bg-muted)', padding: '0.9rem', borderRadius: '14px' }}>
                    <div className="grid grid-2" style={{ marginBottom: '0.5rem' }}>
                      <input
                        className="input"
                        placeholder="Job Title / Role (e.g. Software Engineer)"
                        value={exp.position}
                        onChange={(e) => {
                          const experience = [...form.experience]
                          experience[i] = { ...exp, position: e.target.value }
                          setForm({ ...form, experience })
                        }}
                      />
                      <input
                        className="input"
                        placeholder="Company Name (e.g. Razorpay)"
                        value={exp.company}
                        onChange={(e) => {
                          const experience = [...form.experience]
                          experience[i] = { ...exp, company: e.target.value }
                          setForm({ ...form, experience })
                        }}
                      />
                    </div>
                    <div className="grid grid-2" style={{ marginBottom: '0.5rem' }}>
                      <input
                        className="input"
                        placeholder="Start Date (e.g. Jan 2024)"
                        value={exp.start_date}
                        onChange={(e) => {
                          const experience = [...form.experience]
                          experience[i] = { ...exp, start_date: e.target.value }
                          setForm({ ...form, experience })
                        }}
                      />
                      <input
                        className="input"
                        placeholder="End Date (e.g. Present)"
                        value={exp.end_date}
                        onChange={(e) => {
                          const experience = [...form.experience]
                          experience[i] = { ...exp, end_date: e.target.value }
                          setForm({ ...form, experience })
                        }}
                      />
                    </div>
                    <textarea
                      className="input"
                      rows={3}
                      placeholder="Bullet points (one bullet per line). Focus on action verbs + metric results (e.g. 'Increased throughput by 25%')..."
                      value={exp.responsibilities}
                      onChange={(e) => {
                        const experience = [...form.experience]
                        experience[i] = { ...exp, responsibilities: e.target.value }
                        setForm({ ...form, experience })
                      }}
                    />
                  </div>
                ))}

                <div style={{ textAlign: 'right' }}>
                  <Button variant="secondary" onClick={() => setTab('Education')}>
                    Next: Add Education →
                  </Button>
                </div>
              </div>
            ) : null}

            {/* TAB 4: EDUCATION */}
            {tab === 'Education' ? (
              <div className="grid">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ margin: 0 }}>Education & Qualifications</h4>
                  <Button
                    variant="secondary"
                    onClick={() =>
                      setForm({
                        ...form,
                        education: [...form.education, { school: '', degree: '', field: '', graduation_date: '', gpa: '' }],
                      })
                    }
                  >
                    <Plus size={16} /> Add Education
                  </Button>
                </div>

                {form.education.map((ed, i) => (
                  <div key={i} className="card" style={{ background: 'var(--bg-muted)', padding: '0.9rem', borderRadius: '14px' }}>
                    <div className="grid grid-2" style={{ marginBottom: '0.5rem' }}>
                      <input
                        className="input"
                        placeholder="University / School Name"
                        value={ed.school}
                        onChange={(e) => {
                          const education = [...form.education]
                          education[i] = { ...ed, school: e.target.value }
                          setForm({ ...form, education })
                        }}
                      />
                      <input
                        className="input"
                        placeholder="Degree (e.g. B.Tech / B.S.)"
                        value={ed.degree}
                        onChange={(e) => {
                          const education = [...form.education]
                          education[i] = { ...ed, degree: e.target.value }
                          setForm({ ...form, education })
                        }}
                      />
                      <input
                        className="input"
                        placeholder="Field of Study (e.g. Computer Science)"
                        value={ed.field}
                        onChange={(e) => {
                          const education = [...form.education]
                          education[i] = { ...ed, field: e.target.value }
                          setForm({ ...form, education })
                        }}
                      />
                      <input
                        className="input"
                        placeholder="Graduation Year / Date (e.g. May 2025)"
                        value={ed.graduation_date}
                        onChange={(e) => {
                          const education = [...form.education]
                          education[i] = { ...ed, graduation_date: e.target.value }
                          setForm({ ...form, education })
                        }}
                      />
                    </div>
                  </div>
                ))}

                <div style={{ textAlign: 'right' }}>
                  <Button variant="secondary" onClick={() => setTab('Projects')}>
                    Next: Add Projects →
                  </Button>
                </div>
              </div>
            ) : null}

            {/* TAB 5: PROJECTS */}
            {tab === 'Projects' ? (
              <div className="grid">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ margin: 0 }}>Key Technical Projects</h4>
                  <Button
                    variant="secondary"
                    onClick={() =>
                      setForm({
                        ...form,
                        projects: [...form.projects, { name: '', technologies: '', description: '', link: '' }],
                      })
                    }
                  >
                    <Plus size={16} /> Add Project
                  </Button>
                </div>

                {form.projects.map((project, i) => (
                  <div key={i} className="card" style={{ background: 'var(--bg-muted)', padding: '0.9rem', borderRadius: '14px' }}>
                    <div className="grid grid-2" style={{ marginBottom: '0.5rem' }}>
                      <input
                        className="input"
                        placeholder="Project Name"
                        value={project.name}
                        onChange={(e) => {
                          const projects = [...form.projects]
                          projects[i] = { ...project, name: e.target.value }
                          setForm({ ...form, projects })
                        }}
                      />
                      <input
                        className="input"
                        placeholder="Technologies (e.g. React, Python, Docker)"
                        value={project.technologies}
                        onChange={(e) => {
                          const projects = [...form.projects]
                          projects[i] = { ...project, technologies: e.target.value }
                          setForm({ ...form, projects })
                        }}
                      />
                    </div>
                    <textarea
                      className="input"
                      rows={2}
                      placeholder="Brief description of what you built and outcomes..."
                      value={project.description}
                      onChange={(e) => {
                        const projects = [...form.projects]
                        projects[i] = { ...project, description: e.target.value }
                        setForm({ ...form, projects })
                      }}
                    />
                  </div>
                ))}

                <div style={{ textAlign: 'right' }}>
                  <Button variant="secondary" onClick={() => setTab('Skills')}>
                    Next: Add Skills →
                  </Button>
                </div>
              </div>
            ) : null}

            {/* TAB 6: SKILLS */}
            {tab === 'Skills' ? (
              <div className="grid grid-2">
                <Field label="Technical Skills (One per line)">
                  <textarea
                    className="input"
                    rows={4}
                    placeholder="React&#10;TypeScript&#10;Python&#10;FastAPI"
                    value={form.skills.technical}
                    onChange={(e) => setForm({ ...form, skills: { ...form.skills, technical: e.target.value } })}
                  />
                </Field>
                <Field label="Tools & Frameworks (One per line)">
                  <textarea
                    className="input"
                    rows={4}
                    placeholder="Git&#10;Docker&#10;AWS&#10;Postman"
                    value={form.skills.tools}
                    onChange={(e) => setForm({ ...form, skills: { ...form.skills, tools: e.target.value } })}
                  />
                </Field>
                <Field label="Languages (One per line)">
                  <textarea
                    className="input"
                    rows={3}
                    placeholder="English (Native)&#10;Spanish (Conversational)"
                    value={form.skills.languages}
                    onChange={(e) => setForm({ ...form, skills: { ...form.skills, languages: e.target.value } })}
                  />
                </Field>
                <Field label="Soft Skills & Leadership (One per line)">
                  <textarea
                    className="input"
                    rows={3}
                    placeholder="Agile Development&#10;Problem Solving&#10;Team Leadership"
                    value={form.skills.soft}
                    onChange={(e) => setForm({ ...form, skills: { ...form.skills, soft: e.target.value } })}
                  />
                </Field>
              </div>
            ) : null}

            {error ? <p style={{ color: 'var(--danger)', marginTop: '0.8rem' }}>{error}</p> : null}
          </Card>
        </FadeIn>

        {/* RIGHT COLUMN: DYNAMIC LIVE ATS PREVIEW */}
        <FadeIn delay={0.08}>
          <div
            style={{
              background: '#ffffff',
              color: '#0f172a',
              minHeight: '740px',
              padding: '2.2rem 2rem',
              borderRadius: '16px',
              boxShadow: '0 20px 45px rgba(0,0,0,0.12)',
              position: 'sticky',
              top: '1rem',
              fontFamily: selectedTemplate.fontFamily,
              border: `1px solid color-mix(in srgb, ${selectedTemplate.accentColor} 30%, transparent)`,
            }}
          >
            {/* Header Badge */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: selectedTemplate.accentColor,
                  background: `color-mix(in srgb, ${selectedTemplate.accentColor} 12%, transparent)`,
                  padding: '0.2rem 0.6rem',
                  borderRadius: '999px',
                }}
              >
                LIVE PREVIEW: {selectedTemplate.name.toUpperCase()} ({selectedTemplate.badge})
              </span>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>A4 Page Format</span>
            </div>

            {/* Template Header */}
            {selectedTemplate.id === 'Modern' && (
              <div style={{ textAlign: 'center', marginBottom: '1.2rem' }}>
                <h2 style={{ margin: 0, fontSize: '1.8rem', color: selectedTemplate.accentColor, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  {person.full_name || 'YOUR FULL NAME'}
                </h2>
                {person.title && <p style={{ margin: '0.2rem 0', fontWeight: 600, color: '#475569', fontSize: '0.98rem' }}>{person.title}</p>}
                <p style={{ margin: '0.3rem 0', fontSize: '0.85rem', color: '#64748b' }}>
                  {[person.email, person.phone, person.location].filter(Boolean).join('  |  ')}
                </p>
                {(person.linkedin || person.portfolio) && (
                  <p style={{ margin: 0, fontSize: '0.82rem', color: selectedTemplate.accentColor }}>
                    {[person.linkedin, person.portfolio].filter(Boolean).join('  |  ')}
                  </p>
                )}
              </div>
            )}

            {selectedTemplate.id === 'Professional' && (
              <div style={{ marginBottom: '1.2rem' }}>
                <h2 style={{ margin: 0, fontSize: '1.85rem', color: '#0f172a', fontWeight: 700 }}>
                  {person.full_name || 'YOUR FULL NAME'}
                </h2>
                {person.title && <p style={{ margin: '0.2rem 0', fontWeight: 600, color: selectedTemplate.accentColor, fontSize: '1rem' }}>{person.title}</p>}
                <p style={{ margin: '0.2rem 0', fontSize: '0.86rem', color: '#475569' }}>
                  {[person.email, person.phone, person.location, person.linkedin, person.portfolio].filter(Boolean).join('  •  ')}
                </p>
              </div>
            )}

            {selectedTemplate.id === 'Minimal' && (
              <div style={{ marginBottom: '1.2rem', paddingBottom: '0.8rem', borderBottom: '2px solid #0f172a' }}>
                <h2 style={{ margin: 0, fontSize: '2rem', color: '#0f172a', fontWeight: 800, letterSpacing: '-0.02em' }}>
                  {person.full_name || 'YOUR FULL NAME'}
                </h2>
                {person.title && <p style={{ margin: '0.2rem 0', fontSize: '0.95rem', color: '#475569', fontWeight: 500 }}>{person.title}</p>}
                <p style={{ margin: '0.3rem 0 0', fontSize: '0.82rem', color: '#64748b' }}>
                  {[person.email, person.phone, person.location, person.linkedin].filter(Boolean).join('  /  ')}
                </p>
              </div>
            )}

            {selectedTemplate.id === 'Creative' && (
              <div style={{ textAlign: 'center', marginBottom: '1.2rem' }}>
                <h2 style={{ margin: 0, fontSize: '1.9rem', color: '#7c3aed', fontWeight: 800 }}>
                  {person.full_name ? `✨ ${person.full_name} ✨` : '✨ YOUR FULL NAME ✨'}
                </h2>
                {person.title && <p style={{ margin: '0.2rem 0', fontWeight: 600, color: '#475569', fontSize: '1rem' }}>{person.title}</p>}
                <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '0.4rem' }}>
                  {[person.email, person.phone, person.location].filter(Boolean).map((item, idx) => (
                    <span key={idx} style={{ background: '#f3e8ff', color: '#6b21a8', padding: '0.15rem 0.5rem', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 600 }}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Divider Rule */}
            <div
              style={{
                height: '2px',
                background: selectedTemplate.accentColor,
                margin: '0.4rem 0 1rem',
                opacity: selectedTemplate.id === 'Minimal' ? 0.3 : 0.85,
              }}
            />

            {/* Summary */}
            {form.summary && (
              <div style={{ marginBottom: '1.1rem' }}>
                <h4
                  style={{
                    margin: '0 0 0.35rem',
                    fontSize: '0.92rem',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: selectedTemplate.accentColor,
                  }}
                >
                  Professional Summary
                </h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#334155', lineHeight: 1.55 }}>{form.summary}</p>
              </div>
            )}

            {/* Experience */}
            {form.experience.some((e) => e.position || e.company) && (
              <div style={{ marginBottom: '1.1rem' }}>
                <h4
                  style={{
                    margin: '0 0 0.45rem',
                    fontSize: '0.92rem',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: selectedTemplate.accentColor,
                  }}
                >
                  Work Experience
                </h4>
                {form.experience.map((exp, i) => (
                  <div key={i} style={{ marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <strong style={{ fontSize: '0.9rem', color: '#0f172a' }}>
                        {exp.position || 'Position'} {exp.company ? `— ${exp.company}` : ''}
                      </strong>
                      <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                        {[exp.start_date, exp.end_date].filter(Boolean).join(' – ')}
                      </span>
                    </div>
                    {exp.responsibilities && (
                      <ul style={{ margin: '0.25rem 0 0', paddingLeft: '1.2rem', fontSize: '0.83rem', color: '#334155' }}>
                        {splitList(exp.responsibilities).map((bullet, idx) => (
                          <li key={idx} style={{ marginBottom: '2px', lineHeight: 1.45 }}>
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Education */}
            {form.education.some((e) => e.school || e.degree) && (
              <div style={{ marginBottom: '1.1rem' }}>
                <h4
                  style={{
                    margin: '0 0 0.4rem',
                    fontSize: '0.92rem',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: selectedTemplate.accentColor,
                  }}
                >
                  Education
                </h4>
                {form.education.map((ed, i) => (
                  <div key={i} style={{ marginBottom: '0.4rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <strong style={{ fontSize: '0.88rem', color: '#0f172a' }}>
                        {ed.school} {ed.degree ? `| ${ed.degree} ${ed.field || ''}` : ''}
                      </strong>
                      <span style={{ fontSize: '0.78rem', color: '#64748b' }}>{ed.graduation_date}</span>
                    </div>
                    {ed.gpa && <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>GPA: {ed.gpa}</p>}
                  </div>
                ))}
              </div>
            )}

            {/* Projects */}
            {form.projects.some((p) => p.name) && (
              <div style={{ marginBottom: '1.1rem' }}>
                <h4
                  style={{
                    margin: '0 0 0.4rem',
                    fontSize: '0.92rem',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: selectedTemplate.accentColor,
                  }}
                >
                  Projects
                </h4>
                {form.projects.map((proj, i) => (
                  <div key={i} style={{ marginBottom: '0.5rem' }}>
                    <strong style={{ fontSize: '0.88rem', color: '#0f172a' }}>{proj.name}</strong>
                    {proj.technologies && (
                      <span style={{ fontSize: '0.8rem', color: selectedTemplate.accentColor, marginLeft: '6px' }}>
                        ({proj.technologies})
                      </span>
                    )}
                    {proj.description && (
                      <p style={{ margin: '2px 0 0', fontSize: '0.82rem', color: '#334155', lineHeight: 1.4 }}>
                        {proj.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Skills */}
            {(form.skills.technical || form.skills.tools || form.skills.languages || form.skills.soft) && (
              <div>
                <h4
                  style={{
                    margin: '0 0 0.4rem',
                    fontSize: '0.92rem',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: selectedTemplate.accentColor,
                  }}
                >
                  Skills & Technical Competencies
                </h4>
                {form.skills.technical && (
                  <p style={{ margin: '0 0 4px', fontSize: '0.82rem', color: '#334155' }}>
                    <strong>Technical: </strong> {splitList(form.skills.technical).join('  •  ')}
                  </p>
                )}
                {form.skills.tools && (
                  <p style={{ margin: '0 0 4px', fontSize: '0.82rem', color: '#334155' }}>
                    <strong>Tools & Frameworks: </strong> {splitList(form.skills.tools).join('  •  ')}
                  </p>
                )}
                {form.skills.languages && (
                  <p style={{ margin: '0 0 4px', fontSize: '0.82rem', color: '#334155' }}>
                    <strong>Languages: </strong> {splitList(form.skills.languages).join('  •  ')}
                  </p>
                )}
                {form.skills.soft && (
                  <p style={{ margin: 0, fontSize: '0.82rem', color: '#334155' }}>
                    <strong>Soft Skills: </strong> {splitList(form.skills.soft).join('  •  ')}
                  </p>
                )}
              </div>
            )}
          </div>
        </FadeIn>
      </div>
    </div>
  )
}
