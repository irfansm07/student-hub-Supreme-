export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ')
}

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`/api${path}`)
  if (!res.ok) throw new Error(await readError(res))
  return res.json() as Promise<T>
}

export async function apiSend<T>(path: string, method: string, body?: unknown): Promise<T> {
  const res = await fetch(`/api${path}`, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) throw new Error(await readError(res))
  return res.json() as Promise<T>
}

export async function apiForm<T>(path: string, form: FormData): Promise<T> {
  const res = await fetch(`/api${path}`, { method: 'POST', body: form })
  if (!res.ok) throw new Error(await readError(res))
  return res.json() as Promise<T>
}

export async function apiDownload(path: string, body: unknown, fallbackName: string) {
  const res = await fetch(`/api${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(await readError(res))
  const blob = await res.blob()
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = fallbackName
  a.click()
  URL.revokeObjectURL(url)
}

async function readError(res: Response) {
  try {
    const data = await res.json()
    return data.detail || JSON.stringify(data)
  } catch {
    return res.statusText
  }
}
