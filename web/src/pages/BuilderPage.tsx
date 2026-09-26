import { useMemo, useState } from 'react'
import { Plus, FileText, Check, Sparkles, Target, Layers, Copy, Code, ExternalLink, Image as ImageIcon, Eye, FileSpreadsheet } from 'lucide-react'
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
  image: string
  accentColor: string
  fontFamily: string
  latexStyle: string
}

export const EXACT_OVERLEAF_TEMPLATES: ResumeTemplateOption[] = [
  {
    id: 'LewisVerstappen',
    name: 'Lewis Verstappen CV',
    subtitle: 'Left-Margin Sidebar Layout',
    score: 99,
    badge: '99 ATS Score',
    bestFor: 'Executives, Designers & Modern Roles',
    description: 'Minimalist layout with section headers (CONTACT INFO, ABOUT ME, EXPERIENCE, EDUCATION) in the left margin.',
    image: '/templates/lewis_verstappen.png',
    accentColor: '#334155',
    fontFamily: '"Plus Jakarta Sans", sans-serif',
    latexStyle: 'Left Margin LaTeX Class',
  },
  {
    id: 'JackSparrow',
    name: 'Jack Sparrow Creative CV',
    subtitle: 'Dark Header & Avatar Sidebar',
    score: 97,
    badge: '97 ATS Score',
    bestFor: 'Creative Engineers, UI/UX & Developers',
    description: 'Dark top header, circular profile avatar photo, left sidebar with blue category badges, skill progress bars, and language rating dots.',
    image: '/templates/jack_sparrow.png',
    accentColor: '#0284c7',
    fontFamily: '"Plus Jakarta Sans", sans-serif',
    latexStyle: 'TwentySeconds Graphic LaTeX',
  },
  {
    id: 'JaneDoe',
    name: 'Jane Doe Developer CV',
    subtitle: 'Full Stack Tech Standard',
    score: 99,
    badge: '99 ATS Score',
    bestFor: 'Software Engineers & Full Stack Devs',
    description: 'Header links (GitHub, LeetCode), blue target role title, structured technical skills table, right-aligned dates, and Project Source Code links.',
    image: '/templates/jane_doe.png',
    accentColor: '#2563eb',
    fontFamily: 'Arial, sans-serif',
    latexStyle: 'TwentyOneSeconds LaTeX',
  },
  {
    id: 'CarlJohnson',
    name: 'Carl Johnson Academic CV',
    subtitle: 'Formal Blue Serif & Thesis CV',
    score: 98,
    badge: '98 ATS Score',
    bestFor: 'Research Scholars, Postdocs & Academia',
    description: 'Centered blue serif header with star-separated contact line (✻), blue italic section titles, right-aligned dates, and thesis project highlights.',
    image: '/templates/carl_johnson.png',
    accentColor: '#1d4ed8',
    fontFamily: 'Georgia, serif',
    latexStyle: 'Academic Classic Serif LaTeX',
  },
  {
    id: 'ReCeIVe',
    name: 'ReCeIVe Classic CV',
    subtitle: 'Symmetric Blue Centered Layout',
    score: 96,
    badge: '96 ATS Score',
    bestFor: 'Corporate, Analysts & Engineers',
    description: 'Symmetric centered header layout with brief description paragraph, structured technical competencies, and right-aligned position dates.',
    image: '/templates/receive_cv.png',
    accentColor: '#1e3a8a',
    fontFamily: '"Times New Roman", serif',
    latexStyle: 'ReCeIVe Class LaTeX',
  },
]

