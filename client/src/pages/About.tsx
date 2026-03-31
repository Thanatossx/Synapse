import { Link } from "react-router-dom";
import { FAQ_EN, IMAGES, SITE, TEAM, TESTIMONIALS } from "../data/site";
import { useState } from "react";

function BlackSection({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full overflow-hidden">
      <div className="absolute inset-0 bg-black" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export function About() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="w-full">
      <section className="w-full">
        <BlackSection>
          <div className="mx-auto grid max-w-[1536px] gap-10 px-6 py-16 md:grid-cols-2 md:items-center md:py-24">
            <div className="flex flex-col gap-6">
              <h1
                className="synax-about-title-glow whitespace-pre-line font-bold leading-tight text-[#faf8ff]"
                style={{ fontSize: "clamp(1.75rem, 3cqi + 1rem, 2.5rem)" }}
              >
                {`From Los Santos's\nUnderground to\nImmersive Reality`}
              </h1>
              <p className="synax-cta-sub-glow max-w-xl text-[15px] leading-relaxed text-white/85 md:text-base">
                SYNAX started as a vision to bring Los Santos&apos;s most authentic electronic music
                experiences to life. We built a platform that connects underground artists with
                passionate dance floor seekers.
              </p>
              <Link
                to="/events"
                className="inline-flex w-fit items-center justify-center rounded-none border border-violet-500/50 bg-gradient-to-b from-violet-600 via-violet-700 to-violet-900 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_22px_rgba(139,92,246,0.38)] transition duration-300 hover:border-violet-400/80 hover:from-violet-500 hover:via-violet-600 hover:to-violet-800 hover:shadow-[0_0_32px_rgba(167,139,250,0.48)]"
              >
                Explore upcoming events
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="aspect-[4/3] overflow-hidden rounded-xl ring-1 ring-violet-500/20 transition ring-offset-2 ring-offset-black hover:ring-violet-400/35">
                <img
                  src={IMAGES.aboutClub}
                  alt="Underground nightclub with purple lighting"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="aspect-[4/3] overflow-hidden rounded-xl ring-1 ring-violet-500/20 transition ring-offset-2 ring-offset-black hover:ring-violet-400/35">
                <img
                  src={IMAGES.aboutVinyl}
                  alt="Vinyl records with dark purple tones"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </BlackSection>
      </section>

      <section>
        <BlackSection>
          <div className="mx-auto flex max-w-[1536px] flex-col gap-6 px-6 py-16 md:flex-row md:gap-12 md:py-20">
            <div className="md:w-1/2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-violet-200/55">
                Our mission
              </span>
              <h2
                className="mt-3 whitespace-pre-line font-semibold text-[#faf8ff]"
                style={{ fontSize: "clamp(1.5rem, 2.5cqi + 1rem, 2rem)" }}
              >
                {`We create spaces where\nthe underground comes alive`}
              </h2>
            </div>
            <p className="synax-cta-sub-glow md:w-1/2 text-[15px] leading-relaxed text-white/85 md:text-base">
              SYNAX exists to bring Los Santos&apos;s underground music community together through
              immersive rave experiences. We believe in authentic connection, bold creativity, and
              events that stay with you long after the music stops.
            </p>
          </div>
        </BlackSection>
      </section>

      <section>
        <BlackSection>
          <div className="mx-auto max-w-[1536px] px-6 py-16 md:py-20">
            <div className="mb-12 text-center md:text-left">
              <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-violet-200/55">
                Meet the team
              </span>
              <h2 className="mt-3 font-semibold text-[#faf8ff]" style={{ fontSize: "clamp(1.5rem, 2cqi + 1rem, 2rem)" }}>
                The people shaping SYNAX
              </h2>
              <p className="mt-4 max-w-2xl text-white/80">
                A small but passionate team dedicated to bringing Los Santos&apos;s underground music
                scene to life.
              </p>
            </div>
            <div className="grid gap-10 md:grid-cols-2">
              {TEAM.map((m) => (
                <article
                  key={m.name}
                  className="flex flex-col gap-4 rounded-xl border border-violet-500/20 bg-white/[0.03] p-6 shadow-[0_0_40px_rgba(0,0,0,0.25)] transition hover:border-violet-400/30"
                >
                  <div className="aspect-square max-w-[200px] overflow-hidden rounded-lg ring-1 ring-white/10">
                    <img src={m.image} alt="" className="h-full w-full object-cover" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#f9f9f9]">{m.name}</h3>
                  <p className="text-sm text-[#a855f7]">{m.role}</p>
                  <p className="text-sm leading-relaxed text-[#cfcfcf]">{m.description}</p>
                </article>
              ))}
            </div>
            <div className="mt-12 text-center">
              <a
                href="#contact"
                className="inline-flex rounded-none border border-violet-400/45 bg-violet-950/20 px-5 py-2.5 text-sm font-semibold text-violet-100 shadow-[0_0_18px_rgba(139,92,246,0.15)] transition hover:border-violet-300/60 hover:bg-violet-900/30 hover:text-white"
              >
                Get in touch
              </a>
            </div>
          </div>
        </BlackSection>
      </section>

      <section>
        <BlackSection>
          <div className="mx-auto max-w-[1536px] px-6 py-16 md:py-20">
            <div className="mb-12">
              <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-violet-200/55">
                Our partners
              </span>
              <h2 className="mt-3 whitespace-pre-line font-semibold text-[#faf8ff]" style={{ fontSize: "clamp(1.5rem, 2cqi + 1rem, 2rem)" }}>
                {`Collaborations that\nmake SYNAX real`}
              </h2>
            </div>
            <div className="grid gap-8 md:grid-cols-2">
              {TESTIMONIALS.map((t) => (
                <blockquote
                  key={t.name}
                  className="flex flex-col gap-4 rounded-xl border border-violet-500/20 bg-white/[0.03] p-6 shadow-[0_0_40px_rgba(0,0,0,0.2)] transition hover:border-violet-400/28"
                >
                  <p className="text-[15px] leading-relaxed text-white/85">&ldquo;{t.quote}&rdquo;</p>
                  <footer className="flex items-center gap-3">
                    <img src={t.image} alt="" className="size-12 rounded-full object-cover" />
                    <div>
                      <cite className="not-italic font-semibold text-[#f9f9f9]">{t.name}</cite>
                      <p className="text-xs text-[#a7a7a7]">{t.title}</p>
                    </div>
                  </footer>
                </blockquote>
              ))}
            </div>
            <div className="mt-10">
              <Link
                to="/events"
                className="inline-flex rounded-none border border-violet-500/50 bg-gradient-to-b from-violet-600 to-violet-800 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_22px_rgba(139,92,246,0.35)] transition hover:from-violet-500 hover:to-violet-700 hover:shadow-[0_0_30px_rgba(167,139,250,0.45)]"
              >
                Explore upcoming events
              </Link>
            </div>
          </div>
        </BlackSection>
      </section>

      <section>
        <BlackSection>
          <div className="mx-auto max-w-[1536px] px-6 py-16 md:py-20">
            <h2 className="font-semibold text-[#faf8ff]" style={{ fontSize: "clamp(1.5rem, 2cqi + 1rem, 2rem)" }}>
              SYNAX FAQ
            </h2>
            <p className="mt-2 text-white/75">Find answers to common questions about SYNAX events</p>
            <div className="mt-8 flex flex-col gap-2">
              {FAQ_EN.map((item, i) => (
                <div key={item.q} className="overflow-hidden rounded-lg border border-violet-500/15 bg-white/[0.02]">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left text-[#f9f9f9] transition hover:bg-violet-950/30"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span className="font-medium">{item.q}</span>
                    <span className="text-violet-300/80 tabular-nums">{openFaq === i ? "−" : "+"}</span>
                  </button>
                  {openFaq === i && (
                    <div className="border-t border-violet-500/10 px-4 py-4 text-sm leading-relaxed text-[#d4d4d8]">
                      {item.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </BlackSection>
      </section>

      <section id="contact">
        <BlackSection>
          <div className="mx-auto max-w-[1536px] px-6 py-16 md:py-24">
            <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-violet-200/55">
              Get in touch
            </span>
            <h2 className="mt-3 whitespace-pre-line font-semibold text-[#faf8ff]" style={{ fontSize: "clamp(1.5rem, 2cqi + 1rem, 2rem)" }}>
              {`Join the SYNAX\ncommunity`}
            </h2>
            <p className="mt-4 max-w-xl text-white/80">
              Reach out with questions about events, tickets, or partnerships.
            </p>
            <form
              className="mt-10 flex max-w-lg flex-col gap-4 rounded-xl border border-violet-500/15 bg-white/[0.02] p-6 md:p-8"
              onSubmit={(e) => {
                e.preventDefault();
                alert("Bu demo sürümünde form gönderilmez. İletişim: " + SITE.email);
              }}
            >
              <label className="flex flex-col gap-2 text-sm text-[#dfdfdf]">
                Your Name
                <input
                  required
                  className="border border-violet-500/20 bg-black/50 px-4 py-3 text-[#f9f9f9] outline-none transition focus:border-violet-400/70 focus:ring-1 focus:ring-violet-500/25"
                  name="name"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm text-[#dfdfdf]">
                Email Address
                <input
                  required
                  type="email"
                  className="border border-violet-500/20 bg-black/50 px-4 py-3 text-[#f9f9f9] outline-none transition focus:border-violet-400/70 focus:ring-1 focus:ring-violet-500/25"
                  name="email"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm text-[#dfdfdf]">
                Your Message
                <textarea
                  required
                  rows={5}
                  className="resize-y border border-violet-500/20 bg-black/50 px-4 py-3 text-[#f9f9f9] outline-none transition focus:border-violet-400/70 focus:ring-1 focus:ring-violet-500/25"
                  name="message"
                />
              </label>
              <button
                type="submit"
                className="mt-2 inline-flex w-fit rounded-none border border-violet-500/50 bg-gradient-to-b from-violet-600 to-violet-800 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_24px_rgba(139,92,246,0.35)] transition hover:from-violet-500 hover:to-violet-700 hover:shadow-[0_0_32px_rgba(167,139,250,0.45)]"
              >
                Send Message
              </button>
            </form>
          </div>
        </BlackSection>
      </section>
    </div>
  );
}
