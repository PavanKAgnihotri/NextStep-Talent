"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Evaluation", href: "/evaluation-program" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const showEligibilityCta = pathname !== "/eligibility-check";

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <nav className="mx-auto grid max-w-7xl grid-cols-[1fr_auto] items-center px-4 py-5 sm:px-6 lg:grid-cols-[1fr_auto_1fr] lg:px-8 lg:py-7">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center justify-self-start font-display text-2xl tracking-tight text-(--accent-strong) lg:opacity-0 lg:pointer-events-none"
        >
          NextTalent
        </Link>

        <div className="hidden items-center gap-10 justify-self-center text-sm font-semibold uppercase tracking-[0.28em] text-white/88 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="inline-flex min-h-11 items-center transition hover:text-(--accent-strong)"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {showEligibilityCta && (
          <div className="hidden justify-self-end lg:block">
            <Link
              href="/eligibility-check"
              className="min-w-70 inline-flex min-h-11 items-center justify-center rounded-full border border-(--accent) bg-[rgba(201,169,110,0.03)] px-5 py-3 text-center text-xs font-semibold uppercase tracking-[0.24em] text-(--accent-strong) transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.02] hover:border-(--accent-strong) hover:bg-[linear-gradient(180deg,rgba(201,169,110,0.22),rgba(201,169,110,0.10))] hover:shadow-[0_14px_30px_rgba(201,169,110,0.32)]"
            >
              Check Eligibility
            </Link>
          </div>
        )}

        <button
          className="justify-self-end rounded-full border border-(--border) bg-black/30 p-3 text-(--accent-strong) backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen((open) => !open)}
          aria-label="Toggle navigation"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </nav>

      {isOpen && (
        <div className="mx-4 rounded-4xl border border-white/8 bg-black/92 p-4 shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl lg:hidden sm:mx-6">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm uppercase tracking-[0.22em] text-white/72">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-2xl border border-transparent px-4 py-3 transition hover:border-(--border) hover:bg-white/4 hover:text-(--accent-strong)"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {showEligibilityCta && (
              <Link
                href="/eligibility-check"
                className="mt-2 inline-flex items-center justify-center rounded-full border border-(--accent) bg-[rgba(201,169,110,0.03)] px-5 py-3 text-center text-xs font-semibold uppercase tracking-[0.24em] text-(--accent-strong) transition duration-300 hover:border-(--accent-strong) hover:bg-[linear-gradient(180deg,rgba(201,169,110,0.18),rgba(201,169,110,0.08))]"
                onClick={() => setIsOpen(false)}
              >
                Check Eligibility
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
