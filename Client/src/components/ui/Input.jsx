import { forwardRef } from 'react';

const Input = forwardRef(function Input({ label, error, icon: Icon, className = '', ...props }, ref) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-[13px] font-medium text-[var(--text-secondary)] mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-[var(--text-muted)] pointer-events-none" />
        )}
        <input
          ref={ref}
          {...props}
          className={`w-full ${Icon ? 'pl-10.5' : 'pl-4'} pr-4 py-2.5 rounded-xl bg-[var(--bg-input)] border ${
            error ? 'border-red-500/70 focus:ring-red-500/20' : 'border-[var(--border-subtle)] focus:ring-primary/30'
          } text-[var(--text-primary)] text-sm placeholder-[var(--text-muted)] focus:outline-none focus:ring-[3px] focus:border-primary/60 hover:border-[var(--border-strong)] transition-all ${className}`}
        />
      </div>
      {error && <p className="text-red-600 dark:text-red-400 text-xs mt-1.5">{error}</p>}
    </div>
  );
});

export default Input;
