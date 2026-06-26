import type { Metadata } from "next";
import BackButton from "@/components/BackButton";

export const metadata: Metadata = {
  title: "Privacy Policy | NextTalent",
  description:
    "Privacy policy for NG Global Advisory and Consulting LLC. DBA NextStep Talent.",
};

type PolicySection = {
  title: string;
  lead?: string;
  bullets?: string[];
  paragraphs?: string[];
};

const policySections: PolicySection[] = [
  {
    title: "1. INFORMATION WE COLLECT",
    lead: "We may collect the following information from candidates and users:",
    bullets: [
      "Full name",
      "Email address",
      "Phone number",
      "Residential address",
      "Passport details",
      "Educational qualifications",
      "Employment history",
      "Certifications and supporting documents",
      "Resume/CV",
      "Login credentials",
      "Payment-related information",
      "IP address and browser/device information",
    ],
  },
  {
    title: "2. HOW WE USE YOUR INFORMATION",
    lead: "Your information may be used for:",
    bullets: [
      "Candidate eligibility review",
      "Recruitment and placement processes",
      "Verification and background screening",
      "Communication regarding opportunities",
      "Payment processing",
      "Compliance and fraud prevention",
      "Internal operational purposes",
    ],
  },
  {
    title: "3. THIRD-PARTY SERVICES",
    lead: "We may use trusted third-party service providers, including but not limited to:",
    bullets: [
      "Stripe (payment processing)",
      "Sterling (background verification)",
      "Hosting and technical infrastructure providers",
    ],
    paragraphs: [
      "These third parties may process information only as necessary to provide services connected to our operations.",
    ],
  },
  {
    title: "4. BACKGROUND VERIFICATION",
    paragraphs: [
      "Candidates may be required to undergo mandatory background verification through Sterling or another approved verification provider.",
      "By proceeding with our services, candidates consent to the sharing of necessary documents and information for verification purposes.",
    ],
  },
  {
    title: "5. DATA SECURITY",
    paragraphs: [
      "We implement commercially reasonable administrative, technical, and organizational safeguards to protect user data.",
      "However, no online system can guarantee absolute security, and users acknowledge this risk when submitting information online.",
    ],
  },
  {
    title: "6. CONFIDENTIALITY OF BUSINESS MATERIALS",
    paragraphs: [
      "All website content, operational structures, workflows, designs, graphics, text, processes, databases, and business models are proprietary to NG Global Advisory and Consulting LLC. DBA NextStep Talent.",
      "Unauthorized copying, reproduction, distribution, or commercial use is strictly prohibited.",
    ],
  },
  {
    title: "7. USER RESPONSIBILITIES",
    lead: "Users agree:",
    bullets: [
      "To provide accurate and truthful information",
      "Not to upload fraudulent, misleading, or forged documents",
      "Not to misuse the website or attempt unauthorized access",
    ],
  },
  {
    title: "8. DATA RETENTION",
    paragraphs: [
      "We may retain submitted information for operational, legal, compliance, and verification purposes for a reasonable duration, even if a candidate does not proceed further.",
    ],
  },
  {
    title: "9. LIMITATION OF LIABILITY",
    paragraphs: [
      "The Company shall not be liable for delays, interruptions, technical failures, third-party platform outages, or events beyond reasonable control.",
    ],
  },
  {
    title: "10. CHANGES TO THIS POLICY",
    paragraphs: [
      "We reserve the right to modify this Privacy Policy at any time without prior notice. Updated versions will be posted on the website.",
    ],
  },
  {
    title: "11. CONTACT INFORMATION",
    bullets: [
      "NG Global Advisory and Consulting LLC.",
      "DBA: NextStep Talent",
      "Company Address: 8735 Dunwoody Place Ste N, Atlanta, GA 30350 United States",
      "Email Address: contact@NextStepTalent.net",
    ],
  },
];

export default function PrivacyPolicyPage({
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
                  Privacy Policy
                </h1>
                <p className="mt-2 text-sm text-[#bdbdc3]">
                  Effective Date: May 12th, 2026
                </p>
              </div>
              <BackButton returnHref={returnHref} />
            </div>

            <div className="mt-6 max-w-none space-y-4 text-sm leading-relaxed text-[#c7c7cd]">
              <p>
                This Privacy Policy describes how NG Global Advisory and
                Consulting LLC., operating under the DBA NextStep Talent
                (&quot;Company,&quot; &quot;we,&quot; &quot;our,&quot; or
                &quot;us&quot;), collects, uses, stores, and protects personal
                information submitted through our website and services.
              </p>
              <p>
                By using our website, you agree to the terms of this Privacy
                Policy.
              </p>

              <div className="mt-6 space-y-3">
                {policySections.map((section) => (
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
