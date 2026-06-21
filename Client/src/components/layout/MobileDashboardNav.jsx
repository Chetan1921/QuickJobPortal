import { NavLink } from 'react-router-dom';
import { JOB_SEEKER_LINKS, RECRUITER_LINKS } from './Sidebar';

export default function MobileDashboardNav({ role }) {
  const links = role === 'recruiter' ? RECRUITER_LINKS : JOB_SEEKER_LINKS;

  return (
    <nav className="md:hidden sticky top-16 z-30 -mx-4 sm:-mx-6 px-4 sm:px-6 py-2.5 border-b border-[var(--border-subtle)] bg-[var(--bg-app)]/90 backdrop-blur-xl overflow-x-auto">
      <div className="flex items-center gap-2 w-max">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            className={({ isActive }) =>
              `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
                isActive
                  ? 'bg-primary/15 text-[var(--text-primary)] border border-primary/30'
                  : 'text-[var(--text-secondary)] border border-transparent hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)]'
              }`
            }
          >
            <l.icon className="h-3.5 w-3.5" />
            {l.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
