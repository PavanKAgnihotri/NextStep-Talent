import Image from "next/image";
import Link from "next/link";
import PremiumInfoCard from "@/components/PremiumInfoCard";

const initialEvaluationChecks = [
  "Your academic and professional background",
  "Your eligibility for international roles",
  "Your language proficiency and skill readiness",
  "Your alignment with current global requirements",
];

const stepIncludes = [
  "Initial profile assessment",
  "Eligibility screening aligned with current global requirements",
  "Basic gap analysis (skills, education, language)",
  "Direction on next steps within the process",
];

const importantInformation = [
  "Evaluation only - this is not a job application",
  "No guarantee of employment or placement",
  "Progression depends on meeting eligibility and external requirements",
  "Only shortlisted candidates will be invited to the next stage",
];

const whoThisIsFor = [
  "Are serious about international career opportunities",
  "Are open to relocation or global roles",
  "Meet basic educational qualifications",
  "Are willing to meet language or certification requirements where applicable",
];

const countryCriteria = [
  {
    country: "Germany",
    flag: "de",
    location: "N/A, but Open to Relocate to Germany",
    language: "B2 Certified or above in German",
  },
  {
    country: "Switzerland",
    flag: "ch",
    location: "Europe",
    language: "B2 Certified or above in German, French, or Italian",
  },
  {
    country: "Austria",
    flag: "at",
    location: "Europe",
    language: "B2 certified or above in German",
  },
  {
    country: "Poland",
    flag: "pl",
    location: "Europe",
    language:
      "Certified level of English; Certified German language proficiency is a plus",
  },
  {
    country: "Global Opportunities",
    flag: "globe",
    location: "NA",
    language: "Certified level of English proficiency",
  },
];

