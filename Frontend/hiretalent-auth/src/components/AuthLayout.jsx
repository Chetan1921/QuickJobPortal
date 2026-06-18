import React from 'react'
import styles from './AuthLayout.module.css'

const CHIPS = [
  'Engineering', 'Design', 'Marketing',
  'Finance', 'Product', 'Data Science', 'DevOps', 'Sales',
]

const STATS = [
  { num: '48K+', label: 'Active jobs' },
  { num: '12K+', label: 'Companies' },
  { num: '2M+',  label: 'Hires made' },
]

export default function AuthLayout({ headline, sub, stats, children }) {
  const displayStats = stats || STATS

  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        {/* ── LEFT PANEL ── */}
        <div className={styles.leftPanel}>
          <Brand />

          <div className={styles.panelContent}>
            <h2
              className={styles.headline}
              dangerouslySetInnerHTML={{ __html: headline }}
            />
            <p className={styles.sub}>{sub}</p>

            <div className={styles.chips}>
              {CHIPS.map((chip, i) => (
                <span
                  key={chip}
                  className={styles.chip}
                  style={{ animationDelay: `${i * 0.4}s` }}
                >
                  <span className={styles.chipDot} />
                  {chip}
                </span>
              ))}
            </div>
          </div>

          <div className={styles.stats}>
            {displayStats.map(s => (
              <div key={s.label} className={styles.statItem}>
                <span className={styles.statNum}>{s.num}</span>
                <span className={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className={styles.rightPanel}>
          <div className={`${styles.formWrap} animate-fade-in`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

function Brand() {
  return (
    <div className={styles.brand}>
      <div className={styles.brandIcon}>
        <svg viewBox="0 0 24 24" fill="white" width="18" height="18">
          <path d="M20 6h-2.18c.07-.44.18-.88.18-1.35C18 2.54 15.75.5 13.12.5c-1.36 0-2.56.56-3.43 1.44L12 4.29l2.35-2.35c.53-.54 1.13-.44 1.65.14.54.62.5 1.57-.08 2.15L13.84 6H4C2.9 6 2 6.9 2 8v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-5 9h-2v2h-2v-2H9v-2h2v-2h2v2h2v2z"/>
        </svg>
      </div>
      <span className={styles.brandName}>
        Hire<span>Talent</span>
      </span>
    </div>
  )
}
