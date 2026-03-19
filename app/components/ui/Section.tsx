import { type ReactNode } from "react";

export function Section({
  id,
  eyebrow,
  title,
  subtitle,
  children,
  className = "",
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`px-6 py-12 sm:px-8 ${className}`}>
      <div className="mx-auto max-w-6xl">
        <div className="mb-5">
          {eyebrow ? (
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            {title}
          </h2>
          {subtitle ? (
            <p className="mt-2 max-w-2xl text-base leading-7 text-slate-600">
              {subtitle}
            </p>
          ) : null}
        </div>
        {children}
      </div>
    </section>
  );
}

