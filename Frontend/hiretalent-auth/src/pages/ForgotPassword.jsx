import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout.jsx'
import {
  Field, Input, Button, Toast, FormHeader,
  BackLink, Divider, SuccessCard,
} from '../components/FormComponents.jsx'

const FORGOT_STATS = [
  { num: '15 min', label: 'Link validity' },
  { num: 'SSL',    label: 'Encrypted' },
  { num: 'Secure', label: 'One-time use' },
]

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [email, setEmail]     = useState('')
  const [error, setError]     = useState('')
  const [toast, setToast]     = useState({ visible: false, message: '', type: 'error' })
  const [loading, setLoading] = useState(false)
  const [sent, setSent]       = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) { setError('Email is required'); return }
    if (!/\S+@\S+\.\S+/.test(email)) { setError('Enter a valid email'); return }
    setError('')
    setLoading(true)

    try {
      // 🔌 Replace with: await axios.post('/api/v1/auth/forgot-password', { email })
      await new Promise(r => setTimeout(r, 1200)) // demo
      setSent(true)
    } catch (err) {
      const msg = err?.response?.data?.message || 'Something went wrong. Try again.'
      setToast({ visible: true, type: 'error', message: msg })
      setTimeout(() => setToast(t => ({ ...t, visible: false })), 4000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      headline="Happens to<br/><em>everyone.</em><br/>We've got you."
      sub="Enter the email linked to your account and we'll send a secure reset link valid for 15 minutes."
      stats={FORGOT_STATS}
    >
      <BackLink onClick={(e) => { e.preventDefault(); navigate('/login') }}>
        Back to sign in
      </BackLink>

      {sent ? (
        <SuccessCard
          title="Check your inbox!"
          message={`We've sent a password reset link to ${email}. It expires in 15 minutes.`}
          action={
            <Button onClick={() => navigate('/login')}>
              Back to sign in
            </Button>
          }
        />
      ) : (
        <>
          <FormHeader
            eyebrow="Account recovery"
            title="Reset your password"
            sub="We'll email you a secure link to reset it."
          />

          <Toast type={toast.type} message={toast.message} visible={toast.visible} />

          <form onSubmit={handleSubmit} noValidate>
            <Field label="Email address" error={error}>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </Field>

            <Button type="submit" loading={loading}>
              {loading ? null : 'Send reset link'}
            </Button>
          </form>

          <Divider label="secure & encrypted" />
          <p style={{
            fontSize: '12px', color: 'var(--muted)',
            textAlign: 'center', lineHeight: '1.7'
          }}>
            The link expires in 15 minutes and can only be used once.
            If you don't receive it, check your spam folder.
          </p>
        </>
      )}
    </AuthLayout>
  )
}
