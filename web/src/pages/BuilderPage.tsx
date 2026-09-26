import { useMemo, useState } from 'react'
import { Plus, FileText, Check, Sparkles, Target, Layers, Copy, Code, ExternalLink, Image as ImageIcon } from 'lucide-react'
import { Card, FadeIn, Button, Field } from '../components/ui/Primitives'
import { GuidedPageHeader } from '../components/ui/GuidedPageHeader'
import { apiDownload } from '../lib/api'
import { useToast } from '../context/ToastContext'

export interface ResumeTemplateOption {
  id: 'MinimalAcademic' | 'ReCeIVe' | 'TwentyOneSeconds' | 'JakesResume'
  name: string
  author: string
  score: number
  badge: string
  bestFor: string
  description: string
  accentColor: string
  fontFamily: string
  latexStyle: string
}

export const OVERLEAF_IMAGE_TEMPLATES: ResumeTemplateOption[] = [
  {
    id: 'TwentyOneSeconds',
    name: 'TwentyOneSeconds Developer CV',
    author: 'Alessandro Trinca Tornidor',
    score: 99,
    badge: '99 ATS Score',
    bestFor: 'Full Stack, Backend & Web Developers',
    description: 'Structured layout with header links, target role title, key-value skills table (Languages, Frameworks, Databases), right-aligned dates, and Project Source Code links.',
    accentColor: '#0f172a',
    fontFamily: '"Computer Modern", "Segoe UI", sans-serif',
    latexStyle: 'TwentyOneSeconds LaTeX',
  },
  {
    id: 'MinimalAcademic',
    name: 'Minimal Academic CV Template',
    author: 'Mariia Steeghs-Turchina',
    score: 98,
    badge: '98 ATS Score',
    bestFor: 'Academic, Research, CS & University',
    description: 'Academic CV with optional top-right photo box, left-aligned date column, full-width section underline rules, and categorized qualifications.',
    accentColor: '#1e293b',
    fontFamily: 'Georgia, "Times New Roman", serif',
    latexStyle: 'Minimal Academic LaTeX',
  },
  {
    id: 'ReCeIVe',
    name: 'ReCeIVe Classic Centered CV',
    author: 'Gedlex',
    score: 97,
    badge: '97 ATS Score',
    bestFor: 'Corporate, Analysts & Engineering',
    description: 'Symmetric centered header layout with brief description, structured competency list (Programming, Data Analysis, Visualization), and right-aligned dates.',
    accentColor: '#0369a1',
    fontFamily: '"Times New Roman", Georgia, serif',
    latexStyle: 'ReCeIVe Class LaTeX',
  },
  {
    id: 'JakesResume',
    name: "Jake's Overleaf Resume",
    author: ' r/EngineeringResumes',
    score: 99,
    badge: '99 ATS Score',
    bestFor: 'Software Engineer & Tech Roles',
    description: 'Classic r/EngineeringResumes single-page standard with horizontal rules and bulleted metric achievements.',
    accentColor: '#0284c7',
    fontFamily: 'Arial, sans-serif',
    latexStyle: "Jake's LaTeX Standard",
  },
]

