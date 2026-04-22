import { Link } from "react-router-dom";
import { FOOTER_NAV, SITE } from "../data/site";

export function Footer() {
  return (
    <footer className="w-full">
      <div className="relative overflow-hidden border-t border-white/15">
        <div
          className="absolute inset-0 bg-gradient-to-b from-white/[0.22] via-black to-black"
          aria-hidden
        />
        <div className="relative z-10 mx-auto flex max-w-[1536px] flex-col gap-12 px-6 py-12">
          <div className="grid grid-cols-1 gap-12 md:flex md:flex-row md:justify-between">
            <div className="flex flex-col gap-8">
              <Link to="/" className="flex items-center">
                <p
                  className="min-w-0 bg-gradient-to-r from-white to-white/70 bg-clip-text font-semibold text-transparent"
                  style={{ fontSize: "clamp(1rem, 0.9rem + 0.4cqi, 1.25rem)" }}
                >
                  {SITE.name}
                </p>
              </Link>
            </div>
            <div className="w-full md:max-w-lg">
              <div className="columns-2 gap-y-6">
                {FOOTER_NAV.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="block break-inside-avoid py-2 text-sm text-[#f9f9f9] transition-colors hover:text-white/80"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div
            className="h-px w-full bg-gradient-to-r from-transparent via-white/25 to-transparent"
            role="separator"
          />

          <div className="grid grid-cols-1 gap-4 pt-2 md:grid-cols-2">
            <p className="text-sm text-[#f9f9f9]">
              © {new Date().getFullYear()} {SITE.name}. All rights reserved.
            </p>
            <div className="flex flex-col gap-4 md:flex-row md:justify-end">
              <Link
                to="/"
                className="text-sm text-[#cfcfcf] underline decoration-white/25 underline-offset-4 transition hover:text-white/80"
              >
                Privacy Policy
              </Link>
              <Link
                to="/"
                className="text-sm text-[#cfcfcf] underline decoration-white/25 underline-offset-4 transition hover:text-white/80"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
