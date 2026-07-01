"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type Destination = "europe" | "global" | null;
type EuropeCountry = "Germany" | "Switzerland" | "Austria" | "Poland" | null;

type YesNo = "Yes" | "No" | "";
type Qualification =
  | "Diploma with one year practical training"
  | "Bachelor’s"
  | "Master's"
  | "";

type EuropeLanguageRequirement =
  | YesNo
  | "German B2 certified or above"
  | "French B2 certified or above"
  | "Italian B2 certified or above";

interface EuropeEligibility {
  itBackground: YesNo;
  qualification: Qualification;
  languageRequirement: EuropeLanguageRequirement;
  currentLocation: "Europe" | "Outside Europe" | "";
  willingToRelocate: YesNo;
  comfortableWithFees: YesNo;
}

interface GlobalEligibility {
  itBackground: YesNo;
  qualification: Qualification;
  englishProficiency: YesNo;
  currentLocation: string;
  willingToRelocate: YesNo;
  comfortableWithFees: YesNo;
}

interface FormState {
  email: string;
  destination: Destination;
  europeCountry: EuropeCountry;
  europeEligibility: EuropeEligibility;
  globalEligibility: GlobalEligibility;
}

interface EligibilityResult {
  eligible: boolean;
  reasons: string[];
}

const emptyEuropeEligibility: EuropeEligibility = {
  itBackground: "",
  qualification: "",
  languageRequirement: "",
  currentLocation: "",
  willingToRelocate: "",
  comfortableWithFees: "",
};

const emptyGlobalEligibility: GlobalEligibility = {
  itBackground: "",
  qualification: "",
  englishProficiency: "",
  currentLocation: "",
  willingToRelocate: "",
  comfortableWithFees: "",
};

const initialState: FormState = {
  email: "",
  destination: null,
  europeCountry: null,
  europeEligibility: emptyEuropeEligibility,
  globalEligibility: emptyGlobalEligibility,
};

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/** Total steps depends on branch: Europe = 5 steps, Global = 4 steps. */
function getTotalSteps(destination: Destination): number {
  if (destination === "europe") return 5;
  if (destination === "global") return 4;
  return 5;
}

/** Simple required-field check per branch, used to enable "Continue"/"Check Eligibility". */
function isEuropeFormComplete(e: EuropeEligibility): boolean {
  return (
    e.itBackground !== "" &&
    e.qualification !== "" &&
    e.languageRequirement !== "" &&
    e.currentLocation !== "" &&
    e.willingToRelocate !== "" &&
    e.comfortableWithFees !== ""
  );
}

function getEuropeLanguageQuestion(country: EuropeCountry): {
  label: string;
  options: string[];
} {
  if (country === "Switzerland") {
    return {
      label: "Do you have certified B2 or above in German, French, or Italian?",
      options: [
        "German B2 certified or above",
        "French B2 certified or above",
        "Italian B2 certified or above",
        "No",
      ],
    };
  }

  if (country === "Poland") {
    return {
      label: "Do you have professional English proficiency?",
      options: ["Yes", "No"],
    };
  }

  return {
    label: "Do you have certified German B2 or above?",
    options: ["Yes", "No"],
  };
}

function getEuropeEligibilityResult(
  e: EuropeEligibility,
  country: EuropeCountry,
): EligibilityResult {
  const reasons: string[] = [];

  if (e.itBackground === "No") {
    reasons.push(
      "You need to have an IT background (Software, Data, Cloud, AI, Cybersecurity, etc.).",
    );
  }

  if (e.languageRequirement === "No") {
    if (country === "Poland") {
      reasons.push("You need to have professional English proficiency.");
    } else if (country === "Switzerland") {
      reasons.push(
        "You need to have certified B2 or above in German, French, or Italian.",
      );
    } else {
      reasons.push("You need to have certified German B2 or above.");
    }
  }

  if (
    country &&
    country !== "Germany" &&
    e.currentLocation === "Outside Europe"
  ) {
    reasons.push(
      "For this selected country, you need to currently be inside Europe.",
    );
  }

  if (e.willingToRelocate === "No") {
    reasons.push("You need to be willing to relocate to the selected country.");
  }

  if (e.comfortableWithFees === "No") {
    reasons.push(
      "You need to be comfortable with program/service fees for processing.",
    );
  }

  return { eligible: reasons.length === 0, reasons };
}

