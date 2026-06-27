"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

const stages = [
  "Personal",
  "Education",
  "Certifications",
  "Experience",
  "Skills",
  "Languages",
  "Additional",
  "Review",
] as const;

const weekdayLabels = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function parseDateString(value: string): Date | null {
  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return null;

  const month = Number(match[1]);
  const day = Number(match[2]);
  const year = Number(match[3]);
  if (month < 1 || month > 12 || day < 1 || year < 1900) return null;

  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

function formatDateString(date: Date): string {
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const yyyy = String(date.getFullYear());
  return `${mm}/${dd}/${yyyy}`;
}

function getMonthGrid(baseMonth: Date): Date[] {
  const firstOfMonth = new Date(
    baseMonth.getFullYear(),
    baseMonth.getMonth(),
    1,
  );
  const firstGridDay = new Date(firstOfMonth);
  firstGridDay.setDate(firstOfMonth.getDate() - firstOfMonth.getDay());

  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(firstGridDay);
    d.setDate(firstGridDay.getDate() + i);
    return d;
  });
}

export default function ProfileSubmissionPage() {
  const [showFeeModal, setShowFeeModal] = useState(() => {
    if (typeof window === "undefined") return true;
    const popup = new URLSearchParams(window.location.search).get("popup");
    return popup === "fee" || !popup;
  });
  const [feeAccepted, setFeeAccepted] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    mobile: "",
    email: "",
    dob: "",
    countryOfBirth: "",
    citizenship: "",
    currentResidence: "",
  });

  const progress = useMemo(() => 0, []);

  return (
    <div
      className="network-grid relative z-20 px-4 pb-20 pt-28 sm:px-6 lg:px-8 lg:pt-32"
      style={{ overflowX: "hidden", overflowY: "visible" }}
    >
      <div className="relative z-50 mx-auto max-w-300">
        <div className="flex flex-col gap-6">
          <div className="w-full">
            <div className="nst-card rounded-[1.35rem] border border-[#d4af37]/20 bg-[linear-gradient(180deg,rgba(255,255,255,0.065),rgba(255,255,255,0.02))] p-4 shadow-[0_28px_90px_-48px_rgba(212,175,55,0.38)] backdrop-blur-xl">
              <div className="flex flex-col gap-3 border-b border-white/5 pb-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
                <div>
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.38em] text-[#d4af37]">
                    Application Progress
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <div className="flex items-baseline gap-2 sm:justify-end">
                    <span className="text-2xl font-semibold text-white">
                      {progress}%
                    </span>
                    <span className="text-[0.68rem] font-semibold uppercase tracking-[0.34em] text-[#b8860b]">
                      Complete
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-4 pb-1">
                <ol
                  className="grid w-full grid-cols-2 gap-2 md:grid-cols-4 md:gap-3 lg:grid-cols-8 lg:gap-0"
                  aria-label="Application Progress stages"
                >
                  {stages.map((stage, index) => {
                    const isCurrent = index === 0;
                    const isLast = index === stages.length - 1;

                    return (
                      <li
                        key={stage}
                        className={`relative isolate flex h-18 w-full min-w-0 items-center justify-center overflow-hidden px-4 py-3 text-center transition-colors duration-300 ease-out motion-reduce:transition-none lg:-ml-3 lg:first:ml-0 ${
                          isCurrent
                            ? "border border-[#f4dfb2]/70 bg-linear-to-br from-[#f8eabf] via-[#d4af37] to-[#b8860b] text-[#111111] shadow-[0_0_30px_rgba(212,175,55,0.3)]"
                            : "border border-white/10 bg-[#151515] text-slate-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                        }`}
                        aria-current={isCurrent ? "step" : undefined}
                        aria-label={`${stage} ${isCurrent ? "current" : "upcoming"} step`}
                        style={{
                          clipPath: isCurrent
                            ? "polygon(0px 0px, calc(100% - 1.1rem) 0px, 100% 50%, calc(100% - 1.1rem) 100%, 0px 100%, 0.9rem 50%)"
                            : isLast
                              ? "polygon(1.1rem 0px, 100% 0px, 100% 100%, 1.1rem 100%, 0px 50%)"
                              : "polygon(1.1rem 0px, calc(100% - 1.1rem) 0px, 100% 50%, calc(100% - 1.1rem) 100%, 1.1rem 100%, 0px 50%)",
                        }}
                      >
                        <span className="relative z-10 flex min-h-14 w-full flex-col items-center justify-center gap-1">
                          <span
                            className={`flex h-6 w-6 items-center justify-center rounded-full border text-[13px] font-semibold ${
                              isCurrent
                                ? "border-[#111111]/10 bg-white text-[#111111]"
                                : "border-white/10 bg-white/5 text-slate-400"
                            }`}
                          >
                            <span
                              className={`rounded-full ${
                                isCurrent
                                  ? "h-2.5 w-2.5 bg-[#111111] shadow-[0_0_0_6px_rgba(17,17,17,0.12)]"
                                  : "h-2 w-2 bg-[#6b6b6b]"
                              }`}
                            />
                          </span>
                          <span
                            className={`text-[0.72rem] uppercase tracking-[0.24em] ${
                              isCurrent
                                ? "font-semibold text-[#111111]"
                                : "text-slate-400"
                            }`}
                          >
                            {stage}
                          </span>
                        </span>
                      </li>
                    );
                  })}
                </ol>
              </div>

              <div
                className="mt-4"
                role="progressbar"
                aria-label="Application Progress progress"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progress}
              >
                <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-linear-to-r from-[#8a6714] via-[#d4af37] to-[#f4dfb2] transition-[width] duration-700 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="w-full">
            <div className="nst-card rounded-xl border border-[rgba(200,169,107,0.18)] bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.02))] p-6 text-[#f7f3ea] shadow-[0_24px_70px_-42px_rgba(0,0,0,0.72)] backdrop-blur-xl">
              <h1 className="font-display text-3xl font-bold text-white">
                Profile Submission
              </h1>
              <p className="mb-4 mt-2 text-sm text-[#d1d2d7]">
                Fill your details exactly as on official documents.
              </p>

              <form className="grid gap-3 md:grid-cols-2">
                <Field
                  label="First Name as per passport"
                  required
                  value={form.firstName}
                  onChange={(value) =>
                    setForm((f) => ({ ...f, firstName: value }))
                  }
                />
                <Field
                  label="Middle Name (optional)"
                  value={form.middleName}
                  onChange={(value) =>
                    setForm((f) => ({ ...f, middleName: value }))
                  }
                />
                <Field
                  label="Last Name as per passport"
                  required
                  value={form.lastName}
                  onChange={(value) =>
                    setForm((f) => ({ ...f, lastName: value }))
                  }
                />
                <Field
                  label="Mobile Number"
                  required
                  placeholder="98765 43210"
                  value={form.mobile}
                  onChange={(value) =>
                    setForm((f) => ({ ...f, mobile: value }))
                  }
                />

                <div className="grid gap-3 md:col-span-2 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
                  <Field
                    label="Email Address"
                    required
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(value) =>
                      setForm((f) => ({ ...f, email: value }))
                    }
                  />
                  <button
                    type="button"
                    className="w-full cursor-pointer whitespace-nowrap rounded-xl border border-[rgba(200,169,107,0.38)] bg-black px-4 py-3 text-sm font-semibold text-[#eef0f5] shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[#16120a] hover:shadow-[0_0_22px_rgba(200,169,107,0.12)] md:w-auto"
                  >
                    Verify Email
                  </button>
                </div>

                <Field
                  label="Date of Birth (MM/DD/YYYY)"
                  required
                  placeholder="MM/DD/YYYY"
                  value={form.dob}
                  onChange={(value) => setForm((f) => ({ ...f, dob: value }))}
                  withCalendarIcon
                />
                <Field
                  label="Country of Birth"
                  required
                  placeholder="Search country"
                  value={form.countryOfBirth}
                  onChange={(value) =>
                    setForm((f) => ({ ...f, countryOfBirth: value }))
                  }
                />
                <Field
                  label="Citizenship"
                  required
                  value={form.citizenship}
                  onChange={(value) =>
                    setForm((f) => ({ ...f, citizenship: value }))
                  }
                />
                <Field
                  label="Current Country of Residence"
                  required
                  placeholder="Search country"
                  value={form.currentResidence}
                  onChange={(value) =>
                    setForm((f) => ({ ...f, currentResidence: value }))
                  }
                />

                <div className="mt-6 flex flex-col gap-2 sm:col-span-2 sm:flex-row">
                  <button
                    type="button"
                    className="w-full cursor-pointer rounded-xl border border-[#c8a96b] bg-[#c8a96b] px-4 py-3 text-sm font-semibold text-black shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[#d4b87e] hover:bg-[#d4b87e] hover:shadow-[0_0_26px_rgba(200,169,107,0.28)] sm:ml-auto sm:min-w-44 sm:w-auto"
                  >
                    Save & Continue
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {showFeeModal && (
        <div className="fixed inset-0 z-9000 grid place-items-center bg-black/85 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl border border-[rgba(212,175,55,0.35)] bg-[linear-gradient(180deg,#111214,#0a0a0b)] p-5 text-[#ece3c7] shadow-[0_0_0_1px_rgba(212,175,55,0.1),0_26px_70px_-40px_rgba(212,175,55,0.45)] sm:p-6">
            <h2 className="text-2xl font-bold text-[#f4dfb2]">
              Program Fee Structure
            </h2>

            <div className="mt-4 space-y-3 text-sm leading-6 text-[#d7d2c4]">
              <div className="rounded-lg border border-[rgba(212,175,55,0.25)] bg-[rgba(255,255,255,0.02)] p-3">
                <p className="font-semibold text-[#f4dfb2]">
                  Initial Evaluation Fee
                </p>
                <p className="font-semibold text-white">
                  USD 500 (non-refundable)
                </p>
                <p className="mt-1 text-[#cfc9b6]">
                  This fee supports evaluation and process coordination
                  services. It does not promise employment outcomes.
                </p>
              </div>

              <div className="rounded-lg border border-[rgba(212,175,55,0.25)] bg-[rgba(255,255,255,0.02)] p-3">
                <p className="font-semibold text-[#f4dfb2]">Program Fee</p>
                <p className="font-semibold text-white">USD 6,200</p>
              </div>

              <div className="rounded-lg border border-[rgba(212,175,55,0.25)] bg-[rgba(255,255,255,0.02)] p-3">
                <p className="font-semibold text-[#f4dfb2]">
                  Post Initial Evaluation
                </p>
                <ul className="mt-1 list-disc pl-5 text-[#cfc9b6]">
                  <li>First installment payment is USD 3,100</li>
                  <li>USD 3,100 payable upon successful selection</li>
                </ul>
              </div>
            </div>

            <div className="mt-4 text-sm text-[#e6dbbc]">
              <Link
                href="/privacy-policy?returnTo=profile-submission&popup=fee"
                className="font-medium hover:underline"
              >
                Privacy Policy
              </Link>
              <span className="mx-2">|</span>
              <Link
                href="/payment-refund-policy?returnTo=profile-submission&popup=fee"
                className="font-medium hover:underline"
              >
                Payment & Refund Policy
              </Link>
              <span className="mx-2">|</span>
              <Link
                href="/terms-of-service?returnTo=profile-submission&popup=fee"
                className="font-medium hover:underline"
              >
                Terms and Conditions
              </Link>
            </div>

            <label className="mt-4 flex items-start gap-3 text-sm text-[#f0e7cd]">
              <input
                className="mt-0.5 h-4 w-4 rounded border-[rgba(212,175,55,0.45)] bg-black"
                type="checkbox"
                checked={feeAccepted}
                onChange={(e) => setFeeAccepted(e.target.checked)}
              />
              <span>
                I have read, reviewed, and understood the fee structure below
                before moving forward.
              </span>
            </label>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                disabled={!feeAccepted}
                onClick={() => setShowFeeModal(false)}
                className="cursor-pointer rounded-xl border border-[#d4af37] bg-[#d4af37] px-4 py-2.5 text-sm font-semibold text-[#111318] shadow-sm transition duration-200 disabled:cursor-not-allowed disabled:opacity-50 hover:-translate-y-0.5 hover:bg-[#e2bf4f]"
              >
                Sign & Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  required = false,
  placeholder,
  type = "text",
  withCalendarIcon = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
  type?: "text" | "email";
  withCalendarIcon?: boolean;
}) {
  const selectedDate = parseDateString(value);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [calendarOpenUpward, setCalendarOpenUpward] = useState(false);
  const [viewMonth, setViewMonth] = useState<Date>(() => {
    const seed = selectedDate ?? new Date();
    return new Date(seed.getFullYear(), seed.getMonth(), 1);
  });
  const wrapperRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (!isCalendarOpen) return;

    function onPointerDown(event: MouseEvent) {
      if (!wrapperRef.current) return;
      const target = event.target as Node;
      if (!wrapperRef.current.contains(target)) {
        setIsCalendarOpen(false);
      }
    }

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [isCalendarOpen]);

  const monthGrid = useMemo(() => getMonthGrid(viewMonth), [viewMonth]);
  const monthLabel = viewMonth.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });
  const today = new Date();

  function updateCalendarPlacement() {
    if (!wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    // Approximate calendar popover height with controls and week grid.
    const requiredHeight = 320;
    const spaceBelow = window.innerHeight - rect.bottom;
    setCalendarOpenUpward(spaceBelow < requiredHeight);
  }

  function sameDay(a: Date, b: Date): boolean {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  }

  function shiftMonth(delta: number) {
    setViewMonth((m) => new Date(m.getFullYear(), m.getMonth() + delta, 1));
  }

  function selectDay(day: Date) {
    onChange(formatDateString(day));
    setIsCalendarOpen(false);
  }

  useEffect(() => {
    if (!isCalendarOpen) return;
    updateCalendarPlacement();

    const onResize = () => updateCalendarPlacement();
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onResize, true);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize, true);
    };
  }, [isCalendarOpen]);

  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-[#d3d3d8]">
        {label}
        {required && <span className="ml-1 text-rose-500">*</span>}
      </span>
      <span className="relative z-60 block" ref={wrapperRef}>
        <input
          className={`w-full rounded-lg border border-[rgba(200,169,107,0.22)] bg-[rgba(255,255,255,0.035)] px-3 py-3 text-sm text-[#f7f3ea] outline-none transition placeholder:text-[#8f8f96] focus:border-[#c8a96b] focus:ring-2 focus:ring-[#c8a96b]/20 ${
            withCalendarIcon ? "pr-12" : ""
          }`}
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
        {withCalendarIcon && (
          <button
            type="button"
            aria-label="Toggle calendar"
            onClick={() => {
              setIsCalendarOpen((v) => {
                const next = !v;
                if (next) {
                  const seed = selectedDate ?? new Date();
                  setViewMonth(
                    new Date(seed.getFullYear(), seed.getMonth(), 1),
                  );
                  updateCalendarPlacement();
                }
                return next;
              });
            }}
            className="absolute inset-y-0 right-0 flex min-w-11 items-center justify-center px-3 text-[#c8a96b] transition hover:text-[#e6c780]"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-4.5 w-4.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3.5" y="5.5" width="17" height="15" rx="2.5" />
              <path d="M7.5 3.5v4" />
              <path d="M16.5 3.5v4" />
              <path d="M3.5 9.5h17" />
              <path d="M8.5 13h3" />
              <path d="M13 13h3" />
              <path d="M8.5 16.5h3" />
            </svg>
          </button>
        )}

        {withCalendarIcon && isCalendarOpen && (
          <div
            className={`absolute right-0 z-80 w-72 max-h-[min(22rem,calc(100vh-5rem))] overflow-y-auto rounded-xl border border-[rgba(200,169,107,0.3)] bg-[rgba(13,13,14,0.98)] p-3 shadow-[0_18px_48px_-20px_rgba(0,0,0,0.8)] backdrop-blur-md ${
              calendarOpenUpward ? "bottom-full mb-2" : "top-full mt-2"
            }`}
          >
            <div className="mb-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => shiftMonth(-1)}
                className="rounded-md border border-[rgba(200,169,107,0.28)] px-2 py-1 text-xs text-[#e6d0a1] transition hover:bg-[rgba(200,169,107,0.12)]"
                aria-label="Previous month"
              >
                Prev
              </button>
              <div className="text-sm font-semibold text-[#f4dfb2]">
                {monthLabel}
              </div>
              <button
                type="button"
                onClick={() => shiftMonth(1)}
                className="rounded-md border border-[rgba(200,169,107,0.28)] px-2 py-1 text-xs text-[#e6d0a1] transition hover:bg-[rgba(200,169,107,0.12)]"
                aria-label="Next month"
              >
                Next
              </button>
            </div>

            <div className="mb-1 grid grid-cols-7 gap-1">
              {weekdayLabels.map((day) => (
                <div
                  key={day}
                  className="py-1 text-center text-[11px] font-medium uppercase tracking-[0.12em] text-[#9ea3af]"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {monthGrid.map((day) => {
                const inMonth = day.getMonth() === viewMonth.getMonth();
                const selected = selectedDate
                  ? sameDay(day, selectedDate)
                  : false;
                const isToday = sameDay(day, today);

                return (
                  <button
                    key={day.toISOString()}
                    type="button"
                    onClick={() => selectDay(day)}
                    className={`rounded-md px-0 py-1.5 text-center text-xs transition ${
                      selected
                        ? "bg-[#c8a96b] font-semibold text-black"
                        : inMonth
                          ? "text-[#e9eaef] hover:bg-[rgba(200,169,107,0.18)]"
                          : "text-[#666c78] hover:bg-[rgba(255,255,255,0.06)]"
                    } ${isToday && !selected ? "ring-1 ring-[#c8a96b]/60" : ""}`}
                    aria-label={`Select ${formatDateString(day)}`}
                  >
                    {day.getDate()}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </span>
    </label>
  );
}
