"use client";

import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const pathwaySteps = [
    {
      number: "01",
      title: "Profile Evaluation & Alignment",
      description:
        "Assessing candidate backgrounds against current international pathway requirements.",
      image: "/profile_evaluation.png",
    },
    {
      number: "02",
      title: "Career Profile Development",
      description:
        "Structuring and presenting profiles to meet global standards.",
      image: "/Profile_development.png",
    },
    {
      number: "03",
      title: "Opportunity Mapping",
      description:
        "Aligning candidates with relevant international pathways based on eligibility.",
      image: "/Profile_opportunity_mapping.png",
    },
    {
      number: "04",
      title: "Documentation & Verification Support",
      description:
        "Coordinating document validation and readiness for external review.",
      image: "/Profile_doc_verification.png",
    },
    {
      number: "05",
      title: "Process Coordination",
      description:
        "Managing candidate progression through each stage of the pathway.",
      image: "/Profile_process_cordination.png",
    },
  ];

  return (
    <div className="network-grid" id="top">
      <section
        id="hero"
        className="relative flex min-h-screen items-center overflow-hidden px-6 pb-9 pt-28 md:px-10"
      >
        <div className="relative mx-auto flex w-full max-w-295 justify-center">
          <div
            className="nst-reveal is-visible mx-auto max-w-215 text-center"
            style={{ transitionDelay: "0ms" }}
          >
            <div className="relative mx-auto mt-4 inline-flex items-center justify-center">
              <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle,rgba(200,169,107,0.2)_0%,rgba(200,169,107,0.08)_38%,transparent_74%)] blur-md" />
              <Image
                src="/logo_ori1.png"
                alt="NextStep Talent"
                width={1400}
                height={700}
                priority
                className="mx-auto h-auto max-h-80 w-full max-w-2xl object-contain md:max-h-96 md:max-w-3xl"
              />
            </div>
            <div className="mx-auto mt-8 h-px w-18 bg-[linear-gradient(90deg,transparent,#c8a96b,transparent)]" />

            <p className="mx-auto mt-8 max-w-190 text-base leading-8 text-[#d2d2d6] sm:text-lg">
              Structured Pathways for Individuals Seeking International Career
              Opportunities through Profile Evaluation, Alignment, and
              Readiness.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                className="w-full max-w-70 rounded-full border border-(--accent) bg-[rgba(201,169,110,0.03)] px-5 py-3 text-center text-xs font-semibold uppercase tracking-[0.24em] text-(--accent-strong) transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.02] hover:border-(--accent-strong) hover:bg-[linear-gradient(180deg,rgba(201,169,110,0.22),rgba(201,169,110,0.10))] hover:shadow-[0_14px_30px_rgba(201,169,110,0.32)] sm:w-auto sm:min-w-70"
                href="/evaluation-program"
                data-discover="true"
              >
                Explore Current Opportunities
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="who-we-are" className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="panel mx-auto grid max-w-7xl gap-10 rounded-4xl p-8 sm:p-10 lg:grid-cols-[0.95fr_1.05fr] lg:p-14">
          <div>
            <div className="section-label">Who We Are</div>
            <h2 className="font-display mt-6 text-4xl leading-tight text-white sm:text-5xl">
              A global platform built on experience and precision.
            </h2>
          </div>
          <div className="space-y-6 text-base leading-8 text-white/68 sm:text-lg">
            <p>
              NextTalent supports individuals exploring structured career
              opportunities beyond their home country with a selective and
              process-led approach.
            </p>
            <p>
              Our operating model is built around clarity, qualification, and
              realistic opportunity alignment rather than broad, generic intake.
            </p>
            <p>
              Every candidate journey is shaped around readiness, fit, and
              disciplined progression across multiple review stages.
            </p>
          </div>
        </div>
      </section>

      <section id="process" className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <div className="section-label">What We Do</div>
            <h2 className="font-display mt-6 text-4xl leading-tight text-white sm:text-5xl">
              A Structured Process, at Every Stage.
            </h2>
            <p className="mt-6 text-lg leading-8 text-white/62">
              We offer a structured and selective process designed to support
              candidates at every stage of their international career journey.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
            {pathwaySteps.map((step) => (
              <article
                key={step.number}
                className="panel group overflow-hidden rounded-[1.75rem] p-0 transition duration-300 hover:-translate-y-1 hover:border-[rgba(201,169,110,0.44)]"
              >
                <div className="relative h-44 overflow-hidden border-b border-[rgba(201,169,110,0.16)]">
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    sizes="(min-width: 1280px) 20vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-[#070707] via-[#070707]/20 to-transparent" />
                </div>
                <div className="p-6">
                  <div className="mb-4 inline-flex rounded-full border border-[rgba(201,169,110,0.42)] bg-[rgba(10,10,10,0.35)] px-3 py-1 text-xs font-semibold tracking-[0.24em] text-(--accent)">
                    {step.number}
                  </div>
                  <h3 className="font-display text-[1.55rem] leading-tight text-white">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-white/68">
                    {step.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="regions" className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <div className="section-label">Global Focus</div>
            <h2 className="font-display mt-6 text-4xl leading-tight text-white sm:text-5xl">
              Regions we work with.
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/62">
              Focus markets evolve with demand, program fit, and candidate
              readiness. Current pathway attention is strongest across four
              major destination clusters.
            </p>
          </div>

          <div className="panel rounded-4xl p-8 sm:p-10">
            <div className="relative z-10">
              <div className="relative overflow-hidden rounded-[1.4rem] border border-[rgba(200,169,107,0.16)] bg-[#070806]">
                <svg
                  viewBox="0 0 1000 620"
                  role="img"
                  aria-label="Abstract global focus map showing United States, United Kingdom, Europe, and Australia"
                  className="relative z-10 mx-auto block aspect-1000/620 w-[90%]"
                >
                  <defs>
                    <radialGradient
                      id="nst-abstract-globe"
                      cx="52%"
                      cy="51%"
                      r="43%"
                    >
                      <stop offset="0%" stopColor="rgba(204,174,105,0.2)" />
                      <stop offset="62%" stopColor="rgba(204,174,105,0.11)" />
                      <stop offset="100%" stopColor="rgba(204,174,105,0.02)" />
                    </radialGradient>
                    <linearGradient
                      id="nst-abstract-land"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="rgba(222,190,121,0.22)" />
                      <stop offset="100%" stopColor="rgba(164,134,75,0.08)" />
                    </linearGradient>
                    <filter
                      id="nst-soft-glow"
                      x="-80%"
                      y="-80%"
                      width="260%"
                      height="260%"
                    >
                      <feGaussianBlur stdDeviation="7" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  <rect width="1000" height="620" fill="#070806" />

                  <ellipse
                    cx="515"
                    cy="383"
                    rx="335"
                    ry="148"
                    fill="url(#nst-abstract-globe)"
                    opacity="0.88"
                  />

                  <g
                    fill="none"
                    stroke="rgba(199,164,91,0.24)"
                    strokeWidth="1.2"
                  >
                    <path d="M125 288 C77 355 128 414 272 413 C386 413 448 388 370 345 C308 310 357 251 473 230 C573 213 682 213 747 257 C799 292 803 335 749 354 C696 373 693 410 643 429" />
                    <path d="M191 243 C244 250 327 261 420 278 C494 292 560 289 632 281 C699 273 751 287 778 318" />
                    <path d="M284 399 C368 431 500 446 651 422 C748 407 818 420 858 467" />
                    <path d="M144 308 L144 242" />
                  </g>

                  <g>
                    <path
                      d="M146 292 C180 254 236 243 297 249 C346 254 366 270 343 290 C316 314 294 334 338 356 C374 374 331 394 273 391 C214 388 167 366 139 332 L139 307 C139 301 141 296 146 292 Z"
                      fill={
                        hoveredRegion === "usa"
                          ? "rgba(212,175,55,0.35)"
                          : "url(#nst-abstract-land)"
                      }
                      stroke={
                        hoveredRegion === "usa"
                          ? "rgba(232,197,71,0.7)"
                          : "rgba(205,170,99,0.5)"
                      }
                      strokeWidth={hoveredRegion === "usa" ? "1.8" : "1.15"}
                      onMouseEnter={() => setHoveredRegion("usa")}
                      onMouseLeave={() => setHoveredRegion(null)}
                      style={{ cursor: "pointer", transition: "240ms" }}
                    />
                    <path
                      d="M360 383 C399 382 453 389 490 411 C529 433 523 464 488 484 C455 502 461 526 503 545 C544 563 491 591 410 581 C336 572 281 539 307 499 C328 467 334 449 315 425 C292 397 316 384 360 383 Z"
                      fill="url(#nst-abstract-land)"
                      stroke="rgba(205,170,99,0.5)"
                      strokeWidth="1.15"
                      style={{ cursor: "default", transition: "240ms" }}
                    />
                    <path
                      d="M434 250 C470 207 531 195 618 204 C697 213 748 240 741 281 C736 310 715 322 662 320 C603 318 554 314 512 333 C466 354 421 340 407 310 C398 291 410 276 434 250 Z"
                      fill={
                        hoveredRegion === "europe"
                          ? "rgba(212,175,55,0.35)"
                          : "url(#nst-abstract-land)"
                      }
                      stroke={
                        hoveredRegion === "europe"
                          ? "rgba(232,197,71,0.7)"
                          : "rgba(205,170,99,0.5)"
                      }
                      strokeWidth={hoveredRegion === "europe" ? "1.8" : "1.15"}
                      onMouseEnter={() => setHoveredRegion("europe")}
                      onMouseLeave={() => setHoveredRegion(null)}
                      style={{ cursor: "pointer", transition: "240ms" }}
                    />
                    <path
                      d="M482 351 C521 329 580 326 630 342 C680 359 686 390 642 410 C599 429 600 448 637 470 C676 493 658 525 595 534 C530 544 462 525 437 491 C416 463 445 444 456 417 C466 390 449 372 482 351 Z"
                      fill="url(#nst-abstract-land)"
                      stroke="rgba(205,170,99,0.5)"
                      strokeWidth="1.15"
                      style={{ cursor: "default", transition: "240ms" }}
                    />
                    <path
                      d="M506 344 C540 335 583 336 607 347 C627 357 619 374 587 378 C553 382 512 374 505 360 C502 354 502 349 506 344 Z"
                      fill="url(#nst-abstract-land)"
                      stroke="rgba(205,170,99,0.5)"
                      strokeWidth="1.15"
                      style={{ cursor: "default", transition: "240ms" }}
                    />
                    <path
                      d="M804 456 C837 438 894 435 923 456 C951 476 935 506 889 515 C841 524 789 507 780 482 C776 470 784 462 804 456 Z"
                      fill="url(#nst-abstract-land)"
                      stroke="rgba(205,170,99,0.5)"
                      strokeWidth="1.15"
                      style={{ cursor: "default", transition: "240ms" }}
                    />
                  </g>

                  <g fill="none">
                    <path
                      id="path-usa-europe"
                      d="M155 168 C282 186 386 211 505 160"
                      stroke={
                        hoveredRegion === "usa" || hoveredRegion === "europe"
                          ? "rgba(212,175,55,0.6)"
                          : "rgba(158,129,69,0.28)"
                      }
                      strokeWidth={
                        hoveredRegion === "usa" || hoveredRegion === "europe"
                          ? "1.8"
                          : "1.05"
                      }
                      strokeLinecap="round"
                      style={{ transition: "240ms" }}
                    />
                    <path
                      id="path-uk-europe"
                      d="M465 140 C481 146 493 152 505 160"
                      stroke={
                        hoveredRegion === "uk" || hoveredRegion === "europe"
                          ? "rgba(212,175,55,0.6)"
                          : "rgba(158,129,69,0.28)"
                      }
                      strokeWidth={
                        hoveredRegion === "uk" || hoveredRegion === "europe"
                          ? "1.8"
                          : "1.05"
                      }
                      strokeLinecap="round"
                      style={{ transition: "240ms" }}
                    />
                    <path
                      id="path-australia-europe"
                      d="M848 470 C786 425 711 349 628 258 C586 211 549 183 505 160"
                      stroke="rgba(158,129,69,0.28)"
                      strokeWidth="1.05"
                      strokeLinecap="round"
                      style={{ transition: "240ms" }}
                    />
                    <path
                      id="path-southamerica-europe"
                      d="M360 383 C386 349 418 307 449 258 C470 224 485 195 505 160"
                      stroke="rgba(158,129,69,0.28)"
                      strokeWidth="1.05"
                      strokeLinecap="round"
                      style={{ transition: "240ms" }}
                    />
                    <path
                      id="path-africa-europe"
                      d="M518 404 C530 350 529 295 520 238 C516 205 511 183 505 160"
                      stroke="rgba(158,129,69,0.28)"
                      strokeWidth="1.05"
                      strokeLinecap="round"
                      style={{ transition: "240ms" }}
                    />
                  </g>

                  {/* ANIMATED TRAVEL DOTS */}
                  <circle r="5" fill="#d4af37" opacity="0.8">
                    <animateMotion dur="4s" repeatCount="indefinite">
                      <mpath href="#path-usa-europe" />
                    </animateMotion>
                  </circle>
                  <circle r="4" fill="#d4af37" opacity="0.7">
                    <animateMotion dur="4s" repeatCount="indefinite">
                      <mpath href="#path-uk-europe" />
                    </animateMotion>
                  </circle>
                  <circle r="4.5" fill="#d4af37" opacity="0.75">
                    <animateMotion dur="4s" repeatCount="indefinite">
                      <mpath href="#path-australia-europe" />
                    </animateMotion>
                  </circle>
                  <circle r="4.2" fill="#d4af37" opacity="0.74">
                    <animateMotion dur="4s" repeatCount="indefinite">
                      <mpath href="#path-southamerica-europe" />
                    </animateMotion>
                  </circle>
                  <circle r="4.2" fill="#d4af37" opacity="0.72">
                    <animateMotion dur="4s" repeatCount="indefinite">
                      <mpath href="#path-africa-europe" />
                    </animateMotion>
                  </circle>

                  {/* EUROPE */}
                  <g
                    style={{ cursor: "pointer" }}
                    onMouseEnter={() => setHoveredRegion("europe")}
                    onMouseLeave={() => setHoveredRegion(null)}
                  >
                    <circle
                      cx="505"
                      cy="160"
                      r="28"
                      fill={
                        hoveredRegion === "europe"
                          ? "rgba(212,175,55,0.32)"
                          : "rgba(207,174,103,0.16)"
                      }
                      style={{ transition: "240ms" }}
                    />
                    <circle
                      cx="505"
                      cy="160"
                      r="12"
                      fill={hoveredRegion === "europe" ? "#e8c547" : "#d1aa5e"}
                      stroke={
                        hoveredRegion === "europe"
                          ? "rgba(232,197,71,0.9)"
                          : "rgba(214,178,105,0.72)"
                      }
                      strokeWidth={hoveredRegion === "europe" ? "2" : "1.3"}
                      style={{ transition: "240ms" }}
                    />
                    <text
                      x="535"
                      y="160"
                      textAnchor="start"
                      fill={hoveredRegion === "europe" ? "#f5d666" : "#d9bd82"}
                      stroke="rgba(7,8,6,0.78)"
                      strokeWidth="3"
                      paintOrder="stroke"
                      style={{
                        fontSize: hoveredRegion === "europe" ? "20px" : "18px",
                        fontWeight: "600",
                        letterSpacing: "0.18em",
                        transition: "240ms",
                        pointerEvents: "none",
                      }}
                    >
                      EUROPE
                    </text>
                  </g>

                  {/* UK */}
                  <g
                    style={{ cursor: "pointer" }}
                    onMouseEnter={() => setHoveredRegion("uk")}
                    onMouseLeave={() => setHoveredRegion(null)}
                  >
                    <circle
                      cx="465"
                      cy="140"
                      r="26"
                      fill={
                        hoveredRegion === "uk"
                          ? "rgba(212,175,55,0.32)"
                          : "rgba(207,174,103,0.16)"
                      }
                      style={{ transition: "240ms" }}
                    />
                    <circle
                      cx="465"
                      cy="140"
                      r="11"
                      fill={hoveredRegion === "uk" ? "#e8c547" : "#d1aa5e"}
                      stroke={
                        hoveredRegion === "uk"
                          ? "rgba(232,197,71,0.9)"
                          : "rgba(214,178,105,0.72)"
                      }
                      strokeWidth={hoveredRegion === "uk" ? "2" : "1.3"}
                      style={{ transition: "240ms" }}
                    />
                    <text
                      x="465"
                      y="98"
                      textAnchor="middle"
                      fill={hoveredRegion === "uk" ? "#f5d666" : "#d9bd82"}
                      stroke="rgba(7,8,6,0.78)"
                      strokeWidth="3"
                      paintOrder="stroke"
                      style={{
                        fontSize: hoveredRegion === "uk" ? "17px" : "15px",
                        fontWeight: "600",
                        letterSpacing: "0.14em",
                        transition: "240ms",
                        pointerEvents: "none",
                      }}
                    >
                      UNITED KINGDOM
                    </text>
                  </g>

                  {/* USA */}
                  <g
                    style={{ cursor: "pointer" }}
                    onMouseEnter={() => setHoveredRegion("usa")}
                    onMouseLeave={() => setHoveredRegion(null)}
                  >
                    <circle
                      cx="155"
                      cy="168"
                      r="27"
                      fill={
                        hoveredRegion === "usa"
                          ? "rgba(212,175,55,0.32)"
                          : "rgba(207,174,103,0.16)"
                      }
                      style={{ transition: "240ms" }}
                    />
                    <circle
                      cx="155"
                      cy="168"
                      r="12"
                      fill={hoveredRegion === "usa" ? "#e8c547" : "#d1aa5e"}
                      stroke={
                        hoveredRegion === "usa"
                          ? "rgba(232,197,71,0.9)"
                          : "rgba(214,178,105,0.72)"
                      }
                      strokeWidth={hoveredRegion === "usa" ? "2" : "1.3"}
                      style={{ transition: "240ms" }}
                    />
                    <text
                      x="130"
                      y="212"
                      textAnchor="start"
                      fill={hoveredRegion === "usa" ? "#f5d666" : "#d9bd82"}
                      stroke="rgba(7,8,6,0.78)"
                      strokeWidth="3"
                      paintOrder="stroke"
                      style={{
                        fontSize: hoveredRegion === "usa" ? "17px" : "15px",
                        fontWeight: "600",
                        letterSpacing: "0.2em",
                        transition: "240ms",
                        pointerEvents: "none",
                      }}
                    >
                      UNITED STATES
                    </text>
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="connect" className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="panel mx-auto grid max-w-7xl gap-8 rounded-4xl px-6 py-8 sm:px-10 sm:py-12 lg:grid-cols-[0.3fr_0.7fr] lg:items-center">
          <div
            className="group relative mx-auto w-full max-w-90 cursor-pointer bg-contain bg-center bg-no-repeat transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_16px_36px_rgba(201,169,110,0.42)]"
            style={{ backgroundImage: "url('/important_notice.png')" }}
          >
            <div className="aspect-4/5 w-full" />
            <div className="absolute inset-x-[16%] inset-y-[28%] flex items-center justify-center text-center">
              <p className="font-display text-[1rem] font-semibold leading-7 text-[#f5f4f0] sm:text-[1.14rem] sm:leading-8">
                Due to our structured and selective process, only a limited
                number of candidates are onboarded each cycle.
              </p>
            </div>
          </div>

          <div className="text-center lg:text-left">
            <div className="section-label lg:text-center">
              Take The Next Step
            </div>
            <h2 className="font-display mt-6 text-4xl leading-tight text-white sm:text-5xl lg:text-center">
              Looking to Explore International Career Pathways?
            </h2>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-white/62 lg:mx-0 lg:text-center">
              Check if you meet the criteria to begin your international career
              journey with NextStep Talent.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-center">
              <a
                href="/eligibility-check"
                className="w-full max-w-70 rounded-full border border-(--accent) bg-[rgba(201,169,110,0.03)] px-5 py-3 text-center text-xs font-semibold uppercase tracking-[0.24em] text-(--accent-strong) transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.02] hover:border-(--accent-strong) hover:bg-[linear-gradient(180deg,rgba(201,169,110,0.22),rgba(201,169,110,0.10))] hover:shadow-[0_14px_30px_rgba(201,169,110,0.32)] sm:w-auto sm:min-w-70"
              >
                Check Eligibility
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
