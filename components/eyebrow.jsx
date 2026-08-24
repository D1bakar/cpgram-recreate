export function Eyebrow({ children, className = "" }) {
  return (
    <p
      className={`font-mono text-[11px] uppercase tracking-[0.08em] text-[#a7a7a7] ${className}`}
    >
      {children}
    </p>
  );
}
