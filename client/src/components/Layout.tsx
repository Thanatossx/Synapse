import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function Layout() {
  return (
    <div
      className="min-h-dvh font-[family-name:var(--font-synax)]"
      style={{ containerType: "size" }}
    >
      <div className="mx-auto min-h-dvh max-w-[100dvw] overflow-x-hidden bg-gradient-to-b from-[#2c1249] via-[#1b0d2e] to-[#0a0612]">
        <Header />
        <main>
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
