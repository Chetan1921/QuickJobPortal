import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { Briefcase, Menu, X, LayoutDashboard, LogOut, User, Sparkles, ScanSearch } from 'lucide-react';
import { logout } from '@/features/auth/authSlice';
import ThemeToggle from '@/components/ui/ThemeToggle';

const PUBLIC_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/jobs', label: 'Find Jobs' },
];

const JOB_SEEKER_NAV_LINKS = [
  { to: '/ai/career-guidance', label: 'Career Guidance', icon: Sparkles },
  { to: '/ai/resume-analyzer', label: 'Resume Analyzer', icon: ScanSearch },
];

export default function Navbar() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isJobSeeker = isAuthenticated && user?.role === 'job_seeker';

  const handleLogout = () => {
    dispatch(logout());
    setMenuOpen(false);
    navigate('/login');
  };

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${isActive ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`;

  const aiLinkClass = ({ isActive }) =>
    `flex items-center gap-1.5 text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'text-[var(--text-secondary)] hover:text-primary'}`;

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border-subtle)] bg-[var(--bg-app)]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-fuchsia-600 flex items-center justify-center">
            <Briefcase className="h-4 w-4 text-white" />
          </div>
          <span className="text-base font-bold text-[var(--text-primary)] tracking-tight">QuickJob</span>
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          {PUBLIC_LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClass} end={l.to === '/'}>
              {l.label}
            </NavLink>
          ))}
          {isJobSeeker && (
            <>
              <span className="h-4 w-px bg-[var(--border-subtle)]" />
              {JOB_SEEKER_NAV_LINKS.map((l) => (
                <NavLink key={l.to} to={l.to} className={aiLinkClass}>
                  <l.icon className="h-3.5 w-3.5" />
                  {l.label}
                </NavLink>
              ))}
            </>
          )}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] transition-all"
              >
                <div className="h-7 w-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xs font-semibold text-indigo-500 dark:text-indigo-600 dark:text-indigo-300">
                  {user?.name?.[0]?.toUpperCase() || <User className="h-3.5 w-3.5" />}
                </div>
                <span className="text-sm text-[var(--text-primary)] max-w-[110px] truncate">{user?.name}</span>
              </button>

              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 mt-2 w-48 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-app)] shadow-2xl shadow-black/50 py-1.5 z-20">
                    <Link
                      to="/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-3.5 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)]"
                    >
                      <LayoutDashboard className="h-4 w-4" /> Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3.5 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-500/10"
                    >
                      <LogOut className="h-4 w-4" /> Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm font-semibold text-white bg-gradient-to-r from-primary to-primary-dark px-4 py-2 rounded-lg shadow-lg shadow-primary/25 hover:brightness-110 transition-all"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <button className="text-[var(--text-secondary)]" onClick={() => setOpen((o) => !o)}>
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-[var(--border-subtle)] bg-[var(--bg-app)] px-4 py-4 space-y-3">
          {PUBLIC_LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="block text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              end={l.to === '/'}
            >
              {l.label}
            </NavLink>
          ))}
          {isJobSeeker && (
            <>
              {JOB_SEEKER_NAV_LINKS.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] hover:text-primary"
                >
                  <l.icon className="h-4 w-4" /> {l.label}
                </NavLink>
              ))}
            </>
          )}
          <div className="pt-3 border-t border-[var(--border-subtle)] space-y-2">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" onClick={() => setOpen(false)} className="block text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="block text-sm text-red-600 dark:text-red-400">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)} className="block text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                  Login
                </Link>
                <Link to="/register" onClick={() => setOpen(false)} className="block text-sm font-semibold text-primary">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