const SAMPLE_PROFILE = {
  template: 'TwentyOneSeconds',
  personal_info: {
    full_name: 'Jane Doe',
    title: 'FULL STACK DEVELOPER',
    email: 'jane.doe@email.com',
    phone: '5555555555',
    location: 'Anycity, Anystate, Anycountry',
    linkedin: 'linkedin.com/in/janedoe',
    portfolio: 'github.com/janedoe | leetcode.com/janedoe',
    show_photo: true,
  },
  summary: 'I am a highly skilled web developer with over 3 years of experience in HTML, CSS, JavaScript, and PHP. I have knowledge of popular frameworks such as React, Angular, and Vue.js and experience with REST APIs and MVC frameworks.',
  experience: [
    {
      company: 'Anycompany',
      position: 'Web Developer',
      start_date: 'Apr 2022',
      end_date: 'Present',
      description: 'Remote — AnyCity, AnyState, AnyCountry',
      responsibilities: 'Designed and developed dynamic and responsive websites using HTML, CSS, JavaScript, and PHP.\nWorked with REST APIs to retrieve and display data from databases.\nImproved website performance and speed through optimization techniques by 25%.',
    },
    {
      company: 'Anycompany',
      position: 'Backend Developer',
      start_date: 'Aug 2021',
      end_date: 'Nov 2022',
      description: 'AnyCity, AnyState, AnyCountry',
      responsibilities: 'Worked with MVC frameworks to develop robust and scalable backends.\nTroubleshot and fixed bugs and issues in the backend to ensure smooth operation of the application.',
    },
    {
      company: 'Anycompany',
      position: 'Backend Developer Intern',
      start_date: 'Jan 2021',
      end_date: 'Aug 2021',
      description: 'AnyCity, AnyState, AnyCountry',
      responsibilities: 'Assisted senior web developers in the design and development of websites using HTML, CSS, and JavaScript.',
    }
  ],
  education: [
    {
      school: 'University of AnyState',
      degree: 'Bachelor of Science in Computer Science',
      field: 'Computer Science',
      graduation_date: 'Jan 2016 – Dec 2020',
      gpa: '3.9 GPA',
    }
  ],
  projects: [
    {
      name: 'Project 1',
      technologies: 'React.js, Redux, PHP, MySQL',
      description: 'Designed and developed a clean and modern website using HTML, CSS, and JavaScript.\nOptimized website for speed and user experience.\nUtilized responsive design to ensure cross-compatibility across all devices.\nDeployed on GitHub pages via GitHub Actions.',
      link: 'Source Code',
    },
    {
      name: 'Project 2',
      technologies: 'Node.js, Express, JavaScript, Git',
      description: 'A CRUD application exposed using a RESTful API made with Node.js.\nExposed POST, GET, PATCH and DELETE HTTP methods using Express.',
      link: 'Source Code',
    }
  ],
  certifications: [
    'Certified Web Developer by the W3C',
    'Microsoft Certified: Azure Developer Associate',
    'AWS Certified Developer - Associate',
  ],
  skills: {
    technical: 'JavaScript, PHP, Java, HTML, CSS\nReact.js, Angular, Express, Node.js\nMaterial, Redux, react-router\nMongoDB, PostgreSQL\nVisual Studio Code, Git, GitHub',
    tools: 'Git, VS Code, Postman, Docker, AWS',
    languages: 'English (Native), Spanish (Basic)',
    soft: 'Leadership, Problem-solving, Writing, Communication',
  }
}

const empty = {
  template: 'TwentyOneSeconds',
  personal_info: {
    full_name: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    portfolio: '',
    show_photo: false,
  },
  summary: '',
  experience: [{ company: '', position: '', start_date: '', end_date: '', description: '', responsibilities: '' }],
  education: [{ school: '', degree: '', field: '', graduation_date: '', gpa: '' }],
  projects: [{ name: '', technologies: '', description: '', link: '' }],
  certifications: [''],
  skills: { technical: '', soft: '', languages: '', tools: '' },
}

const tabs = ['Templates', 'Profile', 'Experience', 'Education', 'Projects', 'Certifications & Skills', 'LaTeX Code'] as const

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
% Generated by Student Hub Studio
\\documentclass[letterpaper,10pt]{article}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}

\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\textwidth}{1.0in}
\\addtolength{\\topmargin}{-0.5in}
\\addtolength{\\textheight}{1.0in}

\\titleformat{\\section}{\\large\\bfseries\\uppercase}{}{0em}{}[\\titlerule]

\\begin{document}

\\begin{tabular*}{\\textwidth}{l@{\\extracolsep{\\fill}}r}
  \\textbf{\\Huge ${escapeLaTeX(p.full_name || 'Jane Doe')}} & ${escapeLaTeX(p.location || 'Location')}\\\\
  ${escapeLaTeX(p.portfolio || 'Website')} & ${escapeLaTeX(p.email || 'Email')} $|$ ${escapeLaTeX(p.phone || 'Mobile')}\\\\
\\end{tabular*}

\\vspace{4pt}
\\textbf{\\large ${escapeLaTeX(p.title || 'FULL STACK DEVELOPER')}}

\\vspace{6pt}
${escapeLaTeX(form.summary || '')}

\\section{Technical Skills}
\\begin{description}[font=\\normalfont\\bfseries]
  \\item[Languages] : ${escapeLaTeX(form.skills.technical.split('\n')[0] || '')}
  \\item[Frameworks] : ${escapeLaTeX(form.skills.technical.split('\n')[1] || '')}
  \\item[Libraries] : ${escapeLaTeX(form.skills.technical.split('\n')[2] || '')}
  \\item[Databases] : ${escapeLaTeX(form.skills.technical.split('\n')[3] || '')}
