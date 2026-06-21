export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      {Icon && (
        <div className="h-14 w-14 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-center mb-4">
          <Icon className="h-6 w-6 text-[var(--text-muted)]" />
        </div>
      )}
      <h3 className="text-[var(--text-primary)] font-semibold mb-1.5">{title}</h3>
      {description && <p className="text-[var(--text-secondary)] text-sm max-w-sm mb-5">{description}</p>}
      {action}
    </div>
  );
}
