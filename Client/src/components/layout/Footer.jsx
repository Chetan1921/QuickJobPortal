import { Link } from 'react-router-dom';
import { Briefcase, Mail, Phone, Linkedin, Github, Globe, MapPin } from 'lucide-react';

const DEVELOPER = {
  name: 'Chetan Sharma',
  location: 'Mathura, Uttar Pradesh, India',
  email: 'chetan.sharma200104022@gmail.com',
  phone: '+91-7300844033',
  linkedin: 'https://linkedin.com/in/chetan-sharma10',
  github: 'https://github.com/Chetan1921',
  portfolio: 'https://v0-resume-analysis-xi-six.vercel.app/',
};

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border-subtle)] bg-[var(--bg-app)] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-8 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-primary to-fuchsia-600 flex items-center justify-center">
              <Briefcase className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-sm font-semibold text-[var(--text-primary)]">QuickJob</span>
          </div>

          <div className="flex items-center gap-5">
            <Link to="/jobs" className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">Find Jobs</Link>
            <Link to="/register" className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">For Recruiters</Link>
          </div>
        </div>

        {/* Developer credit */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 pt-8">
          <div>
            <p className="text-xs text-[var(--text-muted)] mb-1.5">Built &amp; maintained by</p>
            <p className="text-sm font-semibold text-[var(--text-primary)]">{DEVELOPER.name}</p>
            <p className="text-xs text-[var(--text-muted)] flex items-center gap-1 mt-1">
              <MapPin className="h-3 w-3" /> {DEVELOPER.location}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <a href={`mailto:${DEVELOPER.email}`} className="text-xs text-[var(--text-secondary)] hover:text-primary inline-flex items-center gap-1.5 transition-colors">
              <Mail className="h-3.5 w-3.5" /> {DEVELOPER.email}
            </a>
            <a href={`tel:${DEVELOPER.phone}`} className="text-xs text-[var(--text-secondary)] hover:text-primary inline-flex items-center gap-1.5 transition-colors">
              <Phone className="h-3.5 w-3.5" /> {DEVELOPER.phone}
            </a>
            <a href={DEVELOPER.linkedin} target="_blank" rel="noreferrer" className="text-xs text-[var(--text-secondary)] hover:text-primary inline-flex items-center gap-1.5 transition-colors">
              <Linkedin className="h-3.5 w-3.5" /> LinkedIn
            </a>
            <a href={DEVELOPER.github} target="_blank" rel="noreferrer" className="text-xs text-[var(--text-secondary)] hover:text-primary inline-flex items-center gap-1.5 transition-colors">
              <Github className="h-3.5 w-3.5" /> GitHub
            </a>
            <a href={DEVELOPER.portfolio} target="_blank" rel="noreferrer" className="text-xs text-[var(--text-secondary)] hover:text-primary inline-flex items-center gap-1.5 transition-colors">
              <Globe className="h-3.5 w-3.5" /> Portfolio
            </a>
          </div>
        </div>

        <p className="text-[11px] text-[var(--text-muted)] mt-8">© {new Date().getFullYear()} QuickJob. All rights reserved.</p>
      </div>
    </footer>
  );
}
