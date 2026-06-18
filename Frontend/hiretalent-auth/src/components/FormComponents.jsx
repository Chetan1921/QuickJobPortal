import React, { useState } from 'react'
import styles from './FormComponents.module.css'

/* ── Input Field ── */
export function Field({ label, error, children }) {
  return (
    <div className={styles.field}>
      {label && <label className={styles.label}>{label}</label>}
      {children}
      {error && (
        <span className={styles.errorMsg}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {error}
        </span>
      )}
    </div>
  )
}

/* ── Text Input ── */
export function Input({ className = '', ...props }) {
  return <input className={`${styles.input} ${className}`} {...props} />
}

/* ── Password Input with toggle ── */
export function PasswordInput({ value, onChange, placeholder, name, id, autoComplete }) {
  const [show, setShow] = useState(false)
  return (
    <div className={styles.pwWrap}>
      <input
        id={id}
        name={name}
        type={show ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder || 'Enter password'}
        autoComplete={autoComplete}
        className={styles.input}
      />
      <button type="button" className={styles.pwToggle} onClick={() => setShow(s => !s)} aria-label="Toggle password">
        {show ? (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
            <line x1="1" y1="1" x2="23" y2="23"/>
          </svg>
        ) : (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        )}
      </button>
    </div>
  )
}

/* ── Password Strength ── */
export function PasswordStrength({ password }) {
  const calc = (pw) => {
    if (!pw) return 0
    let score = 0
    if (pw.length >= 8) score++
    if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++
    if (/[0-9]/.test(pw) || /[^a-zA-Z0-9]/.test(pw)) score++
    return score
  }
  const score = calc(password)
  const labels = ['', 'Weak', 'Fair', 'Strong']
  const colors = ['', '#F87171', '#FBBF24', '#34D399']
  const cls    = ['', styles.weak, styles.medium, styles.strong]

  if (!password) return null
  return (
    <div className={styles.strengthWrap}>
      <div className={styles.strengthBars}>
        {[1, 2, 3].map(i => (
          <div key={i} className={`${styles.bar} ${i <= score ? cls[score] : ''}`} />
        ))}
      </div>
      <span className={styles.strengthLabel} style={{ color: colors[score] }}>
        {labels[score]}
      </span>
    </div>
  )
}

/* ── Toast ── */
export function Toast({ type = 'error', message, visible }) {
  if (!visible) return null
  const isError   = type === 'error'
  const isSuccess = type === 'success'
  return (
    <div className={`${styles.toast} ${isError ? styles.toastError : styles.toastSuccess}`}>
      {isError ? (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      ) : (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
      )}
      <span>{message}</span>
    </div>
  )
}

/* ── Primary Button ── */
export function Button({ children, loading, type = 'button', onClick, variant = 'primary', fullWidth = true }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading}
      className={`${styles.btn} ${variant === 'primary' ? styles.btnPrimary : styles.btnGhost} ${fullWidth ? styles.btnFull : ''}`}
    >
      {loading ? <span className="spinner" /> : children}
    </button>
  )
}

/* ── Divider ── */
export function Divider({ label }) {
  return (
    <div className={styles.divider}>
      <span>{label}</span>
    </div>
  )
}

/* ── File Upload ── */
export function FileUpload({ onChange, fileName }) {
  return (
    <div>
      <label className={styles.label}>Resume (PDF / DOC)</label>
      <label className={styles.fileUpload} htmlFor="resume-upload">
        <input
          id="resume-upload"
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={onChange}
          style={{ display: 'none' }}
        />
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="17 8 12 3 7 8"/>
          <line x1="12" y1="3" x2="12" y2="15"/>
        </svg>
        <span className={styles.fileUploadText}>
          <em>Click to upload</em> or drag & drop
        </span>
        <span className={styles.fileUploadHint}>PDF, DOC up to 5 MB</span>
        {fileName && <span className={styles.fileName}>{fileName}</span>}
      </label>
    </div>
  )
}

/* ── Eyebrow / Title / Subtitle ── */
export function FormHeader({ eyebrow, title, sub, subLink, subLinkText, subLinkHref, onSubLinkClick }) {
  return (
    <div className={styles.formHeader}>
      {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
      <h1 className={styles.title}>{title}</h1>
      {sub && (
        <p className={styles.subText}>
          {sub}{' '}
          {subLinkText && (
            <a href={subLinkHref || '#'} className={styles.link} onClick={onSubLinkClick}>
              {subLinkText}
            </a>
          )}
        </p>
      )}
    </div>
  )
}

/* ── Back Link ── */
export function BackLink({ children, onClick, href }) {
  return (
    <a href={href || '#'} className={styles.backLink} onClick={onClick}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <polyline points="15 18 9 12 15 6"/>
      </svg>
      {children}
    </a>
  )
}

/* ── Role Tabs ── */
export function RoleTabs({ role, onChange }) {
  return (
    <div className={styles.roleTabs}>
      <button
        type="button"
        className={`${styles.roleTab} ${role === 'job_seeker' ? styles.roleTabActive : ''}`}
        onClick={() => onChange('job_seeker')}
      >
        Job Seeker
      </button>
      <button
        type="button"
        className={`${styles.roleTab} ${role === 'recruiter' ? styles.roleTabActive : ''}`}
        onClick={() => onChange('recruiter')}
      >
        Recruiter
      </button>
    </div>
  )
}

/* ── Success Card ── */
export function SuccessCard({ title, message, action }) {
  return (
    <div className={styles.successCard}>
      <div className={styles.successIcon}>
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="2.5">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
      </div>
      <h2 className={styles.successTitle}>{title}</h2>
      <p className={styles.successMsg}>{message}</p>
      {action}
    </div>
  )
}
