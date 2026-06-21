import { useState } from 'react';
import toast from 'react-hot-toast';
import { ScanSearch, UploadCloud, FileText, X, CheckCircle2, AlertTriangle } from 'lucide-react';
import { analyzeResume } from './aiApi';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import ScoreBar from '@/components/cards/ScoreBar';
import Skeleton from '@/components/ui/Skeleton';

const MAX_SIZE = 5 * 1024 * 1024; // 5MB

const PRIORITY_TONE = { high: 'danger', medium: 'warning', low: 'default' };

export default function ResumeAnalyzerPage() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    if (selected.type !== 'application/pdf') {
      toast.error('Only PDF files are supported');
      return;
    }
    if (selected.size > MAX_SIZE) {
      toast.error('File must be under 5MB');
      return;
    }
    setFile(selected);
    setResult(null);
  };

  const handleAnalyze = async () => {
    if (!file) return;
    try {
      setLoading(true);
      const res = await analyzeResume(file);
      setResult(res.data.data);
    } catch (err) {
      // handled globally
    } finally {
      setLoading(false);
    }
  };

  const scoreTone = (score) => (score >= 80 ? 'text-green-700 dark:text-green-400' : score >= 60 ? 'text-amber-700 dark:text-amber-400' : 'text-red-600 dark:text-red-400');

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center gap-2.5 mb-2">
        <div className="h-9 w-9 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0">
          <ScanSearch className="h-4.5 w-4.5 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Resume Analyzer</h1>
      </div>
      <p className="text-[var(--text-secondary)] text-sm mb-8">Get an AI-powered ATS score and suggestions for your resume</p>

      {/* Upload */}
      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 sm:p-8 mb-6">
        {file ? (
          <div className="flex items-center justify-between gap-4 px-4 py-3 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)]">
            <div className="flex items-center gap-2.5 min-w-0">
              <FileText className="h-5 w-5 text-primary shrink-0" />
              <span className="text-sm text-[var(--text-primary)] truncate">{file.name}</span>
            </div>
            <button onClick={() => { setFile(null); setResult(null); }} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] shrink-0">
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center gap-1.5 py-10 rounded-xl border border-dashed border-[var(--border-strong)] hover:border-primary/50 hover:bg-[var(--bg-surface-hover)] cursor-pointer transition-all">
            <UploadCloud className="h-7 w-7 text-[var(--text-muted)]" />
            <span className="text-sm text-[var(--text-secondary)]">Click to upload your resume</span>
            <span className="text-xs text-[var(--text-muted)]">PDF only, max 5MB</span>
            <input type="file" accept="application/pdf" className="hidden" onChange={handleFileChange} />
          </label>
        )}

        <Button onClick={handleAnalyze} loading={loading} disabled={!file} className="mt-5">
          Analyze Resume
        </Button>
      </div>

      {loading && (
        <div className="space-y-4">
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      )}

      {result && !loading && (
        <>
          {/* Overall score */}
          <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 sm:p-8 mb-6 flex items-center gap-6">
            <div className="relative h-20 w-20 shrink-0">
              <svg viewBox="0 0 36 36" className="h-20 w-20 -rotate-90">
                <circle cx="18" cy="18" r="16" fill="none" stroke="var(--bg-input)" strokeWidth="3" />
                <circle
                  cx="18" cy="18" r="16" fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeDasharray={`${result.atsScore}, 100`}
                  strokeLinecap="round"
                  className={scoreTone(result.atsScore)}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-lg font-bold ${scoreTone(result.atsScore)}`}>{result.atsScore}</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--text-primary)] mb-1">ATS Score</p>
              <p className="text-sm text-[var(--text-secondary)]">{result.summary}</p>
            </div>
          </div>

          {/* Score breakdown */}
          {result.scoreBreakdown && (
            <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 sm:p-8 mb-6">
              <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Score Breakdown</h2>
              {Object.entries(result.scoreBreakdown).map(([key, val]) => (
                <ScoreBar key={key} label={key} score={val.score} feedback={val.feedback} />
              ))}
            </div>
          )}

          {/* Strengths */}
          {result.strengths?.length > 0 && (
            <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 sm:p-8 mb-6">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)] mb-3">
                <CheckCircle2 className="h-4 w-4 text-green-700 dark:text-green-400" /> Strengths
              </h2>
              <ul className="space-y-1.5">
                {result.strengths.map((s, i) => (
                  <li key={i} className="text-sm text-[var(--text-secondary)] flex items-start gap-2">
                    <span className="text-green-700 dark:text-green-400 mt-1">•</span> {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Suggestions */}
          {result.suggestions?.length > 0 && (
            <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 sm:p-8">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)] mb-4">
                <AlertTriangle className="h-4 w-4 text-amber-700 dark:text-amber-400" /> Suggestions
              </h2>
              <div className="space-y-3">
                {result.suggestions.map((sug, i) => (
                  <div key={i} className="border-l-2 border-amber-500/30 pl-3">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium text-[var(--text-primary)]">{sug.category}</p>
                      <Badge tone={PRIORITY_TONE[sug.priority] || 'default'}>{sug.priority}</Badge>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)]">{sug.issue}</p>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">{sug.recommendation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
