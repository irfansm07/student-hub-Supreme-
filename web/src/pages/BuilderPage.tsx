import { useMemo, useState } from 'react'
import { Plus, FileText, Check, Sparkles, Target, Layers, Copy, Code, FileCode, ExternalLink } from 'lucide-react'
import { Card, FadeIn, Button, Field } from '../components/ui/Primitives'
import { GuidedPageHeader } from '../components/ui/GuidedPageHeader'
import { apiDownload } from '../lib/api'
import { useToast } from '../context/ToastContext'

export interface ResumeTemplateOption {
  id: 'JakesResume' | 'DeedyCV' | 'AwesomeCV' | 'AltaCV' | 'ModernCV'
  name: string
  score: number
  badge: string
  bestFor: string
  description: string
  accentColor: string
  fontFamily: string
  latexStyle: string
}

export const OVERLEAF_TEMPLATES: ResumeTemplateOption[] = [
  {
    id: 'JakesResume',
    name: "Jake's Overleaf Resume (r/EngineeringResumes)",
    score: 99,
    badge: '99 ATS Score',
    bestFor: 'Computer Science, Software Engineers & Tech',
    description: 'The #1 most popular single-page LaTeX template on Overleaf. Clean horizontal rules, right-aligned dates, and maximum ATS parse rate.',
    accentColor: '#0f172a',
    fontFamily: '"Computer Modern", "Times New Roman", Georgia, serif',
    latexStyle: "Jake's LaTeX Standard",
  },
  {
    id: 'DeedyCV',
    name: 'Deedy Modern Two-Column (Stanford CS CV)',
    score: 97,
    badge: '97 ATS Score',
    bestFor: 'Developers, Data Scientists & Tech Startups',
    description: 'Famous Stanford CS Deedy layout featuring a left sidebar for skills & education, and main column for work experience & projects.',
    accentColor: '#0284c7',
    fontFamily: '"Plus Jakarta Sans", "Segoe UI", sans-serif',
    latexStyle: 'Deedy Two-Column LaTeX',
  },
  {
    id: 'AwesomeCV',
    name: 'Awesome CV (Modern Executive LaTeX)',
    score: 96,
    badge: '96 ATS Score',
    bestFor: 'Experienced Tech Leads, Product & Managers',
    description: 'Modern executive LaTeX styling with bold crimson/cyan section accents, icon contact badges, and structured achievement bullets.',
    accentColor: '#dc2626',
    fontFamily: 'Roboto, Arial, sans-serif',
    latexStyle: 'Awesome CV LaTeX',
  },
  {
    id: 'AltaCV',
    name: 'AltaCV Visual Professional',
    score: 95,
    badge: '95 ATS Score',
    bestFor: 'Full Stack Engineers & UI/UX Designers',
    description: 'Compact visual layout with pill skill chips, project sub-headings, and clean border dividers derived from AltaCV on Overleaf.',
    accentColor: '#0d9488',
    fontFamily: 'Trebuchet MS, sans-serif',
    latexStyle: 'AltaCV Modern LaTeX',
  },
  {
    id: 'ModernCV',
    name: 'ModernCV Classic Academic',
    score: 94,
    badge: '94 ATS Score',
    bestFor: 'Research, Academia & Higher Education',
    description: 'Traditional European Overleaf academic CV style with chronological dates, formal header hierarchy, and publication sections.',
    accentColor: '#4338ca',
    fontFamily: 'Georgia, serif',
    latexStyle: 'ModernCV Classic LaTeX',
  },
]

