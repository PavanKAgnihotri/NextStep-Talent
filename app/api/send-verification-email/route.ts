import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

import { createEmailVerificationToken } from "@/lib/email-verification-token";

type VerificationEmailRequest = {
  email?: string;
};

function isLikelyPlaceholder(value?: string | null): boolean {
  if (!value) return true;
  const normalized = value.trim().toLowerCase();
  return (
    normalized.includes("your-") ||
    normalized.includes("example") ||
    normalized.includes("placeholder")
  );
}

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || "587");
  const secure =
    String(process.env.SMTP_SECURE || "").toLowerCase() === "true"
      ? true
      : port === 465;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (
    !host ||
    !user ||
    !pass ||
    isLikelyPlaceholder(user) ||
    isLikelyPlaceholder(pass)
  ) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });
}

export async function POST(request: Request) {
  try {
    const payload = (await request
      .json()
      .catch(() => null)) as VerificationEmailRequest | null;

    const email = payload?.email?.trim();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required." },
        { status: 400 },
      );
    }

    const transporter = getTransporter();
    if (!transporter) {
      return NextResponse.json(
        {
          message:
            "SMTP is not configured correctly. Set valid SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, and SMTP_PASS values.",
        },
        { status: 500 },
      );
    }

    const fromAddress = process.env.MAIL_FROM || process.env.SMTP_USER;
    if (!fromAddress || isLikelyPlaceholder(fromAddress)) {
      return NextResponse.json(
        { message: "MAIL_FROM or SMTP_USER must be configured." },
        { status: 500 },
      );
    }

    if (isLikelyPlaceholder(process.env.EMAIL_VERIFICATION_SECRET)) {
      return NextResponse.json(
        {
          message:
            "EMAIL_VERIFICATION_SECRET is missing. Add a long random value in .env.local.",
        },
        { status: 500 },
      );
    }

    const token = createEmailVerificationToken(email);
    const requestUrl = new URL(request.url);
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.APP_BASE_URL ||
      `${requestUrl.protocol}//${requestUrl.host}`;
    const verificationLink = `${baseUrl}/verify-email?token=${encodeURIComponent(token)}`;

    await transporter.sendMail({
      from: fromAddress,
      to: email,
      subject: "NextStep Talent email verification",
      text: `Hello, verify your email by opening this link: ${verificationLink}`,
      html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
        <p style="margin: 0 0 12px;">Hello,</p>
        <p style="margin: 0 0 16px;">Please click the button below to verify your email address.</p>
        <p style="margin: 0 0 18px;">
          <a href="${verificationLink}" style="display:inline-block;background:#c8a96b;color:#111;padding:10px 16px;border-radius:8px;text-decoration:none;font-weight:600;">Verify Email</a>
        </p>
        <p style="margin: 0;">If the button does not work, copy this link into your browser:</p>
        <p style="margin: 8px 0 0; word-break: break-all;">${verificationLink}</p>
      </div>
    `,
    });

    return NextResponse.json({
      message: `Verification email sent to ${email}. Open the link in your inbox to verify your email.`,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to send verification email.";

    return NextResponse.json(
      { message: `Unable to send verification email: ${message}` },
      { status: 500 },
    );
  }
}
