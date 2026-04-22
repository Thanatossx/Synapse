import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center bg-black px-6 py-20 text-center">
      <div className="relative isolate max-w-md rounded-2xl border border-white/15 bg-gradient-to-b from-zinc-950/90 to-black px-8 py-12 shadow-[0_0_36px_rgba(255,255,255,0.06)]">
        <div
          className="pointer-events-none absolute -top-12 left-1/2 h-32 w-[120%] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.14)_0%,transparent_70%)] blur-2xl"
          aria-hidden
        />
        <h1 className="relative synax-cta-title-glow text-5xl font-bold tabular-nums md:text-6xl">404</h1>
        <p className="relative mt-4 text-[15px] leading-relaxed text-white/75">Sayfa bulunamadı.</p>
        <Link
          to="/"
          className="relative mt-8 inline-flex items-center justify-center rounded-none border border-white/25 bg-white px-6 py-3 text-sm font-semibold text-black shadow-[0_0_18px_rgba(255,255,255,0.12)] transition hover:border-white/40 hover:bg-white/90"
        >
          Anasayfaya dön
        </Link>
      </div>
    </div>
  );
}
