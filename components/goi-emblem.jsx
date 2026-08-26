import Image from "next/image";

export function GoiEmblem({
  className = "h-10 w-auto",
  alt = "State Emblem of India",
}) {
  return (
    <Image
      src="/emblem.svg"
      alt={alt}
      width={64}
      height={76}
      className={`${className} bg-white object-contain`}
    />
  );
}
