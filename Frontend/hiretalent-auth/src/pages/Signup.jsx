import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout.jsx'
import {
  Field, Input, PasswordInput, PasswordStrength,
  Button, Toast, FormHeader, RoleTabs, FileUpload,
} from '../components/FormComponents.jsx'
import styles from './Auth.module.css'

const SIGNUP_STATS = [
  { num: '98%', label: 'Satisfaction' },
  { num: '4.8★', label: 'App rating' },
  { num: 'Free', label: 'To get started' },
]

export default function Signup() {
  const navigate = useNavigate()

  const [role, setRole]       = useState('job_seeker')
  const [form, setForm]       = useState({
    name: '', email: '', password: '', phoneNo: '', bio: '',
  })
  const [resume, setResume]   = useState(null)
  const [errors, setErrors]   = useState({})
  const [toast, setToast]     = useState({ visible: false, message: '', type: 'error' })
  const [loading, setLoading] = useState(false)

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  const validate = () => {
    const errs = {}
    if (!form.name.trim())    errs.name     = 'Full name is required'
    if (!form.email)          errs.email    = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email'
    if (!form.password)       errs.password = 'Password is required'
    else if (form.password.length < 8) errs.password = 'Min 8 characters'
    if (!form.phoneNo.trim()) errs.phoneNo  = 'Phone number is required'
    if (!form.bio.trim())     errs.bio      = 'Bio is required'
    if (role === 'job_seeker' && !resume) errs.resume = 'Resume is required for job seekers'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setLoading(true)

    try {
      // 🔌 Replace with actual API call:
      // const formData = new FormData()
      // Object.entries({ ...form, role }).forEach(([k, v]) => formData.append(k, v))
      // if (resume) formData.append('file', resume)
      // const res = await axios.post('/api/v1/auth/register', formData)
      // localStorage.setItem('token', res.data.token)
      // navigate('/dashboard')

      await new Promise(r => setTimeout(r, 1400)) // demo
      showToast('success', 'Account created successfully!')
      setTimeout(() => navigate('/login'), 1500)
    } catch (err) {
      showToast('error', err?.response?.data?.message || 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  const showToast = (type, message) => {
    setToast({ visible: true, type, message })
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 4000)
  }

  return (
    <AuthLayout
      headline='Hire or get<br/><em>hired.</em><br/>Your choice.'
      sub='Recruiters find pre-screened candidates. Job seekers showcase skills and land offers fast.'
      stats={SIGNUP_STATS}
    >
      <FormHeader
        eyebrow="Get started free"
        title="Create your account"
        sub="Already have an account?"
        subLinkText="Sign in →"
        onSubLinkClick={(e) => { e.preventDefault(); navigate('/login') }}
      />

      <Toast type={toast.type} message={toast.message} visible={toast.visible} />

      <RoleTabs role={role} onChange={setRole} />

      <form onSubmit={handleSubmit} noValidate>
        <div className={styles.row}>
          <Field label="Full name" error={errors.name}>
            <Input
              type="text"
              placeholder="Alex Johnson"
              value={form.name}
              onChange={set('name')}
              autoComplete="name"
            />
          </Field>
          <Field label="Phone number" error={errors.phoneNo}>
            <Input
              type="tel"
              placeholder="+91 98765 43210"
              value={form.phoneNo}
              onChange={set('phoneNo')}
              autoComplete="tel"
            />
          </Field>
        </div>

        <Field label="Email address" error={errors.email}>
          <Input
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={set('email')}
            autoComplete="email"
          />
        </Field>

        <Field label="Password" error={errors.password}>
          <PasswordInput
            value={form.password}
            onChange={set('password')}
            placeholder="Create a strong password"
            autoComplete="new-password"
          />
          <PasswordStrength password={form.password} />
        </Field>

        <Field label="Bio / About you" error={errors.bio}>
          <textarea
            className={styles.textarea}
            placeholder={
              role === 'recruiter'
                ? "Tell candidates about your company and what you are hiring for..."
                : "Briefly describe your skills, experience, and what you are looking for..."
            }
            value={form.bio}
            onChange={set('bio')}
            rows={3}
          />
        </Field>

        {role === 'job_seeker' && (
          <div className={styles.resumeSection}>
            <FileUpload
              onChange={(e) => setResume(e.target.files[0])}
              fileName={resume?.name}
            />
            {errors.resume && (
              <span className={styles.resumeError}>{errors.resume}</span>
            )}
          </div>
        )}

        <Button type="submit" loading={loading}>
          {loading ? null : 'Create account'}
        </Button>
      </form>
    </AuthLayout>
  )
}