function getGlobalEligibilityResult(g: GlobalEligibility): EligibilityResult {
  const reasons: string[] = [];

  if (g.itBackground === "No") {
    reasons.push(
      "You need to have an IT background (Software, Data, Cloud, AI, Cybersecurity, etc.).",
    );
  }

  if (g.englishProficiency === "No") {
    reasons.push(
      "You need to have certified/professional English proficiency.",
    );
  }

  if (g.willingToRelocate === "No") {
    reasons.push(
      "You need to be willing to relocate to another country, if required.",
    );
  }

  if (g.comfortableWithFees === "No") {
    reasons.push(
      "You need to be comfortable with program/service fees for processing.",
    );
  }

  return { eligible: reasons.length === 0, reasons };
}

function isGlobalFormComplete(g: GlobalEligibility): boolean {
  return (
    g.itBackground !== "" &&
    g.englishProficiency !== "" &&
    g.currentLocation.trim() !== "" &&
    g.willingToRelocate !== "" &&
    g.comfortableWithFees !== ""
  );
}

const europeCountries: Exclude<EuropeCountry, null>[] = [
  "Germany",
  "Switzerland",
  "Austria",
  "Poland",
];

const europeCountryBackgrounds: Record<Exclude<EuropeCountry, null>, string> = {
  Germany:
    "linear-gradient(180deg, #000000 0 33.33%, #dd0000 33.33% 66.66%, #ffce00 66.66% 100%)",
  Switzerland:
    "linear-gradient(90deg, transparent 0 38%, #ffffff 38% 62%, transparent 62% 100%), linear-gradient(180deg, transparent 0 38%, #ffffff 38% 62%, transparent 62% 100%), #d52b1e",
  Austria:
    "linear-gradient(180deg, #ed2939 0 33.33%, #ffffff 33.33% 66.66%, #ed2939 66.66% 100%)",
  Poland: "linear-gradient(180deg, #ffffff 0 50%, #dc143c 50% 100%)",
};

const europeCountryTextColors: Record<Exclude<EuropeCountry, null>, string> = {
  Germany: "#ffffff",
  Switzerland: "#000000",
  Austria: "#1f2937",
  Poland: "#111827",
};

const upcomingCountries = [
  { name: "United States", code: "us" },
  { name: "United Kingdom", code: "gb" },
  { name: "Spain", code: "es" },
  { name: "Italy", code: "it" },
] as const;

