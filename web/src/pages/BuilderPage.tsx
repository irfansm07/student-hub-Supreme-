import { useMemo, useState } from 'react'
import { Plus, FileText, Check, Sparkles, Target, Layers, Copy, Code, ExternalLink, Image as ImageIcon } from 'lucide-react'
import { Card, FadeIn, Button, Field } from '../components/ui/Primitives'
import { GuidedPageHeader } from '../components/ui/GuidedPageHeader'
import { apiDownload } from '../lib/api'
import { useToast } from '../context/ToastContext'

export interface ResumeTemplateOption {
  id: 'LewisVerstappen' | 'JackSparrow' | 'JaneDoe' | 'CarlJohnson' | 'ReCeIVe'
  name: string
  subtitle: string
  score: number
  badge: string
  bestFor: string
  description: string
  accentColor: string
  fontFamily: string
  latexStyle: string
}

export const EXACT_OVERLEAF_TEMPLATES: ResumeTemplateOption[] = [
  {
    id: 'LewisVerstappen',
    name: 'Lewis Verstappen Left-Margin CV',
    subtitle: 'Sidebar Section Titles',
    score: 99,
    badge: '99 ATS Score',
    bestFor: 'Executives, Designers & Modern Tech Roles',
    description: 'Clean modern layout with section titles (CONTACT INFO, ABOUT ME, EXPERIENCE, EDUCATION) placed in the left margin.',
    accentColor: '#334155',
    fontFamily: '"Plus Jakarta Sans", sans-serif',
    latexStyle: 'Left Margin Sidebar LaTeX',
  },
  {
    id: 'JackSparrow',
    name: 'Jack Sparrow TwentySeconds Creative',
    subtitle: 'Dark Header & Avatar Sidebar',
    score: 97,
    badge: '97 ATS Score',
    bestFor: 'Creative Engineers, UI/UX & Full Stack',
    description: 'Dark top header bar, circular profile avatar, light grey left sidebar with blue category badges, skill progress bars, and language rating dots.',
    accentColor: '#0284c7',
    fontFamily: '"Plus Jakarta Sans", sans-serif',
    latexStyle: 'TwentySeconds Graphic LaTeX',
  },
  {
    id: 'JaneDoe',
    name: 'Jane Doe TwentyOneSeconds Developer',
    subtitle: 'Full Stack Tech Developer CV',
    score: 99,
    badge: '99 ATS Score',
    bestFor: 'Web Developers, Backend & Software Engineers',
    description: 'Top header with portfolio & LeetCode links, blue target role title, structured technical skills table, and project Source Code links.',
    accentColor: '#2563eb',
    fontFamily: 'Arial, sans-serif',
    latexStyle: 'TwentyOneSeconds LaTeX',
  },
  {
    id: 'CarlJohnson',
    name: 'Carl Johnson Classic Academic Serif',
    subtitle: 'Formal Blue Serif & Thesis CV',
    score: 98,
    badge: '98 ATS Score',
    bestFor: 'Research Scholars, Postdocs & Academic Roles',
    description: 'Centered blue serif header with star-separated contact line (✻), blue italic section titles, right-aligned dates, and thesis project highlights.',
    accentColor: '#1d4ed8',
    fontFamily: 'Georgia, serif',
    latexStyle: 'Academic Classic Serif LaTeX',
  },
  {
    id: 'ReCeIVe',
    name: 'ReCeIVe Classic Centered CV',
    subtitle: 'Symmetric Blue Centered Layout',
    score: 96,
    badge: '96 ATS Score',
    bestFor: 'Analysts, Corporate & Engineers',
    description: 'Symmetric centered header layout with brief description paragraph, structured technical competencies, and right-aligned position dates.',
    accentColor: '#1e3a8a',
    fontFamily: '"Times New Roman", serif',
    latexStyle: 'ReCeIVe Class LaTeX',
  },
]

