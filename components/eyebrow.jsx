export function Eyebrow({ children, className = "" }) {
  return (
    <p className={`text-[16px] text-[#505a5f] ${className}`}>{children}</p>
  );
}
