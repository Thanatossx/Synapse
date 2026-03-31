import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import type { PublicEvent } from "../types/data";

export function EventCarouselBlock({ items, sectionTitle }: { items: PublicEvent[]; sectionTitle: string }) {
  const total = items.length;
  const [index, setIndex] = useState(0);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);

  const goPrev = useCallback(() => {
    if (total <= 1) return;
    setIndex((i) => (i - 1 + total) % total);
  }, [total]);

  const goNext = useCallback(() => {
    if (total <= 1) return;
    setIndex((i) => (i + 1) % total);
  }, [total]);

  useEffect(() => {
    cardRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [index]);

  if (total === 0) return null;

  const currentStr = String(index + 1).padStart(2, "0");
  const totalStr = String(total).padStart(2, "0");
  const progress = total > 1 ? ((index + 1) / total) * 100 : 100;

  return (
    <div className="mb-16 md:mb-20">
      <h2
        className="mb-8 font-bold uppercase tracking-tight text-white md:mb-10"
        style={{ fontSize: "clamp(1.125rem, 2cqi + 0.75rem, 1.5rem)" }}
      >
        {sectionTitle}
      </h2>
      <div className="relative">
        <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:gap-8">
          {items.map((ev, i) => {
            const active = i === index;
            return (
              <article
                key={ev.id}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                className={`w-[min(78vw,340px)] shrink-0 snap-center snap-always transition-[opacity,transform,filter] duration-500 ease-out md:w-[min(42vw,380px)] lg:w-[min(36vw,400px)] ${
                  active
                    ? "z-10 scale-100 opacity-100 brightness-100"
                    : "scale-[0.96] opacity-[0.38] brightness-[0.55] grayscale-[0.15]"
                }`}
              >
                <div
                  className={`overflow-hidden border bg-black/40 ${
                    active ? "border-white/25 shadow-[0_0_40px_rgba(168,85,247,0.12)]" : "border-white/5"
                  }`}
                >
                  <div className="aspect-[4/5] overflow-hidden">
                    <img
                      src={ev.image}
                      alt=""
                      className="h-full w-full object-cover"
                      loading={i < 2 ? "eager" : "lazy"}
                      draggable={false}
                    />
                  </div>
                  <div className="p-4 md:p-5">
                    <h3 className="font-bold uppercase tracking-wide text-white">{ev.title}</h3>
                    <p
                      className={`mt-2 text-sm leading-relaxed text-white transition-opacity md:text-[15px] ${
                        active ? "opacity-95" : "opacity-70"
                      }`}
                    >
                      {ev.description}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-2 flex flex-col gap-6 sm:mt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div
              className="inline-flex overflow-hidden rounded-sm border border-white/10"
              style={{ backgroundColor: "#2a2a2a" }}
            >
              <button
                type="button"
                aria-label="Önceki etkinlik"
                className="flex size-10 items-center justify-center text-white transition hover:bg-white/10 md:size-11"
                onClick={goPrev}
              >
                <span className="text-lg leading-none" aria-hidden>
                  ‹
                </span>
              </button>
              <div className="w-px bg-white/10" aria-hidden />
              <button
                type="button"
                aria-label="Sonraki etkinlik"
                className="flex size-10 items-center justify-center text-white transition hover:bg-white/10 md:size-11"
                onClick={goNext}
              >
                <span className="text-lg leading-none" aria-hidden>
                  ›
                </span>
              </button>
            </div>

            <div
              className="flex min-w-0 flex-1 items-center gap-3 rounded-sm border border-white/10 px-4 py-2.5 sm:max-w-xs md:max-w-md"
              style={{ backgroundColor: "#2a2a2a" }}
            >
              <span className="font-mono text-sm tabular-nums text-white md:text-base">{currentStr}</span>
              <div className="relative h-0.5 min-w-[4rem] flex-1 overflow-hidden rounded-full bg-white/15 md:min-w-[6rem]">
                <div
                  className="absolute left-0 top-0 h-full rounded-full bg-white/70 transition-[width] duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="font-mono text-sm tabular-nums text-white/80 md:text-base">{totalStr}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function BlackSection({ children }: { children: ReactNode }) {
  return (
    <div className="relative w-full overflow-hidden">
      <div className="absolute inset-0 bg-black" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
