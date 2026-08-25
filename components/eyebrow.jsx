export function Eyebrow({ children, className = "" }) {
  return (
    <p
      className={`font-sans text-sm font-bold uppercase tracking-[0.12em] text-clay ${className}`}
    >
      {children}
    </p>
  );
}
