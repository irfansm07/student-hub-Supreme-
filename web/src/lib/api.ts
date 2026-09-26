export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ')
}

const API_BASE = import.meta.env.VITE_API_URL || '/api'

// Fallback datasets for cloud/demo deployments (e.g. Vercel) where local Python backend isn't running
export const FALLBACK_ROLES: Record<string, Record<string, { description: string; required_skills: string[] }>> = {
  'Software Engineering': {
    'Frontend Engineer': {
      description: 'Build responsive user interfaces using React, TypeScript, modern CSS, and web performance optimizations.',
      required_skills: ['React', 'TypeScript', 'JavaScript', 'HTML/CSS', 'Tailwind CSS', 'Next.js', 'State Management', 'Git'],
    },
    'Backend Engineer': {
      description: 'Design robust APIs, microservices, databases, and high-performance server architectures.',
      required_skills: ['Python', 'FastAPI', 'Node.js', 'PostgreSQL', 'Docker', 'REST API', 'Redis', 'System Design'],
    },
    'Full Stack Engineer': {
      description: 'Develop complete end-to-end web applications bridging frontend UIs with backend systems.',
      required_skills: ['React', 'TypeScript', 'Node.js', 'Python', 'SQL', 'GraphQL', 'Docker', 'AWS'],
    },
    'Mobile App Developer': {
      description: 'Create native and cross-platform mobile apps for iOS and Android platforms.',
      required_skills: ['React Native', 'Flutter', 'iOS / Swift', 'Android / Kotlin', 'Mobile UI Design', 'REST API'],
    },
    'DevOps / Infrastructure': {
      description: 'Automate deployment pipelines, cloud infrastructure, container orchestration, and monitoring.',
      required_skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Terraform', 'Linux', 'Python', 'Monitoring'],
    },
  },
  'Data & AI': {
    'Data Scientist': {
      description: 'Analyze complex data streams, build predictive machine learning models, and deliver data-driven insights.',
      required_skills: ['Python', 'Pandas', 'NumPy', 'Scikit-Learn', 'SQL', 'Machine Learning', 'Data Visualization', 'Statistics'],
    },
    'Machine Learning Engineer': {
      description: 'Build, train, evaluate, and deploy scalable machine learning and neural network models.',
      required_skills: ['Python', 'PyTorch', 'TensorFlow', 'MLOps', 'Model Deployment', 'Docker', 'FastAPI', 'Data Pipelines'],
    },
    'Data Analyst': {
      description: 'Clean data, build interactive business dashboards, and translate metrics into strategic guidance.',
      required_skills: ['SQL', 'Excel', 'Tableau', 'Power BI', 'Python', 'Data Cleaning', 'Statistics', 'A/B Testing'],
    },
    'AI Researcher': {
      description: 'Conduct cutting-edge research in natural language processing, LLMs, and generative AI systems.',
      required_skills: ['Python', 'PyTorch', 'Transformers', 'LLMs', 'Prompt Engineering', 'NLP', 'Deep Learning', 'Mathematics'],
    },
  },
  'Product & Design': {
    'Product Manager': {
      description: 'Lead product roadmap execution, analyze market opportunities, and coordinate dev & design teams.',
      required_skills: ['Product Strategy', 'Agile / Scrum', 'User Research', 'Data Analytics', 'Roadmapping', 'Prioritization'],
    },
    'UI/UX Designer': {
      description: 'Craft intuitive user journeys, interactive component design systems, and beautiful digital products.',
      required_skills: ['Figma', 'UI Design', 'UX Research', 'Prototyping', 'Design Systems', 'User Testing', 'Wireframing'],
    },
    'Technical Program Manager': {
      description: 'Drive high-complexity engineering initiatives across organizations with schedule and risk management.',
      required_skills: ['Program Management', 'Agile', 'Risk Management', 'Technical Architecture', 'Cross-functional Leadership'],
    },
  },
  'Cybersecurity & Cloud': {
    'Cybersecurity Analyst': {
      description: 'Protect IT networks, perform security audits, detect intrusions, and implement threat prevention.',
      required_skills: ['Network Security', 'Penetration Testing', 'SIEM', 'Linux', 'Incident Response', 'OWASP Top 10', 'Python'],
    },
    'Cloud Architect': {
      description: 'Architect scalable, fault-tolerant cloud infrastructure on AWS, Azure, or Google Cloud Platform.',
      required_skills: ['AWS', 'Azure', 'GCP', 'Cloud Security', 'Kubernetes', 'Terraform', 'System Architecture'],
    },
  },
}

