"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

export function ImageWithSkeleton({
  className = "",
  imgClassName = "",
  ...props
}: ImageProps & { className?: string; imgClassName?: string }) {
  const [loaded, setLoaded] = useState(false);
  const wrapperBase = props.fill
    ? "absolute inset-0 overflow-hidden"
    : "relative overflow-hidden";

  return (
    <div className={`${wrapperBase} ${className}`}>
      <div
        aria-hidden
        className={`absolute inset-0 transition-opacity duration-500 ${
          loaded ? "opacity-0" : "opacity-100"
        }`}
        style={{
          background:
            "linear-gradient(90deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.12) 40%, rgba(255,255,255,0.06) 80%)",
          backgroundSize: "260px 100%",
          animation: "shimmerSkeleton 1.2s ease-in-out infinite",
        }}
      />
      <Image
        {...props}
        alt={props.alt}
        className={imgClassName}
        onLoad={(e) => {
          props.onLoad?.(e);
          setLoaded(true);
        }}
      />
      <style jsx>{`
        @keyframes shimmerSkeleton {
          0% {
            background-position: -260px 0;
          }
          100% {
            background-position: 260px 0;
          }
        }
      `}</style>
    </div>
  );
}

