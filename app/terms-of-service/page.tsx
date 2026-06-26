import type { Metadata } from "next";
import BackButton from "@/components/BackButton";

export const metadata: Metadata = {
  title: "Terms and Conditions | NextTalent",
  description:
    "Terms and Conditions for NG Global Advisory and Consulting LLC. DBA NextStep Talent.",
};

type TermsSection = {
  title: string;
  lead?: string;
  bullets?: string[];
  paragraphs?: string[];
};

const termsSections: TermsSection[] = [
  {
    title: "1. ELIGIBILITY",
    paragraphs: [
      "Candidates must review and satisfy the eligibility requirements displayed on the website before proceeding with registration or application.",
      "Submission of an application does not guarantee selection, placement, employment, or approval.",
    ],
  },
  {
    title: "2. ACCOUNT REGISTRATION",
    lead: "Candidates will be required to:",
    bullets: [
      "Create an online account",
      "Submit forms and documentation",
      "Upload educational, employment, identity, and supporting records",
    ],
    paragraphs: [
      "Candidates are responsible for maintaining accurate and updated information.",
    ],
  },
  {
    title: "3. AUTHENTICITY OF DOCUMENTS",
    lead: "Candidates expressly agree:",
    bullets: [
      "Not to submit forged, altered, misleading, or inaccurate documents",
      "Not to misrepresent qualifications, experience, certifications, or identity",
    ],
    paragraphs: [
      "Any false information may result in immediate rejection, termination of services, permanent disqualification, or potential reporting to authorities.",
    ],
  },
  {
    title: "4. VERIFICATION PROCESS",
    paragraphs: [
      "Candidates acknowledge and agree that background verification is a mandatory part of the process and may be conducted through Sterling or another authorized provider.",
      "Failure to cooperate with verification requirements may result in disqualification.",
    ],
  },
  {
    title: "5. PAYMENT OBLIGATIONS",
    paragraphs: [
      "Candidates agree to comply with all applicable payment terms, fee structures, refund policies, and deadlines outlined by the Company.",
      "Detailed payment and refund terms are published in the Payment & Refund Policy and form part of these Terms.",
    ],
    bullets: [
      "Failure to complete payments may result in suspension of services.",
      "Cancellation of processing.",
      "Disqualification from opportunities.",
    ],
  },
  {
    title: "6. NO GUARANTEE OF EMPLOYMENT",
    paragraphs: [
      "The Company acts as a facilitator and bridge between candidates and hiring entities. The Company does not guarantee employment, selection, visa approvals, immigration outcomes, salary levels, or duration of employment.",
      "Final hiring decisions remain solely with the hiring company.",
    ],
  },
  {
    title: "7. LIMITATION OF LIABILITY",
    bullets: [
      "Decisions made by hiring companies",
      "Visa or immigration outcomes",
      "Third-party delays",
      "Technical issues",
      "Candidate ineligibility",
      "Background verification outcomes",
    ],
  },
  {
    title: "8. WEBSITE USE RESTRICTIONS",
    bullets: [
      "Copy website content or business models",
      "Attempt unauthorized access",
      "Use automated scraping tools",
      "Interfere with website functionality",
      "Reproduce Company intellectual property",
    ],
  },
  {
    title: "9. TERMINATION",
    bullets: [
      "Fraudulent activity",
      "Policy violations",
      "Non-payment",
      "Misconduct",
      "Misrepresentation",
    ],
  },
  {
    title: "10. GOVERNING LAW",
    paragraphs: [
      "These Terms shall be governed by the laws of the State of Georgia, United States.",
    ],
  },
  {
    title: "11. MODIFICATIONS",
    paragraphs: [
      "The Company reserves the right to modify these Terms at any time without prior notice.",
      "Continued use of the website constitutes acceptance of revised Terms.",
    ],
  },
  {
    title: "12. CONTACT INFORMATION",
    bullets: [
      "NG Global Advisory and Consulting LLC.",
      "DBA: NextStep Talent",
      "Company Address: 8735 Dunwoody Place Ste N, Atlanta, GA 30350 United States",
      "Email Address: contact@NextStepTalent.net",
    ],
  },
];

export default function TermsOfServicePage({
  searchParams,
}: {
  searchParams?: { returnTo?: string; popup?: string };
}) {
  const returnHref =
    searchParams?.returnTo === "profile-submission"
      ? "/profile-submission?popup=fee"
      : undefined;

  return (
    <div className="network-grid">
      <section className="pb-16 pt-28">
        <div className="mx-auto max-w-250 px-6">
          <div className="rounded-2xl border border-[rgba(200,169,107,0.28)] bg-[linear-gradient(180deg,rgba(20,20,20,0.62),rgba(10,10,10,0.72))] p-6 shadow-[0_0_0_1px_rgba(200,169,107,0.08),0_24px_55px_rgba(0,0,0,0.45)] sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="font-display text-5xl font-bold tracking-tight text-[#f7f3ea]">
                  Terms and Conditions
                </h1>
                <p className="mt-2 text-sm text-[#bdbdc3]">
                  Effective Date: May 12th, 2026
                </p>
              </div>
              <BackButton returnHref={returnHref} />
            </div>

            <div className="mt-6 max-w-none space-y-4 text-sm leading-relaxed text-[#c7c7cd]">
              <p>
                These Terms and Conditions govern the use of services provided
                by NG Global Advisory and Consulting LLC., DBA NextStep Talent.
              </p>
              <p>
                By accessing our website or using our services, you agree to
                comply with these Terms.
              </p>

              <div className="mt-6 space-y-3">
                {termsSections.map((section) => (
                  <details
                    key={section.title}
                    className="group mb-3 rounded-lg border border-[rgba(200,169,107,0.2)] bg-[rgba(255,255,255,0.035)] shadow-[0_0_0_1px_rgba(200,169,107,0.06),inset_0_1px_0_rgba(255,255,255,0.04)] [&>summary::-webkit-details-marker]:hidden"
                  >
                    <summary className="flex w-full cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 text-left text-sm font-semibold text-[#f7f3ea]">
                      <span>{section.title}</span>
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 20 20"
                        className="ml-4 h-5 w-5 shrink-0 text-[#f7f3ea]/80 transition-transform duration-200 group-open:rotate-180"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 7.5L10 12.5L15 7.5"
                        />
                      </svg>
                    </summary>

                    <div className="block space-y-3 px-4 pb-4 text-sm leading-5 text-[#bdbdc3]">
                      {section.lead ? <p>{section.lead}</p> : null}

                      {section.bullets ? (
                        <ul className="list-disc space-y-2 pl-5 text-left marker:text-[#bdbdc3]">
                          {section.bullets.map((bullet) => (
                            <li key={bullet}>{bullet}</li>
                          ))}
                        </ul>
                      ) : null}

                      {section.paragraphs ? (
                        <div className="space-y-3">
                          {section.paragraphs.map((paragraph) => (
                            <p key={paragraph}>{paragraph}</p>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