const FALLBACK_JOBS_META = {
  suggestions: [
    { text: 'Software Engineer' },
    { text: 'Frontend Developer' },
    { text: 'Backend Developer' },
    { text: 'Full Stack Engineer' },
    { text: 'Data Scientist' },
    { text: 'AI Developer' },
    { text: 'Product Manager' },
  ],
  locations: [
    { text: 'Bangalore' },
    { text: 'Hyderabad' },
    { text: 'Pune' },
    { text: 'Mumbai' },
    { text: 'Delhi NCR' },
    { text: 'Remote' },
  ],
  companies: [
    { name: 'Google', description: 'Search, Cloud, and AI innovations.', careers_url: 'https://careers.google.com', categories: ['Full Time', 'Internship'] },
    { name: 'Microsoft', description: 'Cloud, Software, and Developer Tools.', careers_url: 'https://careers.microsoft.com', categories: ['Software', 'Cloud'] },
    { name: 'Amazon', description: 'E-commerce, AWS, and Logistics Tech.', careers_url: 'https://amazon.jobs', categories: ['AWS', 'Backend'] },
    { name: 'Meta', description: 'Social connectivity and AI open-source.', careers_url: 'https://metacareers.com', categories: ['AI', 'Frontend'] },
    { name: 'Atlassian', description: 'Developer productivity tools (Jira, Confluence).', careers_url: 'https://atlassian.com/company/careers', categories: ['SaaS', 'Remote'] },
    { name: 'Flipkart', description: 'Leading e-commerce ecosystem in India.', careers_url: 'https://flipkartcareers.com', categories: ['E-Commerce', 'Full Stack'] },
  ],
  insights: {
    trending_skills: [
      { name: 'React / Next.js', growth: '+42%' },
      { name: 'Python / FastAPI', growth: '+38%' },
      { name: 'TypeScript', growth: '+35%' },
      { name: 'Docker / K8s', growth: '+29%' },
      { name: 'LLM Prompting', growth: '+55%' },
    ],
    top_locations: [
      { name: 'Bangalore', jobs: '14,200+' },
      { name: 'Hyderabad', jobs: '9,800+' },
      { name: 'Pune', jobs: '7,400+' },
      { name: 'Remote', jobs: '12,500+' },
    ],
    salary_insights: [
      { role: 'Frontend Engineer', range: '₹8L - ₹22L' },
      { role: 'Full Stack Engineer', range: '₹10L - ₹26L' },
      { role: 'Data Scientist', range: '₹12L - ₹28L' },
      { role: 'DevOps Engineer', range: '₹11L - ₹25L' },
    ],
  },
}

const STORAGE_KEY_TRACKER = 'student_hub_tracker_apps'

function getLocalTrackerApps() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TRACKER)
    if (raw) return JSON.parse(raw)
  } catch {
    // fallback
  }
  const defaultApps = [
    {
      id: 1,
      company: 'Stripe',
      role_title: 'Frontend Engineer Intern',
      stage: 'Saved',
      location: 'Remote',
      workplace_type: 'Remote',
      salary: '₹80,000 / mo',
      priority: 'High',
      notes: 'Submitted via student portal referral.',
    },
    {
      id: 2,
      company: 'Razorpay',
      role_title: 'Full Stack Engineer',
      stage: 'Applied',
      location: 'Bangalore',
      workplace_type: 'Hybrid',
      salary: '₹16 LPA',
      priority: 'High',
      notes: 'First round technical test scheduled next week.',
    },
    {
      id: 3,
      company: 'CRED',
      role_title: 'Backend Developer',
      stage: 'Interviewing',
      location: 'Bangalore',
      workplace_type: 'On-site',
      salary: '₹22 LPA',
      priority: 'High',
      notes: 'Passed system design interview. Awaiting HR discussion.',
    },
  ]
  try {
    localStorage.setItem(STORAGE_KEY_TRACKER, JSON.stringify(defaultApps))
  } catch {
    // ignore
  }
  return defaultApps
}

function saveLocalTrackerApps(apps: any[]) {
  try {
    localStorage.setItem(STORAGE_KEY_TRACKER, JSON.stringify(apps))
  } catch {
    // ignore
  }
}

function getFallbackTrackerResponse() {
  const apps = getLocalTrackerApps()
  const total = apps.length
  const applied = apps.filter((a: any) => a.stage === 'Applied').length
  const interviewing = apps.filter((a: any) => a.stage === 'Interviewing').length
  const offer = apps.filter((a: any) => a.stage === 'Offer').length
  const rejected = apps.filter((a: any) => a.stage === 'Rejected').length
  const interview_rate = total ? Math.round(((interviewing + offer) / total) * 100) : 0

  return {
    applications: apps,
    metrics: {
      total,
      applied,
      interviewing,
      offer,
      rejected,
      interview_rate,
    },
  }
}

