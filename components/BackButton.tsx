"use client";

import { useRouter } from "next/navigation";

type BackButtonProps = {
  fallbackHref?: string;
  returnHref?: string;
};

export default function BackButton({
  fallbackHref = "/",
  returnHref,
}: BackButtonProps) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => {
        if (returnHref) {
          router.push(returnHref);
          return;
        }

        if (typeof window !== "undefined" && window.history.length > 1) {
          router.back();
          return;
        }

        router.push(fallbackHref);
      }}
      className="inline-flex items-center gap-2 rounded-full border border-[rgba(200,169,107,0.24)] bg-[rgba(255,255,255,0.04)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-(--accent-strong) transition hover:-translate-y-0.5 hover:border-[rgba(200,169,107,0.5)] hover:bg-[rgba(255,255,255,0.08)]"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12.5 5.5L8 10l4.5 4.5"
        />
      </svg>
      Back
    </button>
  );
}