export default function EligibilityWizard() {
  const [form, setForm] = useState<FormState>(initialState);
  // activeStep is 1-indexed and tracks how far the user has progressed.
  const [activeStep, setActiveStep] = useState<number>(1);
  const [confirmTargetStep, setConfirmTargetStep] = useState<number | null>(
    null,
  );

  const totalSteps = getTotalSteps(form.destination);
  const emailIsValid = isValidEmail(form.email);
  const isLocked =
    (form.destination === "europe" && activeStep >= 5) ||
    (form.destination === "global" && activeStep >= 4);

  function openContinueConfirm(targetStep: number) {
    setConfirmTargetStep(targetStep);
  }

  function closeContinueConfirm() {
    setConfirmTargetStep(null);
  }

  function confirmAndContinue() {
    if (confirmTargetStep !== null) {
      setActiveStep(confirmTargetStep);
    }
    closeContinueConfirm();
  }

  function goBack() {
    setActiveStep((s) => Math.max(1, s - 1));
  }

  function resetFromStep2Branch() {
    // If user backs out past the destination choice, branch-specific data is stale.
    setForm((f) => ({
      ...f,
      destination: null,
      europeCountry: null,
      europeEligibility: emptyEuropeEligibility,
      globalEligibility: emptyGlobalEligibility,
    }));
  }

  function restartFromDestinationStep() {
    setForm((f) => ({
      ...initialState,
      email: f.email,
    }));
    setActiveStep(2);
    closeContinueConfirm();
  }

  return (
    <div className="network-grid px-4 pb-20 pt-28 sm:px-6 lg:px-8 lg:pt-32">
      <style>{wizardStyles}</style>
      <div className="mx-auto flex max-w-360 flex-col items-center">
        <div className="w-full max-w-5xl text-center">
          <h1 className="nst-display mb-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Where would you like to work?
          </h1>
          <p className="mb-8 text-base leading-8 text-[#d1d2d7] sm:text-lg">
            Our selective process begins with destination and readiness checks
            for international pathway evaluation.
          </p>
        </div>

        <div className="w-full max-w-5xl flex flex-col gap-6">
          {/* STEP 1: Email */}
          <StepShell
            stepNumber={1}
            totalSteps={totalSteps}
            isActive={activeStep === 1}
            isComplete={activeStep > 1}
          >
            <h2 className="mb-4 nst-display text-2xl font-semibold text-white">
              Enter your email to begin
            </h2>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-[#d3d3d8]">
                Email Address<span className="ml-1 text-rose-600">*</span>
              </span>
              <span className="relative block">
                <input
                  className="w-full rounded-lg border border-[rgba(200,169,107,0.22)] bg-[rgba(255,255,255,0.035)] px-3 py-2.5 text-sm text-[#f7f3ea] outline-none transition placeholder:text-[#8f8f96] focus:border-[#c8a96b] focus:ring-2 focus:ring-[#c8a96b]/20"
                  disabled={isLocked}
                  required
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                />
              </span>
            </label>
            {form.email.length > 0 && !emailIsValid && (
              <p className="mt-2 text-sm text-rose-400">
                Enter a valid email address to continue.
              </p>
            )}
            {activeStep === 1 && (
              <div className="mt-6 flex justify-end">
                <button
                  className="cursor-pointer rounded-xl px-4 py-2.5 text-sm font-semibold shadow-sm transition duration-200 disabled:cursor-not-allowed disabled:opacity-50 bg-[#c8a96b] text-black border border-[#c8a96b] hover:-translate-y-0.5 hover:bg-[#d4b87e] hover:border-[#d4b87e] hover:shadow-[0_0_26px_rgba(200,169,107,0.28)]"
                  disabled={!emailIsValid}
                  onClick={() => setActiveStep(2)}
                >
                  Continue
                </button>
              </div>
            )}
          </StepShell>

          {/* STEP 2: Destination (Europe / Global / upcoming) */}
          {activeStep >= 2 && (
            <StepShell
              stepNumber={2}
              totalSteps={totalSteps}
              isActive={activeStep === 2}
              isComplete={activeStep > 2}
            >
              <div className="grid grid-cols-1 gap-6">
                <button
                  type="button"
                  className={cardButtonClasses(
                    form.destination === "europe" && activeStep === 2,
                  )}
                  disabled={isLocked}
                  onClick={() => {
                    setForm((f) => ({
                      ...f,
                      destination: "europe",
                      europeCountry: null,
                      europeEligibility: emptyEuropeEligibility,
                      globalEligibility: emptyGlobalEligibility,
                    }));
                    setActiveStep(3);
                  }}
                >
                  <div className="h-64">
                    <Image
                      className="h-full w-full object-cover"
                      src="/Europe2.png"
                      alt="Europe"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                  <div className="absolute inset-0 bg-linear-to-t from-[#002147]/80 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <h2 className="nst-display text-3xl font-bold">Europe</h2>
                    <p className="text-xs uppercase tracking-widest text-[#f4dfb2]">
                      Currently Servicing
                    </p>
                    <p className="mt-1 text-sm text-[#f4dfb2]">
                      Germany, Switzerland, Austria, and Poland
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  className={cardButtonClasses(
                    form.destination === "global" && activeStep === 2,
                  )}
                  disabled={isLocked}
                  onClick={() => {
                    setForm((f) => ({
                      ...f,
                      destination: "global",
                      europeCountry: null,
                      europeEligibility: emptyEuropeEligibility,
                      globalEligibility: emptyGlobalEligibility,
                    }));
                    setActiveStep(3);
                  }}
                >
                  <div className="relative h-64 overflow-hidden rounded-xl">
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{
                        backgroundImage: "url('/global_oppurtunities.png')",
                      }}
                    />
                    <div className="absolute inset-0 opacity-35">
                      <div className="absolute -left-8 top-0 h-32 w-32 rounded-full bg-[#c8a96b]/25 blur-3xl" />
                    </div>
                    <div className="absolute bottom-6 left-6 right-34 text-white">
                      <h2 className="nst-display text-3xl font-bold">
                        Global Opportunities
                      </h2>
                    </div>
                  </div>
                </button>

                <div>
                  <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#c8a96b]">
                    Upcoming
                  </h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {upcomingCountries.map((country) => (
                      <button
                        key={country.name}
                        type="button"
                        disabled
                        className="group grid w-full grid-cols-[4.25rem_minmax(0,1fr)] overflow-hidden rounded-xl border border-[rgba(200,169,107,0.22)] bg-[rgba(255,255,255,0.035)] text-left transition disabled:cursor-not-allowed disabled:opacity-85"
                      >
                        <div className="flex items-center justify-center border-r border-[rgba(200,169,107,0.18)] bg-[rgba(200,169,107,0.12)] p-3">
                          <div className="relative h-11 w-11 overflow-hidden rounded-lg border border-white/12 bg-[#111827] shadow-[0_8px_18px_rgba(0,0,0,0.22)]">
                            <Image
                              src={`https://flagcdn.com/w80/${country.code}.png`}
                              alt={`${country.name} flag`}
                              fill
                              sizes="44px"
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                        </div>
                        <div className="flex items-center px-4 py-4">
                          <div>
                            <h3 className="nst-display mt-1 text-xl font-semibold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)] sm:text-[1.35rem]">
                              {country.name}
                            </h3>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </StepShell>
          )}

          {/* BRANCH: EUROPE -------------------------------------------------- */}
          {form.destination === "europe" && activeStep >= 3 && (
            <StepShell
              stepNumber={3}
              totalSteps={totalSteps}
              isActive={activeStep === 3}
              isComplete={activeStep > 3}
            >
              <h2 className="mb-4 nst-display text-2xl font-semibold text-white">
                Choose your preferred country
              </h2>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {europeCountries.map((country) => (
                  <button
                    key={country}
                    type="button"
                    disabled={isLocked}
                    className={`relative overflow-hidden rounded-xl border p-5 text-center transition duration-300 border-white/30 hover:border-white/45 ${
                      form.europeCountry === country
                        ? "scale-[1.02] border-[#f4dfb2] ring-2 ring-[#f4dfb2]/80 shadow-[0_0_0_1px_rgba(255,255,255,0.85),0_0_34px_rgba(200,169,107,0.48),0_14px_30px_rgba(0,0,0,0.36)]"
                        : ""
                    }`}
                    style={{ background: europeCountryBackgrounds[country] }}
                    onClick={() =>
                      setForm((f) => ({
                        ...f,
                        europeCountry: country,
                        europeEligibility: emptyEuropeEligibility,
                      }))
                    }
                  >
                    {form.europeCountry === country && (
                      <div className="absolute inset-0 bg-linear-to-br from-white/20 via-transparent to-[#c8a96b]/22" />
                    )}
                    <div
                      className={`absolute inset-0 ${
                        form.europeCountry === country
                          ? "bg-black/6"
                          : "bg-black/14"
                      }`}
                    />
                    <span
                      className="relative block text-base font-semibold md:text-lg"
                      style={{ color: europeCountryTextColors[country] }}
                    >
                      {country}
                    </span>
                  </button>
                ))}
              </div>
              {activeStep === 3 && (
                <div className="mt-6 flex gap-2">
                  <button
                    className={backButtonClasses}
                    onClick={() => {
                      goBack();
                      resetFromStep2Branch();
                    }}
                  >
                    Back
                  </button>
                  <button
                    className={continueButtonClasses}
                    disabled={!form.europeCountry}
                    onClick={() => setActiveStep(4)}
                  >
                    Continue
                  </button>
                </div>
              )}
            </StepShell>
          )}

          {form.destination === "europe" && activeStep >= 4 && (
            <StepShell
              stepNumber={4}
              totalSteps={totalSteps}
              isActive={activeStep === 4}
              isComplete={activeStep > 4}
            >
              {(() => {
                const languageQuestion = getEuropeLanguageQuestion(
                  form.europeCountry,
                );

                return (
                  <>
                    <h2 className="mb-4 nst-display text-2xl font-semibold text-white">
                      Quick Questions
                    </h2>
                    <div className="grid gap-3 md:grid-cols-2">
                      <SelectField
                        disabled={isLocked}
                        label="Do you have an IT background? (Software, Data, Cloud, AI, Cybersecurity, etc.)"
                        required
                        value={form.europeEligibility.itBackground}
                        options={["Yes", "No"]}
                        onChange={(v) =>
                          setForm((f) => ({
                            ...f,
                            europeEligibility: {
                              ...f.europeEligibility,
                              itBackground: v as YesNo,
                            },
                          }))
                        }
                      />
                      <SelectField
                        disabled={isLocked}
                        label="Highest Qualification"
                        required
                        value={form.europeEligibility.qualification}
                        options={[
                          "Diploma with one year practical training",
                          "Bachelor’s",
                          "Master's",
                        ]}
                        onChange={(v) =>
                          setForm((f) => ({
                            ...f,
                            europeEligibility: {
                              ...f.europeEligibility,
                              qualification: v as Qualification,
                            },
                          }))
                        }
                      />
                      <SelectField
                        disabled={isLocked}
                        label={languageQuestion.label}
                        required
                        value={form.europeEligibility.languageRequirement}
                        options={languageQuestion.options}
                        onChange={(v) =>
                          setForm((f) => ({
                            ...f,
                            europeEligibility: {
                              ...f.europeEligibility,
                              languageRequirement:
                                v as EuropeLanguageRequirement,
                            },
                          }))
                        }
                      />
                      <SelectField
                        disabled={isLocked}
                        label="Current location"
                        required
                        value={form.europeEligibility.currentLocation}
                        options={["Europe", "Outside Europe"]}
                        onChange={(v) =>
                          setForm((f) => ({
                            ...f,
                            europeEligibility: {
                              ...f.europeEligibility,
                              currentLocation: v as
                                | "Europe"
                                | "Outside Europe"
                                | "",
                            },
                          }))
                        }
                      />
                      <SelectField
                        disabled={isLocked}
                        label="Are you willing to relocate to the selected country?"
                        required
                        value={form.europeEligibility.willingToRelocate}
                        options={["Yes", "No"]}
                        onChange={(v) =>
                          setForm((f) => ({
                            ...f,
                            europeEligibility: {
                              ...f.europeEligibility,
                              willingToRelocate: v as YesNo,
                            },
                          }))
                        }
                      />
                      <SelectField
                        disabled={isLocked}
                        label="Are you comfortable with program/service fees for processing?"
                        required
                        value={form.europeEligibility.comfortableWithFees}
                        options={["Yes", "No"]}
                        onChange={(v) =>
                          setForm((f) => ({
                            ...f,
                            europeEligibility: {
                              ...f.europeEligibility,
                              comfortableWithFees: v as YesNo,
                            },
                          }))
                        }
                      />
                    </div>
                    {activeStep === 4 && (
                      <div className="mt-6 flex gap-2">
                        <button className={backButtonClasses} onClick={goBack}>
                          Back
                        </button>
                        <button
                          className={continueButtonClasses}
                          disabled={
                            !isEuropeFormComplete(form.europeEligibility)
                          }
                          onClick={() => openContinueConfirm(5)}
                        >
                          Continue
                        </button>
                      </div>
                    )}
                  </>
                );
              })()}
            </StepShell>
          )}

          {form.destination === "europe" && activeStep >= 5 && (
            <StepShell
              stepNumber={5}
              totalSteps={totalSteps}
              isActive={activeStep === 5}
              isComplete={false}
            >
              <ResultPanel
                result={getEuropeEligibilityResult(
                  form.europeEligibility,
                  form.europeCountry,
                )}
              />
              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  className={backButtonClasses}
                  onClick={restartFromDestinationStep}
                >
                  Check with another country
                </button>
              </div>
            </StepShell>
          )}

          {/* BRANCH: GLOBAL --------------------------------------------------- */}
          {form.destination === "global" && activeStep >= 3 && (
            <StepShell
              stepNumber={3}
              totalSteps={totalSteps}
              isActive={activeStep === 3}
              isComplete={activeStep > 3}
            >
              <h2 className="mb-4 nst-display text-2xl font-semibold text-white">
                Quick Questions
              </h2>
              <div className="grid gap-3 md:grid-cols-2">
                <SelectField
                  disabled={isLocked}
                  label="Do you have an IT background? (Software, Data, Cloud, AI, Cybersecurity, etc.)"
                  required
                  value={form.globalEligibility.itBackground}
                  options={["Yes", "No"]}
                  onChange={(v) =>
                    setForm((f) => ({
                      ...f,
                      globalEligibility: {
                        ...f.globalEligibility,
                        itBackground: v as YesNo,
                      },
                    }))
                  }
                />
                <SelectField
                  disabled={isLocked}
                  label="Highest Qualification"
                  value={form.globalEligibility.qualification}
                  options={[
                    "Diploma with one year practical training",
                    "Bachelor’s",
                    "Master's",
                  ]}
                  onChange={(v) =>
                    setForm((f) => ({
                      ...f,
                      globalEligibility: {
                        ...f.globalEligibility,
                        qualification: v as Qualification,
                      },
                    }))
                  }
                />
                <SelectField
                  disabled={isLocked}
                  label="Do you have certified / professional English proficiency"
                  required
                  value={form.globalEligibility.englishProficiency}
                  options={["Yes", "No"]}
                  onChange={(v) =>
                    setForm((f) => ({
                      ...f,
                      globalEligibility: {
                        ...f.globalEligibility,
                        englishProficiency: v as YesNo,
                      },
                    }))
                  }
                />
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-[#d3d3d8]">
                    Current location
                  </span>
                  <span className="relative block">
                    <input
                      className="w-full rounded-lg border border-[rgba(200,169,107,0.22)] bg-[rgba(255,255,255,0.035)] px-3 py-2.5 text-sm text-[#f7f3ea] outline-none transition placeholder:text-[#8f8f96] focus:border-[#c8a96b] focus:ring-2 focus:ring-[#c8a96b]/20"
                      autoCapitalize="sentences"
                      disabled={isLocked}
                      placeholder="Type your country"
                      value={form.globalEligibility.currentLocation}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          globalEligibility: {
                            ...f.globalEligibility,
                            currentLocation: e.target.value,
                          },
                        }))
                      }
                    />
                  </span>
                </label>
                <SelectField
                  disabled={isLocked}
                  label="Are you willing to relocate to another country, if required"
                  required
                  value={form.globalEligibility.willingToRelocate}
                  options={["Yes", "No"]}
                  onChange={(v) =>
                    setForm((f) => ({
                      ...f,
                      globalEligibility: {
                        ...f.globalEligibility,
                        willingToRelocate: v as YesNo,
                      },
                    }))
                  }
                />
                <SelectField
                  disabled={isLocked}
                  label="Are you comfortable with program/service fees for processing?"
                  required
                  value={form.globalEligibility.comfortableWithFees}
                  options={["Yes", "No"]}
                  onChange={(v) =>
                    setForm((f) => ({
                      ...f,
                      globalEligibility: {
                        ...f.globalEligibility,
                        comfortableWithFees: v as YesNo,
                      },
                    }))
                  }
                />
              </div>
              {activeStep === 3 && (
                <div className="mt-6 flex gap-2">
                  <button
                    className={backButtonClasses}
                    onClick={() => {
                      goBack();
                      resetFromStep2Branch();
                    }}
                  >
                    Back
                  </button>
                  <button
                    className={continueButtonClasses}
                    disabled={!isGlobalFormComplete(form.globalEligibility)}
                    onClick={() => openContinueConfirm(4)}
                  >
                    Continue
                  </button>
                </div>
              )}
            </StepShell>
          )}

          {form.destination === "global" && activeStep >= 4 && (
            <StepShell
              stepNumber={4}
              totalSteps={totalSteps}
              isActive={activeStep === 4}
              isComplete={false}
            >
              <ResultPanel
                result={getGlobalEligibilityResult(form.globalEligibility)}
              />
              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  className={backButtonClasses}
                  onClick={restartFromDestinationStep}
                >
                  Check with another Country
                </button>
              </div>
            </StepShell>
          )}

          <ContinueConfirmModal
            isOpen={confirmTargetStep !== null}
            onCancel={closeContinueConfirm}
            onConfirm={confirmAndContinue}
          />
        </div>
      </div>
    </div>
  );
}

