export default function Button({ children, loading, variant = 'primary', icon: Icon, className = '', ...props }) {
  const base =
    'w-full py-2.5 px-4 rounded-xl font-semibold text-sm transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]';
  const variants = {
    primary:
      'bg-gradient-to-r from-primary to-primary-dark hover:brightness-110 text-[var(--text-primary)] shadow-lg shadow-primary/30',
    outline: 'border border-[var(--border-subtle)] text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] hover:border-[var(--border-strong)]',
    ghost: 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)]',
  };

  return (
    <button {...props} disabled={loading || props.disabled} className={`${base} ${variants[variant]} ${className}`}>
      {loading ? (
        <span className="h-4.5 w-4.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
      ) : (
        <>
          {Icon && <Icon className="h-4.5 w-4.5" />}
          {children}
        </>
      )}
    </button>
  );
}
