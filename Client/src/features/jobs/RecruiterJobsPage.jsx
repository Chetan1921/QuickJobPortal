import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Briefcase } from 'lucide-react';
import { getActiveJobs } from './jobApi';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';

export default function RecruiterJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await getActiveJobs({ page: 1, limit: 20 });
        setJobs(res.data.jobs || []);
      } catch (err) {
        // handled globally
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1.5">Jobs</h1>
          <p className="text-[var(--text-secondary)] text-sm">Jobs you've posted</p>
        </div>
        <Link to="/dashboard/jobs/new">
          <Button icon={Plus} className="w-auto px-5">Post Job</Button>
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}</div>
      ) : jobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No jobs posted yet"
          description="Post your first job to start receiving applications."
          action={<Link to="/dashboard/jobs/new"><Button className="w-auto px-5">Post a Job</Button></Link>}
        />
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <Link
              key={job.job_id}
              to={`/dashboard/applications?jobId=${job.job_id}`}
              className="flex items-center justify-between gap-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] px-5 py-4 transition-all"
            >
              <div className="min-w-0">
                <p className="text-[var(--text-primary)] font-medium truncate">{job.title}</p>
                <p className="text-xs text-[var(--text-muted)] mt-1">{job.company_name} · {job.location}</p>
              </div>
              <Badge tone={job.isActive ? 'success' : 'default'}>{job.isActive ? 'Active' : 'Closed'}</Badge>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
