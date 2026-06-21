import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Target, BookOpen, Lightbulb, RefreshCw, UserCog, Wand2 } from 'lucide-react';
import { getCareerGuidance } from './aiApi';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';

const NO_SKILLS_MESSAGE = 'Please add skills to your profile first';

export default function CareerGuidancePage() {
  const [data, setData] = useState(null);
  const [cached, setCached] = useState(false);
  const [loading, setLoading] = useState(false);
  const [needsSkills, setNeedsSkills] = useState(false);
  const [started, setStarted] = useState(false);

  const fetchGuidance = async () => {
    setStarted(true);
    setLoading(true);
    setNeedsSkills(false);
    try {
      const res = await getCareerGuidance();
      setData(res.data.data);
      setCached(res.data.cached);
    } catch (err) {
      const message = err?.response?.data?.message || '';
      if (message.includes(NO_SKILLS_MESSAGE) || err?.response?.status === 400) {
        setNeedsSkills(true);
      }
      // other errors handled globally via toast
    } finally {
      setLoading(false);
    }
  };

  const headerIcon = (
    <div className="h-9 w-9 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0">
      <Sparkles className="h-4.5 w-4.5 text-indigo-600 dark:text-indigo-300" />
    </div>
  );

  // ---------- Intro / CTA state ----------
  if (!started) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-14 text-center">
        <div className="relative mx-auto mb-7 h-20 w-20">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary to-fuchsia-600 blur-xl opacity-40" />
          <div className="relative h-20 w-20 rounded-3xl bg-gradient-to-br from-primary to-fuchsia-600 flex items-center justify-center shadow-lg shadow-primary/30">
            <Sparkles className="h-9 w-9 text-white" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight mb-3">AI Career Guidance</h1>
        <p className="text-[var(--text-secondary)] text-base max-w-md mx-auto mb-10">
          Get a personalized breakdown of roles you're a fit for, skills worth learning next, and how to approach
          picking them up — generated from your profile in seconds.
        </p>

        <button
          onClick={fetchGuidance}
          className="group relative inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl font-semibold text-white bg-gradient-to-r from-primary to-primary-dark shadow-xl shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all"
        >
          <Wand2 className="h-5 w-5 group-hover:rotate-12 transition-transform" />
          Generate My Career Guidance
        </button>

        <p className="text-xs text-[var(--text-muted)] mt-5">Takes a few seconds · Based on the skills in your profile</p>
      </div>
    );
  }

  // ---------- Loading ----------
  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col items-center text-center py-10 mb-6">
          <div className="h-14 w-14 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center mb-4 animate-pulse">
            <Sparkles className="h-6 w-6 text-indigo-600 dark:text-indigo-300" />
          </div>
          <p className="text-[var(--text-primary)] font-medium">Analyzing your profile…</p>
          <p className="text-[var(--text-muted)] text-sm mt-1">This usually takes a few seconds</p>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-40 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
        </div>
      </div>
    );
  }

  // ---------- Needs skills ----------
  if (needsSkills) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <EmptyState
          icon={UserCog}
          title="Add skills to get career guidance"
          description="Our AI builds a personalized career path from the skills on your profile. Add a few to get started."
          action={
            <Link to="/profile" className="text-sm font-semibold text-white bg-primary px-5 py-2.5 rounded-lg hover:bg-primary-dark transition-all">
              Go to Profile
            </Link>
          }
        />
      </div>
    );
  }

  if (!data) return null;

  // ---------- Result ----------
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-2.5">
          {headerIcon}
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Career Guidance</h1>
        </div>
        <Button variant="outline" icon={RefreshCw} onClick={fetchGuidance} className="w-auto px-4 shrink-0">
          Regenerate
        </Button>
      </div>
      <p className="text-[var(--text-secondary)] text-sm mb-2">AI-generated guidance based on your current skill set</p>
      {cached && (
        <span className="inline-block text-[11px] text-[var(--text-muted)] mb-6">Showing cached result (refreshes every 24h)</span>
      )}

      {/* Summary */}
      <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/[0.08] to-fuchsia-600/[0.04] p-6 sm:p-8 mb-6">
        <p className="text-[var(--text-primary)] leading-relaxed">{data.summary}</p>
      </div>

      {/* Job options */}
      {data.jobOptions?.length > 0 && (
        <div className="mb-6">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)] mb-3">
            <Target className="h-4 w-4 text-indigo-600 dark:text-indigo-300" /> Roles you're a fit for
          </h2>
          <div className="space-y-3">
            {data.jobOptions.map((job, i) => (
              <div key={i} className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 hover:border-[var(--border-strong)] transition-all">
                <p className="text-[var(--text-primary)] font-semibold mb-1.5">{job.title}</p>
                <p className="text-sm text-[var(--text-secondary)] mb-2">{job.responsibilities}</p>
                <p className="text-xs text-[var(--text-muted)]">{job.why}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills to learn */}
      {data.skillsToLearn?.length > 0 && (
        <div className="mb-6">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)] mb-3">
            <BookOpen className="h-4 w-4 text-indigo-600 dark:text-indigo-300" /> Skills to learn next
          </h2>
          <div className="space-y-4">
            {data.skillsToLearn.map((category, i) => (
              <div key={i} className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5">
                <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-3">{category.category}</p>
                <div className="space-y-3">
                  {category.skills?.map((skill, j) => (
                    <div key={j} className="border-l-2 border-primary/30 pl-3">
                      <p className="text-sm font-medium text-[var(--text-primary)]">{skill.title}</p>
                      <p className="text-xs text-[var(--text-secondary)] mt-0.5">{skill.why}</p>
                      <p className="text-xs text-[var(--text-muted)] mt-0.5">How: {skill.how}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Learning approach */}
      {data.learningApproach && (
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 sm:p-6">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)] mb-3">
            <Lightbulb className="h-4 w-4 text-indigo-600 dark:text-indigo-300" /> {data.learningApproach.title}
          </h2>
          <ul className="space-y-2">
            {data.learningApproach.points?.map((point, i) => (
              <li key={i} className="text-sm text-[var(--text-secondary)] flex items-start gap-2">
                <span className="text-primary mt-1">•</span> {point}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
