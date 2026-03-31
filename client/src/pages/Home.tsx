import { Link } from "react-router-dom";
import { IMAGES } from "../data/site";

const BRAND_LOGO_ALT = "SYNAPSE logo";

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
            <div className="synapse-hero-spot-wrap pb-8 text-center md:pb-12 lg:pb-16">
              <div className="synapse-spot-layers" aria-hidden>
                <div className="synapse-spot synapse-spot--left-soft" />
                <div className="synapse-spot synapse-spot--left-hard" />
                <div className="synapse-spot synapse-spot--right-soft" />
                <div className="synapse-spot synapse-spot--right-hard" />
              </div>
              <h1
                className="synapse-hero-title-glow relative z-[1] max-w-3xl text-balance font-bold leading-tight tracking-[0em] antialiased md:leading-[1.08]"
                style={{
                  fontSize: "clamp(2rem, 5cqi + 1.5rem, 3.75rem)",
                }}
              >
                <span className="block">welcome… are we</span>
                <span className="mt-1 block md:mt-1.5">Synapse, the dark side.</span>
              </h1>
            </div>

            <div className="mx-auto grid max-w-5xl grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-14 lg:gap-20">
              {/* Sol: logo */}
              <div className="synapse-intro-logo order-1 flex justify-center md:justify-start">
                <div className="relative w-full max-w-[300px] md:max-w-[340px]">
                  <div
                    className="pointer-events-none absolute -inset-4 rounded-[28px] bg-[radial-gradient(ellipse_80%_70%_at_50%_0%,rgba(139,92,246,0.35)_0%,transparent_65%)] opacity-90 blur-xl"
                    aria-hidden
                  />
                  <div className="relative overflow-hidden rounded-2xl border border-violet-400/25 bg-gradient-to-br from-violet-950/35 via-black/60 to-black p-8 shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_24px_64px_rgba(0,0,0,0.55),inset_0_1px_0_0_rgba(255,255,255,0.06)] md:rounded-3xl md:p-10">
                    <div
                      className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(167,139,250,0.08)_0%,transparent_45%,transparent_100%)]"
                      aria-hidden
                    />
                    <img
                      src={IMAGES.brandLogo}
                      alt={BRAND_LOGO_ALT}
                      className="relative z-[1] mx-auto w-full max-h-[200px] object-contain md:max-h-[240px]"
                      width={400}
                      height={400}
                      loading="eager"
                      decoding="async"
                    />
                  </div>
                </div>
              </div>

              {/* Sağ: metin */}
              <div className="order-2 flex flex-col items-center gap-7 text-center md:items-end md:text-right">
                <p className="max-w-md text-[15px] leading-relaxed text-[#dfdfdf] md:max-w-lg md:text-base md:leading-relaxed">
                  Synapse, yeraltı elektronik müzik ve rave kültürünün dijital izdüşümüdür. Biz bir
                  topluluk değil, enerjiyi ve ritmi paylaşan bir bilinç ağıyız. Bass, trance ve
                  psytrance ile gecenin karanlığında her şeyi dans pistinde birleşiyoruz.
                </p>
                <Link
                  to="/events"
                  className="inline-flex items-center justify-center gap-2 rounded-none border border-violet-400/55 bg-gradient-to-b from-violet-500 via-violet-600 to-violet-800 px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white shadow-[0_0_28px_rgba(139,92,246,0.45),0_0_56px_rgba(91,33,182,0.28),inset_0_1px_0_0_rgba(255,255,255,0.18)] transition-[border-color,transform] duration-150 ease-out hover:border-violet-300/80 hover:from-violet-400 hover:via-violet-500 hover:to-violet-700 hover:shadow-[0_0_36px_rgba(167,139,250,0.65),0_0_72px_rgba(124,58,237,0.38),inset_0_1px_0_0_rgba(255,255,255,0.25)] active:translate-y-px md:self-end"
                >
                  ETKİNLİKLER
                </Link>
              </div>
            </div>
          </div>
        </BlackSection>
      </section>

      <section id="tickets" className="w-full">
        <BlackSection>
          <div className="mx-auto max-w-[900px] px-6 py-8 md:max-w-[960px] md:py-10">
            <div className="relative isolate overflow-hidden rounded-2xl border border-violet-500/30 bg-gradient-to-b from-zinc-950/95 via-neutral-950 to-black px-5 py-9 shadow-[0_0_0_1px_rgba(255,255,255,0.04),inset_0_1px_0_0_rgba(255,255,255,0.06),0_20px_50px_rgba(0,0,0,0.45)] md:px-10 md:py-11">
                <div className="pointer-events-none absolute inset-0 opacity-90" aria-hidden>
                <div className="absolute -left-[20%] top-1/2 h-[180%] w-[55%] -translate-y-1/2 bg-[linear-gradient(95deg,rgba(139,92,246,0.22)_0%,transparent_55%)] blur-2xl" />
                <div className="absolute -right-[20%] top-1/2 h-[180%] w-[55%] -translate-y-1/2 bg-[linear-gradient(265deg,rgba(167,139,250,0.18)_0%,transparent_55%)] blur-2xl" />
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/35 to-transparent" />
              </div>

              <div className="relative z-10 flex flex-col items-center gap-4 text-center md:gap-5">
                <h2
                  className="synapse-cta-title-glow whitespace-pre-line text-balance font-semibold leading-[1.12] tracking-[-0.02em]"
                  style={{ fontSize: "clamp(1.35rem, 2.8cqi + 0.75rem, 2.15rem)" }}
                >
                  {`BU BİR PARTİ DEĞİL\nBU BİR RAVE`}
                </h2>
                <p className="synapse-cta-sub-glow max-w-md whitespace-pre-line text-[14px] leading-snug text-white/82 text-balance md:text-[15px] md:leading-relaxed">
                  {`Strobe. Bass. Karanlık.\nKendini sesin içinde kaybet.\nGirişler sınırlı.`}
                </p>
                <div className="mt-1 flex w-full max-w-md flex-col items-stretch gap-3 sm:max-w-none sm:flex-row sm:justify-center md:mt-0">
                  <Link
                    to="/tickets/apply"
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-none border border-violet-500/50 bg-gradient-to-b from-violet-600 via-violet-700 to-violet-900 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_24px_rgba(139,92,246,0.4),inset_0_1px_0_0_rgba(255,255,255,0.15)] transition-[border-color,transform] duration-150 ease-out hover:border-violet-400/80 hover:from-violet-500 hover:via-violet-600 hover:to-violet-800 hover:shadow-[0_0_32px_rgba(167,139,250,0.5)] sm:flex-initial sm:px-7"
                  >
                    Bilet Al
                  </Link>
                  <Link
                    to="/events"
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-none border border-violet-400/55 bg-violet-950/25 px-5 py-2.5 text-sm font-semibold text-violet-100 shadow-[0_0_18px_rgba(139,92,246,0.2)] transition-[border-color,background-color,color,transform] duration-150 ease-out hover:border-violet-300/70 hover:bg-violet-900/40 hover:text-white hover:shadow-[0_0_28px_rgba(139,92,246,0.45)] sm:flex-initial sm:px-7"
                  >
                    Etkinlikler
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
            <div className="relative isolate overflow-hidden rounded-2xl border border-violet-500/30 bg-gradient-to-b from-zinc-950/95 via-neutral-950 to-black px-5 py-9 shadow-[0_0_0_1px_rgba(255,255,255,0.04),inset_0_1px_0_0_rgba(255,255,255,0.06),0_20px_50px_rgba(0,0,0,0.45)] md:px-10 md:py-11">
              <div className="pointer-events-none absolute inset-0 opacity-90" aria-hidden>
                <div className="absolute -left-[18%] top-1/2 h-[160%] w-1/2 -translate-y-1/2 bg-[linear-gradient(95deg,rgba(139,92,246,0.18)_0%,transparent_58%)] blur-2xl" />
                <div className="absolute -right-[18%] top-1/2 h-[160%] w-1/2 -translate-y-1/2 bg-[linear-gradient(265deg,rgba(167,139,250,0.14)_0%,transparent_58%)] blur-2xl" />
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/30 to-transparent" />
              </div>

              <div className="relative z-10 flex flex-col gap-7 text-left md:gap-8">
                <div className="flex items-center gap-3">
                  <span className="h-px w-10 bg-gradient-to-r from-violet-400/80 to-transparent" aria-hidden />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.32em] text-violet-200/70">
                    HAKKIMIZDA
                  </span>
                </div>

                <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-12 lg:gap-16">
                  <h2
                    className="synapse-about-title-glow w-full whitespace-pre-line text-balance font-semibold uppercase leading-[1.15] tracking-[0.02em] md:max-w-[20rem] md:shrink-0 lg:max-w-[22rem]"
                    style={{ fontSize: "clamp(1.35rem, 2.5cqi + 0.85rem, 2.05rem)" }}
                  >
                    {`UNDERGROUND\nKÜLTÜRÜN NABZI`}
                  </h2>
                  <p className="synapse-about-body-glow w-full text-[15px] leading-relaxed text-white/85 md:max-w-2xl md:flex-1 md:text-[16px] md:leading-[1.7]">
                    SYNAPSE, ticari gürültüden uzak, gerçek underground rave kültürünü yaşatmak için
                    kuruldu.
                    <br />
                    Karanlık odalar, ağır baslar ve özgür bedenler.
                    <br />
                    <br />
                    Burada telefon ışıkları değil, strobe ve bass konuşur.
                    <br />
                    Burada izleyen değil, yaşayan insanlar vardır.
                    <br />
                    <br />
                    Bu sadece bir parti değil.
                    <br />
                    Bu bir deneyim.
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
