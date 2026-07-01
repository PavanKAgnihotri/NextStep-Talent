import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

import { createEmailVerificationToken } from "@/lib/email-verification-token";

type VerificationEmailRequest = {
  email?: string;
};

type MailTransporter = ReturnType<typeof nodemailer.createTransport>;

type TransportConfig = {
  transporter: MailTransporter;
  host: string;
  user: string;
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

function getTransporter(): TransportConfig | null {
  const host = process.env.SMTP_HOST?.trim();
  const port = Number(process.env.SMTP_PORT || "587");
  const secure =
    String(process.env.SMTP_SECURE || "").toLowerCase() === "true"
      ? true
      : port === 465;
  const user = process.env.SMTP_USER?.trim();
  const passRaw = process.env.SMTP_PASS?.trim();
  const isGmailHost = Boolean(host && host.toLowerCase().includes("gmail"));
  const pass = isGmailHost
    ? (passRaw || "").replace(/\s+/g, "")
    : (passRaw ?? "");

  if (
    !host ||
    !user ||
    !pass ||
    isLikelyPlaceholder(user) ||
    isLikelyPlaceholder(pass)
  ) {
    return null;
  }

  return {
    host,
    user,
    transporter: nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
    }),
  };
}

function extractEmailAddress(fromValue: string): string {
  const match = fromValue.match(/<([^>]+)>/);
  if (match?.[1]) return match[1].trim().toLowerCase();
  return fromValue.trim().toLowerCase();
}

function extractDisplayName(fromValue: string): string | null {
  const idx = fromValue.indexOf("<");
  if (idx <= 0) return null;
  const name = fromValue.slice(0, idx).trim();
  return name || null;
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

    const transportConfig = getTransporter();
    if (!transportConfig) {
      return NextResponse.json(
        {
          message:
            "SMTP is not configured correctly. Set valid SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, and SMTP_PASS values.",
        },
        { status: 500 },
      );
    }

    const fromAddress = (
      process.env.MAIL_FROM ||
      process.env.SMTP_USER ||
      ""
    ).trim();
    if (!fromAddress || isLikelyPlaceholder(fromAddress)) {
      return NextResponse.json(
        { message: "MAIL_FROM or SMTP_USER must be configured." },
        { status: 500 },
      );
    }

    const isGmailHost = transportConfig.host.toLowerCase().includes("gmail");
    const mailFromEmail = extractEmailAddress(fromAddress);
    const smtpUserEmail = transportConfig.user.trim().toLowerCase();
    const displayName = extractDisplayName(fromAddress);

    // Gmail usually requires the envelope/header from address to match the authenticated user.
    const effectiveFrom =
      isGmailHost && mailFromEmail !== smtpUserEmail
        ? displayName
          ? `${displayName} <${transportConfig.user}>`
          : transportConfig.user
        : fromAddress;

    const replyTo =
      isGmailHost && mailFromEmail !== smtpUserEmail ? fromAddress : undefined;

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

    await transportConfig.transporter.sendMail({
      from: effectiveFrom,
      replyTo,
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