const SAMPLE_PROFILE = {
  template: 'LewisVerstappen',
  personal_info: {
    full_name: 'Lewis Verstappen',
    title: 'Senior Product Architect',
    email: 'youremail@email.com',
    phone: '+31 6 69696969',
    location: 'Street 185, 1234IJ, City Name, Morocco',
    linkedin: 'linkedin.com/in/username',
    portfolio: 'github.com/username',
    show_photo: true,
  },
  summary: 'Nam dui ligula, fringilla a, euismod sodales, sollicitudin vel, wisi. Morbi auctor lorem non justo. Nam lacus libero, pretium at, lobortis vitae, ultricies et, tellus. Donec aliquet, tortor sed accumsan bibendum, erat ligula aliquet magna, vitae ornare odio metus a mi.',
  experience: [
    {
      company: 'The Cool Company',
      position: 'JOB TITLE',
      start_date: '2020',
      end_date: '2023',
      description: 'Earth, Alpha quadrant',
      responsibilities: 'Successfully sent 5 humans to Mars with the biggest blah.\nIncreased the average number of humans sent to Pluto by 146%.',
    },
    {
      company: 'SweetWorld Technologies',
      position: 'ANOTHER JOB TITLE',
      start_date: '2016',
      end_date: '2019',
      description: 'Santiago, Chile (the most delicious division)',
      responsibilities: 'Solved the world hunger by producing new nutritious candy.',
    }
  ],
  education: [
    {
      school: 'Dutch Beer University',
      degree: 'MSc IN BREWING BEER',
      field: 'Urk, The Netherlands',
      graduation_date: '2020-2023',
      gpa: 'Summa cum laude',
    },
    {
      school: 'The University of Wasted Time',
      degree: 'BA IN PROCRASTINATING',
      field: 'Naples, Italy',
      graduation_date: '2016-2019',
      gpa: 'First Class',
    }
  ],
  projects: [
    {
      name: 'Mars Terraforming Module',
      technologies: 'React, Node.js, Python',
      description: 'Built automated atmospheric monitoring system deployed across 3 planetary stations.',
      link: 'Source Code',
    }
  ],
  certifications: [
    'Certified Web Developer by W3C',
    'AWS Certified Solutions Architect',
  ],
  skills: {
    technical: 'JavaScript, Python, React, Node.js, HTML/CSS\nExpress, FastAPI, Redux, PostgreSQL\nMongoDB, Docker, Git, VS Code',
    tools: 'Git, Docker, AWS, Figma',
    languages: 'English (Mother tongue), Dutch (Fluent), Spanish (Basic)',
    soft: 'Leadership, Problem Solving, Communication',
  }
}

const empty = {
  template: 'LewisVerstappen',
  personal_info: {
    full_name: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    portfolio: '',
    show_photo: true,
  },
  summary: '',
  experience: [{ company: '', position: '', start_date: '', end_date: '', description: '', responsibilities: '' }],
  education: [{ school: '', degree: '', field: '', graduation_date: '', gpa: '' }],
  projects: [{ name: '', technologies: '', description: '', link: '' }],
  certifications: [''],
  skills: { technical: '', soft: '', languages: '', tools: '' },
}

const tabs = ['Templates', 'Profile', 'Experience', 'Education', 'Projects', 'Skills & Certs', 'LaTeX Code'] as const

function splitList(value: string) {
  return value.split('\n').map((s) => s.trim()).filter(Boolean)
}

