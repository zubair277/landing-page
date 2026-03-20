"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent } from "react";
import { ImageWithSkeleton } from "@/app/components/ui/ImageWithSkeleton";

type NewsItem = {
  tag: string;
  title: string;
  description: string;
  imageUrl: string;
};

export function PhoneNewsCarousel() {
  const items: NewsItem[] = useMemo(
    () => [
      {
        imageUrl: "/images/peri-peri-chicken-skewers.jpg",
        title: "Government Shutdown Standoff",
        tag: "Politics",
        description: "Tensions rise as leaders debate next steps and funding.",
      },
      {
        imageUrl: "/images/truffle-mushroom-arancini.jpg",
        title: "Bank Stocks Surge on Volume",
        tag: "Finance",
        description: "Markets react as trading volume picks up across major banks.",
      },
      {
        imageUrl: "/images/paneer-steak-herb-sauce.jpg",
        title: "Team USA Dominates Winter Olympics",
        tag: "Sports",
        description: "A standout performance delivers momentum heading forward.",
      },
    ],
    []
  );

  const n = items.length;
  const slides = useMemo(() => [...items, items[0]], [items]); // duplicate first

  const screenRef = useRef<HTMLDivElement | null>(null);
  const [screenWidth, setScreenWidth] = useState(0);

  const [index, setIndex] = useState(0); // 0..n (n is duplicate)
  const [transitionEnabled, setTransitionEnabled] = useState(true);

  const [dragging, setDragging] = useState(false);
  const [dragX, setDragX] = useState(0);
  const dragStartX = useRef(0);
  const dragPointerId = useRef<number | null>(null);
  const lastDragX = useRef(0);

  // Measure screen width for pixel-perfect snapping
  useEffect(() => {
    const el = screenRef.current;
    if (!el) return;

    const initial = Math.max(0, Math.floor(el.getBoundingClientRect().width));
    setScreenWidth(initial);

    const ro = new ResizeObserver(() => {
      const rect = el.getBoundingClientRect();
      setScreenWidth(Math.max(0, Math.floor(rect.width)));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Autoplay: move every 3 seconds
  useEffect(() => {
    if (!screenWidth) return;
    if (dragging) return;

    const t = window.setInterval(() => {
      setTransitionEnabled(true);
      setIndex((v) => v + 1);
    }, 3000);

    return () => window.clearInterval(t);
  }, [screenWidth, dragging]);

  const goPrev = () => {
    setTransitionEnabled(true);
    setIndex((v) => {
      if (v === 0) return n - 1;
      if (v === n) return n - 1; // when on duplicate, prev should show last real slide
      return v - 1;
    });
  };

  const goNext = () => {
    setTransitionEnabled(true);
    setIndex((v) => v + 1);
  };

  const activeDot = index === n ? 0 : index;

  const handleTransitionEnd = () => {
    // If we reached the duplicate slide, snap back to the first without animation.
    if (index !== n) return;
    setTransitionEnabled(false);
    setIndex(0);
    // Re-enable transitions on the next frame for subsequent swipes/autoplay.
    window.requestAnimationFrame(() => setTransitionEnabled(true));
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (!screenWidth) return;
    dragPointerId.current = e.pointerId;
    dragStartX.current = e.clientX;
    lastDragX.current = 0;
    setDragging(true);
    setDragX(0);
    setTransitionEnabled(false);
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    if (dragPointerId.current !== e.pointerId) return;
    const dx = e.clientX - dragStartX.current;
    lastDragX.current = dx;
    setDragX(dx);
  };

  const onPointerUpOrCancel = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    if (dragPointerId.current !== e.pointerId) return;

    const dx = lastDragX.current;
    const threshold = Math.max(32, screenWidth * 0.18);

    if (dx <= -threshold) {
      goNext();
    } else if (dx >= threshold) {
      goPrev();
    } else {
      // Snap back to current index
      setTransitionEnabled(true);
    }

    setDragging(false);
    setDragX(0);
    dragPointerId.current = null;
  };

  const translateX = screenWidth
    ? -index * screenWidth + (dragging ? dragX : 0)
    : 0;

  return (
    <div
      ref={screenRef}
      className="relative h-full w-full overflow-hidden"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUpOrCancel}
      onPointerCancel={onPointerUpOrCancel}
    >
      <div
        className="absolute inset-0"
        style={{
          transform: `translate3d(${translateX}px, 0, 0)`,
          transition: transitionEnabled && !dragging ? "transform 600ms ease-in-out" : "none",
          willChange: "transform",
          display: "flex",
          height: "100%",
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        {slides.map((item, i) => (
          <div
            // eslint-disable-next-line react/no-array-index-key
            key={`${item.title}-${i}`}
            style={{ flex: `0 0 ${screenWidth || 1}px` }}
            className="relative h-full"
          >
            <div className="absolute inset-0 overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200">
              <div className="relative h-[60%] w-full bg-slate-50">
                <ImageWithSkeleton
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  sizes="240px"
                  imgClassName="object-cover"
                />
                {/* dark overlay for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/25 to-transparent" />

                <div className="absolute bottom-4 left-4 right-4">
                  <div className="inline-flex rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold text-white ring-1 ring-white/25">
                    {item.tag}
                  </div>
                  <h3 className="mt-2 line-clamp-2 text-[14px] font-extrabold leading-5 text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-[12px] leading-4 text-white/85">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* subtle bottom padding like the reference card */}
              <div className="h-[40%] bg-white" />
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-1 left-0 right-0 flex justify-center gap-2">
        {items.map((_, i) => {
          const active = i === activeDot;
          return (
            <span
              // eslint-disable-next-line react/no-array-index-key
              key={i}
              className={`h-1.5 w-1.5 rounded-full ${
                active ? "bg-white" : "bg-white/40"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}

