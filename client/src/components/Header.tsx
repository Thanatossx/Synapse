import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { NAV, SITE } from "../data/site";

function MenuIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 24 24"
      width={24}
      height={24}
      className="size-6"
      aria-hidden
    >
      <path fill="none" d="M0 0h24v24H0z" />
      <path d="M3 18h18v-2H3zm0-5h18v-2H3zm0-7v2h18V6z" />
    </svg>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="relative z-50 w-full bg-black">
      <div className="relative mx-auto max-w-[1536px] px-6 py-5 md:px-10 lg:px-[50px]">
        <div className="relative flex min-h-[44px] items-center justify-center">
          <Link
            to="/"
            className="absolute left-0 top-1/2 z-10 -translate-y-1/2 font-bold uppercase tracking-wide text-white transition-colors duration-150 ease-out hover:text-white/80"
            style={{ fontSize: "clamp(1rem, 0.95rem + 0.2cqi, 1.125rem)" }}
          >
            {SITE.name}
          </Link>

          <nav
            className="hidden items-center gap-5 md:flex lg:gap-6"
            aria-label="Ana navigasyon"
          >
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `whitespace-nowrap py-1 text-[15px] font-normal leading-none no-underline transition-colors duration-150 ease-out ${
                    isActive
                      ? "text-white underline decoration-white/35 underline-offset-4"
                      : "text-white/90 hover:text-white"
                  }`
                }
                end={item.to === "/"}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <button
            type="button"
            aria-label="Menüyü aç"
            aria-expanded={open}
            className="absolute right-0 top-1/2 z-10 -translate-y-1/2 inline-flex items-center justify-center p-2 text-white md:hidden"
            onClick={() => setOpen((v) => !v)}
          >
            <MenuIcon />
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-white/15 bg-black px-6 py-4 md:hidden">
          <ul className="flex flex-col gap-1">
            {NAV.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="block py-3 text-[15px] font-normal text-white no-underline transition-colors duration-150 ease-out hover:text-white/80"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
