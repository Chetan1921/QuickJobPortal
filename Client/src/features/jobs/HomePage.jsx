import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, Briefcase, Building2, Users } from 'lucide-react';
import { getActiveJobs } from './jobApi';
import JobCard from '@/components/cards/JobCard';
import Skeleton from '@/components/ui/Skeleton';

const STATS = [
  { icon: Briefcase, label: 'Active Jobs', value: '2,400+' },
  { icon: Building2, label: 'Companies', value: '320+' },
  { icon: Users, label: 'Job Seekers', value: '18k+' },
];

export default function HomePage() {
  const [search, setSearch] = useState('');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await getActiveJobs({ page: 1, limit: 6, sort: 'latest' });
        setJobs(res.data.jobs || []);
      } catch (err) {
        // toast handled globally
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-primary/20 blur-[120px]" />
          <div className="absolute top-0 right-1/4 h-96 w-96 rounded-full bg-fuchsia-600/10 blur-[120px]" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-20 pb-16 text-center">
          <span className="inline-block text-xs font-medium text-indigo-600 dark:text-indigo-300 bg-primary/10 border border-primary/20 rounded-full px-3 py-1 mb-6">
            Find your next opportunity
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-[var(--text-primary)] tracking-tight leading-tight mb-5">
            The job board built for<br className="hidden sm:block" /> serious career moves.
          </h1>
          <p className="text-[var(--text-secondary)] text-base sm:text-lg max-w-xl mx-auto mb-9">
            Browse curated openings from real companies, track every application, and let recruiters find you.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              window.location.href = `/jobs?search=${encodeURIComponent(search)}`;
            }}
            className="max-w-xl mx-auto flex items-center gap-2 bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] rounded-2xl p-2 backdrop-blur-xl"
          >
            <Search className="h-5 w-5 text-[var(--text-muted)] ml-2" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search job title, skill, or company"
              className="flex-1 bg-transparent text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none py-2"
            />
            <button
              type="submit"
              className="text-sm font-semibold text-[var(--text-primary)] bg-gradient-to-r from-primary to-primary-dark px-5 py-2.5 rounded-xl shadow-lg shadow-primary/25 hover:brightness-110 transition-all whitespace-nowrap"
            >
              Search
            </button>
          </form>

          <div className="flex flex-wrap items-center justify-center gap-8 mt-12">
            {STATS.map((s) => (
              <div key={s.label} className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-center">
                  <s.icon className="h-4 w-4 text-primary" />
                </div>
                <div className="text-left">
                  <p className="text-[var(--text-primary)] font-bold text-sm leading-none">{s.value}</p>
                  <p className="text-[var(--text-muted)] text-xs mt-0.5">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest jobs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[var(--text-primary)]">Latest openings</h2>
          <Link to="/jobs" className="text-sm font-medium text-primary inline-flex items-center gap-1 hover:gap-1.5 transition-all">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl" />)
            : jobs.map((job) => <JobCard key={job.job_id} job={job} />)}
        </div>
      </section>
    </div>
  );
}
