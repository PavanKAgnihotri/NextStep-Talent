"use client";

import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState } from "react";

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

const languageOptions = ["German", "English", "French", "Italian"];

const fallbackCountryOptions = [
  "Australia",
  "Austria",
  "Belgium",
  "Brazil",
  "Canada",
  "China",
  "France",
  "Germany",
  "India",
  "Italy",
  "Japan",
  "Netherlands",
  "Poland",
  "Spain",
  "Switzerland",
  "United Kingdom",
  "United States",
];

function getCountryOptions(): string[] {
  try {
    if (
      typeof Intl !== "undefined" &&
      typeof Intl.DisplayNames === "function"
    ) {
      const displayNames = new Intl.DisplayNames(["en"], { type: "region" });
      const excludedCodes = new Set(["EU", "UN", "ZZ"]);
      const regions: string[] = [];
      for (let first = 65; first <= 90; first += 1) {
        for (let second = 65; second <= 90; second += 1) {
          const code = `${String.fromCharCode(first)}${String.fromCharCode(second)}`;
          if (!excludedCodes.has(code)) regions.push(code);
        }
      }

      const names = regions
        .map((code) => ({ code, name: displayNames.of(code) }))
        .filter(
          (entry): entry is { code: string; name: string } =>
            Boolean(entry.name) &&
            entry.name !== entry.code &&
            entry.name !== "Unknown Region",
        )
        .map((entry) => entry.name)
        .sort((a, b) => a.localeCompare(b));

      if (names.length) return Array.from(new Set(names));
    }
  } catch {
    // Fallback list below is used when Intl region APIs are unavailable.
  }
  return fallbackCountryOptions;
}

type AdditionalQualification = {
  qualificationName: string;
  field: string;
  startDate: string;
  endDate: string;
  country: string;
};

type Certification = {
  certificationName: string;
  issuingOrganization: string;
  yearCompleted: string;
};

type Experience = {
  experienceType: "work" | "internship";
  organizationName: string;
  jobTitle: string;
  responsibilities: string;
  startDate: string;
  endDate: string;
  currentlyWorkingHere: boolean;
  country: string;
};

type LanguageEntry = {
  language: string;
  proficiencyLevel: string;
};

type PersonalRequiredKey =
  | "firstName"
  | "lastName"
  | "mobile"
  | "email"
  | "dateOfBirth"
  | "countryOfBirth"
  | "citizenship"
  | "currentCountryOfResidence"
  | "currentVisaStatus";

const personalRequiredKeys: PersonalRequiredKey[] = [
  "firstName",
  "lastName",
  "mobile",
  "email",
  "dateOfBirth",
  "countryOfBirth",
  "citizenship",
  "currentCountryOfResidence",
  "currentVisaStatus",
];

function newQualification(): AdditionalQualification {
  return {
    qualificationName: "",
    field: "",
    startDate: "",
    endDate: "",
    country: "",
  };
}

function newCertification(): Certification {
  return {
    certificationName: "",
    issuingOrganization: "",
    yearCompleted: "",
  };
}

function newExperience(type: "work" | "internship"): Experience {
  return {
    experienceType: type,
    organizationName: "",
    jobTitle: "",
    responsibilities: "",
    startDate: "",
    endDate: "",
    currentlyWorkingHere: false,
    country: "",
  };
}

function newLanguage(): LanguageEntry {
  return {
    language: "",
    proficiencyLevel: "",
  };
}

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

function isPersonalStepComplete(
  personalDetails: {
    firstName: string;
    lastName: string;
    mobile: string;
    email: string;
    dateOfBirth: string;
    countryOfBirth: string;
    citizenship: string;
    currentCountryOfResidence: string;
    currentVisaStatus: string;
  },
  requiresVisa: boolean,
): boolean {
  const requiredFields = [
    personalDetails.firstName,
    personalDetails.lastName,
    personalDetails.mobile,
    personalDetails.email,
    personalDetails.dateOfBirth,
    personalDetails.countryOfBirth,
    personalDetails.citizenship,
    personalDetails.currentCountryOfResidence,
  ];

  if (requiresVisa) {
    requiredFields.push(personalDetails.currentVisaStatus);
  }

  return requiredFields.every((value) => value.trim().length > 0);
}

function isEducationStepComplete(education: {
  highSchool: {
    startDate: string;
    endDate: string;
    track: string;
    country: string;
  };
  diploma: {
    notApplicable: boolean;
    duration: string;
    hasTraining: string;
    startDate: string;
    endDate: string;
    field: string;
    country: string;
  };
  bachelors: {
    startDate: string;
    endDate: string;
    field: string;
    country: string;
  };
}): boolean {
  const highSchoolComplete =
    education.highSchool.startDate.trim() !== "" &&
    education.highSchool.endDate.trim() !== "" &&
    education.highSchool.track.trim() !== "" &&
    education.highSchool.country.trim() !== "";

  const diplomaComplete = education.diploma.notApplicable
    ? true
    : education.diploma.duration.trim() !== "" &&
      education.diploma.hasTraining.trim() !== "" &&
      education.diploma.startDate.trim() !== "" &&
      education.diploma.endDate.trim() !== "" &&
      education.diploma.field.trim() !== "" &&
      education.diploma.country.trim() !== "";

  const bachelorsComplete = education.diploma.notApplicable
    ? education.bachelors.startDate.trim() !== "" &&
      education.bachelors.endDate.trim() !== "" &&
      education.bachelors.field.trim() !== "" &&
      education.bachelors.country.trim() !== ""
    : true;

  return highSchoolComplete && diplomaComplete && bachelorsComplete;
}

function isSkillsStepComplete(skills: {
  technical: string;
  soft: string;
}): boolean {
  return skills.technical.trim() !== "";
}

