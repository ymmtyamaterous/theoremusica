import { Button } from "@better-t-app/ui/components/button";
import { Skeleton } from "@better-t-app/ui/components/skeleton";
import { Link } from "@tanstack/react-router";

import { authClient } from "@/lib/auth-client";

import UserMenu from "./user-menu";

export default function Header() {
  const { data: session, isPending } = authClient.useSession();

  const navLinks = [
    { to: "/courses", label: "コース" },
  ] as const;

  return (
    <header
      className="sticky top-0 z-50 w-full"
      style={{
        background: "rgba(14,13,12,0.92)",
        backdropFilter: "blur(12px)",
        borderBottom: "0.5px solid rgba(201,168,76,0.25)",
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* ロゴ */}
        <Link to="/" className="flex items-center gap-2">
          <span
            className="font-serif text-2xl italic text-[#c9a84c]"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            𝄞 Teoria
          </span>
        </Link>

        {/* ナビ */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="text-sm font-medium uppercase tracking-[0.08em] text-[#f5f0e8]/70 transition-colors hover:text-[#c9a84c]"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* 右側 */}
        <div className="flex items-center gap-3">
          {isPending ? (
            <Skeleton className="h-9 w-24 bg-[#2a2520]" />
          ) : session ? (
            <UserMenu />
          ) : (
            <Link to="/register">
              <Button
                className="rounded-lg bg-[#c9a84c] px-5 py-2 text-sm font-medium text-[#0e0d0c] transition-colors hover:bg-[#e8cc87]"
              >
                無料で始める
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
