import { Link } from 'react-router-dom';
import { MapPin, Briefcase, Clock } from 'lucide-react';
import Badge from '@/components/ui/Badge';

export default function JobCard({ job }) {
  return (
    <Link
      to={`/jobs/${job.job_id}`}
      className="group block rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] hover:border-[var(--border-strong)] p-5 transition-all"
    >
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] overflow-hidden shrink-0 flex items-center justify-center">
          {job.company_logo ? (
            <img src={job.company_logo} alt={job.company_name} className="h-full w-full object-cover" />
          ) : (
            <Briefcase className="h-5 w-5 text-[var(--text-muted)]" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-[var(--text-primary)] font-semibold truncate group-hover:text-primary transition-colors">
            {job.title}
          </h3>
          <p className="text-sm text-[var(--text-secondary)] truncate">{job.company_name}</p>

          <div className="flex flex-wrap items-center gap-2 mt-3">
            {job.location && (
              <Badge tone="default">
                <MapPin className="h-3 w-3 mr-1 inline" />
                {job.location}
              </Badge>
            )}
            {job.job_type && <Badge tone="primary">{job.job_type}</Badge>}
            {job.work_location && <Badge tone="default">{job.work_location}</Badge>}
          </div>
        </div>
      </div>
    </Link>
  );
}
