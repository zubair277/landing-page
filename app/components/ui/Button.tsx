"use client";

import Link from "next/link";
import { type ComponentProps } from "react";

type Variant = "primary" | "secondary" | "ghost";

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-200 ease-out will-change-transform active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

const variants: Record<Variant, string> = {
  primary:
    "bg-[#25D366] text-white shadow-md hover:shadow-lg hover:bg-[#1fbf5a] hover:-translate-y-[1px]",
  secondary:
    "bg-white text-slate-900 ring-1 ring-slate-200 hover:bg-slate-50 hover:ring-slate-300 hover:-translate-y-[1px]",
  ghost: "text-slate-600 hover:text-slate-900 hover:bg-slate-50",
};

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ComponentProps<"button"> & { variant?: Variant }) {
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props} />
  );
}

export function ButtonLink({
  variant = "primary",
  className = "",
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant }) {
  return (
    <Link className={`${base} ${variants[variant]} ${className}`} {...props} />
  );
}

export function ExternalButtonLink({
  variant = "primary",
  className = "",
  ...props
}: ComponentProps<"a"> & { variant?: Variant }) {
  return (
    <a
      className={`${base} ${variants[variant]} ${className}`}
      target="_blank"
      rel="noreferrer"
      {...props}
    />
  );
}

