import { Link } from "react-router-dom";

function BlackSection({
  children,
  overflow = "hidden",
}: {
  children: React.ReactNode;
  overflow?: "hidden" | "visible";
}) {
  return (
    <div className={`relative w-full ${overflow === "visible" ? "overflow-visible" : "overflow-hidden"}`}>
      <div className="absolute inset-0 rounded-[inherit] bg-black" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export function Home() {
  return (
    <>
      <section id="hero" className="w-full">
        <BlackSection overflow="visible">
          <div className="mx-auto flex max-w-[1536px] flex-col px-6 py-10 md:py-16 lg:py-20">
            <div className="synax-hero-spot-wrap pb-8 text-center md:pb-12 lg:pb-16">
              <div className="synax-spot-layers" aria-hidden>
                <div className="synax-spot synax-spot--left-soft" />
                <div className="synax-spot synax-spot--left-hard" />
                <div className="synax-spot synax-spot--right-soft" />
                <div className="synax-spot synax-spot--right-hard" />
              </div>
              <h1
                className="synax-hero-title-glow relative z-[1] max-w-3xl text-balance font-bold leading-tight tracking-[0em] antialiased md:leading-[1.08]"
                style={{
                  fontSize: "clamp(2rem, 5cqi + 1.5rem, 3.75rem)",
                }}
              >
                <span className="block">welcome… we are NYX</span>
              </h1>
            </div>

            <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-7 text-center">
              <p className="max-w-md text-[15px] leading-relaxed text-white/70 md:max-w-lg md:text-base md:leading-relaxed">
                based in ?
              </p>
            </div>
          </div>
        </BlackSection>
      </section>

      <section id="tickets" className="w-full">
        <BlackSection>
          <div className="mx-auto max-w-[900px] px-6 py-8 md:max-w-[960px] md:py-10">
            <div className="relative isolate overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-b from-zinc-950/95 via-neutral-950 to-black px-5 py-9 shadow-[0_0_0_1px_rgba(255,255,255,0.04),inset_0_1px_0_0_rgba(255,255,255,0.06),0_20px_50px_rgba(0,0,0,0.45)] md:px-10 md:py-11">
                <div className="pointer-events-none absolute inset-0 opacity-90" aria-hidden>
                <div className="absolute -left-[20%] top-1/2 h-[180%] w-[55%] -translate-y-1/2 bg-[linear-gradient(95deg,rgba(255,255,255,0.12)_0%,transparent_55%)] blur-2xl" />
                <div className="absolute -right-[20%] top-1/2 h-[180%] w-[55%] -translate-y-1/2 bg-[linear-gradient(265deg,rgba(255,255,255,0.10)_0%,transparent_55%)] blur-2xl" />
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </div>

              <div className="relative z-10 flex flex-col items-center gap-4 text-center md:gap-5">
                <h2
                  className="synax-cta-title-glow whitespace-pre-line text-balance font-semibold leading-[1.12] tracking-[-0.02em]"
                  style={{ fontSize: "clamp(1.35rem, 2.8cqi + 0.75rem, 2.15rem)" }}
                >
                  Sadece NYX ve sizin aranızda olanlar
                </h2>
                <p className="synax-cta-sub-glow max-w-md whitespace-pre-line text-[14px] leading-snug text-white/82 text-balance md:text-[15px] md:leading-relaxed">
                  {`Strobe. Bass. Karanlık.\nKendini sesin içinde kaybet.\nGirişler sınırlı.`}
                </p>
                <div className="mt-1 flex w-full max-w-md flex-col items-stretch gap-3 sm:max-w-none sm:flex-row sm:justify-center md:mt-0">
                  <Link
                    to="/tickets/apply"
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-none border border-white/25 bg-white px-5 py-2.5 text-sm font-semibold text-black shadow-[0_0_20px_rgba(255,255,255,0.12)] transition-[border-color,background-color,transform] duration-150 ease-out hover:border-white/40 hover:bg-white/90 sm:flex-initial sm:px-7"
                  >
                    Bilet Al
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </BlackSection>
      </section>

      <section id="about" className="w-full">
        <BlackSection>
          <div className="mx-auto max-w-[960px] px-6 py-8 md:max-w-[1024px] md:py-10">
            <div className="relative isolate overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-b from-zinc-950/95 via-neutral-950 to-black px-5 py-9 shadow-[0_0_0_1px_rgba(255,255,255,0.04),inset_0_1px_0_0_rgba(255,255,255,0.06),0_20px_50px_rgba(0,0,0,0.45)] md:px-10 md:py-11">
              <div className="pointer-events-none absolute inset-0 opacity-90" aria-hidden>
                <div className="absolute -left-[18%] top-1/2 h-[160%] w-1/2 -translate-y-1/2 bg-[linear-gradient(95deg,rgba(255,255,255,0.10)_0%,transparent_58%)] blur-2xl" />
                <div className="absolute -right-[18%] top-1/2 h-[160%] w-1/2 -translate-y-1/2 bg-[linear-gradient(265deg,rgba(255,255,255,0.08)_0%,transparent_58%)] blur-2xl" />
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/18 to-transparent" />
              </div>

              <div className="relative z-10 flex flex-col gap-7 text-left md:gap-8">
                <div className="flex items-center gap-3">
                  <span className="h-px w-10 bg-gradient-to-r from-white/55 to-transparent" aria-hidden />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.32em] text-white/60">
                    HAKKIMIZDA
                  </span>
                </div>

                <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-12 lg:gap-16">
                  <h2
                    className="synax-about-title-glow w-full whitespace-pre-line text-balance font-semibold uppercase leading-[1.15] tracking-[0.02em] md:max-w-[20rem] md:shrink-0 lg:max-w-[22rem]"
                    style={{ fontSize: "clamp(1.35rem, 2.5cqi + 0.85rem, 2.05rem)" }}
                  >
                    {`UNDERGROUND\nKÜLTÜRÜN NABZI`}
                  </h2>
                  <p className="synax-about-body-glow w-full text-[15px] leading-relaxed text-white/85 md:max-w-2xl md:flex-1 md:text-[16px] md:leading-[1.7]">
                    Sadece düşünceleriniz ve siz, dans etmeyi bırakma?
                  </p>
                </div>
              </div>
            </div>
          </div>
        </BlackSection>
      </section>
    </>
  );
}
