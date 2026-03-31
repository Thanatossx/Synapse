import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { apiGet } from "../lib/api";
import { fallbackBracelets } from "../lib/fallbackData";
import type { PublicBracelet } from "../types/data";

function BlackSection({ children }: { children: ReactNode }) {
  return (
    <div className="relative w-full overflow-hidden">
      <div className="absolute inset-0 bg-black" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export function Bracelet() {
  const [items, setItems] = useState<PublicBracelet[]>([]);
  const [usedFallback, setUsedFallback] = useState(false);
  const total = items.length;
  const [index, setIndex] = useState(0);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    apiGet<PublicBracelet[]>("/api/bracelets")
      .then(setItems)
      .catch(() => {
        setItems(fallbackBracelets());
        setUsedFallback(true);
      });
  }, []);

  const goPrev = useCallback(() => {
    if (total <= 1) return;
    setIndex((i) => (i - 1 + total) % total);
  }, [total]);

  const goNext = useCallback(() => {
    if (total <= 1) return;
    setIndex((i) => (i + 1) % total);
  }, [total]);

  useEffect(() => {
    if (total === 0) return;
    setIndex((i) => Math.min(i, total - 1));
  }, [total]);

  useEffect(() => {
    cardRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [index]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goPrev, goNext]);

  const currentStr = String(Math.min(index + 1, Math.max(total, 1))).padStart(2, "0");
  const totalStr = String(Math.max(total, 1)).padStart(2, "0");
  const progress = total > 1 ? ((index + 1) / total) * 100 : 100;

  return (
    <section className="w-full">
      <BlackSection>
        <div className="mx-auto max-w-[1536px] px-6 py-16 md:py-24">
          <div className="mb-12 max-w-3xl md:mb-14">
            <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-violet-200/55">
              Bileklik Kültürü
            </span>
            <h1
              className="synax-about-title-glow mt-3 font-bold text-[#faf8ff]"
              style={{ fontSize: "clamp(1.75rem, 3cqi + 1rem, 2.25rem)" }}
            >
              Her şeyin bir anlamı var.
            </h1>
            <p className="synax-cta-sub-glow mt-6 text-[15px] leading-relaxed text-white/85 md:text-base">
              SYNAX partilerinde katılımcılar, farklı renklerde Kandi bileklikler takarak kendilerini
              ve sınırlarını ifade ederler. Bu sistem, partinin kaotik enerjisinde iletişim kurmayı
              kolaylaştırır ve yanlış anlaşılmaları önler. Her renk, katılımcının niyetini, sosyal veya
              romantik yaklaşımını temsil eder. Kısaca, Kandi bileklik kültürü bir tür görsel sosyal
              dildir.
            </p>
            {usedFallback && (
              <p className="mt-4 rounded border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100/90">
                Sunucuya bağlanılamadı; örnek bileklik listesi gösteriliyor.
              </p>
            )}
          </div>

          {total === 0 ? (
            <p className="text-white/70">Henüz bileklik eklenmedi.</p>
          ) : (
            <div className="relative">
              <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:gap-8">
                {items.map((b, i) => {
                  const active = i === index;
                  return (
                    <article
                      key={b.id}
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
                      className={`flex flex-col gap-4 overflow-hidden border bg-black/40 p-4 transition-[border-color,box-shadow] duration-300 ${
                        active
                          ? "border-violet-400/40 shadow-[0_0_48px_rgba(139,92,246,0.18)]"
                          : "border-white/8 hover:border-violet-500/15"
                      }`}
                      >
                        <div className="aspect-square overflow-hidden bg-white/5">
                          <img
                            src={b.image}
                            alt=""
                            className="h-full w-full object-contain p-4"
                            loading={i < 2 ? "eager" : "lazy"}
                            draggable={false}
                          />
                        </div>
                        <h2 className="text-base font-semibold leading-snug text-white md:text-lg">
                          {b.title}
                        </h2>
                        <p
                          className={`text-sm leading-relaxed transition-opacity md:text-[15px] ${
                            active ? "text-[#e8e8e8] opacity-95" : "text-[#cfcfcf] opacity-70"
                          }`}
                        >
                          {b.description}
                        </p>
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
                      aria-label="Önceki bileklik"
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
                      aria-label="Sonraki bileklik"
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
                    <span className="font-mono text-sm tabular-nums text-white md:text-base">
                      {currentStr}
                    </span>
                    <div className="relative h-0.5 min-w-[4rem] flex-1 overflow-hidden rounded-full bg-white/15 md:min-w-[6rem]">
                      <div
                        className="absolute left-0 top-0 h-full rounded-full bg-white/70 transition-[width] duration-500 ease-out"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="font-mono text-sm tabular-nums text-white/80 md:text-base">
                      {totalStr}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </BlackSection>
    </section>
  );
}
