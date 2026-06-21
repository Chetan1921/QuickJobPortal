import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Building2, Globe, Briefcase, Plus } from 'lucide-react';
import { getCompanyById } from './companyApi';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';

export default function CompanyDetailsPage() {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompany = async () => {
      setLoading(true);
      try {
        const res = await getCompanyById(companyId);
        setCompany(res.data.company);
        setJobs(res.data.jobs || []);
      } catch (err) {
        // handled globally
      } finally {
        setLoading(false);
      }
    };
    fetchCompany();
  }, [companyId]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-36 rounded-2xl" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  if (!company) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      {/* Company header */}
      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 sm:p-8 mb-6">
        <div className="flex items-start gap-5">
          <div className="h-16 w-16 rounded-2xl bg-[var(--bg-input)] border border-[var(--border-subtle)] overflow-hidden flex items-center justify-center shrink-0">
            {company.logo ? (
              <img src={company.logo} alt={company.name} className="h-full w-full object-cover" />
            ) : (
              <Building2 className="h-7 w-7 text-[var(--text-muted)]" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1">{company.name}</h1>
            {company.website && (
              <a
                href={company.website}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
              >
                <Globe className="h-3.5 w-3.5" /> {company.website.replace(/^https?:\/\//, '')}
              </a>
            )}
          </div>
          <Badge tone="primary" className="shrink-0">{jobs.length} job{jobs.length === 1 ? '' : 's'}</Badge>
        </div>

        {company.description && (
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed mt-5 pt-5 border-t border-[var(--border-subtle)]">
            {company.description}
          </p>
        )}
      </div>

      {/* Jobs at this company */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
          <Briefcase className="h-4 w-4 text-indigo-600 dark:text-indigo-300" /> Jobs at {company.name}
        </h2>
        <Link to="/dashboard/jobs/new">
          <Button variant="outline" icon={Plus} className="w-auto px-4">Post Job</Button>
        </Link>
      </div>

      {jobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No jobs posted yet"
          description="Post a job under this company to start receiving applications."
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
                <p className="text-xs text-[var(--text-muted)] mt-1">{job.location} · {job.job_type} · {job.work_location}</p>
              </div>
              <Badge tone={job.isactive ?? job.isActive ? 'success' : 'default'}>
                {(job.isactive ?? job.isActive) ? 'Active' : 'Closed'}
              </Badge>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
