import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Inbox, MapPin, Building2 } from 'lucide-react';
import { getMyApplications } from '@/features/jobs/jobApi';
import Badge from '@/components/ui/Badge';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';

const STATUS_TONE = {
  Submitted: 'default',
  Shortlisted: 'primary',
  Hired: 'success',
  Rejected: 'danger',
};

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await getMyApplications({ page: 1, limit: 20 });
        setApplications(res.data.applications || []);
      } catch (err) {
        // handled globally
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1.5">My Applications</h1>
      <p className="text-[var(--text-secondary)] text-sm mb-8">Track the status of every job you've applied to</p>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
        </div>
      ) : applications.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="No applications yet"
          description="Start applying to jobs and track your progress here."
          action={
            <Link to="/jobs" className="text-sm font-semibold text-[var(--text-primary)] bg-primary px-5 py-2.5 rounded-lg hover:bg-primary-dark transition-all">
              Browse Jobs
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          {applications.map((app) => (
            <Link
              key={app.application_id}
              to={`/jobs/${app.job_id}`}
              className="flex items-center gap-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] px-5 py-4 transition-all"
            >
              <div className="h-11 w-11 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] overflow-hidden flex items-center justify-center shrink-0">
                {app.company_logo ? (
                  <img src={app.company_logo} alt={app.company_name} className="h-full w-full object-cover" />
                ) : (
                  <Building2 className="h-5 w-5 text-[var(--text-muted)]" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[var(--text-primary)] font-medium truncate">{app.title}</p>
                <p className="text-xs text-[var(--text-muted)] mt-1 flex items-center gap-2 flex-wrap">
                  <span>{app.company_name}</span>
                  {app.location && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {app.location}
                    </span>
                  )}
                  <span>· Applied {new Date(app.applied_at).toLocaleDateString()}</span>
                </p>
              </div>

              <Badge tone={STATUS_TONE[app.status] || 'default'} className="shrink-0">{app.status}</Badge>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