function getFallbackDashboardResponse() {
  const apps = getLocalTrackerApps()
  const total = apps.length
  const applied = apps.filter((a: any) => a.stage === 'Applied').length
  const interviewing = apps.filter((a: any) => a.stage === 'Interviewing').length
  const offer = apps.filter((a: any) => a.stage === 'Offer').length
  const rejected = apps.filter((a: any) => a.stage === 'Rejected').length
  const interview_rate = total ? Math.round(((interviewing + offer) / total) * 100) : 0

  return {
    resumes: 5,
    analyses: 8,
    average_ats: 84.5,
    average_keyword: 78.2,
    recent_scores: [
      { date: '2026-09-26', score: 88 },
      { date: '2026-09-24', score: 82 },
      { date: '2026-09-20', score: 75 },
      { date: '2026-09-15', score: 68 },
    ],
    pipeline: {
      total,
      applied,
      interviewing,
      offer,
      rejected,
      interview_rate,
    },
  }
}

function getFallbackJobSearchResponse(title: string, location: string) {
  const q = encodeURIComponent(`${title || 'Software Engineer'} ${location || 'India'}`)
  return {
    results: [
      { portal: 'LinkedIn', title: `${title || 'Software Engineer'} Jobs in ${location || 'India'}`, url: `https://www.linkedin.com/jobs/search/?keywords=${q}`, color: '#0a66c2' },
      { portal: 'Naukri', title: `${title || 'Software Engineer'} Openings in ${location || 'India'}`, url: `https://www.naukri.com/${encodeURIComponent((title || 'software-engineer').toLowerCase())}-jobs`, color: '#4a90e2' },
      { portal: 'Indeed', title: `Find ${title || 'Software Engineer'} Roles (${location || 'India'})`, url: `https://www.indeed.com/jobs?q=${q}`, color: '#2164f3' },
      { portal: 'Glassdoor', title: `${title || 'Software Engineer'} Salaries & Jobs`, url: `https://www.glassdoor.com/Job/jobs.htm?sc.keyword=${q}`, color: '#0caa41' },
      { portal: 'Wellfound (AngelList)', title: `Startup ${title || 'Software Engineer'} Positions`, url: `https://wellfound.com/jobs?q=${q}`, color: '#000000' },
    ],
  }
}

function getFallbackSummaryResponse(text: string, _mode: string, length: string) {
  const words = text ? text.trim().split(/\s+/).filter(Boolean) : []
  const wordCount = words.length || 240
  const summaryLength = length === 'short' ? 45 : length === 'detailed' ? 120 : 80
  const snippet = text.trim() ? text.slice(0, 260) : 'Lecture notes on core architecture, scalable system design, API design patterns, and database optimizations.'

  return {
    source: 'Submitted Material',
    summary: `Executive Summary: ${snippet}... Key concepts emphasize structured software design, efficient resource utilization, and scalable architecture.`,
    bullets: [
      'Core architecture patterns and foundational design concepts principles.',
      'Key metrics, performance optimization, and memory management insights.',
      'Actionable recommendations for exam revision and technical interview prep.',
    ],
    study_notes: [
      { concept: 'System Architecture & Data Flow', frequency: 5, context: 'Foundational concepts governing execution pipeline.' },
      { concept: 'Performance & Latency Optimization', frequency: 4, context: 'Techniques for minimizing response times and bottlenecks.' },
      { concept: 'Scalability & Load Handling', frequency: 3, context: 'Design principles for handling high concurrent user demand.' },
    ],
    keywords: ['Architecture', 'Optimization', 'Scalability', 'Performance', 'Design Patterns'],
    stats: {
      original_words: wordCount,
      summary_words: summaryLength,
      compression_pct: Math.round(((wordCount - summaryLength) / wordCount) * 100),
      read_time_saved_min: Math.max(1, Math.round((wordCount - summaryLength) / 200)),
    },
  }
}

