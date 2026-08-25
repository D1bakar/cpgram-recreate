export function GoiEmblem({
  className = "h-14 w-auto",
  alt = "State Emblem of India",
}) {
  return (
    <img
      src="/emblem.svg"
      alt={alt}
      width={56}
      height={67}
      className={className}
    />
  );
}
