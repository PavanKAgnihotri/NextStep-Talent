"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    "verifying",
  );
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    async function verifyToken() {
      if (!token) {
        setStatus("error");
        setMessage("Verification token is missing.");
        return;
      }

      try {
        const response = await fetch("/api/verify-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        const data = (await response.json().catch(() => null)) as {
          message?: string;
          email?: string;
        } | null;

        if (!response.ok || !data?.email) {
          throw new Error(data?.message || "Unable to verify email.");
        }

        localStorage.setItem("profile_submission_verified_email", data.email);
        setStatus("success");
        setMessage(
          "Email verified successfully. Redirecting to profile form...",
        );

        window.setTimeout(() => {
          router.replace("/profile-submission");
        }, 1200);
      } catch (error) {
        setStatus("error");
        setMessage(
          error instanceof Error ? error.message : "Unable to verify email.",
        );
      }
    }

    verifyToken();
  }, [router, token]);

  return (
    <div className="network-grid relative z-20 px-4 pb-10 pt-28 sm:px-6 lg:px-8 lg:pt-32">
      <div className="relative z-50 mx-auto max-w-2xl">
        <div className="nst-card rounded-xl border border-[rgba(200,169,107,0.18)] bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.02))] p-6 text-[#f7f3ea] shadow-[0_24px_70px_-42px_rgba(0,0,0,0.72)] backdrop-blur-xl">
          <h1 className="font-display text-3xl font-bold text-white">
            Email Verification
          </h1>
          <p className="mt-3 text-sm leading-7 text-[#d1d2d7]">{message}</p>

          {status !== "verifying" && (
            <div className="mt-6">
              <Link
                href="/profile-submission"
                className="inline-flex items-center gap-2 rounded-lg border border-[#c8a96b] bg-[#c8a96b] px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-[#d4b87e]"
              >
                Back to Profile Submission
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="network-grid relative z-20 px-4 pb-10 pt-28 sm:px-6 lg:px-8 lg:pt-32">
          <div className="relative z-50 mx-auto max-w-2xl">
            <div className="nst-card rounded-xl border border-[rgba(200,169,107,0.18)] bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.02))] p-6 text-[#f7f3ea] shadow-[0_24px_70px_-42px_rgba(0,0,0,0.72)] backdrop-blur-xl">
              <h1 className="font-display text-3xl font-bold text-white">
                Email Verification
              </h1>
              <p className="mt-3 text-sm leading-7 text-[#d1d2d7]">
                Verifying your email...
              </p>
            </div>
          </div>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