const TEMPLATE_PRESETS: Record<string, any> = {
  LewisVerstappen: {
    template: 'LewisVerstappen',
    personal_info: {
      full_name: 'LEWIS VERSTAPPEN',
      title: 'Senior Product Architect',
      email: 'youremail@email.com',
      phone: '+31 6 69696969',
      location: 'Street 185, 1234IJ, City Name, Morocco',
      linkedin: 'linkedin.com/in/username',
      portfolio: 'github.com/username',
      show_photo: false,
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
        gpa: 'Graduated with summa cum laude',
      },
      {
        school: 'The University of Wasted Time',
        degree: 'BA IN PROCRASTINATING',
        field: 'Naples, Italy',
        graduation_date: '2016-2019',
        gpa: 'Won the most prestigious award',
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
    certifications: ['Certified Space Systems Engineer', 'AWS Cloud Architect'],
    skills: {
      technical: 'JavaScript, Python, React, Node.js\nExpress, FastAPI, PostgreSQL\nMongoDB, Docker, Git',
      tools: 'Git, Docker, AWS, Figma',
      languages: 'English (Mother tongue), Dutch (Fluent)',
      soft: 'Leadership, Problem Solving, Communication',
    }
  },
  JackSparrow: {
    template: 'JackSparrow',
    personal_info: {
      full_name: 'Jack Sparrow',
      title: 'Captain',
      email: 'jack@sparrow.org',
      phone: '0099/333 5647380',
      location: 'Tortuga',
      linkedin: 'sparrow',
      portfolio: '@sparrow',
      show_photo: true,
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    },
    summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a diam lectus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a diam lectus.',
    experience: [
      {
        company: 'LEAD',
        position: 'Captain of the Black Pearl',
        start_date: '2018',
        end_date: '2021',
        description: 'East Indies',
        responsibilities: 'Finally got the goddamn ship back. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      },
      {
        company: 'LEAD',
        position: 'Captain of the Black Pearl',
        start_date: '2016',
        end_date: '2017',
        description: 'Tortuga',
        responsibilities: 'Found a secret treasure, lost the ship. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      }
    ],
    education: [
      {
        school: 'Tortuga Uni',
        degree: 'Captain',
        field: 'CERTIFIED',
        graduation_date: '1710',
        gpa: 'Honors',
      },
      {
        school: 'London',
        degree: 'Buccaneering',
        field: 'M.A.',
        graduation_date: '1715',
        gpa: 'Passed',
      }
    ],
    projects: [
      {
        name: 'The Black Pearl Navigation',
        technologies: 'Compass, Map, Telescope',
        description: 'Navigated uncharted waters to reach the ends of the earth.',
        link: 'Source Code',
      }
    ],
    certifications: ["Captain's Certificates 1708", "Travel grant 1710"],
    skills: {
      technical: 'html, css\nLaTeX\npython\nR\njavascript',
      tools: 'Map, Compass, Telescope',
      languages: 'English (Mother tongue), French (C2), Spanish (C2), Italian (C2)',
      soft: 'Privateering, Buccaneering, Parley, Rum',
    }
  },
  JaneDoe: {
    template: 'JaneDoe',
    personal_info: {
      full_name: 'Jane Doe',
      title: 'FULL STACK DEVELOPER',
      email: 'jane.doe@anysite.com',
      phone: '5555555555',
      location: 'Anycity, Anystate, Anycountry',
      linkedin: 'linkedin.com/in/janedoe',
      portfolio: 'jane-doe.com | GitHub | Leetcode',
      show_photo: false,
    },
    summary: 'I am a highly skilled web developer with over 3 years of experience in HTML, CSS, JavaScript, and PHP. I have knowledge of popular frameworks such as React, Angular, and Vue.js and experience with REST APIs and MVC frameworks.',
    experience: [
      {
        company: 'Anycompany',
        position: 'Web Developer',
        start_date: 'Apr 2022',
        end_date: 'Present',
        description: 'Remote — AnyCity, AnyState, AnyCountry',
        responsibilities: 'Designed and developed dynamic and responsive websites using HTML, CSS, JavaScript, and PHP.\nWorked with REST APIs to retrieve and display data from databases.\nImproved website performance and speed through optimization techniques by 55%.',
      },
      {
        company: 'Anycompany',
        position: 'Backend Developer',
        start_date: 'Aug 2021',
        end_date: 'Nov 2022',
        description: 'Anycity, Anystate, Anycountry',
        responsibilities: 'Worked with MVC frameworks to develop robust and scalable backends.\nTroubleshot and fixed bugs and issues in the backend to ensure smooth operation of the application.',
      }
    ],
    education: [
      {
        school: 'University of AnyState',
        degree: 'Bachelor of Science in Computer Science',
        field: 'Anycity, Anystate, Anycountry',
        graduation_date: 'Jan 2016 – Dec 2020',
        gpa: '3.9 GPA',
      }
    ],
    projects: [
      {
        name: 'Project 1',
        technologies: 'React.js, Redux, PHP, MySQL Git',
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
      technical: 'JavaScript, PHP, Java, HTML, CSS\nReact.js, Angular, Express, Node.js\nMaterial, Redux, React Router\nMongoDB, PostgreSQL\nVisual Studio Code, Git, Gitlab',
      tools: 'Git, VS Code, Postman, Docker',
      languages: 'English (Native)',
      soft: 'Problem Solving, Teamwork',
    }
  },
  CarlJohnson: {
    template: 'CarlJohnson',
    personal_info: {
      full_name: 'Carl Johnson (CJ)',
      title: 'Head of Machine Learning for Absurd Stuff',
      email: 'pleasedonotcontactme@gmail.com',
      phone: '+1-202-555-0100',
      location: '113, Groove Street',
      linkedin: 'Ariccia, Italy',
      portfolio: 'Date of birth: 08-11-1968',
      show_photo: false,
    },
    summary: 'Master scholar and absurdity robotics researcher specializing in Brexit white walker predictions and flamethrower toast robotics.',
    experience: [
      {
        company: 'Dank Memes Inc.',
        position: 'Head of "Machine Learning for Absurd Stuff" Department',
        start_date: 'September 2019',
        end_date: 'September 2021',
        description: 'Ariccia, Italy',
        responsibilities: 'Developed state-of-the-art predictive models for next-generation memes.\nApplied machine learning techniques to optimize unicorn-mounted laser systems.\nStreamlined internal meme generation pipelines.',
      },
      {
        company: 'Viral News Robotics Laboratory (VNRL)',
        position: 'Robotics Comedian Intern',
        start_date: 'March 2019',
        end_date: 'July 2019',
        description: 'Fries, Virginia',
        responsibilities: 'Engineered a robotic Tyrion Lannister that repeatedly asks, "Where\'s the wine?"',
      }
    ],
    education: [
      {
        school: 'Faber College',
        degree: "Master's degree in Memeology and Unicorn Analytics",
        field: 'Graduated with honors',
        graduation_date: 'February 2019 - April 2020',
        gpa: 'Honors',
      },
      {
        school: 'Westeros University',
        degree: "Bachelor's degree in Absurd Robotics Engineering",
        field: 'Final grade: 9.001/10.000',
        graduation_date: 'May 2016 - August 2018',
        gpa: '9.001/10.000',
      }
    ],
    projects: [
      {
        name: 'Procrastinators Anonymous',
        technologies: 'Machine Learning for Laziness',
        description: 'Developed an AI that predicts the perfect moment to start binge-watching Dr. House episodes instead of working.',
        link: 'Source Code',
      }
    ],
    certifications: ['Captain Certificates 1708', 'Dumb Literature Club Member'],
    skills: {
      technical: 'Python, Memeology, Robotics, Machine Learning\nTensorFlow, PyTorch, C++',
      tools: 'Linux, Git, VS Code',
      languages: 'English (Mother tongue), Italian (Fluent)',
      soft: 'Absurdity Research, Robotics Comedy',
    }
  },
  ReCeIVe: {
    template: 'ReCeIVe',
    personal_info: {
      full_name: 'YOUR NAME',
      title: 'Lead Systems Analyst',
      email: 'email@address.com',
      phone: '+1 555-0192',
      location: 'Address, YY, XX',
      linkedin: 'mywebsite.com',
      portfolio: 'mywebsite.com',
      show_photo: false,
    },
    summary: 'My brief description. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Ut purus elit, vestibulum ut, fermentum a, justo. Morbi auctor lorem non justo.',
    experience: [
      {
        company: 'XYZ Institute',
        position: 'First Position',
        start_date: 'XX 2000',
        end_date: 'Present',
        description: 'CT, USA',
        responsibilities: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Ut purus elit, vestibulum ut, placerat ac, adipiscing vitae, felis.',
      }
    ],
    education: [
      {
        school: 'XYZ University, CT',
        degree: 'Ph.D. in YYY',
        field: 'CT, USA',
        graduation_date: 'XX 2000 — YY XXXX',
        gpa: 'High Distinction',
      }
    ],
    projects: [
      {
        name: 'Visualization Engine',
        technologies: 'C++, OpenGL, Python',
        description: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit.',
        link: 'Source Code',
      }
    ],
    certifications: ['Certified Data Analyst'],
    skills: {
      technical: 'Programming skills — Lorem ipsum dolor sit amet\nData Analysis — Lorem ipsum dolor sit amet\nVisualization — Lorem ipsum dolor sit amet',
      tools: 'Git, Unix',
      languages: 'English',
      soft: 'Leadership, Problem-solving, Communication, Writing',
    }
  }
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

export function generateLaTeXSource(form: typeof TEMPLATE_PRESETS.LewisVerstappen) {
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
        (e: any) => `\\textbf{${escapeLaTeX(e.position)}} \\hfill ${escapeLaTeX(e.start_date)}--${escapeLaTeX(e.end_date)}\\\\
\\textit{${escapeLaTeX(e.company)}} $|$ \\textit{${escapeLaTeX(e.description)}}\\\\
\\begin{itemize}
${splitList(e.responsibilities).map((r: string) => `  \\item ${escapeLaTeX(r)}`).join('\n')}
\\end{itemize}`
      )
      .join('\n\n')}

\\section*{EDUCATION}
${form.education
      .map(
        (ed: any) => `\\textbf{${escapeLaTeX(ed.degree)}} \\hfill ${escapeLaTeX(ed.graduation_date)}\\\\
\\textit{${escapeLaTeX(ed.school)}} $|$ \\textit{${escapeLaTeX(ed.field)}}`
      )
      .join('\n\n')}
\\end{document}`
}

export function BuilderPage() {
  const toast = useToast()
  const [form, setForm] = useState(TEMPLATE_PRESETS.LewisVerstappen)
  const [tab, setTab] = useState<(typeof tabs)[number]>('Templates')
  const [previewMode, setPreviewMode] = useState<'image' | 'render'>('image')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const person = form.personal_info
  const selectedTemplate = EXACT_OVERLEAF_TEMPLATES.find((t) => t.id === form.template) || EXACT_OVERLEAF_TEMPLATES[0]

  const hasProfile = !!(person.full_name && person.email)
  const hasExperience = form.experience.some((e: any) => e.position || e.company) || form.education.some((e: any) => e.school)
  const currentStep = hasExperience ? 2 : hasProfile ? 1 : 0

  const pageSteps = [
    { title: 'Choose template', description: 'Overleaf / LaTeX layout' },
    { title: 'Fill details', description: 'Experience & skills' },
    { title: 'Download resume', description: 'Export Word / LaTeX' },
  ]

  const latexCode = useMemo(() => generateLaTeXSource(form), [form])

  const payload = useMemo(() => ({
    ...form,
    experience: form.experience.map((e: any) => ({
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

  const handleSelectTemplate = (templateId: string) => {
    if (TEMPLATE_PRESETS[templateId]) {
      setForm(TEMPLATE_PRESETS[templateId])
      toast.push(`Loaded ${templateId} exact template & data!`)
    } else {
      setForm({ ...form, template: templateId as any })
    }
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

  const skillsRows = form.skills.technical.split('\n').map((s: string) => s.trim()).filter(Boolean)

  return (
    <div>
      <GuidedPageHeader
        icon={FileText}
        kicker="Exact Overleaf LaTeX Studio"
        title="Exact Resume Templates with Real Previews"
        subtitle="Select from the exact Overleaf resume template photos you attached (Lewis Verstappen, Jack Sparrow, Jane Doe, Carl Johnson, ReCeIVe)."
        color="#0ea5e9"
        gradient="linear-gradient(135deg, #0ea5e9, #06b6d4)"
        steps={pageSteps}
        currentStep={currentStep}
      />

      {/* Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', gap: '0.8rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <Button variant="secondary" onClick={() => handleSelectTemplate('LewisVerstappen')}>
            <Sparkles size={16} style={{ color: '#0ea5e9' }} /> Reset to Lewis Verstappen
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
            Overleaf CV Gallery <ExternalLink size={12} />
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

            {/* TAB 1: TEMPLATES GRID WITH EXACT SCREENSHOT PREVIEW PHOTOS */}
            {tab === 'Templates' ? (
              <div className="grid" style={{ gap: '1rem' }}>
                <div>
                  <h3 style={{ margin: '0 0 0.3rem', fontSize: '1.15rem' }}>Select Exact Overleaf Resume Template</h3>
                  <p style={{ margin: 0, fontSize: '0.86rem', color: 'var(--ink-soft)' }}>
                    Each card features the exact screenshot template image. Click any template to view its exact preview photo & load its sample data!
                  </p>
                </div>

                <div className="grid" style={{ gap: '1rem' }}>
                  {EXACT_OVERLEAF_TEMPLATES.map((tmpl) => {
                    const isSelected = form.template === tmpl.id
                    return (
                      <div
                        key={tmpl.id}
                        onClick={() => handleSelectTemplate(tmpl.id)}
                        style={{
                          borderRadius: '16px',
                          border: isSelected ? `2px solid ${tmpl.accentColor}` : '1px solid var(--line)',
                          background: isSelected ? `color-mix(in srgb, ${tmpl.accentColor} 8%, var(--bg-elevated))` : 'var(--bg-elevated)',
                          cursor: 'pointer',
                          transition: 'all 200ms ease',
                          overflow: 'hidden',
                          boxShadow: isSelected ? `0 8px 25px color-mix(in srgb, ${tmpl.accentColor} 25%, transparent)` : 'none',
                        }}
                      >
                        {/* SCREENSHOT IMAGE PREVIEW HEADER */}
                        <div
                          style={{
                            height: '180px',
                            background: '#0f172a',
                            position: 'relative',
                            overflow: 'hidden',
                            borderBottom: '1px solid var(--line)',
                          }}
                        >
                          <img
                            src={tmpl.image}
                            alt={tmpl.name}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              objectPosition: 'top center',
                              filter: isSelected ? 'brightness(1)' : 'brightness(0.9)',
                              transition: 'transform 300ms ease',
                            }}
                          />
                          <div
                            style={{
                              position: 'absolute',
                              top: '10px',
                              left: '10px',
                              background: 'rgba(15, 23, 42, 0.85)',
                              backdropFilter: 'blur(6px)',
                              color: 'white',
                              padding: '0.2rem 0.6rem',
                              borderRadius: '999px',
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <Target size={12} style={{ color: '#10b981' }} /> {tmpl.badge}
                          </div>

                          {isSelected && (
                            <div
                              style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                width: '26px',
                                height: '26px',
                                borderRadius: '50%',
                                background: tmpl.accentColor,
                                color: 'white',
                                display: 'grid',
                                placeItems: 'center',
                                boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                              }}
                            >
                              <Check size={16} />
                            </div>
                          )}
                        </div>

                        {/* CARD INFO */}
                        <div style={{ padding: '1rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.3rem' }}>
                            <h4 style={{ margin: 0, fontSize: '1.08rem', color: isSelected ? tmpl.accentColor : 'inherit' }}>
                              {tmpl.name}
                            </h4>
                            <span style={{ fontSize: '0.74rem', color: 'var(--ink-muted)', fontWeight: 600 }}>{tmpl.subtitle}</span>
                          </div>
                          <p style={{ margin: '0 0 0.5rem', fontSize: '0.78rem', color: 'var(--ink-muted)', fontWeight: 600 }}>
                            Best for: {tmpl.bestFor}
                          </p>
                          <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--ink-soft)', lineHeight: 1.45 }}>
                            {tmpl.description}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div style={{ marginTop: '0.6rem', textAlign: 'right' }}>
                  <Button variant="secondary" onClick={() => setTab('Profile')}>
                    Next: Edit Profile Details →
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
                    onChange={(e) => handleSelectTemplate(e.target.value)}
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
                    ['title', 'Job Title / Role'],
                    ['email', 'Email Address *'],
                    ['phone', 'Phone / Mobile Number'],
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
                    <ImageIcon size={14} /> Include Profile Photo Avatar Frame (Jack Sparrow Creative Template)
                  </label>
                </div>

                <Field label="Summary / About Me">
                  <textarea
                    className="input"
                    rows={4}
                    placeholder="Brief summary paragraph..."
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

                {form.experience.map((exp: any, i: number) => (
                  <div key={i} className="card" style={{ background: 'var(--bg-muted)', padding: '0.9rem', borderRadius: '14px' }}>
                    <div className="grid grid-2" style={{ marginBottom: '0.5rem' }}>
                      <input
                        className="input"
                        placeholder="Position Title (e.g. JOB TITLE)"
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

                {form.education.map((ed: any, i: number) => (
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
                        placeholder="Graduation Dates (e.g. 2020-2023)"
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
                {form.projects.map((project: any, i: number) => (
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
                      placeholder="Description..."
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
                    placeholder="JavaScript, Python, React&#10;Express, FastAPI, PostgreSQL"
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

            {/* TAB 7: LATEX CODE */}
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

        {/* RIGHT COLUMN: PREVIEW PANEL WITH EXACT SCREENSHOT TEMPLATE PHOTO VIEW BY DEFAULT */}
        <FadeIn delay={0.08}>
          <div
            style={{
              background: '#1e293b',
              borderRadius: '16px',
              padding: '0.8rem',
              boxShadow: '0 20px 45px rgba(0,0,0,0.25)',
              position: 'sticky',
              top: '1rem',
              border: '1px solid #334155',
            }}
          >
            {/* VIEW MODE TOGGLE BAR */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.8rem',
                background: '#0f172a',
                padding: '0.5rem 0.8rem',
                borderRadius: '12px',
                border: '1px solid #334155',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 700 }}>
                <Eye size={15} style={{ color: '#0ea5e9' }} /> Live Template Preview
              </div>
              <div style={{ display: 'flex', gap: '4px', background: '#1e293b', padding: '2px', borderRadius: '8px' }}>
                <button
                  type="button"
                  onClick={() => setPreviewMode('image')}
                  style={{
                    padding: '0.3rem 0.6rem',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    borderRadius: '6px',
                    border: 'none',
                    background: previewMode === 'image' ? '#0ea5e9' : 'transparent',
                    color: previewMode === 'image' ? '#ffffff' : '#94a3b8',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <ImageIcon size={13} /> Exact Template Photo
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode('render')}
                  style={{
                    padding: '0.3rem 0.6rem',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    borderRadius: '6px',
                    border: 'none',
                    background: previewMode === 'render' ? '#0ea5e9' : 'transparent',
                    color: previewMode === 'render' ? '#ffffff' : '#94a3b8',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <FileSpreadsheet size={13} /> Interactive Render
                </button>
              </div>
            </div>

            {/* PREVIEW CONTAINER */}
            <div
              style={{
                background: '#ffffff',
                color: '#111827',
                minHeight: '760px',
                borderRadius: '12px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                fontFamily: selectedTemplate.fontFamily,
                fontSize: '13px',
                lineHeight: 1.4,
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              {/* MODE 1: EXACT SCREENSHOT TEMPLATE PHOTO VIEW (DEFAULT) */}
              {previewMode === 'image' ? (
                <div style={{ width: '100%', height: '100%', background: '#f8fafc', position: 'relative' }}>
                  <img
                    src={selectedTemplate.image}
                    alt={selectedTemplate.name}
                    style={{
                      width: '100%',
                      height: 'auto',
                      maxHeight: '850px',
                      objectFit: 'contain',
                      objectPosition: 'top center',
                      display: 'block',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '14px',
                      left: '14px',
                      right: '14px',
                      background: 'rgba(15, 23, 42, 0.92)',
                      backdropFilter: 'blur(10px)',
                      color: '#ffffff',
                      padding: '0.65rem 1rem',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '8px',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.35)',
                      border: '1px solid rgba(255,255,255,0.1)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Sparkles size={16} style={{ color: '#38bdf8' }} />
                      <span>This is just to preview. Let's start building with this template if you like?</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setTab('Profile')}
                      style={{
                        background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                        color: '#ffffff',
                        border: 'none',
                        padding: '0.35rem 0.8rem',
                        borderRadius: '8px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Start Building →
                    </button>
                  </div>
                </div>
              ) : (
                /* MODE 2: INTERACTIVE LIVE TEXT RENDER */
                <div style={{ padding: selectedTemplate.id === 'JackSparrow' ? '0' : '2.4rem 2rem' }}>
                  {/* 1. LEWIS VERSTAPPEN */}
                  {selectedTemplate.id === 'LewisVerstappen' && (
                    <div style={{ padding: '0.5rem' }}>
                      <div style={{ marginBottom: '1.5rem', paddingLeft: '140px', position: 'relative' }}>
                        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '2px', background: '#000000' }} />
                        <h1 style={{ margin: 0, fontSize: '2.2rem', fontWeight: 300, color: '#475569', letterSpacing: '0.25em', lineHeight: 1 }}>
                          LEWIS
                        </h1>
                        <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700, color: '#1e293b', letterSpacing: '0.12em', lineHeight: 1.1 }}>
                          VERSTAPPEN
                        </h1>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: '1rem', marginBottom: '1.2rem' }}>
                        <div style={{ fontWeight: 800, fontSize: '0.82rem', letterSpacing: '0.05em', color: '#1e293b', paddingTop: '2px' }}>
                          CONTACT INFO
                        </div>
                        <div style={{ borderTop: '1px solid #000', paddingTop: '0.4rem' }}>
                          <table style={{ width: '100%', fontSize: '0.8rem', borderCollapse: 'collapse' }}>
                            <tbody>
                              <tr><td style={{ width: '90px', fontWeight: 700, padding: '2px 0' }}>E-mail</td><td style={{ color: '#64748b' }}>{person.email}</td></tr>
                              <tr><td style={{ fontWeight: 700, padding: '2px 0' }}>Phone Nr</td><td style={{ color: '#64748b' }}>{person.phone}</td></tr>
                              <tr><td style={{ fontWeight: 700, padding: '2px 0' }}>Address</td><td style={{ color: '#64748b' }}>{person.location}</td></tr>
                              <tr><td style={{ fontWeight: 700, padding: '2px 0' }}>LinkedIn</td><td style={{ color: '#64748b' }}>{person.linkedin}</td></tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: '1rem', marginBottom: '1.2rem' }}>
                        <div style={{ fontWeight: 800, fontSize: '0.82rem', letterSpacing: '0.05em', color: '#1e293b', paddingTop: '2px' }}>
                          ABOUT ME
                        </div>
                        <div style={{ borderTop: '1px solid #000', paddingTop: '0.4rem' }}>
                          <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b', lineHeight: 1.5 }}>{form.summary}</p>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: '1rem', marginBottom: '1.2rem' }}>
                        <div style={{ fontWeight: 800, fontSize: '0.82rem', letterSpacing: '0.05em', color: '#1e293b', paddingTop: '2px' }}>
                          EXPERIENCE
                        </div>
                        <div style={{ borderTop: '1px solid #000', paddingTop: '0.4rem' }}>
                          {form.experience.map((exp: any, idx: number) => (
                            <div key={idx} style={{ marginBottom: '0.8rem' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <strong style={{ fontSize: '0.84rem' }}>{exp.position}</strong>
                                <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>{exp.start_date}-{exp.end_date}</span>
                              </div>
                              <div style={{ fontSize: '0.8rem', color: '#64748b', fontStyle: 'italic', marginBottom: '4px' }}>
                                {exp.company} | {exp.description}
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

                      <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: '1rem' }}>
                        <div style={{ fontWeight: 800, fontSize: '0.82rem', letterSpacing: '0.05em', color: '#1e293b', paddingTop: '2px' }}>
                          EDUCATION
                        </div>
                        <div style={{ borderTop: '1px solid #000', paddingTop: '0.4rem' }}>
                          {form.education.map((ed: any, idx: number) => (
                            <div key={idx} style={{ marginBottom: '0.8rem' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <strong style={{ fontSize: '0.84rem' }}>{ed.degree}</strong>
                                <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>{ed.graduation_date}</span>
                              </div>
                              <div style={{ fontSize: '0.8rem', color: '#64748b', fontStyle: 'italic' }}>
                                {ed.school} | {ed.field}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 2. JACK SPARROW */}
                  {selectedTemplate.id === 'JackSparrow' && (
                    <div>
                      <div style={{ background: '#334155', color: '#ffffff', padding: '1.2rem', textAlign: 'center' }}>
                        <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 600 }}>
                          Jack <span style={{ fontWeight: 800 }}>Sparrow</span>
                        </h1>
                        <p style={{ margin: '2px 0 0', fontSize: '0.84rem', opacity: 0.85 }}>Captain</p>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '170px 1fr', minHeight: '700px' }}>
                        <div style={{ background: '#f1f5f9', padding: '1rem', borderRight: '1px solid #e2e8f0' }}>
                          <div
                            style={{
                              width: '90px',
                              height: '90px',
                              borderRadius: '50%',
                              background: '#cbd5e1',
                              margin: '0 auto 1rem',
                              overflow: 'hidden',
                              border: '2px solid #0284c7',
                              boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                            }}
                          >
                            <img
                              src={person.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                              alt="Jack Sparrow"
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          </div>

                          <div style={{ background: '#0284c7', color: 'white', padding: '0.15rem 0.4rem', fontSize: '0.72rem', fontWeight: 700, borderRadius: '2px', marginBottom: '0.3rem', display: 'inline-block' }}>
                            About me
                          </div>
                          <p style={{ margin: '0 0 0.8rem', fontSize: '0.72rem', color: '#475569', lineHeight: 1.35 }}>{form.summary}</p>

                          <div style={{ background: '#0284c7', color: 'white', padding: '0.15rem 0.4rem', fontSize: '0.72rem', fontWeight: 700, borderRadius: '2px', marginBottom: '0.3rem', display: 'inline-block' }}>
                            personal
                          </div>
                          <p style={{ margin: '0 0 0.8rem', fontSize: '0.72rem', color: '#475569' }}>Jack Sparrow<br />nationality: English 1690</p>

                          <div style={{ background: '#0284c7', color: 'white', padding: '0.15rem 0.4rem', fontSize: '0.72rem', fontWeight: 700, borderRadius: '2px', marginBottom: '0.3rem', display: 'inline-block' }}>
                            Areas of specialization
                          </div>
                          <p style={{ margin: '0 0 0.8rem', fontSize: '0.72rem', color: '#475569' }}>Privateering • Buccaneering<br />• Parley • Rum</p>
                        </div>

                        <div style={{ padding: '1.2rem' }}>
                          <h4 style={{ margin: '0 0 0.5rem', fontSize: '0.84rem', fontWeight: 800, textTransform: 'uppercase', borderBottom: '1px solid #000', paddingBottom: '2px' }}>
                            SHORT RESUMÉ
                          </h4>
                          {form.experience.map((exp: any, idx: number) => (
                            <div key={idx} style={{ display: 'grid', gridTemplateColumns: '70px 1fr', gap: '0.5rem', marginBottom: '0.6rem', fontSize: '0.78rem' }}>
                              <div style={{ fontWeight: 700, color: '#475569' }}>{exp.start_date}-{exp.end_date}</div>
                              <div>
                                <strong>{exp.position}</strong>
                                <div style={{ fontSize: '0.74rem', color: '#64748b' }}>{exp.company} • {exp.description}</div>
                                <p style={{ margin: '2px 0 0', fontSize: '0.74rem' }}>{exp.responsibilities}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 3. JANE DOE */}
                  {selectedTemplate.id === 'JaneDoe' && (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                        <div>
                          <h1 style={{ margin: 0, fontSize: '1.9rem', fontWeight: 700, color: '#000000' }}>{person.full_name}</h1>
                          <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: '#2563eb' }}>jane-doe.com | LinkedIn | GitHub | Leetcode</p>
                        </div>
                        <div style={{ textAlign: 'right', fontSize: '0.75rem', color: '#374151' }}>
                          <div>Location: {person.location}</div>
                          <div>Email: {person.email} | Mobile: {person.phone}</div>
                        </div>
                      </div>

                      <h3 style={{ margin: '0.6rem 0 0.3rem', fontSize: '0.86rem', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase' }}>
                        {person.title}
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
                    </div>
                  )}

                  {/* 4. CARL JOHNSON */}
                  {selectedTemplate.id === 'CarlJohnson' && (
                    <div style={{ textAlign: 'center', fontFamily: 'Georgia, serif' }}>
                      <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 700, color: '#1d4ed8' }}>Carl Johnson (CJ)</h1>
                      <p style={{ margin: '0.3rem 0', fontSize: '0.78rem', color: '#1e40af', fontStyle: 'italic' }}>
                        Residence/domicile: 113, Groove Street<br />
                        E-mail: pleasedonotcontactme@gmail.com ✻ Telephone number: +1-202-555-0100<br />
                        Place of birth: Ariccia, Italy ✻ Date of birth: 08-11-1968
                      </p>
                    </div>
                  )}

                  {/* 5. RECEIVE */}
                  {selectedTemplate.id === 'ReCeIVe' && (
                    <div style={{ textAlign: 'center' }}>
                      <h1 style={{ margin: 0, fontSize: '1.8rem', color: '#1e3a8a', letterSpacing: '0.06em' }}>YOUR NAME</h1>
                      <p style={{ margin: '0.4rem 0', fontSize: '0.78rem', color: '#2563eb' }}>
                        Address, YY, XX · email@address.com · mywebsite.com
                      </p>
                      <p style={{ margin: '0 0 1rem', fontSize: '0.8rem', color: '#374151', fontStyle: 'italic' }}>{form.summary}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  )
}
