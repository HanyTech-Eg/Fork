export type AuthState = {
  token: string | null
  username: string | null
  plan: string | null
}

const TOKEN_KEY = 'axiscloud_token'
const USERNAME_KEY = 'axiscloud_username'
const PLAN_KEY = 'axiscloud_plan'

const AUTH_EVENT = 'axiscloud_auth'

function emitAuthChanged() {
  window.dispatchEvent(new Event(AUTH_EVENT))
}

export function getAuth(): AuthState {
  return {
    token: localStorage.getItem(TOKEN_KEY),
    username: localStorage.getItem(USERNAME_KEY),
    plan: localStorage.getItem(PLAN_KEY),
  }
}

export function setAuth(next: { token: string; username?: string | null; plan?: string | null }) {
  localStorage.setItem(TOKEN_KEY, next.token)
  if (typeof next.username !== 'undefined') {
    if (next.username === null) localStorage.removeItem(USERNAME_KEY)
    else localStorage.setItem(USERNAME_KEY, next.username)
  }

  if (typeof next.plan !== 'undefined') {
    if (next.plan === null) localStorage.removeItem(PLAN_KEY)
    else localStorage.setItem(PLAN_KEY, next.plan)
  }

  emitAuthChanged()
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USERNAME_KEY)
  localStorage.removeItem(PLAN_KEY)
  emitAuthChanged()
}

export function onAuthChange(cb: () => void) {
  window.addEventListener(AUTH_EVENT, cb)
  window.addEventListener('storage', cb)
  return () => {
    window.removeEventListener(AUTH_EVENT, cb)
    window.removeEventListener('storage', cb)
  }
}

function base64UrlDecode(input: string) {
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/')
  const pad = base64.length % 4
  const padded = pad ? base64 + '='.repeat(4 - pad) : base64
  return atob(padded)
}

export function getTokenPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.')
    if (parts.length < 2) return null
    const json = base64UrlDecode(parts[1])
    return JSON.parse(json) as Record<string, unknown>
  } catch {
    return null
  }
}

export function resolvePlan() {
  const { token, plan } = getAuth()
  if (plan) return plan
  if (!token) return null
  const payload = getTokenPayload(token)
  const p = payload?.plan
  return typeof p === 'string' ? p : null
}
