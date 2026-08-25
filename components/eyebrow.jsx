export function Eyebrow({ children, className = "" }) {
  return (
    <p
      className={`font-mono text-[12px] uppercase tracking-[0.08em] text-cloud-dark ${className}`}
    >
      {children}
    </p>
  );
}
