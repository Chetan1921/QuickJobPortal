export default function ScoreBar({ label, score, feedback }) {
  const tone = score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-amber-500' : 'bg-red-500';

  return (
    <div className="mb-4 last:mb-0">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm font-medium text-[var(--text-primary)] capitalize">{label}</span>
        <span className="text-sm font-semibold text-[var(--text-primary)]">{score}/100</span>
      </div>
      <div className="h-2 rounded-full bg-[var(--bg-input)] overflow-hidden mb-1.5">
        <div className={`h-full rounded-full ${tone} transition-all`} style={{ width: `${score}%` }} />
      </div>
      {feedback && <p className="text-xs text-[var(--text-muted)]">{feedback}</p>}
    </div>
  );
}