const SAMPLE_PROFILE = {
  template: 'JakesResume',
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
  template: 'JakesResume',
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

const tabs = ['Overleaf Templates', 'Profile', 'Experience', 'Education', 'Projects', 'Skills', 'LaTeX Code'] as const

function splitList(value: string) {
  return value.split('\n').map((s) => s.trim()).filter(Boolean)
}

function escapeLaTeX(str: string) {
  return str
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/&/g, '\\&')
    .replace(/%/g, '\\%')
    .replace(/\$/g, '\\$')
    .replace(/#/g, '\\#')
    .replace(/_/g, '\\_')
    .replace(/~/g, '\\textasciitilde{}')
    .replace(/\^/g, '\\textasciicircum{}')
}

export function generateLaTeXSource(form: typeof SAMPLE_PROFILE) {
  const p = form.personal_info
  const contacts = [
    p.email ? `\\href{mailto:${p.email}}{${escapeLaTeX(p.email)}}` : null,
    p.phone ? escapeLaTeX(p.phone) : null,
    p.location ? escapeLaTeX(p.location) : null,
    p.linkedin ? `\\href{https://${p.linkedin}}{${escapeLaTeX(p.linkedin)}}` : null,
    p.portfolio ? `\\href{https://${p.portfolio}}{${escapeLaTeX(p.portfolio)}}` : null,
  ].filter(Boolean)

  let tex = `%-------------------------
% Overleaf Resume / CV Template
% Generated automatically by Student Hub Studio
% Copy and paste into Overleaf.com
%-------------------------

\\documentclass[letterpaper,11pt]{article}

\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}

\\pagestyle{fancy}
\\fancyhf{} % clear all header and footer fields
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

% Adjust margins
\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}

\\urlstyle{same}

\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

% Sections formatting
\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

% Custom commands
\\newcommand{\\resumeItem}[1]{
  \\item\\small{
    {#1 \\vspace{-2pt}}
  }
}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-2pt}\\item
    \\begin{tabular*}{\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & #2 \\\\
      \\textit{\\small#3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeProjectHeading}[2]{
    \\item
    \\begin{tabular*}{\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\small#1 & #2 \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.15in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}

\\begin{document}

%----------HEADING----------
\\begin{center}
    \\textbf{\\Huge \\scshape ${escapeLaTeX(p.full_name || 'Your Full Name')}} \\\\ \\vspace{1pt}
    ${p.title ? `\\small \\textit{${escapeLaTeX(p.title)}} \\\\ \\vspace{1pt}` : ''}
    \\small ${contacts.join(' $|$ ')}
\\end{center}
`

  if (form.summary) {
    tex += `
%-----------SUMMARY-----------
\\section{Professional Summary}
\\small{${escapeLaTeX(form.summary)}}
`
  }

  if (form.experience.some((e) => e.position || e.company)) {
    tex += `
%-----------EXPERIENCE-----------
\\section{Experience}
  \\resumeSubHeadingListStart
`
    form.experience.forEach((exp) => {
      if (exp.position || exp.company) {
        tex += `    \\resumeSubheading
      {${escapeLaTeX(exp.company || 'Company')}}{${escapeLaTeX(exp.start_date || '')} -- ${escapeLaTeX(exp.end_date || 'Present')}}
      {${escapeLaTeX(exp.position || 'Role')}}{}
`
        const bullets = splitList(exp.responsibilities)
        if (bullets.length) {
          tex += `      \\resumeItemListStart\n`
          bullets.forEach((b) => {
            tex += `        \\resumeItem{${escapeLaTeX(b)}}\n`
          })
          tex += `      \\resumeItemListEnd\n`
        }
      }
    })
    tex += `  \\resumeSubHeadingListEnd\n`
  }

  if (form.education.some((e) => e.school || e.degree)) {
    tex += `
%-----------EDUCATION-----------
\\section{Education}
  \\resumeSubHeadingListStart
`
    form.education.forEach((ed) => {
      if (ed.school) {
        tex += `    \\resumeSubheading
      {${escapeLaTeX(ed.school)}}{${escapeLaTeX(ed.graduation_date || '')}}
      {${escapeLaTeX(ed.degree || '')} ${ed.field ? 'in ' + escapeLaTeX(ed.field) : ''}}{${ed.gpa ? 'GPA: ' + escapeLaTeX(ed.gpa) : ''}}
`
      }
    })
    tex += `  \\resumeSubHeadingListEnd\n`
  }

  if (form.projects.some((p) => p.name)) {
    tex += `
%-----------PROJECTS-----------
\\section{Projects}
  \\resumeSubHeadingListStart
`
    form.projects.forEach((proj) => {
      if (proj.name) {
        tex += `    \\resumeProjectHeading
      {\\textbf{${escapeLaTeX(proj.name)}} $|$ \\emph{${escapeLaTeX(proj.technologies || '')}}}{}
      \\resumeItemListStart
        \\resumeItem{${escapeLaTeX(proj.description || '')}}
      \\resumeItemListEnd
`
      }
    })
    tex += `  \\resumeSubHeadingListEnd\n`
  }

  tex += `
%-----------PROGRAMMING SKILLS-----------
\\section{Technical Skills}
 \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
     ${form.skills.technical ? `\\textbf{Technical Languages/Frameworks}{: ${escapeLaTeX(splitList(form.skills.technical).join(', '))}} \\\\` : ''}
     ${form.skills.tools ? `\\textbf{Developer Tools}{: ${escapeLaTeX(splitList(form.skills.tools).join(', '))}} \\\\` : ''}
     ${form.skills.languages ? `\\textbf{Languages}{: ${escapeLaTeX(splitList(form.skills.languages).join(', '))}} \\\\` : ''}
     ${form.skills.soft ? `\\textbf{Soft Skills}{: ${escapeLaTeX(splitList(form.skills.soft).join(', '))}}` : ''}
    }}
 \\end{itemize}

\\end{document}
`
  return tex
}

export function BuilderPage() {
  const toast = useToast()
  const [form, setForm] = useState(empty)
  const [tab, setTab] = useState<(typeof tabs)[number]>('Overleaf Templates')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const person = form.personal_info
  const selectedTemplate = OVERLEAF_TEMPLATES.find((t) => t.id === form.template) || OVERLEAF_TEMPLATES[0]

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
    toast.push("Overleaf High-ATS Sample Profile loaded! Selected Jake's Resume standard.")
  }

  const handleCopyLaTeX = () => {
    navigator.clipboard.writeText(latexCode)
    toast.push('LaTeX code copied to clipboard! Paste directly into Overleaf.com')
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
      await apiDownload('/builder', payload, `${person.full_name.replace(/\s+/g, '_')}_Overleaf_${selectedTemplate.id}.docx`)
      toast.push(`Downloaded resume using ${selectedTemplate.name}!`)
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
        kicker="Overleaf & LaTeX Studio"
        title="Overleaf CV & ATS Resume Builder"
        subtitle="Build world-class single-page resumes inspired by top Overleaf & LaTeX templates (Jake's Resume, Deedy CV, Awesome CV). Download Word/PDF files or copy compilable LaTeX code."
        color="#0ea5e9"
        gradient="linear-gradient(135deg, #0ea5e9, #06b6d4)"
        steps={pageSteps}
        currentStep={currentStep}
      />

      {/* Top Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', gap: '0.8rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <Button variant="secondary" onClick={handleFillSample}>
            <Sparkles size={16} style={{ color: '#0ea5e9' }} /> Auto-Fill Overleaf Sample Profile
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
            {loading ? 'Generating Resume…' : 'Download Resume Document'}
          </Button>
        </div>
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
                  {item === 'Overleaf Templates' && <Layers size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />}
                  {item === 'LaTeX Code' && <Code size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />}
                  {item}
                </button>
              ))}
            </div>

            {/* TAB 1: OVERLEAF TEMPLATES */}
            {tab === 'Overleaf Templates' ? (
              <div className="grid" style={{ gap: '0.9rem' }}>
                <div style={{ marginBottom: '0.2rem' }}>
                  <h3 style={{ margin: '0 0 0.3rem', fontSize: '1.15rem' }}>Select Overleaf CV / LaTeX Template</h3>
                  <p style={{ margin: 0, fontSize: '0.86rem', color: 'var(--ink-soft)' }}>
                    Engineering & Computer Science resume standards used by top tech companies, research labs, and academic institutions.
                  </p>
                </div>

                <div className="grid grid-2" style={{ gap: '0.85rem' }}>
                  {OVERLEAF_TEMPLATES.map((tmpl) => {
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
                          <span
                            style={{
                              padding: '0.2rem 0.5rem',
                              borderRadius: '6px',
                              background: 'var(--bg-muted)',
                              color: 'var(--ink-muted)',
                              fontSize: '0.7rem',
                              fontWeight: 600,
                            }}
                          >
                            {tmpl.latexStyle}
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
                <Field label="Active Overleaf Template">
                  <select
                    className="input"
                    value={form.template}
                    onChange={(e) => setForm({ ...form, template: e.target.value as any })}
                  >
                    {OVERLEAF_TEMPLATES.map((t) => (
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
                    ['linkedin', 'LinkedIn Handle (e.g. linkedin.com/in/username)'],
                    ['portfolio', 'GitHub / Portfolio URL'],
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

                <Field label="Professional Summary (High Impact Overview)">
                  <textarea
                    className="input"
                    rows={4}
                    placeholder="Concise summary highlighting experience, technical skills, and top achievements..."
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
                        placeholder="Start Date (e.g. Jun 2024)"
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
                      placeholder="Bullet points (one bullet per line). Focus on metric achievements..."
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
                  <h4 style={{ margin: 0 }}>Key Projects</h4>
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
                      placeholder="Brief description of project accomplishments..."
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
                    placeholder="English (Native)&#10;Hindi (Fluent)"
                    value={form.skills.languages}
                    onChange={(e) => setForm({ ...form, skills: { ...form.skills, languages: e.target.value } })}
                  />
                </Field>
                <Field label="Soft Skills (One per line)">
                  <textarea
                    className="input"
                    rows={3}
                    placeholder="Problem Solving&#10;Agile Development&#10;Leadership"
                    value={form.skills.soft}
                    onChange={(e) => setForm({ ...form, skills: { ...form.skills, soft: e.target.value } })}
                  />
                </Field>
              </div>
            ) : null}

            {/* TAB 7: LATEX CODE SOURCE */}
            {tab === 'LaTeX Code' ? (
              <div className="grid">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FileCode size={18} style={{ color: '#0ea5e9' }} /> Compilable LaTeX Source (.tex)
                  </h4>
                  <Button variant="secondary" onClick={handleCopyLaTeX}>
                    <Copy size={15} /> Copy LaTeX Code
                  </Button>
                </div>
                <p style={{ margin: '0.2rem 0 0.6rem', fontSize: '0.84rem', color: 'var(--ink-soft)' }}>
                  You can copy this exact LaTeX code and compile it instantly at{' '}
                  <a href="https://www.overleaf.com" target="_blank" rel="noopener noreferrer" style={{ color: '#0ea5e9', textDecoration: 'underline' }}>
                    Overleaf.com
                  </a>.
                </p>
                <textarea
                  className="input"
                  rows={16}
                  readOnly
                  style={{ fontFamily: 'monospace', fontSize: '0.82rem', background: '#0f172a', color: '#f8fafc', padding: '1rem', borderRadius: '12px' }}
                  value={latexCode}
                />
              </div>
            ) : null}

            {error ? <p style={{ color: 'var(--danger)', marginTop: '0.8rem' }}>{error}</p> : null}
          </Card>
        </FadeIn>

        {/* RIGHT COLUMN: DYNAMIC OVERLEAF LIVE PREVIEW */}
        <FadeIn delay={0.08}>
          <div
            style={{
              background: '#ffffff',
              color: '#0f172a',
              minHeight: '760px',
              padding: '2.4rem 2rem',
              borderRadius: '16px',
              boxShadow: '0 20px 45px rgba(0,0,0,0.14)',
              position: 'sticky',
              top: '1rem',
              fontFamily: selectedTemplate.fontFamily,
              border: `1px solid color-mix(in srgb, ${selectedTemplate.accentColor} 30%, transparent)`,
            }}
          >
            {/* Top Indicator */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', paddingBottom: '0.6rem', borderBottom: '1px dashed #e2e8f0' }}>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: selectedTemplate.accentColor,
                  background: `color-mix(in srgb, ${selectedTemplate.accentColor} 12%, transparent)`,
                  padding: '0.2rem 0.6rem',
                  borderRadius: '999px',
                }}
              >
                OVERLEAF PREVIEW: {selectedTemplate.name}
              </span>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>LaTeX A4 Format</span>
            </div>

            {/* Overleaf Header Variations */}
            {selectedTemplate.id === 'JakesResume' && (
              <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                <h2 style={{ margin: 0, fontSize: '1.9rem', color: '#0f172a', letterSpacing: '0.02em', fontWeight: 800, textTransform: 'uppercase' }}>
                  {person.full_name || 'YOUR FULL NAME'}
                </h2>
                {person.title && <p style={{ margin: '0.2rem 0', fontWeight: 600, color: '#475569', fontSize: '0.92rem' }}>{person.title}</p>}
                <p style={{ margin: '0.3rem 0', fontSize: '0.84rem', color: '#334155' }}>
                  {[person.phone, person.email, person.location].filter(Boolean).join('  |  ')}
                </p>
                {(person.linkedin || person.portfolio) && (
                  <p style={{ margin: 0, fontSize: '0.82rem', color: '#0ea5e9' }}>
                    {[person.linkedin, person.portfolio].filter(Boolean).join('  |  ')}
                  </p>
                )}
              </div>
            )}

            {selectedTemplate.id === 'DeedyCV' && (
              <div style={{ display: 'grid', gridTemplateColumns: '0.35fr 0.65fr', gap: '1rem', marginBottom: '1rem', paddingBottom: '0.8rem', borderBottom: '2px solid #0284c7' }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: '1.6rem', color: '#0284c7', fontWeight: 800, lineHeight: 1.1 }}>
                    {person.full_name || 'YOUR NAME'}
                  </h2>
                  <p style={{ margin: '0.2rem 0', fontSize: '0.82rem', color: '#475569' }}>{person.title}</p>
                </div>
                <div style={{ textAlign: 'right', fontSize: '0.8rem', color: '#64748b' }}>
                  <div>{person.email}</div>
                  <div>{person.phone}</div>
                  <div>{person.linkedin}</div>
                </div>
              </div>
            )}

            {selectedTemplate.id === 'AwesomeCV' && (
              <div style={{ textAlign: 'center', marginBottom: '1.2rem' }}>
                <h2 style={{ margin: 0, fontSize: '2rem', color: '#dc2626', fontWeight: 900, letterSpacing: '-0.02em' }}>
                  {person.full_name || 'YOUR FULL NAME'}
                </h2>
                {person.title && <p style={{ margin: '0.2rem 0', fontWeight: 700, color: '#0f172a', fontSize: '0.98rem' }}>{person.title}</p>}
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '0.4rem' }}>
                  {[person.email, person.phone, person.location, person.linkedin].filter(Boolean).map((item, idx) => (
                    <span key={idx} style={{ background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.76rem', fontWeight: 600 }}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {selectedTemplate.id === 'AltaCV' && (
              <div style={{ marginBottom: '1.2rem', background: '#f0fdf4', padding: '1rem', borderRadius: '10px', borderLeft: '4px solid #0d9488' }}>
                <h2 style={{ margin: 0, fontSize: '1.75rem', color: '#0f766e', fontWeight: 800 }}>
                  {person.full_name || 'YOUR FULL NAME'}
                </h2>
                {person.title && <p style={{ margin: '0.2rem 0', fontWeight: 600, color: '#134e4a', fontSize: '0.92rem' }}>{person.title}</p>}
                <p style={{ margin: '0.3rem 0 0', fontSize: '0.82rem', color: '#115e59' }}>
                  {[person.email, person.phone, person.location, person.linkedin].filter(Boolean).join('  •  ')}
                </p>
              </div>
            )}

            {selectedTemplate.id === 'ModernCV' && (
              <div style={{ marginBottom: '1.2rem', paddingBottom: '0.6rem', borderBottom: '2px solid #4338ca' }}>
                <h2 style={{ margin: 0, fontSize: '1.8rem', color: '#4338ca', fontWeight: 700, fontFamily: 'Georgia, serif' }}>
                  {person.full_name || 'YOUR FULL NAME'}
                </h2>
                {person.title && <p style={{ margin: '0.2rem 0', fontSize: '0.95rem', color: '#3730a3', fontStyle: 'italic' }}>{person.title}</p>}
                <p style={{ margin: '0.3rem 0 0', fontSize: '0.82rem', color: '#64748b' }}>
                  {[person.email, person.phone, person.location, person.linkedin].filter(Boolean).join('  |  ')}
                </p>
              </div>
            )}

            {/* Standard Overleaf Section Divider */}
            {selectedTemplate.id === 'JakesResume' && <div style={{ height: '1.5px', background: '#0f172a', margin: '0.4rem 0 1rem' }} />}

            {/* Summary */}
            {form.summary && (
              <div style={{ marginBottom: '1.1rem' }}>
                <h4
                  style={{
                    margin: '0 0 0.35rem',
                    fontSize: '0.88rem',
                    fontWeight: 800,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: selectedTemplate.accentColor,
                    borderBottom: `1px solid color-mix(in srgb, ${selectedTemplate.accentColor} 40%, transparent)`,
                    paddingBottom: '2px',
                  }}
                >
                  Professional Summary
                </h4>
                <p style={{ margin: 0, fontSize: '0.84rem', color: '#334155', lineHeight: 1.5 }}>{form.summary}</p>
              </div>
            )}

            {/* Experience */}
            {form.experience.some((e) => e.position || e.company) && (
              <div style={{ marginBottom: '1.1rem' }}>
                <h4
                  style={{
                    margin: '0 0 0.45rem',
                    fontSize: '0.88rem',
                    fontWeight: 800,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: selectedTemplate.accentColor,
                    borderBottom: `1px solid color-mix(in srgb, ${selectedTemplate.accentColor} 40%, transparent)`,
                    paddingBottom: '2px',
                  }}
                >
                  Experience
                </h4>
                {form.experience.map((exp, i) => (
                  <div key={i} style={{ marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <strong style={{ fontSize: '0.88rem', color: '#0f172a' }}>
                        {exp.company || 'Company'} — <span style={{ fontStyle: 'italic', fontWeight: 600 }}>{exp.position || 'Role'}</span>
                      </strong>
                      <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>
                        {[exp.start_date, exp.end_date].filter(Boolean).join(' – ')}
                      </span>
                    </div>
                    {exp.responsibilities && (
                      <ul style={{ margin: '0.25rem 0 0', paddingLeft: '1.1rem', fontSize: '0.82rem', color: '#334155' }}>
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
                    fontSize: '0.88rem',
                    fontWeight: 800,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: selectedTemplate.accentColor,
                    borderBottom: `1px solid color-mix(in srgb, ${selectedTemplate.accentColor} 40%, transparent)`,
                    paddingBottom: '2px',
                  }}
                >
                  Education
                </h4>
                {form.education.map((ed, i) => (
                  <div key={i} style={{ marginBottom: '0.4rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <strong style={{ fontSize: '0.88rem', color: '#0f172a' }}>{ed.school}</strong>
                      <span style={{ fontSize: '0.78rem', color: '#64748b' }}>{ed.graduation_date}</span>
                    </div>
                    <p style={{ margin: '2px 0 0', fontSize: '0.82rem', color: '#475569', fontStyle: 'italic' }}>
                      {ed.degree} {ed.field ? `in ${ed.field}` : ''} {ed.gpa ? `| GPA: ${ed.gpa}` : ''}
                    </p>
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
                    fontSize: '0.88rem',
                    fontWeight: 800,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: selectedTemplate.accentColor,
                    borderBottom: `1px solid color-mix(in srgb, ${selectedTemplate.accentColor} 40%, transparent)`,
                    paddingBottom: '2px',
                  }}
                >
                  Projects
                </h4>
                {form.projects.map((proj, i) => (
                  <div key={i} style={{ marginBottom: '0.55rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <strong style={{ fontSize: '0.86rem', color: '#0f172a' }}>
                        {proj.name} {proj.technologies ? `| ${proj.technologies}` : ''}
                      </strong>
                    </div>
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
                    fontSize: '0.88rem',
                    fontWeight: 800,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: selectedTemplate.accentColor,
                    borderBottom: `1px solid color-mix(in srgb, ${selectedTemplate.accentColor} 40%, transparent)`,
                    paddingBottom: '2px',
                  }}
                >
                  Technical Skills
                </h4>
                {form.skills.technical && (
                  <p style={{ margin: '0 0 4px', fontSize: '0.82rem', color: '#334155' }}>
                    <strong>Technical Languages: </strong> {splitList(form.skills.technical).join(', ')}
                  </p>
                )}
                {form.skills.tools && (
                  <p style={{ margin: '0 0 4px', fontSize: '0.82rem', color: '#334155' }}>
                    <strong>Developer Tools: </strong> {splitList(form.skills.tools).join(', ')}
                  </p>
                )}
                {form.skills.languages && (
                  <p style={{ margin: '0 0 4px', fontSize: '0.82rem', color: '#334155' }}>
                    <strong>Languages: </strong> {splitList(form.skills.languages).join(', ')}
                  </p>
                )}
                {form.skills.soft && (
                  <p style={{ margin: 0, fontSize: '0.82rem', color: '#334155' }}>
                    <strong>Soft Skills: </strong> {splitList(form.skills.soft).join(', ')}
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
