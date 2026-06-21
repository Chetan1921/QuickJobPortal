export default function StatCard({ icon: Icon, label, value, tone = 'primary', hint }) {
  const tones = {
    primary: {
      iconWrap: 'bg-primary/15 text-indigo-600 dark:text-indigo-300 border-primary/20',
      glow: 'from-primary/10',
    },
    success: {
      iconWrap: 'bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/20',
      glow: 'from-green-500/10',
    },
    warning: {
      iconWrap: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/20',
      glow: 'from-amber-500/10',
    },
  };
  const t = tones[tone] || tones.primary;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 transition-all hover:border-[var(--border-strong)] hover:-translate-y-0.5">
      <div className={`pointer-events-none absolute -top-10 -right-10 h-28 w-28 rounded-full bg-gradient-to-br ${t.glow} to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition-opacity`} />
      <div className="relative flex items-center gap-4">
        <div className={`h-12 w-12 rounded-xl border flex items-center justify-center shrink-0 ${t.iconWrap}`}>
          <Icon className="h-5.5 w-5.5" />
        </div>
        <div className="min-w-0">
          <p className="text-2xl font-bold text-[var(--text-primary)] leading-none tracking-tight">{value}</p>
          <p className="text-xs text-[var(--text-muted)] mt-1.5">{label}</p>
          {hint && <p className="text-[11px] text-[var(--text-muted)] mt-0.5">{hint}</p>}
        </div>
      </div>
    </div>
  );
}
