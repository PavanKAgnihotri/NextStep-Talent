import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

type VerificationEmailRequest = {
  email?: string;
  code?: string;
};

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });
}

export async function POST(request: Request) {
  const payload = (await request
    .json()
    .catch(() => null)) as VerificationEmailRequest | null;

  const email = payload?.email?.trim();
  const code = payload?.code?.trim();

  if (!email || !code) {
    return NextResponse.json(
      { message: "Email and verification code are required." },
      { status: 400 },
    );
  }

  const transporter = getTransporter();
  if (!transporter) {
    return NextResponse.json(
      {
        message:
          "SMTP is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASS.",
      },
      { status: 500 },
    );
  }

  const fromAddress = process.env.MAIL_FROM || process.env.SMTP_USER;
  if (!fromAddress) {
    return NextResponse.json(
      { message: "MAIL_FROM or SMTP_USER must be configured." },
      { status: 500 },
    );
  }

  await transporter.sendMail({
    from: fromAddress,
    to: email,
    subject: "NextTalent verification code",
    text: `Hello, your NextTalent verification code is ${code}. Enter this code to confirm your email address.`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
        <h2 style="margin: 0 0 12px; color: #b8860b;">NextTalent verification code</h2>
        <p style="margin: 0 0 12px;">Hello,</p>
        <p style="margin: 0 0 16px;">Your verification code is <strong style="font-size: 20px; letter-spacing: 0.2em;">${code}</strong>.</p>
        <p style="margin: 0;">Enter this code in the profile submission form to confirm your email address.</p>
      </div>
    `,
  });

  return NextResponse.json({
    message: `Verification email sent to ${email}. Enter the 6-digit code below to continue.`,
  });
}
