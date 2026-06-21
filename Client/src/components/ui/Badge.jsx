const TONES = {
  default: 'bg-[var(--bg-surface-hover)] text-[var(--text-secondary)] border-[var(--border-subtle)]',
  primary: 'bg-primary/10 text-indigo-600 dark:text-indigo-600 dark:text-indigo-300 border-primary/30',
  success: 'bg-green-500/10 text-green-700 dark:text-green-700 dark:text-green-400 border-green-500/30',
  warning: 'bg-amber-500/10 text-amber-700 dark:text-amber-700 dark:text-amber-400 border-amber-500/30',
  danger: 'bg-red-500/10 text-red-700 dark:text-red-600 dark:text-red-400 border-red-500/30',
};

export default function Badge({ children, tone = 'default', className = '' }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${TONES[tone]} ${className}`}>
      {children}
    </span>
  );
}