function StepShell({
  stepNumber,
  totalSteps,
  isActive,
  isComplete,
  children,
}: {
  stepNumber: number;
  totalSteps: number;
  isActive: boolean;
  isComplete: boolean;
  children: React.ReactNode;
}) {
  const stepProgressPct = Math.round((stepNumber / totalSteps) * 100);

  return (
    <div className="mx-auto w-full max-w-full">
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span className="inline-block w-fit rounded-full border border-[rgba(200,169,107,0.45)] bg-[rgba(200,169,107,0.16)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#f4dfb2]">
          Step {stepNumber} of {totalSteps}
        </span>
        <div className="h-2 w-full max-w-xs rounded-full bg-[rgba(255,255,255,0.15)] sm:ml-auto">
          <div
            className="h-2 rounded-full bg-[#c8a96b] transition-all"
            style={{ width: `${stepProgressPct}%` }}
          />
        </div>
      </div>
      <div
        className={`nst-step-box rounded-xl border border-[rgba(200,169,107,0.18)] bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.02))] p-6 text-[#f7f3ea] shadow-[0_24px_70px_-42px_rgba(0,0,0,0.72)] backdrop-blur-xl nst-card transition-opacity ${
          isComplete ? "opacity-90" : ""
        } ${isActive ? "ring-1 ring-[#c8a96b]/30" : ""}`}
      >
        {children}
      </div>
    </div>
  );
}

