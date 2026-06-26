import BackButton from "@/components/BackButton";

type PolicySection = {
  title: string;
  blocks: Array<
    { type: "paragraph"; text: string } | { type: "bullets"; items: string[] }
  >;
};

const policySections: PolicySection[] = [
  {
    title: "1. INITIAL SCREENING PAYMENT",
    blocks: [
      {
        type: "paragraph",
        text: "After internal eligibility review and approval, candidates may be invited to proceed with an initial payment of:",
      },
      { type: "paragraph", text: "USD $500 (Non-Refundable)" },
      {
        type: "bullets",
        items: [
          "This payment confirms the candidate’s intent and seriousness toward the process.",
          "This payment is processed through Stripe.",
          "Applicable Stripe transaction/processing fees shall be borne by the candidate and added where applicable.",
          "This amount is strictly non-refundable under any circumstances once paid.",
        ],
      },
    ],
  },
  {
    title: "2. FIRST PLACEMENT DEPOSIT",
    blocks: [
      {
        type: "paragraph",
        text: "After document review and onboarding progression, candidates are required to pay:",
      },
      { type: "paragraph", text: "USD $3,000 + USD $100 Banking/Transfer Fee" },
      { type: "paragraph", text: "Total: USD $3,100" },
      {
        type: "paragraph",
        text: "The USD $100 banking fee is non-refundable and covers transaction and banking charges.",
      },
    ],
  },
  {
    title: "3. REFUND CONDITIONS",
    blocks: [
      { type: "paragraph", text: "A. Candidate NOT Selected After Interviews" },
      {
        type: "paragraph",
        text: "If the candidate completes the interview process but is not selected by the hiring company:",
      },
      {
        type: "bullets",
        items: [
          "USD $200 shall be deducted as administrative/processing charges.",
          "Remaining balance shall be refunded.",
        ],
      },
      { type: "paragraph", text: "Example:" },
      {
        type: "bullets",
        items: [
          "USD $3,100 paid",
          "Less USD $200 processing deduction",
          "Refund Amount: USD $2,900",
        ],
      },
      {
        type: "paragraph",
        text: "Administrative and banking components remain non-refundable.",
      },
      { type: "paragraph", text: "B. Candidate Selected But Declines to Join" },
      {
        type: "paragraph",
        text: "If the candidate receives selection/offer confirmation and voluntarily refuses, declines, withdraws, or fails to join the company, the entire amount becomes non-refundable.",
      },
      { type: "paragraph", text: "C. Visa Refusal / Immigration Rejection" },
      {
        type: "paragraph",
        text: "If the candidate is selected but the visa or immigration process is officially denied or rejected, the refundable portion may be returned after verification of official refusal documentation. Administrative and banking charges still apply.",
      },
    ],
  },
  {
    title: "4. FINAL PAYMENT",
    blocks: [
      {
        type: "paragraph",
        text: "Upon successful selection by the hiring company, candidates shall pay the remaining balance of:",
      },
      { type: "paragraph", text: "USD $3,100" },
      {
        type: "paragraph",
        text: "before final onboarding and deployment processes are completed.",
      },
    ],
  },
  {
    title: "5. PAYMENT METHODS",
    blocks: [
      {
        type: "bullets",
        items: [
          "Initial payments shall be processed through Stripe.",
          "Remaining payments shall be transferred directly to the Company’s designated U.S. business bank account.",
          "Bank details shall only be shared through official communication channels.",
        ],
      },
    ],
  },
  {
    title: "6. REFUND TIMELINES",
    blocks: [
      {
        type: "paragraph",
        text: "Approved refunds may take 14–30 business days depending on banking systems, international transfers, compliance reviews, and payment processing timelines.",
      },
    ],
  },
  {
    title: "7. CHARGEBACKS & DISPUTES",
    blocks: [
      {
        type: "bullets",
        items: [
          "Unauthorized chargebacks or payment disputes after service initiation may result in immediate suspension of services.",
          "Permanent disqualification.",
          "Legal recovery actions where applicable.",
        ],
      },
    ],
  },
  {
    title: "8. COMPANY RIGHTS",
    blocks: [
      {
        type: "bullets",
        items: [
          "Reject candidates at any stage.",
          "Suspend or terminate applications involving fraudulent information.",
          "Modify pricing or policies without prior notice.",
        ],
      },
    ],
  },
];

export default function PaymentRefundPolicyPage() {
  return (
    <div className="network-grid px-4 pb-20 pt-28 sm:px-6 lg:px-8 lg:pt-32">
      <div className="mx-auto max-w-4xl panel rounded-2xl p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <BackButton />
          <p className="text-xs uppercase tracking-[0.28em] text-(--muted)">
            Effective Date: May 12th, 2026
          </p>
        </div>

        <h1 className="mt-6 font-display text-4xl font-semibold text-white sm:text-5xl">
          Payment and Refund Policy
        </h1>

        <div className="mt-6 space-y-4 text-sm leading-7 text-[#d1d2d7] sm:text-base">
          <p>
            This Payment and Refund Policy applies to all candidates engaging
            with services provided by NG Global Advisory and Consulting LLC.,
            DBA NextStep Talent.
          </p>
          <p>
            By proceeding with our services and making payments, you acknowledge
            and agree to the following terms.
          </p>
        </div>

        <div className="mt-8 space-y-3">
          {policySections.map((section) => (
            <details
              key={section.title}
              className="group rounded-xl border border-[rgba(200,169,107,0.18)] bg-[rgba(255,255,255,0.03)] shadow-[0_0_0_1px_rgba(200,169,107,0.05)] [&>summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 text-left text-sm font-semibold uppercase tracking-[0.16em] text-white sm:px-5">
                <span>{section.title}</span>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 20 20"
                  className="h-5 w-5 shrink-0 transition-transform duration-200 group-open:rotate-180"
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

              <div className="space-y-2 border-t border-[rgba(200,169,107,0.12)] px-4 py-4 text-sm leading-6 text-[#c7c7cd] sm:px-5">
                {section.blocks.map((block, index) =>
                  block.type === "paragraph" ? (
                    <p key={`${section.title}-p-${index}`}>{block.text}</p>
                  ) : (
                    <ul
                      key={`${section.title}-u-${index}`}
                      className="list-disc space-y-1.5 pl-5 marker:text-[#bdbdc3]"
                    >
                      {block.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ),
                )}
              </div>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
