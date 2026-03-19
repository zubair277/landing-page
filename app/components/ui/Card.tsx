import { type ReactNode } from "react";

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl bg-white ring-1 ring-slate-200 shadow-md ${className}`}
    >
      {children}
    </div>
  );
}