function ContinueConfirmModal({
  isOpen,
  onCancel,
  onConfirm,
}: {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-label="Confirm eligibility submission"
      onClick={onCancel}
    >
      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-[rgba(200,169,107,0.38)] bg-[linear-gradient(165deg,rgba(3,6,12,0.985),rgba(2,5,10,0.985))] p-6 text-[#e5e7ee] shadow-[0_24px_80px_-28px_rgba(0,0,0,0.8)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="pointer-events-none absolute -right-14 -top-14 h-44 w-44 rounded-full bg-[#2563eb]/14 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-16 h-52 w-52 rounded-full bg-[#0ea5e9]/10 blur-3xl" />

        <div className="mb-4 inline-flex items-center rounded-full border border-[rgba(200,169,107,0.45)] bg-[rgba(200,169,107,0.14)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#f4dfb2]">
          Confirmation Required
        </div>

        <p className="text-sm leading-7 text-[#e5e7ee] sm:text-base">
          Please review your information carefully before continuing. Once you
          proceed, you will not be able to modify your responses for this
          eligibility assessment.
        </p>

        <p className="mt-4 text-sm leading-7 text-[#e5e7ee] sm:text-base">
          If you would like to check your eligibility for another country or
          opportunity, you will need to complete a new eligibility assessment
          from the beginning.
        </p>

        <p className="mt-4 text-sm font-semibold leading-7 text-[#f4dfb2] sm:text-base">
          Do you wish to continue?
        </p>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            className={backButtonClasses}
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className={continueButtonClasses}
            onClick={onConfirm}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
  required = false,
  disabled = false,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-[#d3d3d8]">
        {label}
        {required && <span className="ml-1 text-rose-600">*</span>}
      </span>
      <select
        className="w-full rounded-lg border border-[rgba(200,169,107,0.22)] bg-[rgba(255,255,255,0.035)] px-3 py-2.5 text-sm text-[#f7f3ea] outline-none transition focus:border-[#c8a96b] focus:ring-2 focus:ring-[#c8a96b]/20"
        disabled={disabled}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="" className="text-[#9ca3af]">
          Select
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt} className="text-black">
            {opt}
          </option>
        ))}
      </select>
    </label>
  );
}

