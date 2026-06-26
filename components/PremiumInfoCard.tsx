"use client";

import Image from "next/image";

type Props = {
  title: string;
  description?: string;
  items?: string[];
  backgroundImageSrc?: string;
};

function CheckItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-3 text-sm leading-6 text-white/80 sm:text-base">
      <span className="mt-0.5 inline-flex h-6 w-6 flex-none items-center justify-center rounded-full border border-[rgba(201,169,110,0.28)] bg-[rgba(201,169,110,0.06)] text-[0.7rem] font-semibold text-[rgba(201,169,110,0.9)]">
        +
      </span>
      <span>{text}</span>
    </li>
  );
}

export default function PremiumInfoCard({
  title,
  description,
  items,
  backgroundImageSrc = "/pattern-world.png",
}: Props) {
  return (
    <article className="group relative overflow-hidden rounded-4xl border border-[rgba(201,169,110,0.12)] bg-[linear-gradient(135deg,rgba(20,20,20,0.8),rgba(10,10,10,0.64))] p-7 sm:p-9 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-[#c9a96e]/25">
      {/* ✨ Glow background */}
      <div className="absolute -inset-1 rounded-4xl bg-[radial-gradient(circle_at_top,rgba(201,169,110,0.06),transparent_60%)] blur-2xl opacity-35" />

      {/* 🖼️ Subtle texture (put image in /public) */}
      <Image
        src={backgroundImageSrc}
        alt=""
        fill
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.16]"
      />

      {/* 🟡 Gold accent line */}
      <div className="absolute left-0 top-0 h-full w-0.5 bg-linear-to-b from-[rgba(201,169,110,0.65)] via-transparent to-transparent opacity-40" />

      {/* 🔥 Floating blob */}
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#c9a96e]/5 blur-3xl transition-all duration-500 group-hover:scale-110" />

      {/* ✨ Content */}
      <div className="relative z-10">
        <h3 className="font-display text-3xl text-white sm:text-4xl">
          {title}
        </h3>

        {description && (
          <p className="mt-4 text-sm leading-7 text-white/75 sm:text-base">
            {description}
          </p>
        )}

        {items && (
          <ul className="mt-6 space-y-3">
            {items.map((item) => (
              <CheckItem key={item} text={item} />
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}
