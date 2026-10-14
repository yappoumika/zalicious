import { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../lib/api'

export default function AdminAccount() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.')
      return
    }
    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters.')
      return
    }

    setSaving(true)
    try {
      await api.put('/auth/password', { currentPassword, newPassword })
      setSuccess(true)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      setError(err.response?.data?.error || 'Could not update password.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto flex max-w-sm flex-col px-6 py-20">
      <Link to="/admin" className="font-mono text-xs uppercase tracking-widest text-ink/50 hover:text-ink">
        ← Back to Products
      </Link>
      <h1 className="mt-2 font-display text-2xl">Change Password</h1>
      <p className="mt-2 text-sm text-ink/60">Update the password used to log in to this admin dashboard.</p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <label className="flex flex-col gap-1">
          <span className="font-mono text-xs uppercase text-ink/50">Current Password</span>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="input"
            required
            autoFocus
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="font-mono text-xs uppercase text-ink/50">New Password</span>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="input"
            required
            minLength={8}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="font-mono text-xs uppercase text-ink/50">Confirm New Password</span>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="input"
            required
            minLength={8}
          />
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {success && <p className="text-sm text-lime-dark">Password updated.</p>}

        <button
          type="submit"
          disabled={saving}
          className="mt-2 rounded-full bg-lime px-6 py-3 font-display text-sm text-white transition-transform hover:scale-105 disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Update Password'}
        </button>
      </form>
    </div>
  )
}
