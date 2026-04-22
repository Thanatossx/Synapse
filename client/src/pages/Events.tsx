import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BlackSection, EventCarouselBlock } from "../components/EventCarouselBlock";
import { apiGet } from "../lib/api";
import { fallbackEvents } from "../lib/fallbackData";
import type { PublicEvent } from "../types/data";

export function Events() {
  const [events, setEvents] = useState<PublicEvent[] | null>(null);
  const [usedFallback, setUsedFallback] = useState(false);

  useEffect(() => {
    apiGet<PublicEvent[]>("/api/events")
      .then(setEvents)
      .catch(() => {
        setEvents(fallbackEvents());
        setUsedFallback(true);
      });
  }, []);

  const loading = events === null;

  const active = useMemo(
    () => (events ?? []).filter((e) => e.status === "active"),
    [events],
  );
  const past = useMemo(() => (events ?? []).filter((e) => e.status === "past"), [events]);

  return (
    <div className="w-full">
      <section>
        <BlackSection>
          <div className="mx-auto max-w-[1536px] px-6 py-16 md:py-24">
            <div className="mb-12 md:mb-14">
              <h1
                className="font-bold uppercase tracking-tight text-white"
                style={{ fontSize: "clamp(1.75rem, 4cqi + 1rem, 3rem)" }}
              >
                SESİN İÇİNE İN
              </h1>
              <p className="mt-3 text-sm font-normal uppercase tracking-[0.18em] text-white/60 md:text-base">
                based in ?
              </p>
            </div>

            {loading && <p className="text-white/60">Yükleniyor…</p>}

            {!loading && usedFallback && (
              <p className="mb-8 rounded border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100/90">
                Sunucuya bağlanılamadı; örnek etkinlik listesi gösteriliyor. Tam veri için uygulamayı sunucu ile
                çalıştırın.
              </p>
            )}

            {!loading && events && (
              <>
                <EventCarouselBlock items={active} sectionTitle="Aktif Etkinlikler" />
                <EventCarouselBlock items={past} sectionTitle="Geçmiş Etkinlikler" />
              </>
            )}
          </div>
        </BlackSection>
      </section>

      <section>
        <BlackSection>
          <div className="mx-auto max-w-[900px] px-6 py-8 md:max-w-[960px] md:py-10">
            <div className="relative isolate overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-b from-zinc-950/95 via-neutral-950 to-black px-5 py-9 shadow-[0_0_0_1px_rgba(255,255,255,0.04),inset_0_1px_0_0_rgba(255,255,255,0.06),0_20px_50px_rgba(0,0,0,0.45)] md:px-10 md:py-10">
              <div className="pointer-events-none absolute inset-0 opacity-90" aria-hidden>
                <div className="absolute -left-[20%] top-1/2 h-[180%] w-[55%] -translate-y-1/2 bg-[linear-gradient(95deg,rgba(255,255,255,0.10)_0%,transparent_55%)] blur-3xl" />
                <div className="absolute -right-[20%] top-1/2 h-[180%] w-[55%] -translate-y-1/2 bg-[linear-gradient(265deg,rgba(255,255,255,0.08)_0%,transparent_55%)] blur-3xl" />
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </div>
              <div className="relative z-10 flex flex-col items-center gap-5 text-center">
                <h2
                  className="synax-cta-title-glow max-w-2xl text-balance font-semibold leading-tight text-[#faf8ff]"
                  style={{ fontSize: "clamp(1.35rem, 2.8cqi + 0.75rem, 2.1rem)" }}
                >
                  YERALTI SENİ BEKLİYOR, NYX
                </h2>
                <div className="flex w-full max-w-md flex-col items-stretch gap-3 sm:max-w-none sm:flex-row sm:justify-center">
                  <Link
                    to="/tickets/apply"
                    className="inline-flex flex-1 items-center justify-center rounded-none border border-white/25 bg-white px-5 py-2.5 text-sm font-semibold text-black shadow-[0_0_20px_rgba(255,255,255,0.12)] transition duration-300 hover:border-white/40 hover:bg-white/90 sm:flex-initial sm:px-7"
                  >
                    Biletini AL
                  </Link>
                  <a
                    href="https://face-tr.gta.world/profile/nyx"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex flex-1 items-center justify-center rounded-none border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_16px_rgba(255,255,255,0.08)] transition duration-300 hover:border-white/35 hover:bg-white/10 sm:flex-initial sm:px-7"
                  >
                    BİZE ULAŞ
                  </a>
                </div>
              </div>
            </div>
          </div>
        </BlackSection>
      </section>
    </div>
  );
}