export default function ProfileSubmissionPage() {
  const [showFeeModal, setShowFeeModal] = useState(() => {
    if (typeof window === "undefined") return true;
    const popup = new URLSearchParams(window.location.search).get("popup");
    return popup === "fee" || !popup;
  });
  const [feeAccepted, setFeeAccepted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [hasReachedReview, setHasReachedReview] = useState(false);

  const [personalDetails, setPersonalDetails] = useState(() => {
    const verifiedEmail =
      typeof window === "undefined"
        ? ""
        : String(
            localStorage.getItem("profile_submission_verified_email") || "",
          ).trim();

    return {
      firstName: "",
      middleName: "",
      lastName: "",
      mobile: "",
      email: verifiedEmail,
      dateOfBirth: "",
      countryOfBirth: "",
      citizenship: "",
      currentCountryOfResidence: "",
      currentVisaStatus: "",
    };
  });
  const [verificationEmailMessage, setVerificationEmailMessage] = useState("");
  const [showEmailVerificationBox, setShowEmailVerificationBox] =
    useState(false);
  const [isSendingVerificationEmail, setIsSendingVerificationEmail] =
    useState(false);
  const [personalRequiredStarted, setPersonalRequiredStarted] = useState<
    Record<PersonalRequiredKey, boolean>
  >({
    firstName: false,
    lastName: false,
    mobile: false,
    email: false,
    dateOfBirth: false,
    countryOfBirth: false,
    citizenship: false,
    currentCountryOfResidence: false,
    currentVisaStatus: false,
  });
  const [requiredStarted, setRequiredStarted] = useState<
    Record<string, boolean>
  >({});

  const [education, setEducation] = useState({
    highSchool: { startDate: "", endDate: "", track: "", country: "" },
    diploma: {
      notApplicable: false,
      duration: "",
      hasTraining: "",
      startDate: "",
      endDate: "",
      field: "",
      country: "",
    },
    bachelors: { startDate: "", endDate: "", field: "", country: "" },
    masters: {
      notApplicable: true,
      startDate: "",
      endDate: "",
      field: "",
      country: "",
    },
    additionalQualifications: [newQualification()],
  });

  const [certifications, setCertifications] = useState<Certification[]>([
    newCertification(),
  ]);
  const [workExperience, setWorkExperience] = useState<Experience[]>([
    newExperience("work"),
    newExperience("internship"),
  ]);
  const [skills, setSkills] = useState({ technical: "", soft: "" });
  const [technicalSkillInput, setTechnicalSkillInput] = useState("");
  const [languages, setLanguages] = useState<LanguageEntry[]>([newLanguage()]);
  const [additionalInfo, setAdditionalInfo] = useState("");

  const technicalSkillList = useMemo(
    () =>
      skills.technical
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    [skills.technical],
  );

  const requiresVisa = Boolean(
    personalDetails.currentCountryOfResidence &&
    personalDetails.countryOfBirth &&
    personalDetails.currentCountryOfResidence !==
      personalDetails.countryOfBirth,
  );

  const progress = useMemo(
    () => Math.round(((currentStep - 1) / (stages.length - 1)) * 100),
    [currentStep],
  );
  const countryOptions = useMemo(() => getCountryOptions(), []);
  const isEmailVerified = useMemo(() => {
    if (typeof window === "undefined") return false;

    const currentEmail = personalDetails.email.trim().toLowerCase();
    if (!currentEmail) return false;

    const verifiedEmail = String(
      localStorage.getItem("profile_submission_verified_email") || "",
    )
      .trim()
      .toLowerCase();

    return Boolean(verifiedEmail && verifiedEmail === currentEmail);
  }, [personalDetails.email]);

  function markPersonalRequiredStarted(
    key: PersonalRequiredKey,
    value: string,
  ) {
    if (!value.trim()) return;
    setPersonalRequiredStarted((prev) => {
      if (prev[key]) return prev;
      return { ...prev, [key]: true };
    });
  }

  function getPersonalRequiredError(
    key: PersonalRequiredKey,
    value: string,
    message: string,
  ): string | undefined {
    if (!personalRequiredStarted[key]) return undefined;
    return value.trim() ? undefined : message;
  }

  function markRequiredStarted(fieldKey: string, value: string) {
    if (!value.trim()) return;
    setRequiredStarted((prev) => {
      if (prev[fieldKey]) return prev;
      return { ...prev, [fieldKey]: true };
    });
  }

  function markRequiredFields(fieldKeys: string[]) {
    setRequiredStarted((prev) => {
      const next = { ...prev };
      for (const fieldKey of fieldKeys) {
        next[fieldKey] = true;
      }
      return next;
    });
  }

  function getRequiredError(
    fieldKey: string,
    value: string,
    message: string,
  ): string | undefined {
    if (!requiredStarted[fieldKey]) return undefined;
    return value.trim() ? undefined : message;
  }

  function addTechnicalSkill() {
    const next = technicalSkillInput.trim();
    if (!next) return;
    markRequiredStarted("skills.technical", next);
    setSkills((prev) => ({
      ...prev,
      technical: [
        ...prev.technical
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        next,
      ].join(", "),
    }));
    setTechnicalSkillInput("");
  }

  async function handleVerifyEmail() {
    if (!personalDetails.email.trim()) {
      markPersonalRequiredStarted("email", personalDetails.email);
      return;
    }

    if (isEmailVerified) {
      setShowEmailVerificationBox(true);
      setVerificationEmailMessage("Email verified successfully.");
      return;
    }

    setShowEmailVerificationBox(true);

    setIsSendingVerificationEmail(true);
    setVerificationEmailMessage("Sending verification email...");

    try {
      const response = await fetch("/api/send-verification-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: personalDetails.email.trim(),
        }),
      });

      const data = (await response.json().catch(() => null)) as {
        message?: string;
      } | null;

      if (!response.ok) {
        throw new Error(data?.message || "Unable to send verification email.");
      }

      setVerificationEmailMessage(
        data?.message ||
          `Verification email sent to ${personalDetails.email.trim()}. Open the link in your inbox to verify your email.`,
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to send verification email.";
      setVerificationEmailMessage(message);
    } finally {
      setIsSendingVerificationEmail(false);
    }
  }

  function removeTechnicalSkill(indexToRemove: number) {
    setSkills((prev) => ({
      ...prev,
      technical: prev.technical
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .filter((_, index) => index !== indexToRemove)
        .join(", "),
    }));
  }

  function nextStep() {
    if (currentStep === 1 && !isEmailVerified) {
      setShowEmailVerificationBox(true);
      setVerificationEmailMessage(
        "Please verify your email using the link sent to your inbox before continuing.",
      );
      return;
    }

    if (
      currentStep === 1 &&
      !isPersonalStepComplete(personalDetails, requiresVisa)
    ) {
      setPersonalRequiredStarted((prev) => {
        const next = { ...prev };
        for (const key of personalRequiredKeys) {
          next[key] = true;
        }
        return next;
      });
      return;
    }

    if (currentStep === 2 && !isEducationStepComplete(education)) {
      const fieldKeys = [
        "education.highSchool.startDate",
        "education.highSchool.endDate",
        "education.highSchool.track",
        "education.highSchool.country",
      ];

      if (!education.diploma.notApplicable) {
        fieldKeys.push(
          "education.diploma.duration",
          "education.diploma.hasTraining",
          "education.diploma.startDate",
          "education.diploma.endDate",
          "education.diploma.field",
          "education.diploma.country",
        );
      } else {
        fieldKeys.push(
          "education.bachelors.startDate",
          "education.bachelors.endDate",
          "education.bachelors.field",
          "education.bachelors.country",
        );
      }

      markRequiredFields(fieldKeys);
      return;
    }

    if (currentStep === 5 && !isSkillsStepComplete(skills)) {
      markRequiredFields(["skills.technical"]);
      return;
    }

    setCurrentStep((s) => {
      const next = Math.min(8, s + 1);
      if (next === 8) setHasReachedReview(true);
      return next;
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function prevStep() {
    setCurrentStep((s) => Math.max(1, s - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function jumpToStep(step: number) {
    if (step === 8) setHasReachedReview(true);
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const workRows = workExperience.filter(
    (entry) => entry.experienceType === "work",
  );
  const internshipRows = workExperience.filter(
    (entry) => entry.experienceType === "internship",
  );

  function updateWorkRows(rows: Experience[]) {
    setWorkExperience([...rows, ...internshipRows]);
  }

  function updateInternshipRows(rows: Experience[]) {
    setWorkExperience([...workRows, ...rows]);
  }

  return (
    <div className="network-grid relative z-20 px-4 pb-5 pt-28 sm:px-6 lg:px-8 lg:pt-32">
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
                    const isCurrent = index === currentStep - 1;
                    const isDone = index < currentStep - 1;
                    const isLast = index === stages.length - 1;

                    return (
                      <li
                        key={stage}
                        className={`relative isolate flex h-18 w-full min-w-0 items-center justify-center overflow-hidden px-4 py-3 text-center transition-colors duration-300 ease-out motion-reduce:transition-none lg:-ml-3 lg:first:ml-0 ${
                          isCurrent
                            ? "border border-[#f4dfb2]/70 bg-linear-to-br from-[#f8eabf] via-[#d4af37] to-[#b8860b] text-[#111111] shadow-[0_0_30px_rgba(212,175,55,0.3)]"
                            : isDone
                              ? "border border-[#3b7240]/30 bg-[#122016] text-[#d8eedb]"
                              : "border border-white/10 bg-[#151515] text-slate-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                        }`}
                        aria-current={isCurrent ? "step" : undefined}
                        style={{
                          clipPath: isCurrent
                            ? "polygon(0px 0px, calc(100% - 1.1rem) 0px, 100% 50%, calc(100% - 1.1rem) 100%, 0px 100%, 0.9rem 50%)"
                            : isLast
                              ? "polygon(1.1rem 0px, 100% 0px, 100% 100%, 1.1rem 100%, 0px 50%)"
                              : "polygon(1.1rem 0px, calc(100% - 1.1rem) 0px, 100% 50%, calc(100% - 1.1rem) 100%, 1.1rem 100%, 0px 50%)",
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            if (!hasReachedReview) return;
                            jumpToStep(index + 1);
                          }}
                          disabled={!hasReachedReview}
                          className={`relative z-10 flex min-h-14 w-full flex-col items-center justify-center gap-1 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37]/60 ${
                            hasReachedReview
                              ? "cursor-pointer"
                              : "cursor-not-allowed"
                          }`}
                          aria-label={`Go to ${stage} section`}
                        >
                          <span
                            className={`flex h-6 w-6 items-center justify-center rounded-full border text-[13px] font-semibold ${
                              isCurrent
                                ? "border-[#111111]/10 bg-white text-[#111111]"
                                : "border-white/10 bg-white/5 text-slate-400"
                            }`}
                          >
                            {index + 1}
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
                        </button>
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
                Complete all sections carefully. Precision in your profile
                supports faster evaluation.
              </p>

              {currentStep === 1 && (
                <div className="grid gap-3 md:grid-cols-2">
                  <Field
                    label="First Name as per passport"
                    required
                    error={getPersonalRequiredError(
                      "firstName",
                      personalDetails.firstName,
                      "First name is required.",
                    )}
                    value={personalDetails.firstName}
                    onChange={(value) => {
                      markPersonalRequiredStarted("firstName", value);
                      setPersonalDetails((prev) => ({
                        ...prev,
                        firstName: value,
                      }));
                    }}
                  />
                  <Field
                    label="Middle Name (optional)"
                    value={personalDetails.middleName}
                    onChange={(value) =>
                      setPersonalDetails((prev) => ({
                        ...prev,
                        middleName: value,
                      }))
                    }
                  />
                  <Field
                    label="Last Name as per passport"
                    required
                    error={getPersonalRequiredError(
                      "lastName",
                      personalDetails.lastName,
                      "Last name is required.",
                    )}
                    value={personalDetails.lastName}
                    onChange={(value) => {
                      markPersonalRequiredStarted("lastName", value);
                      setPersonalDetails((prev) => ({
                        ...prev,
                        lastName: value,
                      }));
                    }}
                  />
                  <Field
                    label="Mobile Number"
                    required
                    placeholder="98765 43210"
                    error={getPersonalRequiredError(
                      "mobile",
                      personalDetails.mobile,
                      "Mobile number is required.",
                    )}
                    value={personalDetails.mobile}
                    inputMode="numeric"
                    maxLength={15}
                    onChange={(value) => {
                      markPersonalRequiredStarted("mobile", value);
                      setPersonalDetails((prev) => ({
                        ...prev,
                        mobile: value,
                      }));
                    }}
                  />
                  <div className="grid gap-3 md:col-span-2 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
                    <label className="block">
                      <span className="mb-1.5 block text-sm font-medium text-[#d3d3d8]">
                        Email Address
                        <span className="ml-1 text-rose-600">*</span>
                      </span>
                      <span className="relative block">
                        <input
                          className={`w-full rounded-lg border bg-[rgba(255,255,255,0.035)] px-3 py-2.5 text-sm text-[#f7f3ea] outline-none transition placeholder:text-[#8f8f96] ${
                            getPersonalRequiredError(
                              "email",
                              personalDetails.email,
                              "Email address is required.",
                            )
                              ? "border-rose-600 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                              : "border-[rgba(200,169,107,0.22)] focus:border-[#c8a96b] focus:ring-2 focus:ring-[#c8a96b]/20"
                          }`}
                          required
                          type="email"
                          placeholder="you@example.com"
                          value={personalDetails.email}
                          onChange={(e) => {
                            markPersonalRequiredStarted(
                              "email",
                              e.target.value,
                            );
                            setPersonalDetails((prev) => ({
                              ...prev,
                              email: e.target.value,
                            }));
                          }}
                        />
                      </span>
                      {getPersonalRequiredError(
                        "email",
                        personalDetails.email,
                        "Email address is required.",
                      ) && (
                        <span className="mt-1 block text-sm text-rose-500">
                          Email address is required.
                        </span>
                      )}
                    </label>
                    <button
                      className="cursor-pointer rounded-xl px-4 py-2.5 text-sm font-semibold shadow-sm transition duration-200 bg-[#c8a96b] text-black border border-[#c8a96b] hover:-translate-y-0.5 hover:bg-[#d4b87e] hover:border-[#d4b87e] hover:shadow-[0_0_24px_rgba(200,169,107,0.3)] w-full whitespace-nowrap md:w-auto"
                      type="button"
                      onClick={handleVerifyEmail}
                      disabled={isSendingVerificationEmail || isEmailVerified}
                    >
                      {isEmailVerified
                        ? "Verified"
                        : isSendingVerificationEmail
                          ? "Sending..."
                          : "Verify Email"}
                    </button>
                  </div>
                  <Field
                    label="Date of Birth (MM/DD/YYYY)"
                    required
                    error={getPersonalRequiredError(
                      "dateOfBirth",
                      personalDetails.dateOfBirth,
                      "Date of birth is required.",
                    )}
                    value={personalDetails.dateOfBirth}
                    onChange={(value) => {
                      markPersonalRequiredStarted("dateOfBirth", value);
                      setPersonalDetails((prev) => ({
                        ...prev,
                        dateOfBirth: value,
                      }));
                    }}
                    placeholder="MM/DD/YYYY"
                    withCalendarIcon
                  />
                  <TypeaheadField
                    label="Country of Birth"
                    required
                    error={getPersonalRequiredError(
                      "countryOfBirth",
                      personalDetails.countryOfBirth,
                      "Country of birth is required.",
                    )}
                    options={countryOptions}
                    value={personalDetails.countryOfBirth}
                    onChange={(value) => {
                      markPersonalRequiredStarted("countryOfBirth", value);
                      setPersonalDetails((prev) => ({
                        ...prev,
                        countryOfBirth: value,
                      }));
                    }}
                  />
                  <TypeaheadField
                    label="Citizenship"
                    required
                    error={getPersonalRequiredError(
                      "citizenship",
                      personalDetails.citizenship,
                      "Citizenship is required.",
                    )}
                    options={countryOptions}
                    value={personalDetails.citizenship}
                    onChange={(value) => {
                      markPersonalRequiredStarted("citizenship", value);
                      setPersonalDetails((prev) => ({
                        ...prev,
                        citizenship: value,
                      }));
                    }}
                  />
                  <TypeaheadField
                    label="Current Country of Residence"
                    required
                    error={getPersonalRequiredError(
                      "currentCountryOfResidence",
                      personalDetails.currentCountryOfResidence,
                      "Current country of residence is required.",
                    )}
                    options={countryOptions}
                    value={personalDetails.currentCountryOfResidence}
                    onChange={(value) => {
                      markPersonalRequiredStarted(
                        "currentCountryOfResidence",
                        value,
                      );
                      setPersonalDetails((prev) => ({
                        ...prev,
                        currentCountryOfResidence: value,
                      }));
                    }}
                  />
                  {requiresVisa && (
                    <SelectField
                      label="Current Visa Status"
                      required
                      error={getPersonalRequiredError(
                        "currentVisaStatus",
                        personalDetails.currentVisaStatus,
                        "Current visa status is required.",
                      )}
                      options={["Applied", "Approved", "Rejected"]}
                      value={personalDetails.currentVisaStatus}
                      onChange={(value) => {
                        markPersonalRequiredStarted("currentVisaStatus", value);
                        setPersonalDetails((prev) => ({
                          ...prev,
                          currentVisaStatus: value,
                        }));
                      }}
                    />
                  )}
                  {showEmailVerificationBox && (
                    <div className="md:col-span-2 rounded-xl border border-[rgba(200,169,107,0.16)] bg-[rgba(255,255,255,0.04)] p-4">
                      <div className="rounded-lg border border-[rgba(200,169,107,0.18)] bg-[rgba(200,169,107,0.06)] px-4 py-3 text-sm text-[#e9eaef]">
                        <p className="font-semibold text-[#f4dfb2]">
                          {isEmailVerified
                            ? "Email verified"
                            : "Verification email sent"}
                        </p>
                        <p className="mt-1 leading-6 text-[#d3d3d8]">
                          {verificationEmailMessage ||
                            "Verification email sent. Open the link in your inbox to verify your email."}
                        </p>
                      </div>

                      {!isEmailVerified && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          <button
                            className="cursor-pointer rounded-xl px-4 py-2.5 text-sm font-semibold shadow-sm transition duration-200 bg-transparent text-[#c8a96b] border border-[rgba(200,169,107,0.26)] hover:-translate-y-0.5 hover:bg-[rgba(200,169,107,0.1)]"
                            type="button"
                            onClick={handleVerifyEmail}
                            disabled={isSendingVerificationEmail}
                          >
                            Resend Link
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-5">
                  <div className="grid gap-3 md:grid-cols-2">
                    <Field
                      label="High School Start (MM/YYYY)"
                      required
                      error={getRequiredError(
                        "education.highSchool.startDate",
                        education.highSchool.startDate,
                        "High school start is required.",
                      )}
                      placeholder="MM/YYYY"
                      maxLength={7}
                      inputMode="numeric"
                      value={education.highSchool.startDate}
                      onChange={(value) => {
                        markRequiredStarted(
                          "education.highSchool.startDate",
                          value,
                        );
                        setEducation((prev) => ({
                          ...prev,
                          highSchool: { ...prev.highSchool, startDate: value },
                        }));
                      }}
                    />
                    <Field
                      label="High School End (MM/YYYY)"
                      required
                      error={getRequiredError(
                        "education.highSchool.endDate",
                        education.highSchool.endDate,
                        "High school end is required.",
                      )}
                      placeholder="MM/YYYY"
                      maxLength={7}
                      inputMode="numeric"
                      value={education.highSchool.endDate}
                      onChange={(value) => {
                        markRequiredStarted(
                          "education.highSchool.endDate",
                          value,
                        );
                        setEducation((prev) => ({
                          ...prev,
                          highSchool: { ...prev.highSchool, endDate: value },
                        }));
                      }}
                    />
                    <SelectField
                      label="Academic Track"
                      required
                      error={getRequiredError(
                        "education.highSchool.track",
                        education.highSchool.track,
                        "Academic track is required.",
                      )}
                      options={["Science", "Commerce", "Arts", "Other"]}
                      value={education.highSchool.track}
                      onChange={(value) => {
                        markRequiredStarted(
                          "education.highSchool.track",
                          value,
                        );
                        setEducation((prev) => ({
                          ...prev,
                          highSchool: { ...prev.highSchool, track: value },
                        }));
                      }}
                    />
                    <Field
                      label="High School Country"
                      required
                      error={getRequiredError(
                        "education.highSchool.country",
                        education.highSchool.country,
                        "High school country is required.",
                      )}
                      value={education.highSchool.country}
                      onChange={(value) => {
                        markRequiredStarted(
                          "education.highSchool.country",
                          value,
                        );
                        setEducation((prev) => ({
                          ...prev,
                          highSchool: { ...prev.highSchool, country: value },
                        }));
                      }}
                    />
                  </div>

                  <div className="rounded-xl border border-[rgba(200,169,107,0.22)] p-3">
                    <label className="flex items-center gap-2 text-sm text-[#d1d2d7]">
                      <input
                        type="checkbox"
                        checked={education.diploma.notApplicable}
                        onChange={(e) =>
                          setEducation((prev) => ({
                            ...prev,
                            diploma: {
                              ...prev.diploma,
                              notApplicable: e.target.checked,
                            },
                          }))
                        }
                      />
                      Diploma Not Applicable
                    </label>
                    {!education.diploma.notApplicable && (
                      <div className="mt-3 grid gap-3 md:grid-cols-2">
                        <SelectField
                          label="Diploma Duration"
                          required
                          error={getRequiredError(
                            "education.diploma.duration",
                            education.diploma.duration,
                            "Diploma duration is required.",
                          )}
                          options={["3-Year Diploma", "Other"]}
                          value={education.diploma.duration}
                          onChange={(value) => {
                            markRequiredStarted(
                              "education.diploma.duration",
                              value,
                            );
                            setEducation((prev) => ({
                              ...prev,
                              diploma: { ...prev.diploma, duration: value },
                            }));
                          }}
                        />
                        <SelectField
                          label="Includes 1-year training"
                          required
                          error={getRequiredError(
                            "education.diploma.hasTraining",
                            education.diploma.hasTraining,
                            "Training selection is required.",
                          )}
                          options={["Yes", "No"]}
                          value={education.diploma.hasTraining}
                          onChange={(value) => {
                            markRequiredStarted(
                              "education.diploma.hasTraining",
                              value,
                            );
                            setEducation((prev) => ({
                              ...prev,
                              diploma: { ...prev.diploma, hasTraining: value },
                            }));
                          }}
                        />
                        <Field
                          label="Diploma Start (MM/YYYY)"
                          required
                          error={getRequiredError(
                            "education.diploma.startDate",
                            education.diploma.startDate,
                            "Diploma start is required.",
                          )}
                          placeholder="MM/YYYY"
                          maxLength={7}
                          inputMode="numeric"
                          value={education.diploma.startDate}
                          onChange={(value) => {
                            markRequiredStarted(
                              "education.diploma.startDate",
                              value,
                            );
                            setEducation((prev) => ({
                              ...prev,
                              diploma: { ...prev.diploma, startDate: value },
                            }));
                          }}
                        />
                        <Field
                          label="Diploma End (MM/YYYY)"
                          required
                          error={getRequiredError(
                            "education.diploma.endDate",
                            education.diploma.endDate,
                            "Diploma end is required.",
                          )}
                          placeholder="MM/YYYY"
                          maxLength={7}
                          inputMode="numeric"
                          value={education.diploma.endDate}
                          onChange={(value) => {
                            markRequiredStarted(
                              "education.diploma.endDate",
                              value,
                            );
                            setEducation((prev) => ({
                              ...prev,
                              diploma: { ...prev.diploma, endDate: value },
                            }));
                          }}
                        />
                        <Field
                          label="Diploma Field of Study"
                          required
                          error={getRequiredError(
                            "education.diploma.field",
                            education.diploma.field,
                            "Diploma field is required.",
                          )}
                          value={education.diploma.field}
                          onChange={(value) => {
                            markRequiredStarted(
                              "education.diploma.field",
                              value,
                            );
                            setEducation((prev) => ({
                              ...prev,
                              diploma: { ...prev.diploma, field: value },
                            }));
                          }}
                        />
                        <Field
                          label="Diploma Country"
                          required
                          error={getRequiredError(
                            "education.diploma.country",
                            education.diploma.country,
                            "Diploma country is required.",
                          )}
                          value={education.diploma.country}
                          onChange={(value) => {
                            markRequiredStarted(
                              "education.diploma.country",
                              value,
                            );
                            setEducation((prev) => ({
                              ...prev,
                              diploma: { ...prev.diploma, country: value },
                            }));
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="rounded-xl border border-[rgba(200,169,107,0.22)] p-3">
                    <h3 className="font-semibold text-white">
                      Bachelor&apos;s
                    </h3>
                    <div className="mt-3 grid gap-3 md:grid-cols-2">
                      <Field
                        required={education.diploma.notApplicable}
                        error={
                          education.diploma.notApplicable
                            ? getRequiredError(
                                "education.bachelors.startDate",
                                education.bachelors.startDate,
                                "Bachelor's start is required.",
                              )
                            : undefined
                        }
                        label="Bachelor's Start (MM/YYYY)"
                        placeholder="MM/YYYY"
                        maxLength={7}
                        inputMode="numeric"
                        value={education.bachelors.startDate}
                        onChange={(value) => {
                          markRequiredStarted(
                            "education.bachelors.startDate",
                            value,
                          );
                          setEducation((prev) => ({
                            ...prev,
                            bachelors: { ...prev.bachelors, startDate: value },
                          }));
                        }}
                      />
                      <Field
                        required={education.diploma.notApplicable}
                        error={
                          education.diploma.notApplicable
                            ? getRequiredError(
                                "education.bachelors.endDate",
                                education.bachelors.endDate,
                                "Bachelor's end is required.",
                              )
                            : undefined
                        }
                        label="Bachelor's End (MM/YYYY)"
                        placeholder="MM/YYYY"
                        maxLength={7}
                        inputMode="numeric"
                        value={education.bachelors.endDate}
                        onChange={(value) => {
                          markRequiredStarted(
                            "education.bachelors.endDate",
                            value,
                          );
                          setEducation((prev) => ({
                            ...prev,
                            bachelors: { ...prev.bachelors, endDate: value },
                          }));
                        }}
                      />
                      <Field
                        required={education.diploma.notApplicable}
                        error={
                          education.diploma.notApplicable
                            ? getRequiredError(
                                "education.bachelors.field",
                                education.bachelors.field,
                                "Bachelor's field is required.",
                              )
                            : undefined
                        }
                        label="Bachelor's Field of Study"
                        value={education.bachelors.field}
                        onChange={(value) => {
                          markRequiredStarted(
                            "education.bachelors.field",
                            value,
                          );
                          setEducation((prev) => ({
                            ...prev,
                            bachelors: { ...prev.bachelors, field: value },
                          }));
                        }}
                      />
                      <Field
                        required={education.diploma.notApplicable}
                        error={
                          education.diploma.notApplicable
                            ? getRequiredError(
                                "education.bachelors.country",
                                education.bachelors.country,
                                "Bachelor's country is required.",
                              )
                            : undefined
                        }
                        label="Bachelor's Country"
                        value={education.bachelors.country}
                        onChange={(value) => {
                          markRequiredStarted(
                            "education.bachelors.country",
                            value,
                          );
                          setEducation((prev) => ({
                            ...prev,
                            bachelors: { ...prev.bachelors, country: value },
                          }));
                        }}
                      />
                    </div>
                  </div>

                  <div className="rounded-xl border border-[rgba(200,169,107,0.22)] p-3">
                    <label className="flex items-center gap-2 text-sm text-[#d1d2d7]">
                      <input
                        type="checkbox"
                        checked={education.masters.notApplicable}
                        onChange={(e) =>
                          setEducation((prev) => ({
                            ...prev,
                            masters: {
                              ...prev.masters,
                              notApplicable: e.target.checked,
                            },
                          }))
                        }
                      />
                      Master&apos;s Not Applicable
                    </label>
                    {!education.masters.notApplicable && (
                      <div className="mt-3 grid gap-3 md:grid-cols-2">
                        <Field
                          label="Master's Start (MM/YYYY)"
                          placeholder="MM/YYYY"
                          maxLength={7}
                          inputMode="numeric"
                          value={education.masters.startDate}
                          onChange={(value) =>
                            setEducation((prev) => ({
                              ...prev,
                              masters: { ...prev.masters, startDate: value },
                            }))
                          }
                        />
                        <Field
                          label="Master's End (MM/YYYY)"
                          placeholder="MM/YYYY"
                          maxLength={7}
                          inputMode="numeric"
                          value={education.masters.endDate}
                          onChange={(value) =>
                            setEducation((prev) => ({
                              ...prev,
                              masters: { ...prev.masters, endDate: value },
                            }))
                          }
                        />
                        <Field
                          label="Master's Field of Study"
                          value={education.masters.field}
                          onChange={(value) =>
                            setEducation((prev) => ({
                              ...prev,
                              masters: { ...prev.masters, field: value },
                            }))
                          }
                        />
                        <Field
                          label="Master's Country"
                          value={education.masters.country}
                          onChange={(value) =>
                            setEducation((prev) => ({
                              ...prev,
                              masters: { ...prev.masters, country: value },
                            }))
                          }
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="font-semibold text-white">
                      Additional Qualifications{" "}
                    </h3>
                    {education.additionalQualifications.map((entry, index) => (
                      <div
                        key={`qualification-${index}`}
                        className="relative mt-3 grid gap-3 rounded-xl border border-[rgba(200,169,107,0.22)] p-3 md:grid-cols-2"
                      >
                        {index > 0 && (
                          <button
                            type="button"
                            className="absolute right-2 top-2 rounded-full px-2 py-0.5 text-sm font-bold text-rose-500 hover:bg-rose-950/30"
                            onClick={() =>
                              setEducation((prev) => ({
                                ...prev,
                                additionalQualifications:
                                  prev.additionalQualifications.filter(
                                    (_, i) => i !== index,
                                  ),
                              }))
                            }
                            aria-label="Remove qualification"
                          >
                            x
                          </button>
                        )}
                        <Field
                          label="Qualification Name"
                          value={entry.qualificationName}
                          onChange={(value) => {
                            const next = [
                              ...education.additionalQualifications,
                            ];
                            next[index] = {
                              ...next[index],
                              qualificationName: value,
                            };
                            setEducation((prev) => ({
                              ...prev,
                              additionalQualifications: next,
                            }));
                          }}
                        />
                        <Field
                          label="Field"
                          value={entry.field}
                          onChange={(value) => {
                            const next = [
                              ...education.additionalQualifications,
                            ];
                            next[index] = { ...next[index], field: value };
                            setEducation((prev) => ({
                              ...prev,
                              additionalQualifications: next,
                            }));
                          }}
                        />
                        <Field
                          label="Start (MM/YYYY)"
                          maxLength={7}
                          inputMode="numeric"
                          value={entry.startDate}
                          onChange={(value) => {
                            const next = [
                              ...education.additionalQualifications,
                            ];
                            next[index] = { ...next[index], startDate: value };
                            setEducation((prev) => ({
                              ...prev,
                              additionalQualifications: next,
                            }));
                          }}
                        />
                        <Field
                          label="End (MM/YYYY)"
                          maxLength={7}
                          inputMode="numeric"
                          value={entry.endDate}
                          onChange={(value) => {
                            const next = [
                              ...education.additionalQualifications,
                            ];
                            next[index] = { ...next[index], endDate: value };
                            setEducation((prev) => ({
                              ...prev,
                              additionalQualifications: next,
                            }));
                          }}
                        />
                      </div>
                    ))}
                    <button
                      type="button"
                      className="mt-3 rounded-lg border border-[rgba(200,169,107,0.4)] px-4 py-2 text-sm font-semibold text-[#f4dfb2] transition hover:bg-[rgba(200,169,107,0.15)]"
                      onClick={() => {
                        if (education.additionalQualifications.length >= 3)
                          return;
                        setEducation((prev) => ({
                          ...prev,
                          additionalQualifications: [
                            ...prev.additionalQualifications,
                            newQualification(),
                          ],
                        }));
                      }}
                    >
                      Add Qualification
                    </button>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div>
                  <h3 className="font-semibold text-white">Certifications</h3>
                  {certifications.map((entry, index) => (
                    <div
                      key={`certification-${index}`}
                      className="relative mt-3 grid gap-3 rounded-xl border border-[rgba(200,169,107,0.22)] p-3 md:grid-cols-3"
                    >
                      {index > 0 && (
                        <button
                          type="button"
                          className="absolute right-2 top-2 rounded-full px-2 py-0.5 text-sm font-bold text-rose-500 hover:bg-rose-950/30"
                          onClick={() =>
                            setCertifications((prev) =>
                              prev.filter((_, i) => i !== index),
                            )
                          }
                          aria-label="Remove certification"
                        >
                          x
                        </button>
                      )}
                      <Field
                        label="Certification Name"
                        value={entry.certificationName}
                        onChange={(value) => {
                          const next = [...certifications];
                          next[index] = {
                            ...next[index],
                            certificationName: value,
                          };
                          setCertifications(next);
                        }}
                      />
                      <Field
                        label="Issuing Organization / Platform"
                        value={entry.issuingOrganization}
                        onChange={(value) => {
                          const next = [...certifications];
                          next[index] = {
                            ...next[index],
                            issuingOrganization: value,
                          };
                          setCertifications(next);
                        }}
                      />
                      <Field
                        label="Year Completed"
                        placeholder="YYYY"
                        maxLength={4}
                        inputMode="numeric"
                        value={entry.yearCompleted}
                        onChange={(value) => {
                          const next = [...certifications];
                          next[index] = {
                            ...next[index],
                            yearCompleted: value.replace(/\D/g, "").slice(0, 4),
                          };
                          setCertifications(next);
                        }}
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    className="mt-3 rounded-lg border border-[rgba(200,169,107,0.4)] px-4 py-2 text-sm font-semibold text-[#f4dfb2] transition hover:bg-[rgba(200,169,107,0.15)]"
                    onClick={() => {
                      if (certifications.length >= 10) return;
                      setCertifications((prev) => [
                        ...prev,
                        newCertification(),
                      ]);
                    }}
                  >
                    Add Certification
                  </button>
                </div>
              )}

              {currentStep === 4 && (
                <div>
                  <h3 className="font-semibold text-white">Work Experience</h3>
                  {workRows.map((entry, index) => (
                    <div
                      key={`work-${index}`}
                      className="relative mt-3 grid gap-3 rounded-xl border border-[rgba(200,169,107,0.22)] p-3 md:grid-cols-2"
                    >
                      {index > 0 && (
                        <button
                          type="button"
                          className="absolute right-2 top-2 rounded-full px-2 py-0.5 text-sm font-bold text-rose-500 hover:bg-rose-950/30"
                          onClick={() =>
                            updateWorkRows(
                              workRows.filter((_, i) => i !== index),
                            )
                          }
                          aria-label="Remove experience"
                        >
                          x
                        </button>
                      )}
                      <Field
                        label="Organization Name"
                        value={entry.organizationName}
                        onChange={(value) => {
                          const next = [...workRows];
                          next[index] = {
                            ...next[index],
                            organizationName: value,
                          };
                          updateWorkRows(next);
                        }}
                      />
                      <Field
                        label="Job Title"
                        value={entry.jobTitle}
                        onChange={(value) => {
                          const next = [...workRows];
                          next[index] = { ...next[index], jobTitle: value };
                          updateWorkRows(next);
                        }}
                      />
                      <Field
                        label="Key Responsibilities"
                        value={entry.responsibilities}
                        onChange={(value) => {
                          const next = [...workRows];
                          next[index] = {
                            ...next[index],
                            responsibilities: value,
                          };
                          updateWorkRows(next);
                        }}
                      />
                      <Field
                        label="Country"
                        value={entry.country}
                        onChange={(value) => {
                          const next = [...workRows];
                          next[index] = { ...next[index], country: value };
                          updateWorkRows(next);
                        }}
                      />
                      <Field
                        label="Start Date (MM/YYYY)"
                        maxLength={7}
                        inputMode="numeric"
                        value={entry.startDate}
                        onChange={(value) => {
                          const next = [...workRows];
                          next[index] = { ...next[index], startDate: value };
                          updateWorkRows(next);
                        }}
                      />
                      {!entry.currentlyWorkingHere && (
                        <Field
                          label="End Date (MM/YYYY)"
                          maxLength={7}
                          inputMode="numeric"
                          value={entry.endDate}
                          onChange={(value) => {
                            const next = [...workRows];
                            next[index] = { ...next[index], endDate: value };
                            updateWorkRows(next);
                          }}
                        />
                      )}
                      <label className="flex items-center gap-2 text-sm text-[#d1d2d7]">
                        <input
                          type="checkbox"
                          checked={entry.currentlyWorkingHere}
                          onChange={(e) => {
                            const next = [...workRows];
                            next[index] = {
                              ...next[index],
                              currentlyWorkingHere: e.target.checked,
                              endDate: e.target.checked
                                ? ""
                                : next[index].endDate,
                            };
                            updateWorkRows(next);
                          }}
                        />
                        Currently Working Here
                      </label>
                    </div>
                  ))}

                  <button
                    type="button"
                    className="mt-3 rounded-lg border border-[rgba(200,169,107,0.4)] px-4 py-2 text-sm font-semibold text-[#f4dfb2] transition hover:bg-[rgba(200,169,107,0.15)]"
                    onClick={() => {
                      if (workRows.length >= 10) return;
                      setWorkExperience((prev) => [
                        ...prev,
                        newExperience("work"),
                      ]);
                    }}
                  >
                    Add Experience
                  </button>

                  <h3 className="mt-6 font-semibold text-white">Internships</h3>
                  {internshipRows.map((entry, index) => (
                    <div
                      key={`internship-${index}`}
                      className="relative mt-3 grid gap-3 rounded-xl border border-[rgba(200,169,107,0.22)] p-3 md:grid-cols-2"
                    >
                      {index > 0 && (
                        <button
                          type="button"
                          className="absolute right-2 top-2 rounded-full px-2 py-0.5 text-sm font-bold text-rose-500 hover:bg-rose-950/30"
                          onClick={() =>
                            updateInternshipRows(
                              internshipRows.filter((_, i) => i !== index),
                            )
                          }
                          aria-label="Remove internship"
                        >
                          x
                        </button>
                      )}
                      <Field
                        label="Organization Name"
                        value={entry.organizationName}
                        onChange={(value) => {
                          const next = [...internshipRows];
                          next[index] = {
                            ...next[index],
                            organizationName: value,
                          };
                          updateInternshipRows(next);
                        }}
                      />
                      <Field
                        label="Job Title"
                        value={entry.jobTitle}
                        onChange={(value) => {
                          const next = [...internshipRows];
                          next[index] = { ...next[index], jobTitle: value };
                          updateInternshipRows(next);
                        }}
                      />
                      <Field
                        label="Key Responsibilities"
                        value={entry.responsibilities}
                        onChange={(value) => {
                          const next = [...internshipRows];
                          next[index] = {
                            ...next[index],
                            responsibilities: value,
                          };
                          updateInternshipRows(next);
                        }}
                      />
                      <Field
                        label="Country"
                        value={entry.country}
                        onChange={(value) => {
                          const next = [...internshipRows];
                          next[index] = { ...next[index], country: value };
                          updateInternshipRows(next);
                        }}
                      />
                      <Field
                        label="Start Date (MM/YYYY)"
                        maxLength={7}
                        inputMode="numeric"
                        value={entry.startDate}
                        onChange={(value) => {
                          const next = [...internshipRows];
                          next[index] = { ...next[index], startDate: value };
                          updateInternshipRows(next);
                        }}
                      />
                      {!entry.currentlyWorkingHere && (
                        <Field
                          label="End Date (MM/YYYY)"
                          maxLength={7}
                          inputMode="numeric"
                          value={entry.endDate}
                          onChange={(value) => {
                            const next = [...internshipRows];
                            next[index] = { ...next[index], endDate: value };
                            updateInternshipRows(next);
                          }}
                        />
                      )}
                      <label className="flex items-center gap-2 text-sm text-[#d1d2d7]">
                        <input
                          type="checkbox"
                          checked={entry.currentlyWorkingHere}
                          onChange={(e) => {
                            const next = [...internshipRows];
                            next[index] = {
                              ...next[index],
                              currentlyWorkingHere: e.target.checked,
                              endDate: e.target.checked
                                ? ""
                                : next[index].endDate,
                            };
                            updateInternshipRows(next);
                          }}
                        />
                        Currently Working Here
                      </label>
                    </div>
                  ))}

                  <button
                    type="button"
                    className="mt-3 rounded-lg border border-[rgba(200,169,107,0.4)] px-4 py-2 text-sm font-semibold text-[#f4dfb2] transition hover:bg-[rgba(200,169,107,0.15)]"
                    onClick={() => {
                      if (internshipRows.length >= 10) return;
                      setWorkExperience((prev) => [
                        ...prev,
                        newExperience("internship"),
                      ]);
                    }}
                  >
                    Add Internship
                  </button>
                </div>
              )}

              {currentStep === 5 && (
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-[#d3d3d8]">
                      Technical Skills<span className="text-rose-500">*</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        className={`w-full rounded-lg border bg-[rgba(255,255,255,0.035)] px-3 py-3 text-sm text-[#f7f3ea] outline-none transition placeholder:text-[#8f8f96] ${
                          getRequiredError(
                            "skills.technical",
                            skills.technical,
                            "At least one technical skill is required.",
                          )
                            ? "border-rose-600 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                            : "border-[rgba(200,169,107,0.22)] focus:border-[#c8a96b] focus:ring-2 focus:ring-[#c8a96b]/20"
                        }`}
                        value={technicalSkillInput}
                        onChange={(e) => {
                          markRequiredStarted(
                            "skills.technical",
                            e.target.value,
                          );
                          setTechnicalSkillInput(e.target.value);
                        }}
                        placeholder="Type a skill"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === "NumpadEnter") {
                            e.preventDefault();
                            addTechnicalSkill();
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={addTechnicalSkill}
                        className="rounded-lg border border-[#c8a96b] bg-[#c8a96b] px-4 text-sm font-semibold text-black"
                        aria-label="Add skill"
                      >
                        +
                      </button>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {technicalSkillList.map((skill, index) => (
                        <span
                          key={`${skill}-${index}`}
                          className="inline-flex items-center gap-2 rounded-full bg-[#d8c293] px-3 py-1 text-xs font-semibold text-black"
                        >
                          {skill}
                          <button
                            type="button"
                            className="text-black hover:text-rose-700"
                            onClick={() => removeTechnicalSkill(index)}
                            aria-label={`Remove ${skill}`}
                          >
                            x
                          </button>
                        </span>
                      ))}
                    </div>
                    {getRequiredError(
                      "skills.technical",
                      skills.technical,
                      "At least one technical skill is required.",
                    ) && (
                      <span className="mt-1 block text-sm text-rose-500">
                        At least one technical skill is required.
                      </span>
                    )}
                  </div>
                  <Field
                    label="Soft Skills"
                    value={skills.soft}
                    onChange={(value) =>
                      setSkills((prev) => ({ ...prev, soft: value }))
                    }
                  />
                </div>
              )}

              {currentStep === 6 && (
                <div>
                  {languages.map((entry, index) => {
                    const usedByOthers = languages
                      .filter((_, i) => i !== index)
                      .map((l) => l.language);
                    const available = languageOptions.filter(
                      (lang) =>
                        !usedByOthers.includes(lang) || lang === entry.language,
                    );

                    return (
                      <div
                        key={`language-${index}`}
                        className="relative mt-3 grid gap-3 rounded-xl border border-[rgba(200,169,107,0.22)] bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))] p-3 md:grid-cols-2"
                      >
                        {index > 0 && (
                          <button
                            type="button"
                            className="absolute right-2 top-2 rounded-full px-2 py-0.5 text-sm font-bold text-rose-500 hover:bg-rose-950/30"
                            onClick={() =>
                              setLanguages((prev) =>
                                prev.filter((_, i) => i !== index),
                              )
                            }
                            aria-label="Remove language"
                          >
                            x
                          </button>
                        )}
                        <SelectField
                          compact
                          error={getRequiredError(
                            `languages.${index}.language`,
                            entry.language,
                            "Language is required.",
                          )}
                          label="Language"
                          options={available}
                          value={entry.language}
                          onChange={(value) => {
                            markRequiredStarted(
                              `languages.${index}.language`,
                              value,
                            );
                            const next = [...languages];
                            next[index] = { ...next[index], language: value };
                            setLanguages(next);
                          }}
                        />
                        <SelectField
                          compact
                          error={getRequiredError(
                            `languages.${index}.proficiencyLevel`,
                            entry.proficiencyLevel,
                            "Proficiency level is required.",
                          )}
                          label="Proficiency Level"
                          options={["B1", "B2", "C1", "C2"]}
                          value={entry.proficiencyLevel}
                          onChange={(value) => {
                            markRequiredStarted(
                              `languages.${index}.proficiencyLevel`,
                              value,
                            );
                            const next = [...languages];
                            next[index] = {
                              ...next[index],
                              proficiencyLevel: value,
                            };
                            setLanguages(next);
                          }}
                        />
                      </div>
                    );
                  })}
                  {languages.length < languageOptions.length && (
                    <button
                      type="button"
                      className="mt-3 rounded-lg border border-[rgba(200,169,107,0.4)] px-4 py-2 text-sm font-semibold text-[#f4dfb2] transition hover:bg-[rgba(200,169,107,0.15)]"
                      onClick={() =>
                        setLanguages((prev) => [...prev, newLanguage()])
                      }
                    >
                      Add Language
                    </button>
                  )}
                </div>
              )}

              {currentStep === 7 && (
                <TextAreaField
                  label="Additional Information (max 1000 chars)"
                  value={additionalInfo}
                  maxLength={1000}
                  onChange={setAdditionalInfo}
                />
              )}

              {currentStep === 8 && (
                <div className="space-y-4 text-sm">
                  <ReviewCard title="Personal Details">
                    <ReviewItem
                      label="First Name"
                      value={personalDetails.firstName}
                    />
                    <ReviewItem
                      label="Middle Name"
                      value={personalDetails.middleName}
                    />
                    <ReviewItem
                      label="Last Name"
                      value={personalDetails.lastName}
                    />
                    <ReviewItem
                      label="Mobile Number"
                      value={personalDetails.mobile}
                    />
                    <ReviewItem
                      label="Email Address"
                      value={personalDetails.email}
                    />
                    <ReviewItem
                      label="Date of Birth"
                      value={personalDetails.dateOfBirth}
                    />
                    <ReviewItem
                      label="Country of Birth"
                      value={personalDetails.countryOfBirth}
                    />
                    <ReviewItem
                      label="Citizenship"
                      value={personalDetails.citizenship}
                    />
                    <ReviewItem
                      label="Current Country of Residence"
                      value={personalDetails.currentCountryOfResidence}
                    />
                    {requiresVisa && (
                      <ReviewItem
                        label="Current Visa Status"
                        value={personalDetails.currentVisaStatus}
                      />
                    )}
                  </ReviewCard>

                  <ReviewCard title="Education">
                    <ReviewItem
                      label="High School Start"
                      value={education.highSchool.startDate}
                    />
                    <ReviewItem
                      label="High School End"
                      value={education.highSchool.endDate}
                    />
                    <ReviewItem
                      label="Academic Track"
                      value={education.highSchool.track}
                    />
                    <ReviewItem
                      label="High School Country"
                      value={education.highSchool.country}
                    />
                  </ReviewCard>

                  <ReviewCard title="Certifications">
                    {certifications.map((entry, index) => (
                      <div
                        key={`review-cert-${index}`}
                        className="rounded-lg bg-[#141414] p-3"
                      >
                        <ReviewItem
                          label="Certification Name"
                          value={entry.certificationName}
                        />
                        <ReviewItem
                          label="Issuing Organization / Platform"
                          value={entry.issuingOrganization}
                        />
                        <ReviewItem
                          label="Year Completed"
                          value={entry.yearCompleted}
                        />
                      </div>
                    ))}
                  </ReviewCard>

                  <ReviewCard title="Work Experience">
                    {workExperience.map((entry, index) => (
                      <div
                        key={`review-work-${index}`}
                        className="rounded-lg bg-[#141414] p-3"
                      >
                        <p className="mb-2 text-xs uppercase tracking-wider text-[#d4af37]">
                          {entry.experienceType === "internship"
                            ? "Internship"
                            : "Work"}{" "}
                          {index + 1}
                        </p>
                        <ReviewItem
                          label="Organization Name"
                          value={entry.organizationName}
                        />
                        <ReviewItem label="Job Title" value={entry.jobTitle} />
                        <ReviewItem
                          label="Key Responsibilities"
                          value={entry.responsibilities}
                        />
                        <ReviewItem label="Country" value={entry.country} />
                        <ReviewItem
                          label="Start Date"
                          value={entry.startDate}
                        />
                        <ReviewItem
                          label="End Date"
                          value={
                            entry.currentlyWorkingHere
                              ? "Currently Working Here"
                              : entry.endDate
                          }
                        />
                      </div>
                    ))}
                  </ReviewCard>

                  <ReviewCard title="Skills">
                    <ReviewItem
                      label="Technical Skills"
                      value={skills.technical}
                    />
                    <ReviewItem label="Soft Skills" value={skills.soft} />
                  </ReviewCard>

                  <ReviewCard title="Languages">
                    {languages.map((entry, index) => (
                      <div
                        key={`review-language-${index}`}
                        className="rounded-lg bg-[#141414] p-3"
                      >
                        <ReviewItem label="Language" value={entry.language} />
                        <ReviewItem
                          label="Proficiency Level"
                          value={entry.proficiencyLevel}
                        />
                      </div>
                    ))}
                  </ReviewCard>

                  <ReviewCard title="Additional">
                    <ReviewItem
                      label="Additional Information"
                      value={additionalInfo}
                    />
                  </ReviewCard>
                </div>
              )}

              <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="w-full cursor-pointer rounded-xl border border-[rgba(200,169,107,0.35)] bg-black px-4 py-3 text-sm font-semibold text-[#eef0f5] transition duration-200 hover:-translate-y-0.5 hover:bg-[#16120a] disabled:cursor-not-allowed disabled:opacity-45 sm:w-auto"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={currentStep === 8}
                  className="w-full cursor-pointer rounded-xl border border-[#c8a96b] bg-[#c8a96b] px-4 py-3 text-sm font-semibold text-black shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[#d4b87e] hover:bg-[#d4b87e] hover:shadow-[0_0_26px_rgba(200,169,107,0.28)] disabled:cursor-not-allowed disabled:opacity-45 sm:min-w-44 sm:w-auto"
                >
                  {currentStep === 8 ? "Submit" : "Save & Continue"}
                </button>
              </div>
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

function ReviewCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-[rgba(200,169,107,0.22)] bg-[rgba(12,12,12,0.65)] p-4">
      <h3 className="mb-3 text-lg font-semibold text-white">{title}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function ReviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-[#101012] p-3">
      <p className="text-xs uppercase tracking-wider text-[#9fa1a8]">{label}</p>
      <p className="mt-1 text-sm font-medium text-[#f7f3ea]">
        {value || "Not provided"}
      </p>
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  required = false,
  error,
  compact = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  required?: boolean;
  error?: string;
  compact?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-[#d3d3d8]">
        {label}
        {required && <span className="ml-1 text-rose-500">*</span>}
      </span>
      <select
        className={`w-full appearance-none rounded-lg border bg-[rgba(255,255,255,0.035)] bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none'%3E%3Cpath d='M5 7.5L10 12.5L15 7.5' stroke='%23d4af37' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")] bg-size-[1rem_1rem] bg-position-[right_0.75rem_center] bg-no-repeat pl-3 pr-8 text-sm text-[#f7f3ea] outline-none transition ${
          compact ? "py-2.5" : "py-3"
        } ${
          error
            ? "border-rose-600 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
            : "border-[rgba(200,169,107,0.22)] focus:border-[#c8a96b] focus:ring-2 focus:ring-[#c8a96b]/20"
        }`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select</option>
        {options.map((option) => (
          <option
            key={option}
            value={option}
            className="bg-[#111] text-[#f7f3ea]"
          >
            {option}
          </option>
        ))}
      </select>
      {error && (
        <span className="mt-1 block text-sm text-rose-500">{error}</span>
      )}
    </label>
  );
}

function TypeaheadField({
  label,
  value,
  onChange,
  options,
  required = false,
  error,
  placeholder = "Search Country",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  required?: boolean;
  error?: string;
  placeholder?: string;
}) {
  const listId = useId();

  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-[#d3d3d8]">
        {label}
        {required && <span className="ml-1 text-rose-500">*</span>}
      </span>
      <input
        className={`w-full rounded-lg border bg-[rgba(255,255,255,0.035)] px-3 py-3 text-sm text-[#f7f3ea] outline-none transition placeholder:text-[#8f8f96] ${
          error
            ? "border-rose-600 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
            : "border-[rgba(200,169,107,0.22)] focus:border-[#c8a96b] focus:ring-2 focus:ring-[#c8a96b]/20"
        }`}
        list={listId}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
      <datalist id={listId}>
        {options.map((option) => (
          <option key={option} value={option} />
        ))}
      </datalist>
      {error && (
        <span className="mt-1 block text-sm text-rose-500">{error}</span>
      )}
    </label>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-[#d3d3d8]">
        {label}
      </span>
      <textarea
        className="min-h-34 w-full rounded-lg border border-[rgba(200,169,107,0.22)] bg-[rgba(255,255,255,0.035)] px-3 py-3 text-sm text-[#f7f3ea] outline-none transition placeholder:text-[#8f8f96] focus:border-[#c8a96b] focus:ring-2 focus:ring-[#c8a96b]/20"
        value={value}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

function Field({
  label,
  value,
  onChange,
  required = false,
  error,
  placeholder,
  type = "text",
  withCalendarIcon = false,
  maxLength,
  inputMode,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  error?: string;
  placeholder?: string;
  type?: "text" | "email";
  withCalendarIcon?: boolean;
  maxLength?: number;
  inputMode?: "text" | "numeric" | "email";
}) {
  const selectedDate = parseDateString(value);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [calendarOpenUpward, setCalendarOpenUpward] = useState(false);
  const [showMonthYearPicker, setShowMonthYearPicker] = useState(false);
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
  const monthOptions = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 121 }, (_, i) => currentYear - 100 + i);
  }, []);
  const today = new Date();

  function updateCalendarPlacement() {
    if (!wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
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
          className={`w-full rounded-lg border bg-[rgba(255,255,255,0.035)] px-3 py-3 text-sm text-[#f7f3ea] outline-none transition placeholder:text-[#8f8f96] ${
            error
              ? "border-rose-600 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
              : "border-[rgba(200,169,107,0.22)] focus:border-[#c8a96b] focus:ring-2 focus:ring-[#c8a96b]/20"
          } ${withCalendarIcon ? "pr-12" : ""}`}
          type={type}
          value={value}
          maxLength={maxLength}
          inputMode={inputMode}
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
                  setShowMonthYearPicker(false);
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
              <button
                type="button"
                className="rounded-md border border-[rgba(200,169,107,0.28)] px-2 py-1 text-sm font-semibold text-[#f4dfb2] transition hover:bg-[rgba(200,169,107,0.12)]"
                onClick={() => setShowMonthYearPicker((v) => !v)}
                aria-label="Choose month and year"
              >
                {monthLabel}
              </button>
              <button
                type="button"
                onClick={() => shiftMonth(1)}
                className="rounded-md border border-[rgba(200,169,107,0.28)] px-2 py-1 text-xs text-[#e6d0a1] transition hover:bg-[rgba(200,169,107,0.12)]"
                aria-label="Next month"
              >
                Next
              </button>
            </div>

            {showMonthYearPicker && (
              <div className="mb-3 grid grid-cols-2 gap-2">
                <select
                  className="rounded-md border border-[rgba(200,169,107,0.28)] bg-[rgba(13,13,14,0.98)] px-2 py-1 text-xs text-[#f4dfb2] outline-none transition focus:border-[#c8a96b]"
                  value={viewMonth.getMonth()}
                  onChange={(e) =>
                    setViewMonth(
                      new Date(
                        viewMonth.getFullYear(),
                        Number(e.target.value),
                        1,
                      ),
                    )
                  }
                  aria-label="Select month"
                >
                  {monthOptions.map((month, idx) => (
                    <option
                      key={month}
                      value={idx}
                      className="bg-[#111] text-[#f7f3ea]"
                    >
                      {month}
                    </option>
                  ))}
                </select>
                <select
                  className="rounded-md border border-[rgba(200,169,107,0.28)] bg-[rgba(13,13,14,0.98)] px-2 py-1 text-xs text-[#f4dfb2] outline-none transition focus:border-[#c8a96b]"
                  value={viewMonth.getFullYear()}
                  onChange={(e) =>
                    setViewMonth(
                      new Date(Number(e.target.value), viewMonth.getMonth(), 1),
                    )
                  }
                  aria-label="Select year"
                >
                  {yearOptions.map((year) => (
                    <option
                      key={year}
                      value={year}
                      className="bg-[#111] text-[#f7f3ea]"
                    >
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            )}

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
      {error && (
        <span className="mt-1 block text-sm text-rose-500">{error}</span>
      )}
    </label>
  );
}
