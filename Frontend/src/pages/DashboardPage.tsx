import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getAuth } from '../lib/auth'

export function DashboardPage() {
  const navigate = useNavigate()
  const { token, username } = getAuth()

  useEffect(() => {
    if (!token) navigate('/login', { replace: true })
  }, [token, navigate])

  return (
    <div className="mx-auto max-w-3xl">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-lg font-semibold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-600">
          Welcome{username ? `, ${username}` : ''}.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-slate-600">Create and manage uptime monitors from your account.</div>
          <Link className="ui-btn-primary" to="/monitors/new">
            Create monitor
          </Link>
        </div>
      </div>
    </div>
  )
}
