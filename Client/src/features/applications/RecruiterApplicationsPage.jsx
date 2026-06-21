import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ClipboardList, FileText, User } from 'lucide-react';
import { getApplicationsByJob, updateApplicationStatus } from '@/features/jobs/jobApi';
import Badge from '@/components/ui/Badge';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';

const STATUS_OPTIONS = ['Submitted', 'Shortlisted', 'Rejected', 'Hired'];
const STATUS_TONE = { Submitted: 'default', Shortlisted: 'primary', Hired: 'success', Rejected: 'danger' };

export default function RecruiterApplicationsPage() {
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get('jobId');
  const [applications, setApplications] = useState([]);
  const [jobTitle, setJobTitle] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!jobId) { setLoading(false); return; }
    const fetchApplications = async () => {
      setLoading(true);
      try {
        const res = await getApplicationsByJob(jobId);
        const apps = res.data.applications || [];
        setApplications(apps);
        if (apps.length) setJobTitle(apps[0].title);
      } catch (err) {
        // handled globally
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [jobId]);

  const handleStatusChange = async (id, status) => {
    try {
      await updateApplicationStatus(id, status);
      setApplications((apps) => apps.map((a) => (a.application_id === id ? { ...a, status } : a)));
      toast.success('Status updated');
    } catch (err) {
      // handled globally
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1.5">Applications</h1>
      <p className="text-[var(--text-secondary)] text-sm mb-8">
        {jobId
          ? jobTitle
            ? `Candidates for "${jobTitle}"`
            : 'Review and manage candidates for this job'
          : 'Select a job from the Jobs tab to see its applications'}
      </p>

      {!jobId ? (
        <EmptyState icon={ClipboardList} title="No job selected" description="Go to Jobs and click a job to view its applicants." />
      ) : loading ? (
        <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}</div>
      ) : applications.length === 0 ? (
        <EmptyState icon={ClipboardList} title="No applications yet" description="Check back once candidates start applying." />
      ) : (
        <div className="space-y-3">
          {applications.map((app) => (
            <div key={app.application_id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-5 py-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-9 w-9 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-center shrink-0">
                  <User className="h-4 w-4 text-[var(--text-muted)]" />
                </div>
                <div className="min-w-0">
                  <p className="text-[var(--text-primary)] font-medium truncate">Applicant #{app.applicant_id}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-1">Applied on {new Date(app.applied_at).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 flex-wrap">
                <div className="flex items-center gap-3">
                  {app.resume_url && (
                    <a
                      href={app.resume_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline shrink-0"
                    >
                      <FileText className="h-3.5 w-3.5" /> Resume
                    </a>
                  )}
                  <Badge tone={STATUS_TONE[app.status] || 'default'}>{app.status}</Badge>
                </div>
                <select
                  value={app.status}
                  onChange={(e) => handleStatusChange(app.application_id, e.target.value)}
                  className="text-xs bg-[var(--bg-input)] border border-[var(--border-subtle)] text-[var(--text-secondary)] rounded-lg px-2.5 py-2 focus:outline-none focus:border-primary/50 min-w-[110px]"
                >
                  {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
