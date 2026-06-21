import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Briefcase, ListChecks, Building2, ClipboardList, FileCheck2, Award, Sparkles, ScanSearch, ArrowRight } from 'lucide-react';
import StatCard from '@/components/cards/StatCard';
import { getMyApplications, getActiveJobs, getApplicationsByJob } from './jobApi';
import { getAllCompanies } from '@/features/companies/companyApi';
import Skeleton from '@/components/ui/Skeleton';

export default function DashboardOverview() {
  const { user } = useSelector((state) => state.auth);
  const isRecruiter = user?.role === 'recruiter';
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (isRecruiter) {
          // 1. Get this recruiter's companies (Companies has a recruiter_id column,
          //    but GetAllCompanies isn't recruiter-scoped, so we filter client-side).
          const companiesRes = await getAllCompanies({ page: 1, limit: 100 });
          const myCompanyIds = new Set(
            (companiesRes.data.companies || [])
              .filter((c) => c.recruiter_id === user.id)
              .map((c) => c.company_id)
          );

          // 2. GetAllActiveJobs only returns active jobs and isn't recruiter-scoped
          //    either, so filter those down to jobs under this recruiter's companies.
          const jobsRes = await getActiveJobs({ page: 1, limit: 100 });
          const myActiveJobs = (jobsRes.data.jobs || []).filter((j) => myCompanyIds.has(j.company_id));

          // 3. There's no single "total applications across all my jobs" endpoint,
          //    so sum per-job counts (capped to keep this fast on dashboards with many jobs).
          const jobsToCount = myActiveJobs.slice(0, 15);
          const appCounts = await Promise.all(
            jobsToCount.map((j) =>
              getApplicationsByJob(j.job_id)
                .then((res) => res.data.totalApplications ?? res.data.applications?.length ?? 0)
                .catch(() => 0)
            )
          );
          const totalApplications = appCounts.reduce((sum, n) => sum + n, 0);

          setStats({
            companies: companiesRes.data.total ?? myCompanyIds.size,
            activeJobs: myActiveJobs.length,
            totalApplications,
          });
        } else {
          const res = await getMyApplications({ page: 1, limit: 1 });
          setStats({ applications: res.data.totalApplications || 0 });
        }
      } catch (err) {
        // handled globally
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [isRecruiter, user?.id]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1.5">Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
      <p className="text-[var(--text-secondary)] text-sm mb-8">
        {isRecruiter ? "Here's how your hiring pipeline is looking." : "Here's a snapshot of your job search."}
      </p>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
        </div>
      ) : isRecruiter ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard icon={Building2} label="Total Companies" value={stats.companies ?? 0} />
          <StatCard icon={Briefcase} label="Active Jobs" value={stats.activeJobs ?? 0} tone="success" />
          <StatCard icon={ClipboardList} label="Total Applications" value={stats.totalApplications ?? 0} tone="warning" />
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard icon={ListChecks} label="Applications Sent" value={stats.applications ?? 0} />
          <StatCard icon={FileCheck2} label="Resume Status" value={user ? 'Active' : '—'} tone="success" />
          <StatCard icon={Award} label="Profile Completion" value="80%" tone="warning" />
        </div>
      )}

      {!isRecruiter && !loading && (
        <div className="grid sm:grid-cols-2 gap-4 mt-4">
          <Link
            to="/ai/career-guidance"
            className="group flex items-center justify-between gap-4 rounded-2xl border border-primary/20 bg-primary/[0.06] hover:bg-primary/[0.1] p-5 transition-all"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-10 w-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0">
                <Sparkles className="h-4.5 w-4.5 text-indigo-600 dark:text-indigo-300" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[var(--text-primary)]">Get AI Career Guidance</p>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">Personalized roles &amp; skills to learn next</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-indigo-600 dark:text-indigo-300 shrink-0 group-hover:translate-x-0.5 transition-transform" />
          </Link>

          <Link
            to="/ai/resume-analyzer"
            className="group flex items-center justify-between gap-4 rounded-2xl border border-primary/20 bg-primary/[0.06] hover:bg-primary/[0.1] p-5 transition-all"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-10 w-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0">
                <ScanSearch className="h-4.5 w-4.5 text-indigo-600 dark:text-indigo-300" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[var(--text-primary)]">Analyze Your Resume</p>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">Get your ATS score and improvement tips</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-indigo-600 dark:text-indigo-300 shrink-0 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      )}
    </div>
  );
}
