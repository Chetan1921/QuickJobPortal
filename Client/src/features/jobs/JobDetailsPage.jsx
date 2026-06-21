import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { MapPin, Briefcase, IndianRupee, Users, ArrowLeft, Building2, CheckCircle2 } from 'lucide-react';
import { getJobById, applyForJob } from './jobApi';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';

export default function JobDetailsPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      try {
        const res = await getJobById(jobId);
        setJob(res.data.job);
      } catch (err) {
        // toast handled globally
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [jobId]);

  const handleApply = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (user?.role === 'job_seeker' && !user?.resume) {
      toast.error('Please upload your resume before applying');
      navigate('/profile');
      return;
    }
    try {
      setApplying(true);
      await applyForJob(jobId);
      toast.success('Application submitted');
      setApplied(true);
    } catch (err) {
      // handled globally
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-40 rounded-2xl" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  if (!job) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <Link to="/jobs" className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to jobs
      </Link>

      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 sm:p-8 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          <div className="h-16 w-16 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] overflow-hidden flex items-center justify-center shrink-0">
            {job.company_logo ? (
              <img src={job.company_logo} alt={job.company_name} className="h-full w-full object-cover" />
            ) : (
              <Building2 className="h-7 w-7 text-[var(--text-muted)]" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1">{job.title}</h1>
            <p className="text-[var(--text-secondary)]">{job.company_name}</p>
          </div>
          <Button onClick={handleApply} loading={applying} disabled={applied} icon={applied ? CheckCircle2 : undefined} className="sm:w-auto px-8">
            {applied ? 'Applied' : user?.role === 'recruiter' ? 'View Only' : 'Apply Now'}
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {job.location && <Badge><MapPin className="h-3 w-3 mr-1 inline" />{job.location}</Badge>}
          {job.job_type && <Badge tone="primary"><Briefcase className="h-3 w-3 mr-1 inline" />{job.job_type}</Badge>}
          {job.work_location && <Badge>{job.work_location}</Badge>}
          {job.salary && <Badge tone="success"><IndianRupee className="h-3 w-3 mr-1 inline" />{job.salary.toLocaleString()}</Badge>}
          {job.openings && <Badge><Users className="h-3 w-3 mr-1 inline" />{job.openings} openings</Badge>}
        </div>

        <div className="prose prose-invert prose-sm max-w-none">
          <h3 className="text-[var(--text-primary)] font-semibold mb-2">Job Description</h3>
          <p className="text-[var(--text-secondary)] leading-relaxed whitespace-pre-line">{job.description}</p>
        </div>
      </div>

      {job.company_description && (
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 sm:p-8">
          <h3 className="text-[var(--text-primary)] font-semibold mb-2">About {job.company_name}</h3>
          <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{job.company_description}</p>
          {job.company_website && (
            <a href={job.company_website} target="_blank" rel="noreferrer" className="inline-block mt-3 text-sm text-primary hover:underline">
              Visit website →
            </a>
          )}
        </div>
      )}
    </div>
  );
}
