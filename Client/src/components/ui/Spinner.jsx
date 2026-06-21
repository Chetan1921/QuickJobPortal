export default function Spinner({ size = 'md', className = '' }) {
  const sizes = { sm: 'h-4 w-4 border-2', md: 'h-7 w-7 border-2', lg: 'h-10 w-10 border-[3px]' };
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <span className={`${sizes[size]} border-[var(--border-subtle)] border-t-primary rounded-full animate-spin`} />
    </div>
  );
}
