import { NextResponse } from "next/server";

import { verifyEmailVerificationToken } from "@/lib/email-verification-token";

type VerifyEmailRequest = {
  token?: string;
};

export async function POST(request: Request) {
  const payload = (await request
    .json()
    .catch(() => null)) as VerifyEmailRequest | null;
  const token = payload?.token?.trim();

  if (!token) {
    return NextResponse.json(
      { message: "Verification token is required." },
      { status: 400 },
    );
  }

  const result = verifyEmailVerificationToken(token);
  if (!result.ok || !result.email) {
    return NextResponse.json(
      { message: result.message || "Invalid verification token." },
      { status: 400 },
    );
  }

  return NextResponse.json({
    message: "Email verified successfully.",
    email: result.email,
  });
}
