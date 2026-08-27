"use client";

import { usePathname } from "next/navigation";

export function PageContent({ children }) {
  const pathname = usePathname();

  return (
    <div
      key={pathname}
      className="flex min-h-0 flex-1 flex-col page-enter"
      style={{ viewTransitionName: "page-content" }}
    >
      {children}
    </div>
  );
}