function ResultPanel({ result }: { result: EligibilityResult }) {
  const isEligible = result.eligible;

  return (
    <div className="relative overflow-hidden rounded-xl p-8 text-center">
      {isEligible && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="nst-burst-glow absolute left-1/2 top-6 h-24 w-24 -translate-x-1/2 rounded-full" />
          {confettiPieces.map((piece, i) => (
            <span
              key={i}
              className="nst-burst-piece absolute h-4 w-2 rounded-full"
              style={{
                left: piece.left,
                backgroundColor: piece.color,
                // @ts-expect-error custom CSS variable used by .nst-burst-piece animation
                "--nst-burst-rotate": piece.rotate,
                animationDelay: piece.delay,
                animationDuration: piece.duration,
              }}
            />
          ))}
        </div>
      )}

      <div
        className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${
          isEligible
            ? "bg-emerald-600 text-emerald-50"
            : "bg-rose-600 text-rose-50"
        }`}
      >
        <span className="text-3xl font-bold">{isEligible ? "✓" : "✕"}</span>
      </div>

      <h2 className="mb-3 nst-display text-3xl font-bold text-[#eef1f5]">
        {isEligible ? "You Are Eligible" : "You Are Not Eligible"}
      </h2>

      {isEligible ? (
        <>
          <p className="mx-auto mb-6 max-w-2xl text-[#e5e7ee]">
            You meet the initial eligibility criteria. You may now proceed to
            submit your detailed profile for evaluation.
          </p>
          <Link href="/profile-submission" className={continueButtonClasses}>
            Continue
          </Link>
        </>
      ) : (
        <div className="mx-auto max-w-2xl text-[#e5e7ee]">
          <p className="mb-3 text-center">
            You are currently not eligible for the following reasons:
          </p>
          <ul className="mx-auto w-fit list-disc space-y-2 pl-5 text-left marker:text-[#c8a96b]">
            {(result.reasons.length > 0
              ? result.reasons
              : ["You are currently not eligible based on your answers."]
            ).map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

const confettiPieces = [
  {
    left: "16%",
    color: "rgb(245, 158, 11)",
    rotate: "-18deg",
    delay: "0ms",
    duration: "2350ms",
  },
  {
    left: "24%",
    color: "rgb(239, 68, 68)",
    rotate: "22deg",
    delay: "120ms",
    duration: "2550ms",
  },
  {
    left: "33%",
    color: "rgb(16, 185, 129)",
    rotate: "-12deg",
    delay: "60ms",
    duration: "2280ms",
  },
  {
    left: "42%",
    color: "rgb(59, 130, 246)",
    rotate: "16deg",
    delay: "180ms",
    duration: "2620ms",
  },
  {
    left: "50%",
    color: "rgb(139, 92, 246)",
    rotate: "-6deg",
    delay: "0ms",
    duration: "2450ms",
  },
  {
    left: "58%",
    color: "rgb(236, 72, 153)",
    rotate: "18deg",
    delay: "200ms",
    duration: "2580ms",
  },
  {
    left: "67%",
    color: "rgb(20, 184, 166)",
    rotate: "-22deg",
    delay: "90ms",
    duration: "2380ms",
  },
  {
    left: "76%",
    color: "rgb(249, 115, 22)",
    rotate: "12deg",
    delay: "160ms",
    duration: "2520ms",
  },
  {
    left: "84%",
    color: "rgb(234, 179, 8)",
    rotate: "-16deg",
    delay: "40ms",
    duration: "2300ms",
  },
];

function cardButtonClasses(isSelected: boolean): string {
  return `relative overflow-hidden rounded-xl border text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_0_26px_rgba(200,169,107,0.18)] w-full ${
    isSelected
      ? "border-[#c8a96b] bg-[rgba(200,169,107,0.08)]"
      : "border-[rgba(200,169,107,0.28)] bg-[rgba(255,255,255,0.04)]"
  }`;
}

const backButtonClasses =
  "cursor-pointer rounded-xl px-4 py-2.5 text-sm font-semibold shadow-sm transition duration-200 disabled:cursor-not-allowed disabled:opacity-50 bg-transparent text-white border border-[rgba(200,169,107,0.38)] hover:-translate-y-0.5 hover:bg-[rgba(255,255,255,0.06)]";

const continueButtonClasses =
  "cursor-pointer rounded-xl px-4 py-2.5 text-sm font-semibold shadow-sm transition duration-200 disabled:cursor-not-allowed disabled:opacity-50 bg-[#c8a96b] text-black border border-[#c8a96b] hover:-translate-y-0.5 hover:bg-[#d4b87e] hover:border-[#d4b87e] hover:shadow-[0_0_26px_rgba(200,169,107,0.28)]";

/* ------------------------------------------------------------------------ */
/* Custom CSS — the original markup referenced these classes               */
/* (nst-display, nst-card, nst-burst-glow, nst-burst-piece) without ever    */
/* defining them. [Guessing] on exact font choice and animation timing;    */
/* everything else here (colors, blur radii, durations) is read directly   */
/* off the values already present in the source snippets.                 */
/* ------------------------------------------------------------------------ */
const wizardStyles = `
  /* [Guessing] Display typeface: a high-contrast serif to match the
     navy/gold "exclusive consultancy" tone implied by the palette.
     Replace this font-family if you already have a licensed/brand font. */
  .nst-display {
    font-family: "Playfair Display", "Georgia", "Times New Roman", serif;
    letter-spacing: -0.01em;
  }

  /* Card surface treatment — matches the frosted-glass look implied by
     backdrop-blur-xl + the translucent border/background already on each
     card's className. This class adds the subtle inner highlight + depth
     that a plain Tailwind utility stack doesn't fully cover. */
  .nst-card {
    position: relative;
  }
  .nst-card::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.06),
      rgba(255, 255, 255, 0) 40%
    );
    pointer-events: none;
  }

  /* Uniform box sizing across all steps. Step 2's image cards are naturally
     tall (h-80 photo); everything else is form fields. This min-height keeps
     every step's outer box visually consistent without forcing Step 2's
     cards to shrink or stretching short steps awkwardly. */
  .nst-step-box {
    min-height: 220px;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  /* Result-screen confetti burst (Step 5 / Europe, Step 4 / Global) */
  .nst-burst-glow {
    background: radial-gradient(
      circle,
      rgba(200, 169, 107, 0.35),
      transparent 70%
    );
    filter: blur(8px);
    animation: nst-glow-pulse 2.4s ease-in-out infinite;
  }

  .nst-burst-piece {
    top: 0;
    opacity: 0;
    transform: rotate(var(--nst-burst-rotate, 0deg)) translateY(0);
    animation-name: nst-burst-fall;
    animation-timing-function: ease-out;
    animation-iteration-count: infinite;
  }

  @keyframes nst-glow-pulse {
    0%, 100% { opacity: 0.5; transform: translateX(-50%) scale(1); }
    50% { opacity: 0.9; transform: translateX(-50%) scale(1.15); }
  }

  @keyframes nst-burst-fall {
    0% {
      opacity: 0;
      transform: rotate(var(--nst-burst-rotate, 0deg)) translateY(-10px);
    }
    15% {
      opacity: 1;
    }
    100% {
      opacity: 0;
      transform: rotate(var(--nst-burst-rotate, 0deg)) translateY(140px);
    }
  }

  /* Respect reduced-motion preference */
  @media (prefers-reduced-motion: reduce) {
    .nst-burst-glow,
    .nst-burst-piece {
      animation: none !important;
    }
  }
`;
