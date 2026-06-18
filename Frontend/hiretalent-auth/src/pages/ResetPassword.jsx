import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout.jsx'
import {
  Field, PasswordInput, PasswordStrength,
  Button, Toast, FormHeader, BackLink, SuccessCard,
} from '../components/FormComponents.jsx'

const RESET_STATS = [
  { num: 'bcrypt',  label: 'Hashed storage' },
  { num: 'Zero',    label: 'Plaintext stored' },
  { num: 'Instant', label: 'Account access' },
]

export default function ResetPassword() {
  const navigate      = useNavigate()
  const { token }     = useParams()

  const [form, setForm]       = useState({ password: '', confirm: '' })
  const [errors, setErrors]   = useState({})
  const [toast, setToast]     = useState({ visible: false, message: '', type: 'error' })
  const [loading, setLoading] = useState(false)
  const [done, setDone]       = useState(false)

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  const validate = () => {
    const errs = {}
    if (!form.password)          errs.password = 'New password is required'
    else if (form.password.length < 8) errs.password = 'Min 8 characters'
    if (!form.confirm)           errs.confirm  = 'Please confirm your password'
    else if (form.password !== form.confirm) errs.confirm = 'Passwords do not match'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setLoading(true)

    try {
      // 🔌 Replace with: await axios.post(`/api/v1/auth/reset/${token}`, { password: form.password })
      await new Promise(r => setTimeout(r, 1200)) // demo
      setDone(true)
    } catch (err) {
      const msg = err?.response?.data?.message || 'Reset failed. The link may have expired.'
      setToast({ visible: true, type: 'error', message: msg })
      setTimeout(() => setToast(t => ({ ...t, visible: false })), 5000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      headline="Almost<br/><em>there.</em><br/>New password."
      sub="Choose something secure — at least 8 characters with a mix of letters and numbers."
      stats={RESET_STATS}
    >
      <BackLink onClick={(e) => { e.preventDefault(); navigate('/login') }}>
        Back to sign in
      </BackLink>

      {done ? (
        <SuccessCard
          title="Password updated!"
          message="Your password has been changed successfully. You can now sign in with your new credentials."
          action={
            <Button onClick={() => navigate('/login')}>
              Go to sign in
            </Button>
          }
        />
      ) : (
        <>
          <FormHeader
            eyebrow="Set new password"
            title="Create a new password"
            sub="Must be different from your previous password."
          />

          <Toast type={toast.type} message={toast.message} visible={toast.visible} />

          <form onSubmit={handleSubmit} noValidate>
            <Field label="New password" error={errors.password}>
              <PasswordInput
                value={form.password}
                onChange={set('password')}
                placeholder="Enter new password"
                autoComplete="new-password"
              />
              <PasswordStrength password={form.password} />
            </Field>

            <Field label="Confirm new password" error={errors.confirm}>
              <PasswordInput
                value={form.confirm}
                onChange={set('confirm')}
                placeholder="Re-enter new password"
                autoComplete="new-password"
              />
            </Field>

            <Button type="submit" loading={loading}>
              {loading ? null : 'Update password'}
            </Button>
          </form>
        </>
      )}
    </AuthLayout>
  )
}
