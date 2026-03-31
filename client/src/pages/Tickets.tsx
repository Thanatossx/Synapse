import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { TICKET_RULES_FAQ } from "../data/site";

function BlackSection({ children }: { children: ReactNode }) {
  return (
    <div className="relative w-full overflow-hidden">
      <div className="absolute inset-0 bg-black" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

function AccordionChevron({ open }: { open: boolean }) {
  return (
    <span
      className="flex size-8 shrink-0 items-center justify-center text-white"
      aria-hidden
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform duration-200"
      >
        <path
          d={open ? "M6 15l6-6 6 6" : "M6 9l6 6 6-6"}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export function Tickets() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="w-full">
      <section>
        <BlackSection>
          <div className="mx-auto max-w-[900px] px-6 py-8 md:max-w-[960px] md:py-10">
            <div className="relative isolate overflow-hidden rounded-2xl border border-violet-500/30 bg-gradient-to-b from-zinc-950/95 via-neutral-950 to-black px-5 py-9 shadow-[0_0_0_1px_rgba(255,255,255,0.04),inset_0_1px_0_0_rgba(255,255,255,0.06),0_20px_50px_rgba(0,0,0,0.45)] md:px-10 md:py-11">
              <div className="pointer-events-none absolute inset-0 opacity-90" aria-hidden>
                <div className="absolute -left-[20%] top-1/2 h-[180%] w-[55%] -translate-y-1/2 bg-[linear-gradient(95deg,rgba(139,92,246,0.22)_0%,transparent_55%)] blur-3xl" />
                <div className="absolute -right-[20%] top-1/2 h-[180%] w-[55%] -translate-y-1/2 bg-[linear-gradient(265deg,rgba(167,139,250,0.18)_0%,transparent_55%)] blur-3xl" />
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/35 to-transparent" />
              </div>

              <div className="relative z-10 flex flex-col items-center gap-4 text-center md:gap-5">
                <h1
                  className="synax-cta-title-glow max-w-3xl text-balance font-bold uppercase leading-tight tracking-[0.04em]"
                  style={{ fontSize: "clamp(1.35rem, 2.6cqi + 0.75rem, 2.1rem)" }}
                >
                  SYNAX UNDERGROUND RAVE
                </h1>
                <p className="synax-cta-sub-glow max-w-2xl text-[14px] leading-relaxed text-white/85 text-balance md:text-[15px] md:leading-relaxed">
                  Geceyi hissetmeye hazır mısın? Bass göğsünü deliyor, ışıklar kaotik bir ritimde
                  çarpıyor, yeraltının kalbi seninle atıyor. Bu gece sıradan değil,
                  underground&apos;un ta kendisi!
                </p>
                <div className="mt-1 flex w-full max-w-md flex-col items-stretch gap-3 sm:max-w-none sm:flex-row sm:justify-center md:mt-0">
                  <Link
                    to="/events"
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-none border border-violet-500/50 bg-gradient-to-b from-violet-600 via-violet-700 to-violet-900 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_24px_rgba(139,92,246,0.4),inset_0_1px_0_0_rgba(255,255,255,0.15)] transition duration-300 hover:border-violet-400/80 hover:from-violet-500 hover:via-violet-600 hover:to-violet-800 hover:shadow-[0_0_32px_rgba(167,139,250,0.5)] sm:flex-initial sm:px-7"
                  >
                    Etkinlikleri Görüntüle
                  </Link>
                  <Link
                    to="/tickets/apply"
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-none border border-violet-400/55 bg-violet-950/25 px-5 py-2.5 text-sm font-semibold text-violet-100 shadow-[0_0_18px_rgba(139,92,246,0.2)] transition duration-300 hover:border-violet-300/70 hover:bg-violet-900/40 hover:text-white hover:shadow-[0_0_28px_rgba(139,92,246,0.45)] sm:flex-initial sm:px-7"
                  >
                    Bilet Al
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </BlackSection>
      </section>

      {/* Kurallar: 2. görsel — üstte ana başlık, altta alt başlık; çizgiler beyaz; chevron; gri buton + siyah yazı */}
      <section>
        <BlackSection>
          <div className="mx-auto max-w-[900px] px-6 py-16 text-left md:py-24 lg:px-8">
            <h2
              className="font-bold leading-tight text-[#faf8ff]"
              style={{ fontSize: "clamp(1.5rem, 2.5cqi + 1rem, 2.25rem)" }}
            >
              E bu partinin kuralları yok mu?
            </h2>
            <p className="synax-cta-sub-glow mt-4 max-w-2xl text-[15px] font-normal leading-relaxed text-white/85 md:text-base">
              Tabii ki varlar. Bir bak istersen.
            </p>

            <div className="mt-12 rounded-t-lg border-t border-violet-500/25">
              {TICKET_RULES_FAQ.map((item, i) => {
                const isOpen = open === i;
                return (
                  <div key={item.q} className="border-b border-violet-500/15">
                    <button
                      type="button"
                      className="flex w-full items-start justify-between gap-4 py-5 text-left transition-colors hover:bg-violet-950/25 md:py-6"
                      onClick={() => setOpen(isOpen ? null : i)}
                      aria-expanded={isOpen}
                    >
                      <span
                        className={`min-w-0 flex-1 text-[15px] leading-snug md:text-base ${
                          isOpen
                            ? "font-normal text-white/65"
                            : "font-bold text-white"
                        }`}
                      >
                        {item.q}
                      </span>
                      <AccordionChevron open={isOpen} />
                    </button>
                    {isOpen && (
                      <div className="space-y-4 pb-6 pr-10 pt-0 text-[15px] leading-relaxed text-white md:text-base">
                        {item.a.split("\n\n").map((block, idx) => (
                          <p key={idx} className="m-0">
                            {block}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-12 md:mt-14">
              <a
                href="https://face-tr.gta.world/profile/synax"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-none border border-violet-400/50 bg-violet-950/30 px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-violet-100 shadow-[0_0_20px_rgba(139,92,246,0.2)] transition hover:border-violet-300/70 hover:bg-violet-900/45 hover:text-white hover:shadow-[0_0_28px_rgba(139,92,246,0.35)]"
              >
                BİZE ULAŞ
              </a>
            </div>
          </div>
        </BlackSection>
      </section>
    </div>
  );
}
