import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto w-full border-t border-[rgba(200,169,107,0.14)] bg-[#050505] py-12 text-white">
      <div className="mx-auto max-w-310 px-6 md:px-8">
        <div className="flex justify-center">
          <Link className="inline-flex" href="/" data-discover="true">
            <Image
              src="/logo_ori1.png"
              alt="NextStep Talent logo"
              width={200}
              height={150}
              className="h-auto w-full max-w-80 object-contain md:h-35 md:w-80"
            />
          </Link>
        </div>

        <div className="mt-10 flex flex-col items-center gap-8 text-center">
          <div>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-[#bdbdc3]">
              <Link
                className="inline-flex min-h-11 items-center px-1 transition hover:text-[#c8a96b]"
                href="/privacy-policy"
                data-discover="true"
              >
                Privacy Policy
              </Link>
              <span className="opacity-50">|</span>
              <Link
                className="inline-flex min-h-11 items-center px-1 transition hover:text-[#c8a96b]"
                href="/terms-of-service"
                data-discover="true"
              >
                Terms and Conditions
              </Link>
            </div>
          </div>
        </div>

        <p className="mt-12 text-center text-xs uppercase tracking-[0.22em] text-[#85858e]">
          © 2026 NextStep Talent. All rights reserved.
          <br />
          Developed by{" "}
          <a
            href="http://ravviolabs.com/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center font-semibold underline-offset-2 hover:underline"
          >
            Pavan
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
