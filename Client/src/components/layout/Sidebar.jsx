import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, User, ListChecks, Building2, Briefcase, ClipboardList, Sparkles, ScanSearch,
} from 'lucide-react';

export const JOB_SEEKER_LINKS = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/profile', label: 'Profile', icon: User },
  { to: '/applications', label: 'My Applications', icon: ListChecks },
  { to: '/ai/career-guidance', label: 'Career Guidance', icon: Sparkles },
  { to: '/ai/resume-analyzer', label: 'Resume Analyzer', icon: ScanSearch },
];

export const RECRUITER_LINKS = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/dashboard/companies', label: 'Companies', icon: Building2 },
  { to: '/dashboard/jobs', label: 'Jobs', icon: Briefcase },
  { to: '/dashboard/applications', label: 'Applications', icon: ClipboardList },
  { to: '/profile', label: 'Profile', icon: User },
];

// Desktop sidebar — vertical, sticky, hidden below md
export default function Sidebar({ role }) {
  const links = role === 'recruiter' ? RECRUITER_LINKS : JOB_SEEKER_LINKS;

  return (
    <aside className="hidden md:block w-56 shrink-0 border-r border-[var(--border-subtle)] py-8 pr-4">
      <nav className="space-y-1 sticky top-24">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive ? 'bg-primary/15 text-[var(--text-primary)] border border-primary/30' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)]'
              }`
            }
          >
            <l.icon className="h-4 w-4" />
            {l.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