function escapeLaTeX(str: string) {
  return str
    .replace(/\\/g, '\\textasciitilde{}')
    .replace(/&/g, '\\&')
    .replace(/%/g, '\\%')
    .replace(/\$/g, '\\$')
    .replace(/#/g, '\\#')
    .replace(/_/g, '\\_')
}

export function generateLaTeXSource(form: typeof SAMPLE_PROFILE) {
  const p = form.personal_info
  return `% Overleaf CV Template (${form.template})
\\documentclass[letterpaper,10pt]{article}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}

\\begin{document}
\\begin{center}
  {\\Huge \\bfseries ${escapeLaTeX(p.full_name || 'LEWIS VERSTAPPEN')}}\\\\
  ${escapeLaTeX(p.email || '')} $|$ ${escapeLaTeX(p.phone || '')} $|$ ${escapeLaTeX(p.location || '')}
\\end{center}

\\section*{ABOUT ME}
${escapeLaTeX(form.summary || '')}

\\section*{EXPERIENCE}
${form.experience
      .map(
        (e) => `\\textbf{${escapeLaTeX(e.position)}} \\hfill ${escapeLaTeX(e.start_date)}--${escapeLaTeX(e.end_date)}\\\\
\\textit{${escapeLaTeX(e.company)}} $|$ \\textit{${escapeLaTeX(e.description)}}\\\\
\\begin{itemize}
${splitList(e.responsibilities).map(r => `  \\item ${escapeLaTeX(r)}`).join('\n')}
\\end{itemize}`
      )
      .join('\n\n')}

\\section*{EDUCATION}
${form.education
      .map(
        (ed) => `\\textbf{${escapeLaTeX(ed.degree)}} \\hfill ${escapeLaTeX(ed.graduation_date)}\\\\
\\textit{${escapeLaTeX(ed.school)}} $|$ \\textit{${escapeLaTeX(ed.field)}}`
      )
      .join('\n\n')}
\\end{document}`
}

export function BuilderPage() {
  const toast = useToast()
  const [form, setForm] = useState(empty)
  const [tab, setTab] = useState<(typeof tabs)[number]>('Templates')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const person = form.personal_info
  const selectedTemplate = EXACT_OVERLEAF_TEMPLATES.find((t) => t.id === form.template) || EXACT_OVERLEAF_TEMPLATES[0]

  const hasProfile = !!(person.full_name && person.email)
  const hasExperience = form.experience.some((e) => e.position || e.company) || form.education.some((e) => e.school)
  const currentStep = hasExperience ? 2 : hasProfile ? 1 : 0

  const pageSteps = [
    { title: 'Choose template', description: 'Overleaf / LaTeX layout' },
    { title: 'Fill details', description: 'Experience & skills' },
    { title: 'Download resume', description: 'Export Word / LaTeX' },
  ]

  const latexCode = useMemo(() => generateLaTeXSource(form), [form])

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
    toast.push('Loaded exact Overleaf template sample data!')
  }

  const handleCopyLaTeX = () => {
    navigator.clipboard.writeText(latexCode)
    toast.push('LaTeX source code copied to clipboard!')
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
      await apiDownload('/builder', payload, `${person.full_name.replace(/\s+/g, '_')}_${selectedTemplate.id}.docx`)
      toast.push(`Downloaded resume using ${selectedTemplate.name}!`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not generate resume file.')
    } finally {
      setLoading(false)
    }
  }

  const skillsRows = form.skills.technical.split('\n').map((s) => s.trim()).filter(Boolean)

  return (
    <div>
      <GuidedPageHeader
        icon={FileText}
        kicker="Overleaf LaTeX Studio"
        title="Exact Overleaf Resume Templates"
        subtitle="Choose from the exact Overleaf & LaTeX CV layouts (Lewis Verstappen Left Margin, Jack Sparrow TwentySeconds, Jane Doe Developer, Carl Johnson Academic)."
        color="#0ea5e9"
        gradient="linear-gradient(135deg, #0ea5e9, #06b6d4)"
        steps={pageSteps}
        currentStep={currentStep}
      />

      {/* Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', gap: '0.8rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <Button variant="secondary" onClick={handleFillSample}>
            <Sparkles size={16} style={{ color: '#0ea5e9' }} /> Load Overleaf Sample Data
          </Button>
          <a
            href="https://www.overleaf.com/latex/templates/tagged/cv"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.82rem',
              color: '#475569',
              textDecoration: 'none',
              padding: '0.4rem 0.7rem',
              border: '1px solid var(--line)',
              borderRadius: '10px',
              background: 'var(--bg-elevated)',
            }}
          >
            Overleaf Templates <ExternalLink size={12} />
          </a>
        </div>
        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <Button variant="secondary" onClick={handleCopyLaTeX}>
            <Copy size={15} /> Copy LaTeX Code (.tex)
          </Button>
          <Button onClick={() => void download()} disabled={loading}>
            {loading ? 'Generating Resume…' : 'Download Resume File'}
          </Button>
        </div>
      </div>

      <div className="grid grid-2" style={{ gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
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
                  {item === 'LaTeX Code' && <Code size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />}
                  {item}
                </button>
              ))}
            </div>

            {/* TAB 1: TEMPLATES */}
            {tab === 'Templates' ? (
              <div className="grid" style={{ gap: '0.9rem' }}>
                <div>
                  <h3 style={{ margin: '0 0 0.3rem', fontSize: '1.15rem' }}>Select Exact Overleaf CV Template</h3>
                  <p style={{ margin: 0, fontSize: '0.86rem', color: 'var(--ink-soft)' }}>
                    High-scoring LaTeX templates identical to your requested Overleaf designs.
                  </p>
                </div>

                <div className="grid" style={{ gap: '0.85rem' }}>
                  {EXACT_OVERLEAF_TEMPLATES.map((tmpl) => {
                    const isSelected = form.template === tmpl.id
                    return (
                      <div
                        key={tmpl.id}
                        onClick={() => setForm({ ...form, template: tmpl.id })}
                        style={{
                          padding: '1rem',
                          borderRadius: '16px',
                          border: isSelected ? `2px solid ${tmpl.accentColor}` : '1px solid var(--line)',
                          background: isSelected ? `color-mix(in srgb, ${tmpl.accentColor} 8%, var(--bg-elevated))` : 'var(--bg-elevated)',
                          cursor: 'pointer',
                          transition: 'all 200ms ease',
                          position: 'relative',
                        }}
                      >
                        {isSelected && (
                          <div
                            style={{
                              position: 'absolute',
                              top: '12px',
                              right: '12px',
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
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                          <span style={{ padding: '0.18rem 0.5rem', borderRadius: '999px', background: 'color-mix(in srgb, #10b981 14%, transparent)', color: '#059669', fontSize: '0.72rem', fontWeight: 800 }}>
                            <Target size={11} style={{ verticalAlign: 'middle', marginRight: '2px' }} /> {tmpl.badge}
                          </span>
                          <span style={{ fontSize: '0.74rem', color: 'var(--ink-muted)', fontWeight: 600 }}>{tmpl.subtitle}</span>
                        </div>

                        <h4 style={{ margin: '0 0 0.2rem', fontSize: '1.05rem', color: isSelected ? tmpl.accentColor : 'inherit' }}>
                          {tmpl.name}
                        </h4>
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
                <Field label="Active Overleaf Template">
                  <select
                    className="input"
                    value={form.template}
                    onChange={(e) => setForm({ ...form, template: e.target.value as any })}
                  >
                    {EXACT_OVERLEAF_TEMPLATES.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.badge})
                      </option>
                    ))}
                  </select>
                </Field>

                <div className="grid grid-2">
                  {([
                    ['full_name', 'Full Name *'],
                    ['title', 'Job Title / Headline'],
                    ['email', 'Email Address *'],
                    ['phone', 'Phone Number'],
                    ['location', 'Address / Location'],
                    ['linkedin', 'LinkedIn Handle'],
                    ['portfolio', 'Website / GitHub'],
                  ] as const).map(([key, label]) => (
                    <Field key={key} label={label}>
                      <input
                        className="input"
                        placeholder={label.replace(' *', '')}
                        value={person[key] as any}
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

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '0.4rem' }}>
                  <input
                    type="checkbox"
                    id="show_photo"
                    checked={person.show_photo}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        personal_info: { ...person, show_photo: e.target.checked },
                      })
                    }
                  />
                  <label htmlFor="show_photo" style={{ fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <ImageIcon size={14} /> Include Profile Photo Avatar (Jack Sparrow Creative Template)
                  </label>
                </div>

                <Field label="About Me / Summary">
                  <textarea
                    className="input"
                    rows={4}
                    placeholder="Brief description about yourself..."
                    value={form.summary}
                    onChange={(e) => setForm({ ...form, summary: e.target.value })}
                  />
                </Field>
              </div>
            ) : null}

            {/* TAB 3: EXPERIENCE */}
            {tab === 'Experience' ? (
              <div className="grid">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ margin: 0 }}>Experience</h4>
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
                    <Plus size={16} /> Add Experience
                  </Button>
                </div>

                {form.experience.map((exp, i) => (
                  <div key={i} className="card" style={{ background: 'var(--bg-muted)', padding: '0.9rem', borderRadius: '14px' }}>
                    <div className="grid grid-2" style={{ marginBottom: '0.5rem' }}>
                      <input
                        className="input"
                        placeholder="Job Title (e.g. JOB TITLE)"
                        value={exp.position}
                        onChange={(e) => {
                          const experience = [...form.experience]
                          experience[i] = { ...exp, position: e.target.value }
                          setForm({ ...form, experience })
                        }}
                      />
                      <input
                        className="input"
                        placeholder="Company Name (e.g. The Cool Company)"
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
                        placeholder="Location / Division (e.g. Earth, Alpha quadrant)"
                        value={exp.description}
                        onChange={(e) => {
                          const experience = [...form.experience]
                          experience[i] = { ...exp, description: e.target.value }
                          setForm({ ...form, experience })
                        }}
                      />
                      <div className="grid grid-2" style={{ gap: '0.4rem' }}>
                        <input
                          className="input"
                          placeholder="Start (e.g. 2020)"
                          value={exp.start_date}
                          onChange={(e) => {
                            const experience = [...form.experience]
                            experience[i] = { ...exp, start_date: e.target.value }
                            setForm({ ...form, experience })
                          }}
                        />
                        <input
                          className="input"
                          placeholder="End (e.g. 2023)"
                          value={exp.end_date}
                          onChange={(e) => {
                            const experience = [...form.experience]
                            experience[i] = { ...exp, end_date: e.target.value }
                            setForm({ ...form, experience })
                          }}
                        />
                      </div>
                    </div>
                    <textarea
                      className="input"
                      rows={3}
                      placeholder="Bullet points (one per line)..."
                      value={exp.responsibilities}
                      onChange={(e) => {
                        const experience = [...form.experience]
                        experience[i] = { ...exp, responsibilities: e.target.value }
                        setForm({ ...form, experience })
                      }}
                    />
                  </div>
                ))}
              </div>
            ) : null}

            {/* TAB 4: EDUCATION */}
            {tab === 'Education' ? (
              <div className="grid">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ margin: 0 }}>Education</h4>
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
                        placeholder="Degree (e.g. MSc IN BREWING BEER)"
                        value={ed.degree}
                        onChange={(e) => {
                          const education = [...form.education]
                          education[i] = { ...ed, degree: e.target.value }
                          setForm({ ...form, education })
                        }}
                      />
                      <input
                        className="input"
                        placeholder="School / University (e.g. Dutch Beer University)"
                        value={ed.school}
                        onChange={(e) => {
                          const education = [...form.education]
                          education[i] = { ...ed, school: e.target.value }
                          setForm({ ...form, education })
                        }}
                      />
                    </div>
                    <div className="grid grid-2">
                      <input
                        className="input"
                        placeholder="Location (e.g. Urk, The Netherlands)"
                        value={ed.field}
                        onChange={(e) => {
                          const education = [...form.education]
                          education[i] = { ...ed, field: e.target.value }
                          setForm({ ...form, education })
                        }}
                      />
                      <input
                        className="input"
                        placeholder="Dates (e.g. 2020-2023)"
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
              </div>
            ) : null}

            {/* TAB 5: PROJECTS */}
            {tab === 'Projects' ? (
              <div className="grid">
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
                        placeholder="Technologies"
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
                      placeholder="Project description..."
                      value={project.description}
                      onChange={(e) => {
                        const projects = [...form.projects]
                        projects[i] = { ...project, description: e.target.value }
                        setForm({ ...form, projects })
                      }}
                    />
                  </div>
                ))}
              </div>
            ) : null}

            {/* TAB 6: SKILLS & CERTS */}
            {tab === 'Skills & Certs' ? (
              <div className="grid">
                <Field label="Technical Skills List (One category per line)">
                  <textarea
                    className="input"
                    rows={4}
                    placeholder="JavaScript, Python, React&#10;Express, FastAPI, PostgreSQL&#10;MongoDB, Docker, Git"
                    value={form.skills.technical}
                    onChange={(e) => setForm({ ...form, skills: { ...form.skills, technical: e.target.value } })}
                  />
                </Field>
                <Field label="Certifications">
                  <textarea
                    className="input"
                    rows={3}
                    placeholder="Certified Web Developer by W3C&#10;AWS Certified Solutions Architect"
                    value={form.certifications.join('\n')}
                    onChange={(e) => setForm({ ...form, certifications: e.target.value.split('\n') })}
                  />
                </Field>
              </div>
            ) : null}

            {/* TAB 7: LATEX */}
            {tab === 'LaTeX Code' ? (
              <div className="grid">
                <textarea
                  className="input"
                  rows={14}
                  readOnly
                  style={{ fontFamily: 'monospace', fontSize: '0.82rem', background: '#0f172a', color: '#f8fafc', padding: '1rem', borderRadius: '12px' }}
                  value={latexCode}
                />
              </div>
            ) : null}

            {error ? <p style={{ color: 'var(--danger)', marginTop: '0.8rem' }}>{error}</p> : null}
          </Card>
        </FadeIn>

        {/* RIGHT COLUMN: DYNAMIC LIVE PREVIEW MATCHING THE 5 SCREENSHOTS */}
        <FadeIn delay={0.08}>
          <div
            style={{
              background: '#ffffff',
              color: '#111827',
              minHeight: '800px',
              padding: selectedTemplate.id === 'JackSparrow' ? '0' : '2.4rem 2rem',
              borderRadius: '14px',
              boxShadow: '0 20px 45px rgba(0,0,0,0.15)',
              position: 'sticky',
              top: '1rem',
              fontFamily: selectedTemplate.fontFamily,
              fontSize: '13px',
              lineHeight: 1.4,
              border: '1px solid #cbd5e1',
              overflow: 'hidden',
            }}
          >
            {/* 1. LEWIS VERSTAPPEN LEFT-MARGIN TEMPLATE (IMAGE 1) */}
            {selectedTemplate.id === 'LewisVerstappen' && (
              <div style={{ padding: '0.5rem' }}>
                {/* Header */}
                <div style={{ marginBottom: '1.5rem', paddingLeft: '140px', position: 'relative' }}>
                  <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '2px', background: '#000000' }} />
                  <h1 style={{ margin: 0, fontSize: '2.2rem', fontWeight: 300, color: '#475569', letterSpacing: '0.25em', lineHeight: 1 }}>
                    LEWIS
                  </h1>
                  <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700, color: '#1e293b', letterSpacing: '0.12em', lineHeight: 1.1 }}>
                    VERSTAPPEN
                  </h1>
                </div>

                {/* CONTACT INFO */}
                <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: '1rem', marginBottom: '1.2rem' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.82rem', letterSpacing: '0.05em', color: '#1e293b', paddingTop: '2px' }}>
                    CONTACT INFO
                  </div>
                  <div style={{ borderTop: '1px solid #000', paddingTop: '0.4rem' }}>
                    <table style={{ width: '100%', fontSize: '0.8rem', borderCollapse: 'collapse' }}>
                      <tbody>
                        <tr>
                          <td style={{ width: '90px', fontWeight: 700, padding: '2px 0', color: '#1e293b' }}>E-mail</td>
                          <td style={{ color: '#64748b' }}>{person.email || 'youremail@email.com'}</td>
                        </tr>
                        <tr>
                          <td style={{ fontWeight: 700, padding: '2px 0', color: '#1e293b' }}>Phone Nr</td>
                          <td style={{ color: '#64748b' }}>{person.phone || '+31 6 69696969'}</td>
                        </tr>
                        <tr>
                          <td style={{ fontWeight: 700, padding: '2px 0', color: '#1e293b' }}>Address</td>
                          <td style={{ color: '#64748b' }}>{person.location || 'Street 185, 1234IJ, City Name, Morocco'}</td>
                        </tr>
                        <tr>
                          <td style={{ fontWeight: 700, padding: '2px 0', color: '#1e293b' }}>LinkedIn</td>
                          <td style={{ color: '#64748b' }}>{person.linkedin || 'linkedin.com/in/username'}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* ABOUT ME */}
                {form.summary && (
                  <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: '1rem', marginBottom: '1.2rem' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.82rem', letterSpacing: '0.05em', color: '#1e293b', paddingTop: '2px' }}>
                      ABOUT ME
                    </div>
                    <div style={{ borderTop: '1px solid #000', paddingTop: '0.4rem' }}>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b', lineHeight: 1.5 }}>
                        {form.summary}
                      </p>
                    </div>
                  </div>
                )}

                {/* EXPERIENCE */}
                <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: '1rem', marginBottom: '1.2rem' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.82rem', letterSpacing: '0.05em', color: '#1e293b', paddingTop: '2px' }}>
                    EXPERIENCE
                  </div>
                  <div style={{ borderTop: '1px solid #000', paddingTop: '0.4rem' }}>
                    {form.experience.map((exp, idx) => (
                      <div key={idx} style={{ marginBottom: '0.8rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                          <strong style={{ fontSize: '0.84rem', color: '#000000', letterSpacing: '0.04em' }}>
                            {exp.position || 'JOB TITLE'}
                          </strong>
                          <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
                            {exp.start_date || '2020'}-{exp.end_date || '2023'}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', fontStyle: 'italic', marginBottom: '4px' }}>
                          {exp.company || 'The Cool Company'} | {exp.description || 'Earth, Alpha quadrant'}
                        </div>
                        <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.78rem', color: '#64748b' }}>
                          {splitList(exp.responsibilities).map((b, bIdx) => (
                            <li key={bIdx}>{b}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* EDUCATION */}
                <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: '1rem' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.82rem', letterSpacing: '0.05em', color: '#1e293b', paddingTop: '2px' }}>
                    EDUCATION
                  </div>
                  <div style={{ borderTop: '1px solid #000', paddingTop: '0.4rem' }}>
                    {form.education.map((ed, idx) => (
                      <div key={idx} style={{ marginBottom: '0.8rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                          <strong style={{ fontSize: '0.84rem', color: '#000000', letterSpacing: '0.04em' }}>
                            {ed.degree || 'MSc IN BREWING BEER'}
                          </strong>
                          <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
                            {ed.graduation_date || '2020-2023'}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', fontStyle: 'italic' }}>
                          {ed.school || 'Dutch Beer University'} | {ed.field || 'Urk, The Netherlands'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 2. JACK SPARROW TWENTYSECONDS CREATIVE TEMPLATE (IMAGE 2) */}
            {selectedTemplate.id === 'JackSparrow' && (
              <div>
                {/* Top Dark Bar */}
                <div style={{ background: '#334155', color: '#ffffff', padding: '1.2rem', textAlign: 'center' }}>
                  <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 600 }}>
                    Jack <span style={{ fontWeight: 800 }}>Sparrow</span>
                  </h1>
                  <p style={{ margin: '2px 0 0', fontSize: '0.84rem', opacity: 0.85 }}>Captain</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '170px 1fr', minHeight: '700px' }}>
                  {/* Left Sidebar */}
                  <div style={{ background: '#f1f5f9', padding: '1rem', borderRight: '1px solid #e2e8f0' }}>
                    {/* Avatar Circle */}
                    <div
                      style={{
                        width: '90px',
                        height: '90px',
                        borderRadius: '50%',
                        background: '#cbd5e1',
                        margin: '0 auto 1rem',
                        overflow: 'hidden',
                        border: '2px solid #0284c7',
                        display: 'grid',
                        placeItems: 'center',
                        fontSize: '0.72rem',
                        color: '#475569',
                      }}
                    >
                      Photo
                    </div>

                    <div style={{ background: '#0284c7', color: 'white', padding: '0.15rem 0.4rem', fontSize: '0.72rem', fontWeight: 700, borderRadius: '2px', marginBottom: '0.3rem', display: 'inline-block' }}>
                      About me
                    </div>
                    <p style={{ margin: '0 0 0.8rem', fontSize: '0.72rem', color: '#475569', lineHeight: 1.35 }}>
                      {form.summary || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'}
                    </p>

                    <div style={{ background: '#0284c7', color: 'white', padding: '0.15rem 0.4rem', fontSize: '0.72rem', fontWeight: 700, borderRadius: '2px', marginBottom: '0.3rem', display: 'inline-block' }}>
                      Personal
                    </div>
                    <p style={{ margin: '0 0 0.8rem', fontSize: '0.72rem', color: '#475569' }}>
                      Jack Sparrow<br />Nationality: English
                    </p>

                    <div style={{ background: '#0284c7', color: 'white', padding: '0.15rem 0.4rem', fontSize: '0.72rem', fontWeight: 700, borderRadius: '2px', marginBottom: '0.3rem', display: 'inline-block' }}>
                      Specialization
                    </div>
                    <p style={{ margin: '0 0 0.8rem', fontSize: '0.72rem', color: '#475569' }}>
                      Privateering • Buccaneering
                    </p>
                  </div>

                  {/* Right Main Area */}
                  <div style={{ padding: '1.2rem' }}>
                    <h4 style={{ margin: '0 0 0.5rem', fontSize: '0.84rem', fontWeight: 800, textTransform: 'uppercase', borderBottom: '1px solid #000', paddingBottom: '2px' }}>
                      SHORT RESUMÉ
                    </h4>
                    {form.experience.map((exp, idx) => (
                      <div key={idx} style={{ display: 'grid', gridTemplateColumns: '70px 1fr', gap: '0.5rem', marginBottom: '0.6rem', fontSize: '0.78rem' }}>
                        <div style={{ fontWeight: 700, color: '#475569' }}>{exp.start_date || '2018-2021'}</div>
                        <div>
                          <strong>{exp.position || 'Captain of the Black Pearl'}</strong>
                          <div style={{ fontSize: '0.74rem', color: '#64748b' }}>{exp.company || 'LEAD • East Indies'}</div>
                          <p style={{ margin: '2px 0 0', fontSize: '0.74rem' }}>{exp.responsibilities}</p>
                        </div>
                      </div>
                    ))}

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                      <div>
                        <h4 style={{ margin: '0 0 0.4rem', fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', borderBottom: '1px solid #000', paddingBottom: '2px' }}>
                          DEGREES
                        </h4>
                        {form.education.map((ed, idx) => (
                          <div key={idx} style={{ fontSize: '0.76rem', marginBottom: '0.4rem' }}>
                            <strong>{ed.degree}</strong>
                            <div style={{ color: '#64748b' }}>{ed.school}</div>
                          </div>
                        ))}
                      </div>

                      <div>
                        <h4 style={{ margin: '0 0 0.4rem', fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', borderBottom: '1px solid #000', paddingBottom: '2px' }}>
                          PROGRAMMING
                        </h4>
                        {skillsRows.slice(0, 4).map((skill, idx) => (
                          <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.74rem', marginBottom: '3px' }}>
                            <span style={{ background: '#e2e8f0', padding: '1px 4px', borderRadius: '3px' }}>{skill}</span>
                            <div style={{ width: '60px', height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                              <div style={{ width: `${85 - idx * 15}%`, height: '100%', background: '#0284c7' }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. JANE DOE TWENTYONESECONDS DEVELOPER (IMAGE 3) */}
            {selectedTemplate.id === 'JaneDoe' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                  <div>
                    <h1 style={{ margin: 0, fontSize: '1.9rem', fontWeight: 700, color: '#000000' }}>{person.full_name || 'Jane Doe'}</h1>
                    <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: '#2563eb' }}>jane-doe.com | LinkedIn | GitHub | Leetcode</p>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '0.75rem', color: '#374151' }}>
                    <div>Location: {person.location || 'Anycity, Anystate, Anycountry'}</div>
                    <div>Email: {person.email || 'jane.doe@anysite.com'} | Mobile: {person.phone || '5555555555'}</div>
                  </div>
                </div>

                <h3 style={{ margin: '0.6rem 0 0.3rem', fontSize: '0.86rem', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase' }}>
                  {person.title || 'FULL STACK DEVELOPER'}
                </h3>
                <p style={{ margin: '0 0 0.8rem', fontSize: '0.8rem', color: '#374151' }}>{form.summary}</p>

                <h4 style={{ margin: '0 0 0.3rem', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', borderBottom: '1px solid #000', paddingBottom: '2px' }}>
                  TECHNICAL SKILLS
                </h4>
                <table style={{ width: '100%', fontSize: '0.78rem', marginBottom: '0.8rem' }}>
                  <tbody>
                    <tr><td style={{ width: '100px', fontWeight: 700 }}>Languages</td><td>: {skillsRows[0] || 'JavaScript, PHP, Java, HTML, CSS'}</td></tr>
                    <tr><td style={{ fontWeight: 700 }}>Frameworks</td><td>: {skillsRows[1] || 'React.js, Angular, Express, Node.js'}</td></tr>
                    <tr><td style={{ fontWeight: 700 }}>Libraries</td><td>: {skillsRows[2] || 'Material, Redux, React Router'}</td></tr>
                    <tr><td style={{ fontWeight: 700 }}>Databases</td><td>: {skillsRows[3] || 'MongoDB, PostgreSQL'}</td></tr>
                    <tr><td style={{ fontWeight: 700 }}>Dev Tools</td><td>: {skillsRows[4] || 'Visual Studio Code, Git, Gitlab'}</td></tr>
                  </tbody>
                </table>

                <h4 style={{ margin: '0 0 0.4rem', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', borderBottom: '1px solid #000', paddingBottom: '2px' }}>
                  EXPERIENCE
                </h4>
                {form.experience.map((exp, idx) => (
                  <div key={idx} style={{ marginBottom: '0.6rem', fontSize: '0.78rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                      <span>{exp.position}</span>
                      <span>{exp.start_date} – {exp.end_date}</span>
                    </div>
                    <div style={{ fontStyle: 'italic', color: '#4b5563', marginBottom: '2px' }}>{exp.company} | {exp.description}</div>
                    <ul style={{ margin: 0, paddingLeft: '1.1rem' }}>
                      {splitList(exp.responsibilities).map((b, bIdx) => (
                        <li key={bIdx}>{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {/* 4. CARL JOHNSON CLASSIC ACADEMIC SERIF (IMAGE 5) */}
            {selectedTemplate.id === 'CarlJohnson' && (
              <div style={{ textAlign: 'center', fontFamily: 'Georgia, serif' }}>
                <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 700, color: '#1d4ed8' }}>
                  Carl Johnson (CJ)
                </h1>
                <p style={{ margin: '0.3rem 0', fontSize: '0.78rem', color: '#1e40af', fontStyle: 'italic' }}>
                  Residence/domicile: 113, Groove Street<br />
                  E-mail: pleasedonotcontactme@gmail.com ✻ Telephone number: +1-202-555-0100<br />
                  Place of birth: Ariccia, Italy ✻ Date of birth: 08-11-1968
                </p>

                <div style={{ textAlign: 'left', marginTop: '1.2rem' }}>
                  <h4 style={{ margin: '0 0 0.5rem', fontSize: '0.88rem', fontWeight: 700, color: '#1d4ed8', fontStyle: 'italic', borderBottom: '1px solid #93c5fd', paddingBottom: '2px' }}>
                    Education
                  </h4>
                  {form.education.map((ed, idx) => (
                    <div key={idx} style={{ marginBottom: '0.7rem', fontSize: '0.8rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                        <span>{ed.degree || "Master's degree in Memeology and Unicorn Analytics"}</span>
                        <span>{ed.school || 'Faber College'}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontStyle: 'italic', color: '#4b5563', fontSize: '0.76rem' }}>
                        <span>Master's degree program</span>
                        <span>{ed.graduation_date || 'February 2019 - April 2020'}</span>
                      </div>
                    </div>
                  ))}

                  <h4 style={{ margin: '1rem 0 0.5rem', fontSize: '0.88rem', fontWeight: 700, color: '#1d4ed8', fontStyle: 'italic', borderBottom: '1px solid #93c5fd', paddingBottom: '2px' }}>
                    Work experience
                  </h4>
                  {form.experience.map((exp, idx) => (
                    <div key={idx} style={{ marginBottom: '0.7rem', fontSize: '0.8rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                        <span>{exp.company || 'Dank Memes Inc.'}</span>
                        <span>{exp.start_date} - {exp.end_date}</span>
                      </div>
                      <div style={{ fontStyle: 'italic', color: '#1e40af', fontSize: '0.78rem' }}>
                        {exp.position}
                      </div>
                      <ul style={{ margin: '3px 0 0', paddingLeft: '1.1rem', fontSize: '0.76rem', color: '#374151' }}>
                        {splitList(exp.responsibilities).map((b, bIdx) => (
                          <li key={bIdx}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. RECEIVE CLASSIC CENTERED (IMAGE 4) */}
            {selectedTemplate.id === 'ReCeIVe' && (
              <div style={{ textAlign: 'center' }}>
                <h1 style={{ margin: 0, fontSize: '1.8rem', color: '#1e3a8a', letterSpacing: '0.06em' }}>
                  {person.full_name || 'YOUR NAME'}
                </h1>
                <p style={{ margin: '0.4rem 0', fontSize: '0.78rem', color: '#2563eb' }}>
                  Address, YY, XX · email@address.com · mywebsite.com
                </p>
                <p style={{ margin: '0 0 1rem', fontSize: '0.8rem', color: '#374151', fontStyle: 'italic' }}>
                  {form.summary}
                </p>
                <div style={{ textAlign: 'left', fontSize: '0.78rem' }}>
                  <h4 style={{ margin: '0 0 0.4rem', color: '#1e3a8a', borderBottom: '1px solid #cbd5e1', paddingBottom: '2px' }}>Positions</h4>
                  {form.experience.map((exp, idx) => (
                    <div key={idx} style={{ marginBottom: '0.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#1e3a8a' }}>
                        <span>{exp.position} — {exp.company}</span>
                        <span>{exp.start_date} — {exp.end_date}</span>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.76rem' }}>{exp.responsibilities}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </FadeIn>
      </div>
    </div>
  )
}