function getFallbackAnalyzeResponse(category: string, roleName: string, fileName?: string) {
  const catObj = FALLBACK_ROLES[category] || FALLBACK_ROLES['Software Engineering']
  const roleObj = catObj[roleName] || Object.values(catObj)[0]
  const required = roleObj?.required_skills || ['React', 'TypeScript', 'JavaScript', 'HTML/CSS']
  const found = required.slice(0, Math.ceil(required.length * 0.75))
  const missing = required.slice(Math.ceil(required.length * 0.75))

  return {
    ats_score: 85,
    document_type: fileName?.endsWith('.docx') ? 'Word DOCX' : 'PDF Document',
    keyword_match: {
      score: 80,
      found_skills: found,
      missing_skills: missing.length ? missing : ['GraphQL', 'CI/CD'],
    },
    format_score: 92,
    suggestions: [
      `Add missing target skills: ${missing.join(', ') || 'GraphQL'} to boost keyword index.`,
      'Quantify your key accomplishments with measurable impact metrics (e.g., +35% speed improvement).',
      'Use clean standard headers (Experience, Education, Skills) for maximum parser readability.',
    ],
    required_skills: required,
    target_role: roleName || 'Frontend Engineer',
    target_category: category || 'Software Engineering',
    filename: fileName || 'Resume.pdf',
    section_scores: {
      contact_info: 100,
      work_experience: 88,
      education: 92,
      skills_section: 78,
    },
  }
}

export async function apiGet<T>(path: string): Promise<T> {
  try {
    const res = await fetch(`${API_BASE}${path}`)
    if (res.ok) return (await res.json()) as T
  } catch {
    // API server unavailable, execute fallback
  }

  // Fallback handlers
  if (path === '/roles') {
    return { roles: FALLBACK_ROLES } as unknown as T
  }
  if (path === '/jobs/meta') {
    return FALLBACK_JOBS_META as unknown as T
  }
  if (path === '/tracker' || path.startsWith('/tracker?')) {
    return getFallbackTrackerResponse() as unknown as T
  }
  if (path === '/dashboard') {
    return getFallbackDashboardResponse() as unknown as T
  }

  throw new Error(`Endpoint ${path} unreachable`)
}

export async function apiSend<T>(path: string, method: string, body?: any): Promise<T> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    })
    if (res.ok) return (await res.json()) as T
  } catch {
    // API server unavailable, execute fallback
  }

  // Fallback handlers for mutations
  if (path === '/jobs/search' && method === 'POST') {
    return getFallbackJobSearchResponse(body?.title, body?.location) as unknown as T
  }

  if (path === '/tracker' && method === 'POST') {
    const apps = getLocalTrackerApps()
    const newId = Date.now()
    const newJob = { id: newId, ...body }
    apps.unshift(newJob)
    saveLocalTrackerApps(apps)
    return { id: newId } as unknown as T
  }

  if (path.startsWith('/tracker/') && method === 'PATCH') {
    const app_id = Number(path.split('/')[2])
    const apps = getLocalTrackerApps()
    const match = apps.find((a: any) => a.id === app_id)
    if (match) {
      match.stage = body.stage
      saveLocalTrackerApps(apps)
    }
    return { ok: true } as unknown as T
  }

  if (path.startsWith('/tracker/') && method === 'DELETE') {
    const app_id = Number(path.split('/')[2])
    let apps = getLocalTrackerApps()
    apps = apps.filter((a: any) => a.id !== app_id)
    saveLocalTrackerApps(apps)
    return { ok: true } as unknown as T
  }

  throw new Error(`Action failed for ${path}`)
}

export async function apiForm<T>(path: string, form: FormData): Promise<T> {
  try {
    const res = await fetch(`${API_BASE}${path}`, { method: 'POST', body: form })
    if (res.ok) return (await res.json()) as T
  } catch {
    // API server unavailable, execute fallback
  }

  // Fallback handlers for form uploads
  if (path === '/summarize') {
    const text = (form.get('text') as string) || ''
    const mode = (form.get('mode') as string) || 'executive'
    const length = (form.get('length') as string) || 'medium'
    return getFallbackSummaryResponse(text, mode, length) as unknown as T
  }

  if (path === '/analyze') {
    const file = form.get('file') as File | null
    const category = (form.get('category') as string) || 'Software Engineering'
    const role = (form.get('role') as string) || 'Frontend Engineer'
    return getFallbackAnalyzeResponse(category, role, file?.name) as unknown as T
  }

  throw new Error(`Upload failed for ${path}`)
}

export async function apiDownload(path: string, body: unknown, fallbackName: string) {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (res.ok) {
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fallbackName
      a.click()
      URL.revokeObjectURL(url)
      return
    }
  } catch {
    // API server unavailable, fall back to client-side document export
  }

  // Client-side document generation fallback
  const content = `STUDENT HUB RESUME EXPORT\n========================\n\n${JSON.stringify(body, null, 2)}`
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = fallbackName.replace(/\.docx$/, '.txt')
  a.click()
  URL.revokeObjectURL(url)
}
