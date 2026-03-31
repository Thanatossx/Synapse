import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center bg-black px-6 py-20 text-center">
      <div className="relative isolate max-w-md rounded-2xl border border-violet-500/25 bg-gradient-to-b from-zinc-950/90 to-black px-8 py-12 shadow-[0_0_48px_rgba(91,33,182,0.15)]">
        <div
          className="pointer-events-none absolute -top-12 left-1/2 h-32 w-[120%] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.25)_0%,transparent_70%)] blur-2xl"
          aria-hidden
        />
        <h1 className="relative synax-cta-title-glow text-5xl font-bold tabular-nums md:text-6xl">404</h1>
        <p className="relative mt-4 text-[15px] leading-relaxed text-white/75">Sayfa bulunamadı.</p>
        <Link
          to="/"
          className="relative mt-8 inline-flex items-center justify-center rounded-none border border-violet-400/50 bg-gradient-to-b from-violet-600 to-violet-800 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_24px_rgba(139,92,246,0.35)] transition hover:border-violet-300 hover:from-violet-500 hover:to-violet-700 hover:shadow-[0_0_32px_rgba(167,139,250,0.45)]"
        >
          Anasayfaya dön
        </Link>
      </div>
    </div>
  );
}