\\end{description}

\\section{Experience}
${form.experience
      .map(
        (exp) => `
\\textbf{${escapeLaTeX(exp.position)}} \\hfill ${escapeLaTeX(exp.start_date)} -- ${escapeLaTeX(exp.end_date)}\\\\
\\textit{${escapeLaTeX(exp.company)}} \\hfill \\textit{${escapeLaTeX(exp.description)}}\\\\
\\begin{itemize}[leftmargin=*]
${splitList(exp.responsibilities)
            .map((b) => `  \\item ${escapeLaTeX(b)}`)
            .join('\n')}
\\end{itemize}
`
      )
      .join('\n')}

\\section{Education}
${form.education
      .map(
        (ed) => `
\\textbf{${escapeLaTeX(ed.school)}} \\hfill ${escapeLaTeX(ed.field || '')}\\\\
\\textit{${escapeLaTeX(ed.degree)}} \\hfill ${escapeLaTeX(ed.graduation_date)}\\\\
`
      )
      .join('\n')}

\\section{Certifications}
\\begin{itemize}[leftmargin=*]
${form.certifications.map((c) => `  \\item ${escapeLaTeX(c)}`).join('\n')}
\\end{itemize}

\\end{document}
`
}

export function BuilderPage() {
  const toast = useToast()
  const [form, setForm] = useState(empty)
  const [tab, setTab] = useState<(typeof tabs)[number]>('Templates')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const person = form.personal_info
  const selectedTemplate = OVERLEAF_IMAGE_TEMPLATES.find((t) => t.id === form.template) || OVERLEAF_IMAGE_TEMPLATES[0]

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
    toast.push('Loaded Overleaf Sample Profile (TwentyOneSeconds CV style)!')
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
        title="Overleaf CV & ATS Resume Builder"
        subtitle="Create professional resumes identical to top Overleaf templates (Minimal Academic CV, ReCeIVe, TwentyOneSeconds CV, Jake's Resume)."
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

      <div className="grid grid-2" style={{ gridTemplateColumns: '1.05fr 0.95fr', gap: '1.2rem' }}>
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
                <div style={{ marginBottom: '0.2rem' }}>
                  <h3 style={{ margin: '0 0 0.3rem', fontSize: '1.15rem' }}>Select Overleaf CV Template</h3>
                  <p style={{ margin: 0, fontSize: '0.86rem', color: 'var(--ink-soft)' }}>
                    Choose from top-rated Overleaf templates (Minimal Academic, ReCeIVe, TwentyOneSeconds, Jake's Resume).
                  </p>
                </div>

                <div className="grid" style={{ gap: '0.9rem' }}>
                  {OVERLEAF_IMAGE_TEMPLATES.map((tmpl) => {
                    const isSelected = form.template === tmpl.id
                    return (
                      <div
                        key={tmpl.id}
                        onClick={() => setForm({ ...form, template: tmpl.id })}
                        style={{
                          padding: '1.1rem',
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
                              top: '12px',
                              right: '12px',
                              width: '24px',
                              height: '24px',
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
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
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
                          <span style={{ fontSize: '0.74rem', color: 'var(--ink-muted)' }}>By {tmpl.author}</span>
                        </div>

                        <h4 style={{ margin: '0 0 0.25rem', fontSize: '1.08rem', color: isSelected ? tmpl.accentColor : 'inherit' }}>
                          {tmpl.name}
                        </h4>
                        <p style={{ margin: '0 0 0.45rem', fontSize: '0.78rem', color: 'var(--ink-muted)', fontWeight: 600 }}>
                          Best for: {tmpl.bestFor}
                        </p>
                        <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--ink-soft)', lineHeight: 1.45 }}>
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
                    {OVERLEAF_IMAGE_TEMPLATES.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.badge})
                      </option>
                    ))}
                  </select>
                </Field>

                <div className="grid grid-2">
                  {([
                    ['full_name', 'Full Name *'],
                    ['title', 'Target Role Title (e.g. FULL STACK DEVELOPER)'],
                    ['email', 'Email Address *'],
                    ['phone', 'Mobile Number'],
                    ['location', 'Location (City, State, Country)'],
                    ['linkedin', 'LinkedIn Handle (e.g. linkedin.com/in/janedoe)'],
                    ['portfolio', 'Website / GitHub / LeetCode (e.g. jane-doe.com | GitHub)'],
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
                    <ImageIcon size={14} /> Include Photo Frame Box on Top Right (Minimal Academic CV Template)
                  </label>
                </div>

                <Field label="Summary / Brief Profile Description">
                  <textarea
                    className="input"
                    rows={4}
                    placeholder="Brief description of skills, experience, and development expertise..."
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
                  <h4 style={{ margin: 0 }}>Work Experience</h4>
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
                    <Plus size={16} /> Add Position
                  </Button>
                </div>

                {form.experience.map((exp, i) => (
                  <div key={i} className="card" style={{ background: 'var(--bg-muted)', padding: '0.9rem', borderRadius: '14px' }}>
                    <div className="grid grid-2" style={{ marginBottom: '0.5rem' }}>
                      <input
                        className="input"
                        placeholder="Job Title (e.g. Web Developer)"
                        value={exp.position}
                        onChange={(e) => {
                          const experience = [...form.experience]
                          experience[i] = { ...exp, position: e.target.value }
                          setForm({ ...form, experience })
                        }}
                      />
                      <input
                        className="input"
                        placeholder="Company Name (e.g. Anycompany)"
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
                        placeholder="Location (e.g. Remote — AnyCity, AnyState)"
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
                          placeholder="Start (e.g. Apr 2022)"
                          value={exp.start_date}
                          onChange={(e) => {
                            const experience = [...form.experience]
                            experience[i] = { ...exp, start_date: e.target.value }
                            setForm({ ...form, experience })
                          }}
                        />
                        <input
                          className="input"
                          placeholder="End (e.g. Present)"
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
                        placeholder="University Name (e.g. University of AnyState)"
                        value={ed.school}
                        onChange={(e) => {
                          const education = [...form.education]
                          education[i] = { ...ed, school: e.target.value }
                          setForm({ ...form, education })
                        }}
                      />
                      <input
                        className="input"
                        placeholder="Degree (e.g. Bachelor of Science in Computer Science)"
                        value={ed.degree}
                        onChange={(e) => {
                          const education = [...form.education]
                          education[i] = { ...ed, degree: e.target.value }
                          setForm({ ...form, education })
                        }}
                      />
                    </div>
                    <div className="grid grid-2">
                      <input
                        className="input"
                        placeholder="Date Range (e.g. Jan 2016 – Dec 2020)"
                        value={ed.graduation_date}
                        onChange={(e) => {
                          const education = [...form.education]
                          education[i] = { ...ed, graduation_date: e.target.value }
                          setForm({ ...form, education })
                        }}
                      />
                      <input
                        className="input"
                        placeholder="Location / Honors (e.g. AnyCity, AnyState)"
                        value={ed.field}
                        onChange={(e) => {
                          const education = [...form.education]
                          education[i] = { ...ed, field: e.target.value }
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
                  <h4 style={{ margin: 0 }}>Projects & Code Repositories</h4>
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
                        placeholder="Project Name (e.g. Project 1)"
                        value={project.name}
                        onChange={(e) => {
                          const projects = [...form.projects]
                          projects[i] = { ...project, name: e.target.value }
                          setForm({ ...form, projects })
                        }}
                      />
                      <input
                        className="input"
                        placeholder="Technologies (e.g. React.js, Redux, PHP, MySQL)"
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
                      rows={3}
                      placeholder="Bullet points describing project..."
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

            {/* TAB 6: CERTIFICATIONS & SKILLS */}
            {tab === 'Certifications & Skills' ? (
              <div className="grid">
                <Field label="Certifications (One per line)">
                  <textarea
                    className="input"
                    rows={3}
                    placeholder="Certified Web Developer by the W3C&#10;Microsoft Certified: Azure Developer Associate&#10;AWS Certified Developer - Associate"
                    value={form.certifications.join('\n')}
                    onChange={(e) => setForm({ ...form, certifications: e.target.value.split('\n') })}
                  />
                </Field>

                <Field label="Technical Skills List (Categorized per line: Languages, Frameworks, Libraries, Databases, Dev Tools)">
                  <textarea
                    className="input"
                    rows={6}
                    placeholder="JavaScript, PHP, Java, HTML, CSS&#10;React.js, Angular, Express, Node.js&#10;Material, Redux, react-router&#10;MongoDB, PostgreSQL&#10;Visual Studio Code, Git, GitHub"
                    value={form.skills.technical}
                    onChange={(e) => setForm({ ...form, skills: { ...form.skills, technical: e.target.value } })}
                  />
                </Field>
              </div>
            ) : null}

            {/* TAB 7: LATEX SOURCE */}
            {tab === 'LaTeX Code' ? (
              <div className="grid">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ margin: 0 }}>Compilable LaTeX Code (.tex)</h4>
                  <Button variant="secondary" onClick={handleCopyLaTeX}>
                    <Copy size={15} /> Copy LaTeX Code
                  </Button>
                </div>
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

        {/* RIGHT COLUMN: DYNAMIC LIVE OVERLEAF PREVIEW MATCHING THE SCREENSHOT */}
        <FadeIn delay={0.08}>
          <div
            style={{
              background: '#ffffff',
              color: '#111827',
              minHeight: '800px',
              padding: '2.5rem 2.2rem',
              borderRadius: '12px',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
              position: 'sticky',
              top: '1rem',
              fontFamily: selectedTemplate.fontFamily,
              fontSize: '13px',
              lineHeight: 1.4,
              border: '1px solid #d1d5db',
            }}
          >
            {/* Template Title Pill */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', paddingBottom: '0.5rem', borderBottom: '1px dashed #cbd5e1' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: selectedTemplate.accentColor }}>
                OVERLEAF PREVIEW: {selectedTemplate.name.toUpperCase()}
              </span>
              <span style={{ fontSize: '0.72rem', color: '#64748b' }}>A4 Page Format</span>
            </div>

            {/* TEMPLATE 1: TwentyOneSeconds CV (Right in image) */}
            {selectedTemplate.id === 'TwentyOneSeconds' && (
              <div>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                  <div>
                    <h1 style={{ margin: 0, fontSize: '1.9rem', fontWeight: 700, color: '#000000', letterSpacing: '-0.02em' }}>
                      {person.full_name || 'Jane Doe'}
                    </h1>
                    <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: '#3b82f6' }}>
                      {[person.portfolio || 'jane-doe.com', 'LinkedIn', 'GitHub', 'LeetCode'].join(' | ')}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '0.75rem', color: '#374151' }}>
                    <div>Location: {person.location || 'Anycity, Anystate, Anycountry'}</div>
                    <div>Email: {person.email || 'jane.doe@email.com'} | Mobile: {person.phone || '5555555555'}</div>
                  </div>
                </div>

                <div style={{ marginTop: '0.6rem', marginBottom: '0.8rem' }}>
                  <h3 style={{ margin: 0, fontSize: '0.86rem', fontWeight: 800, textTransform: 'uppercase', color: '#111827', letterSpacing: '0.04em' }}>
                    {person.title || 'FULL STACK DEVELOPER'}
                  </h3>
                  <p style={{ margin: '0.3rem 0 0', fontSize: '0.8rem', color: '#374151', lineHeight: 1.45 }}>
                    {form.summary}
                  </p>
                </div>

                {/* TECHNICAL SKILLS TABLE */}
                <div style={{ marginBottom: '0.9rem' }}>
                  <h4 style={{ margin: '0 0 0.3rem', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', borderBottom: '1px solid #000000', paddingBottom: '2px' }}>
                    TECHNICAL SKILLS
                  </h4>
                  <table style={{ width: '100%', fontSize: '0.78rem', borderCollapse: 'collapse' }}>
                    <tbody>
                      <tr>
                        <td style={{ width: '110px', fontWeight: 700, verticalAlign: 'top', padding: '1px 0' }}>Languages</td>
                        <td style={{ padding: '1px 0' }}>: {skillsRows[0] || 'JavaScript, PHP, Java, HTML, CSS'}</td>
                      </tr>
                      <tr>
                        <td style={{ fontWeight: 700, verticalAlign: 'top', padding: '1px 0' }}>Frameworks</td>
                        <td style={{ padding: '1px 0' }}>: {skillsRows[1] || 'React.js, Angular, Express, Node.js'}</td>
                      </tr>
                      <tr>
                        <td style={{ fontWeight: 700, verticalAlign: 'top', padding: '1px 0' }}>Libraries</td>
                        <td style={{ padding: '1px 0' }}>: {skillsRows[2] || 'Material, Redux, react-router'}</td>
                      </tr>
                      <tr>
                        <td style={{ fontWeight: 700, verticalAlign: 'top', padding: '1px 0' }}>Databases</td>
                        <td style={{ padding: '1px 0' }}>: {skillsRows[3] || 'MongoDB, PostgreSQL'}</td>
                      </tr>
                      <tr>
                        <td style={{ fontWeight: 700, verticalAlign: 'top', padding: '1px 0' }}>Dev Tools</td>
                        <td style={{ padding: '1px 0' }}>: {skillsRows[4] || 'Visual Studio Code, Git, GitHub'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* EXPERIENCE */}
                <div style={{ marginBottom: '0.9rem' }}>
                  <h4 style={{ margin: '0 0 0.4rem', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', borderBottom: '1px solid #000000', paddingBottom: '2px' }}>
                    EXPERIENCE
                  </h4>
                  {form.experience.map((exp, idx) => (
                    <div key={idx} style={{ marginBottom: '0.65rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <strong style={{ fontSize: '0.83rem', color: '#000000' }}>{exp.position || 'Web Developer'}</strong>
                        <span style={{ fontSize: '0.76rem', fontWeight: 700 }}>{exp.start_date || 'Apr 2022'} – {exp.end_date || 'Present'}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: '0.78rem', color: '#4b5563', fontStyle: 'italic', marginBottom: '3px' }}>
                        <span>{exp.company || 'Anycompany'}</span>
                        <span>{exp.description || 'Remote — AnyCity, AnyState'}</span>
                      </div>
                      <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.78rem', color: '#1f2937' }}>
                        {splitList(exp.responsibilities).map((b, bIdx) => (
                          <li key={bIdx} style={{ marginBottom: '1px' }}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* EDUCATION */}
                <div style={{ marginBottom: '0.9rem' }}>
                  <h4 style={{ margin: '0 0 0.3rem', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', borderBottom: '1px solid #000000', paddingBottom: '2px' }}>
                    EDUCATION
                  </h4>
                  {form.education.map((ed, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: '0.78rem' }}>
                      <div>
                        <strong style={{ display: 'block', color: '#000' }}>{ed.school || 'University of AnyState'}</strong>
                        <span style={{ fontStyle: 'italic', color: '#4b5563' }}>{ed.degree || 'Bachelor of Science in Computer Science'}</span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div>{ed.field || 'Anycity, Anystate, Anycountry'}</div>
                        <div style={{ fontWeight: 700 }}>{ed.graduation_date || 'Jan 2016 – Dec 2020'}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* PROJECTS */}
                {form.projects.some((p) => p.name) && (
                  <div style={{ marginBottom: '0.9rem' }}>
                    <h4 style={{ margin: '0 0 0.4rem', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', borderBottom: '1px solid #000000', paddingBottom: '2px' }}>
                      PROJECTS
                    </h4>
                    {form.projects.map((proj, idx) => (
                      <div key={idx} style={{ marginBottom: '0.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: '0.78rem' }}>
                          <div>
                            <strong style={{ color: '#000' }}>{proj.name || 'Project'}</strong>
                            <span style={{ color: '#4b5563', fontStyle: 'italic', marginLeft: '8px' }}>{proj.technologies}</span>
                          </div>
                          <span style={{ color: '#2563eb', fontWeight: 700, fontSize: '0.74rem' }}>{proj.link || 'Source Code'}</span>
                        </div>
                        <ul style={{ margin: '2px 0 0', paddingLeft: '1.1rem', fontSize: '0.76rem', color: '#1f2937' }}>
                          {splitList(proj.description).map((b, bIdx) => (
                            <li key={bIdx}>{b}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {/* CERTIFICATIONS */}
                {form.certifications.length > 0 && form.certifications[0] && (
                  <div>
                    <h4 style={{ margin: '0 0 0.3rem', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', borderBottom: '1px solid #000000', paddingBottom: '2px' }}>
                      CERTIFICATIONS
                    </h4>
                    <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.76rem', color: '#1f2937' }}>
                      {form.certifications.filter(Boolean).map((cert, idx) => (
                        <li key={idx}>{cert}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* TEMPLATE 2: Minimal Academic CV Template (Left in image) */}
            {selectedTemplate.id === 'MinimalAcademic' && (
              <div>
                {/* Header with optional Image box on top right */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.2rem' }}>
                  <div>
                    <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 700, color: '#000000', fontFamily: 'Georgia, serif' }}>
                      {person.full_name || 'Jane Doe'}
                    </h1>
                    <p style={{ margin: '0.3rem 0', fontSize: '0.78rem', color: '#4b5563' }}>
                      01.01.1990, Born in Sample, Sampleland<br />
                      Samplestreet 1<br />
                      1000 Samplecity<br />
                      012 345 67 89<br />
                      <span style={{ color: '#2563eb' }}>{person.email || 'sample@sample.com'}</span>
                    </p>
                  </div>
                  {/* Photo Frame Box from screenshot */}
                  <div
                    style={{
                      width: '100px',
                      height: '100px',
                      border: '1px solid #94a3b8',
                      background: '#f1f5f9',
                      display: 'grid',
                      placeItems: 'center',
                      fontSize: '0.78rem',
                      color: '#64748b',
                    }}
                  >
                    Image
                  </div>
                </div>

                {/* EDUCATION */}
                <div style={{ marginBottom: '1.2rem' }}>
                  <h4 style={{ margin: '0 0 0.6rem', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', borderBottom: '1.5px solid #000000', paddingBottom: '2px', letterSpacing: '0.05em' }}>
                    EDUCATION
                  </h4>
                  {form.education.map((ed, idx) => (
                    <div key={idx} style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '0.8rem', marginBottom: '0.6rem', fontSize: '0.8rem' }}>
                      <div style={{ fontStyle: 'italic', color: '#4b5563' }}>{ed.graduation_date || 'S.2018 - date'}</div>
                      <div>
                        <strong>{ed.degree || 'Master of Sample Science'} at {ed.school || 'Sample Uni'}</strong>
                        <div style={{ fontSize: '0.76rem', color: '#64748b', fontStyle: 'italic' }}>Focus on sample topics</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* WORK EXPERIENCE */}
                <div style={{ marginBottom: '1.2rem' }}>
                  <h4 style={{ margin: '0 0 0.6rem', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', borderBottom: '1.5px solid #000000', paddingBottom: '2px', letterSpacing: '0.05em' }}>
                    WORK EXPERIENCE
                  </h4>
                  {form.experience.map((exp, idx) => (
                    <div key={idx} style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '0.8rem', marginBottom: '0.6rem', fontSize: '0.8rem' }}>
                      <div style={{ fontStyle: 'italic', color: '#4b5563' }}>{exp.start_date || 'S.2017'} – {exp.end_date || 'S.2018'}</div>
                      <div>
                        <strong>{exp.position || 'Sample Internship'} at {exp.company || 'Sample AG'}</strong>
                        <ul style={{ margin: '4px 0 0', paddingLeft: '1.1rem', fontSize: '0.76rem' }}>
                          {splitList(exp.responsibilities).map((b, bIdx) => (
                            <li key={bIdx}>{b}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>

                {/* SKILLS AND QUALIFICATIONS */}
                <div style={{ marginBottom: '1.2rem' }}>
                  <h4 style={{ margin: '0 0 0.6rem', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', borderBottom: '1.5px solid #000000', paddingBottom: '2px', letterSpacing: '0.05em' }}>
                    SKILLS AND QUALIFICATIONS
                  </h4>
                  <div style={{ fontSize: '0.8rem' }}>
                    <strong>Programming Languages</strong>
                    <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: '0.5rem', marginTop: '4px', fontSize: '0.76rem', color: '#4b5563' }}>
                      <div>Advanced skills</div>
                      <div>{form.skills.technical.split('\n')[0] || 'JavaScript, Python'}</div>
                      <div>Basic skills</div>
                      <div>{form.skills.technical.split('\n')[1] || 'C++, Rust'}</div>
                    </div>
                  </div>
                </div>

                {/* INTERESTS */}
                <div>
                  <h4 style={{ margin: '0 0 0.6rem', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', borderBottom: '1.5px solid #000000', paddingBottom: '2px', letterSpacing: '0.05em' }}>
                    INTERESTS
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: '#4b5563' }}>Sample Interests, Academic Research, Machine Learning</p>
                </div>
              </div>
            )}

            {/* TEMPLATE 3: ReCeIVe Centered CV (Center in image) */}
            {selectedTemplate.id === 'ReCeIVe' && (
              <div style={{ textAlign: 'center' }}>
                <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 600, color: '#1e3a8a', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  {person.full_name || 'YOUR NAME'}
                </h1>
                <p style={{ margin: '0.4rem 0', fontSize: '0.78rem', color: '#2563eb' }}>
                  Address, YY, XX — <span style={{ textDecoration: 'underline' }}>{person.email || 'email@address.com'}</span> — mywebsite.com
                </p>
                <p style={{ margin: '0 0 1.2rem', fontSize: '0.8rem', color: '#374151', fontStyle: 'italic', maxWidth: '85%', marginLeft: 'auto', marginRight: 'auto' }}>
                  {form.summary || 'My brief description. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Ut purus elit, vestibulum ut, fermentum a, justo.'}
                </p>

                {/* Technical Skills */}
                <div style={{ textAlign: 'left', marginBottom: '1.1rem' }}>
                  <h4 style={{ margin: '0 0 0.4rem', fontSize: '0.85rem', fontWeight: 700, color: '#1e3a8a', textTransform: 'none' }}>
                    Technical Skills
                  </h4>
                  <div style={{ fontSize: '0.78rem', lineHeight: 1.5, color: '#374151' }}>
                    <div><strong>Programming skills — </strong> {skillsRows[0] || 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit.'}</div>
                    <div><strong>Data Analysis — </strong> {skillsRows[1] || 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit.'}</div>
                    <div><strong>Visualization — </strong> {skillsRows[2] || 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit.'}</div>
                  </div>
                </div>

                {/* Core Competencies */}
                <div style={{ textAlign: 'left', marginBottom: '1.1rem' }}>
                  <h4 style={{ margin: '0 0 0.4rem', fontSize: '0.85rem', fontWeight: 700, color: '#1e3a8a', textTransform: 'none' }}>
                    Core Competencies
                  </h4>
                  <div style={{ fontSize: '0.78rem', lineHeight: 1.5, color: '#374151' }}>
                    <div><strong>Leadership — </strong> Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</div>
                    <div><strong>Problem-solving — </strong> Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</div>
                    <div><strong>Communication — </strong> Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</div>
                  </div>
                </div>

                {/* Positions */}
                <div style={{ textAlign: 'left', marginBottom: '1.1rem' }}>
                  <h4 style={{ margin: '0 0 0.4rem', fontSize: '0.85rem', fontWeight: 700, color: '#1e3a8a', textTransform: 'none' }}>
                    Positions
                  </h4>
                  {form.experience.map((exp, idx) => (
                    <div key={idx} style={{ marginBottom: '0.6rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, color: '#1e3a8a' }}>
                        <span>{exp.position || 'First Position'} — {exp.company || 'XYZ Institute'}</span>
                        <span>{exp.start_date || 'XX 2000'} — {exp.end_date || 'Present'}</span>
                      </div>
                      <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: '#374151' }}>{exp.responsibilities || 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit.'}</p>
                    </div>
                  ))}
                </div>

                {/* Education */}
                <div style={{ textAlign: 'left' }}>
                  <h4 style={{ margin: '0 0 0.4rem', fontSize: '0.85rem', fontWeight: 700, color: '#1e3a8a', textTransform: 'none' }}>
                    Education
                  </h4>
                  {form.education.map((ed, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.3rem' }}>
                      <span>{ed.degree || 'Ph.D. in YYY'} — {ed.school || 'XYZ University, CT'}</span>
                      <span style={{ fontWeight: 700 }}>{ed.graduation_date || 'XX 2000 — YY XXXX'}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TEMPLATE 4: Jake's Resume */}
            {selectedTemplate.id === 'JakesResume' && (
              <div style={{ textAlign: 'center' }}>
                <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 800, textTransform: 'uppercase' }}>{person.full_name || 'ALEX RIVERS'}</h1>
                <p style={{ margin: '0.3rem 0', fontSize: '0.8rem', color: '#4b5563' }}>{[person.email, person.phone, person.location].filter(Boolean).join(' | ')}</p>
                <div style={{ height: '1.5px', background: '#000', margin: '0.5rem 0 1rem' }} />
                <div style={{ textAlign: 'left' }}>
                  <h4 style={{ margin: '0 0 0.4rem', fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', borderBottom: '1px solid #000', paddingBottom: '2px' }}>
                    EXPERIENCE
                  </h4>
                  {form.experience.map((exp, idx) => (
                    <div key={idx} style={{ marginBottom: '0.6rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '0.82rem' }}>
                        <span>{exp.position} — {exp.company}</span>
                        <span>{exp.start_date} – {exp.end_date}</span>
                      </div>
                      <ul style={{ margin: '3px 0 0', paddingLeft: '1.1rem', fontSize: '0.78rem' }}>
                        {splitList(exp.responsibilities).map((b, bIdx) => (
                          <li key={bIdx}>{b}</li>
                        ))}
                      </ul>
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
