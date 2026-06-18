import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout.jsx'
import {
  Field, Input, PasswordInput, Button,
  Toast, FormHeader,
} from '../components/FormComponents.jsx'
import styles from './Auth.module.css'
import axios from 'axios'


export default function Login() {
  const navigate = useNavigate()
  const [form, setForm]       = useState({ email: '', password: '' })
  const [errors, setErrors]   = useState({})
  const [toast, setToast]     = useState({ visible: false, message: '', type: 'error' })
  const [loading, setLoading] = useState(false)

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  const validate = () => {
    const errs = {}
    if (!form.email)    errs.email    = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email'
    if (!form.password) errs.password = 'Password is required'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setLoading(true)
    try {
      console.log(1);
      console.log(form);
     const res = await axios.post('http://localhost:5000/api/v1/auth/login', form)
     console.log(res);
        localStorage.setItem('token', res.data.token)
      navigate('/dashboard')
     console.log(2);
      await new Promise(r => setTimeout(r, 1200)) // demo delay
      showToast('error', 'Invalid credentials. Please try again.')
    } catch (err) {
      showToast('error', err?.response?.data?.message || 'Login failed. Try again.')
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
      headline='Land your<br/><em>dream role</em><br/>faster.'
      sub='Connect with top employers. Thousands of verified openings updated daily.'
    >
      <FormHeader
        eyebrow="Welcome back"
        title="Sign in to your account"
        sub="New here?"
        subLinkText="Create a free account →"
        onSubLinkClick={(e) => { e.preventDefault(); navigate('/signup') }}
      />

      <Toast type={toast.type} message={toast.message} visible={toast.visible} />

      <form onSubmit={handleSubmit} noValidate>
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
            placeholder="Enter your password"
            autoComplete="current-password"
          />
        </Field>

        <div className={styles.forgotRow}>
          <Link to="/forgot-password" className={styles.forgotLink}>
            Forgot password?
          </Link>
        </div>

        <Button type="submit" loading={loading}>
          {loading ? null : 'Sign in'}
        </Button>
      </form>
    </AuthLayout>
  )
}
