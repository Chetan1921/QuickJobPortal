import { Briefcase } from 'lucide-react';

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="relative min-h-screen w-full bg-[var(--bg-app)] flex items-center justify-center px-4 py-12 overflow-hidden">
      {/* Animated gradient mesh background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-[32rem] w-[32rem] rounded-full bg-primary/30 blur-[120px] animate-pulse-slow" />
        <div className="absolute -bottom-40 -right-40 h-[32rem] w-[32rem] rounded-full bg-fuchsia-600/20 blur-[120px] animate-pulse-slow [animation-delay:1.5s]" />
        <div className="absolute top-1/3 right-1/4 h-72 w-72 rounded-full bg-cyan-500/10 blur-[100px]" />
        {/* subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      <div className="relative w-full max-w-[440px]">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-fuchsia-600 flex items-center justify-center shadow-lg shadow-primary/30">
            <Briefcase className="h-5 w-5 text-[var(--text-primary)]" />
          </div>
          <span className="text-xl font-bold text-[var(--text-primary)] tracking-tight">QuickJob</span>
        </div>

        {/* Card */}
        <div className="relative">
          <div className="absolute -inset-px rounded-[28px] bg-gradient-to-br from-white/20 via-white/5 to-transparent" />
          <div className="relative bg-[var(--bg-surface-hover)] backdrop-blur-2xl border border-[var(--border-subtle)] rounded-[26px] shadow-2xl shadow-black/50 p-7 sm:p-9">
            <div className="text-center mb-7">
              <h1 className="text-[26px] font-bold text-[var(--text-primary)] mb-1.5 tracking-tight">{title}</h1>
              {subtitle && <p className="text-[var(--text-secondary)] text-[15px]">{subtitle}</p>}
            </div>
            {children}
          </div>
        </div>

        {footer && <div className="mt-6 text-center">{footer}</div>}
      </div>
    </div>
  );
}