function CheckItem({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  return (
    <li
      className={`panel flex items-start gap-3 rounded-2xl border-[rgba(201,169,110,0.2)] px-4 py-3 text-sm leading-6 text-white/80 sm:text-base ${className}`}
    >
      <span className="mt-0.5 inline-flex h-6 w-6 flex-none items-center justify-center rounded-full border border-[rgba(201,169,110,0.45)] bg-[rgba(201,169,110,0.12)] text-[0.7rem] font-semibold text-(--accent-strong)">
        +
      </span>
      <span>{text}</span>
    </li>
  );
}

export default function EvaluationProgramPage() {
  return (
    <div className="network-grid relative overflow-hidden px-4 pb-20 pt-28 sm:px-6 lg:px-8 lg:pt-32">
      <div className="pointer-events-none absolute inset-x-0 top-6 h-72 bg-[radial-gradient(circle_at_center,rgba(201,169,110,0.12)_0%,rgba(201,169,110,0.05)_28%,transparent_68%)] blur-xl" />

      <section className="relative mx-auto max-w-7xl">
        <div className="panel relative overflow-hidden rounded-4xl p-7 sm:p-10 lg:p-14">
          <Image
            src="/world_map.jpeg"
            className="absolute inset-0 h-full w-full object-cover object-center opacity-[0.14]"
            alt=""
            fill
          />
          <div className="pointer-events-none absolute -right-10 top-10 h-56 w-56 rounded-full border border-[rgba(201,169,110,0.14)]" />
          <div className="pointer-events-none absolute -bottom-14 left-8 h-48 w-48 rounded-full border border-[rgba(201,169,110,0.12)]" />

          <div className="relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <div className="section-label">Evaluation Program</div>
              <h1 className="font-display mt-5 text-4xl leading-tight text-white sm:text-5xl lg:text-6xl">
                International Career Eligibility &amp; Evaluation
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-white/74 sm:text-lg">
                Begin your application for global career opportunities across
                Europe, United States, and other international markets.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <span className="rounded-full border border-[rgba(201,169,110,0.28)] bg-[rgba(201,169,110,0.1)] px-4 py-2 text-xs uppercase tracking-[0.24em] text-(--accent-strong)">
                  Structured
                </span>
                <span className="rounded-full border border-[rgba(201,169,110,0.28)] bg-[rgba(201,169,110,0.1)] px-4 py-2 text-xs uppercase tracking-[0.24em] text-(--accent-strong)">
                  Selective
                </span>
                <span className="rounded-full border border-[rgba(201,169,110,0.28)] bg-[rgba(201,169,110,0.1)] px-4 py-2 text-xs uppercase tracking-[0.24em] text-(--accent-strong)">
                  Global-Ready
                </span>
              </div>
            </div>

            <div className="panel group relative overflow-hidden rounded-3xl border-[rgba(201,169,110,0.2)] p-6 shadow-[0_0_18px_rgba(201,169,110,0.12)] transition-all duration-500 hover:-translate-y-1 hover:border-[#c9a96e]/25 hover:shadow-[0_16px_34px_rgba(201,169,110,0.2)] sm:p-7">
              <Image
                src="/what_this_sec_includes.png"
                alt=""
                fill
                className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.18] transition duration-300 group-hover:opacity-[0.24]"
              />
              <div className="relative z-10">
                <h2 className="font-display text-3xl text-white sm:text-4xl">
                  About the Evaluation Process
                </h2>
                <p className="mt-5 text-sm leading-7 text-white/74 sm:text-base">
                  At NextStep Talent, we operate a structured International
                  Career Evaluation &amp; Readiness Program designed to assess
                  and prepare candidates for global opportunities.
                </p>
                <p className="mt-4 text-xs uppercase tracking-[0.24em] text-(--accent)">
                  This Initial Stage Helps Us Evaluate
                </p>
                <ul className="mt-4 space-y-2">
                  {initialEvaluationChecks.map((item) => (
                    <CheckItem key={item} text={item} />
                  ))}
                </ul>
                <p className="mt-5 text-sm leading-7 text-white/70 sm:text-base">
                  Only candidates who meet the evaluation criteria will progress
                  to the next stage.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto mt-14 grid max-w-7xl gap-6 lg:grid-cols-2">
        <article className="panel rounded-4xl p-7 sm:p-9">
          <PremiumInfoCard
            title="What This Step Includes"
            description="By completing this evaluation process, you will receive:"
            items={stepIncludes}
            backgroundImageSrc="/what_this_sec_includes.png"
          />
        </article>
        <article className="panel rounded-4xl p-7 sm:p-9">
          <PremiumInfoCard
            title="Important Information"
            items={importantInformation}
            backgroundImageSrc="/what_this_sec_includes.png"
          />
        </article>
      </section>

      <section className="relative mx-auto mt-14 max-w-7xl">
        <article className="panel grid md:grid-cols-2 gap-6 items-center rounded-4xl p-7 sm:p-9">
          <Image
            src="/career1.png"
            width={1200}
            height={900}
            className="rounded-3xl object-cover h-full w-full"
            alt=""
          />
          <div>
            <h3 className="font-display text-3xl text-white sm:text-4xl">
              Who This Is For
            </h3>

            <p className="mt-4 text-sm leading-7 text-white/75 sm:text-base">
              This program is suitable for individuals who:
            </p>

            <ul className="mt-6 grid gap-3">
              {whoThisIsFor.map((item) => (
                <CheckItem
                  key={item}
                  text={item}
                  className="cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:border-[rgba(201,169,110,0.42)] hover:bg-[rgba(14,12,8,0.82)] hover:shadow-[0_16px_34px_rgba(201,169,110,0.3)]"
                />
              ))}
            </ul>
          </div>
        </article>
      </section>

      <section className="relative mx-auto mt-14 max-w-7xl">
        <article className="panel rounded-4xl p-7 sm:p-9">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h3 className="font-display text-3xl text-white sm:text-4xl">
                Country-Specific Eligibility Criteria
              </h3>
              <p className="mt-3 text-sm uppercase tracking-[0.24em] text-(--accent)">
                Minimum Eligibility
              </p>
            </div>
          </div>

          <div className="mt-7 grid gap-4 lg:auto-rows-fr lg:grid-cols-2">
            {countryCriteria.map((item) => (
              <article
                key={item.country}
                className="group h-full cursor-pointer rounded-3xl border border-[rgba(201,169,110,0.24)] bg-[rgba(8,8,8,0.72)] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(201,169,110,0.52)] hover:bg-[rgba(14,12,8,0.86)] hover:shadow-[0_0_0_1px_rgba(201,169,110,0.24),0_22px_46px_rgba(201,169,110,0.22)]"
              >
                <h4 className="font-display flex items-center gap-3 text-2xl text-white">
                  {item.flag === "globe" ? (
                    <span
                      className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[rgba(201,169,110,0.45)] text-sm text-(--accent-strong)"
                      aria-label="Global"
                    >
                      🌍
                    </span>
                  ) : (
                    <Image
                      src={`https://flagcdn.com/w40/${item.flag}.png`}
                      alt={`${item.country} flag`}
                      width={22}
                      height={16}
                      className="h-4 w-[1.4rem] rounded-sm border border-white/15 object-cover"
                      unoptimized
                    />
                  )}
                  <span>{item.country}</span>
                </h4>
                <ul className="mt-4 space-y-2 text-sm leading-7 text-white/78 sm:text-base">
                  <li>
                    <strong className="text-white">
                      Location requirement:
                    </strong>{" "}
                    {item.location}
                  </li>
                  <li>
                    <strong className="text-white">
                      Language requirement:
                    </strong>{" "}
                    {item.language}
                  </li>
                </ul>
              </article>
            ))}
          </div>
        </article>
      </section>

      <section className="relative mx-auto mt-14 max-w-7xl">
        <article className="panel relative overflow-hidden rounded-4xl border-[rgba(201,169,110,0.32)] p-8 text-center sm:p-10 lg:p-12">
          <Image
            src="/check_eligibility.png"
            fill
            className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.2]"
            alt=""
          />
          <div className="relative z-10">
            <p className="text-xs uppercase tracking-[0.28em] text-(--accent)">
              Important Note
            </p>
            <p className="mx-auto mt-4 max-w-3xl text-base leading-8 text-white/78 sm:text-lg">
              Due to the structured and selective nature of our process, only a
              limited number of candidates are onboarded for each cycle.
            </p>

            <h2 className="font-display mt-10 text-4xl text-white sm:text-5xl">
              Step 1: Check Your Eligibility
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/74 sm:text-base">
              Before proceeding further, you will complete a short eligibility
              check based on current requirements.
            </p>

            <div className="mt-8 flex justify-center">
              <Link
                href="/eligibility-check"
                className="w-full max-w-70 rounded-full border border-(--accent) bg-[rgba(201,169,110,0.03)] px-5 py-3 text-center text-xs font-semibold uppercase tracking-[0.24em] text-(--accent-strong) transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.02] hover:border-(--accent-strong) hover:bg-[linear-gradient(180deg,rgba(201,169,110,0.22),rgba(201,169,110,0.10))] hover:shadow-[0_14px_30px_rgba(201,169,110,0.32)] sm:w-auto sm:min-w-70"
              >
                Check Your Eligibility
              </Link>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
