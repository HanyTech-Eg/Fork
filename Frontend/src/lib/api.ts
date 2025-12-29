type ApiError = {
  status: number
  message: string
}

type ApiRequestOptions = RequestInit & {
  auth?: boolean
}

function getBaseUrl() {
  return import.meta.env.VITE_API_URL || 'http://localhost:3000'
}

async function parseJsonSafe(res: Response) {
  try {
    return await res.json()
  } catch {
    return null
  }
}

function getAuthHeader() {
  const token = localStorage.getItem('axiscloud_token')
  if (!token) return {}
  return { Authorization: `Bearer ${token}` }
}

async function request<T>(path: string, init?: ApiRequestOptions): Promise<T> {
  const url = `${getBaseUrl()}${path}`

  const headers = new Headers(init?.headers)
  if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json')
  if (init?.auth) {
    const authHeader = getAuthHeader() as Record<string, string>
    for (const [k, v] of Object.entries(authHeader)) headers.set(k, v)
  }

  const res = await fetch(url, {
    ...init,
    headers,
  })

  if (!res.ok) {
    const data = await parseJsonSafe(res)
    const message = (data && (data.message || data.error?.message)) || res.statusText || 'Request failed'
    const err: ApiError = { status: res.status, message }
    throw err
  }

  const data = await parseJsonSafe(res)
  return data as T
}

export type AuthResponse = {
  token: string
  success: boolean
  username: string
  plan?: string
  plain?: string
}

export async function apiRegister(input: {
  username: string
  email: string
  password: string
}) {
  return request<AuthResponse>('/CreateUser', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export async function apiLogin(input: { email: string; password: string }) {
  return request<AuthResponse>('/Login', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export async function apiCreateCode(input: { email: string }) {
  return request<unknown>('/CreateCode', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export async function apiCheckCode(token: string) {
  return request<unknown>(`/CheckCode?token=${encodeURIComponent(token)}`, {
    method: 'POST',
  })
}

export async function apiUpdatePassword(token: string, input: { password: string }) {
  return request<unknown>(`/UpdatePassword?token=${encodeURIComponent(token)}`, {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export type CreateMonitorInput = {
  url: string
  method: 'GET' | 'AHEAD' | 'POST' | 'HEAD'
  requestTime: number
  checkInterval: number
  headers?: Record<string, string>
}

export async function apiCreateMonitor(input: CreateMonitorInput) {
  return request<unknown>('/CreateMontior', {
    method: 'POST',
    auth: true,
    body: JSON.stringify(input),
  })
}

export async function apiTestUptime(url: string) {
  return request<unknown>('/testUpTime', {
    method: 'GET',
    auth: true,
    body: JSON.stringify({ url }),
  })
}
