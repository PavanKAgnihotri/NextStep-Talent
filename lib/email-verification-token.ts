import { createHmac, timingSafeEqual } from "node:crypto";

type TokenPayload = {
  email: string;
  exp: number;
};

function getSecret(): string {
  const secret = process.env.EMAIL_VERIFICATION_SECRET;
  if (!secret) {
    throw new Error(
      "EMAIL_VERIFICATION_SECRET is not configured. Add it to .env.local.",
    );
  }
  return secret;
}

function toBase64Url(value: string): string {
  return Buffer.from(value, "utf8").toString("base64url");
}

function fromBase64Url(value: string): string {
  return Buffer.from(value, "base64url").toString("utf8");
}

function signValue(value: string, secret: string): string {
  return createHmac("sha256", secret).update(value).digest("base64url");
}

export function createEmailVerificationToken(
  email: string,
  expiresInMinutes = 30,
): string {
  const payload: TokenPayload = {
    email,
    exp: Math.floor(Date.now() / 1000) + expiresInMinutes * 60,
  };
  const payloadPart = toBase64Url(JSON.stringify(payload));
  const signaturePart = signValue(payloadPart, getSecret());
  return `${payloadPart}.${signaturePart}`;
}

export function verifyEmailVerificationToken(token: string): {
  ok: boolean;
  email?: string;
  message?: string;
} {
  const [payloadPart, signaturePart] = token.split(".");
  if (!payloadPart || !signaturePart) {
    return { ok: false, message: "Invalid verification token." };
  }

  const expectedSignature = signValue(payloadPart, getSecret());
  const a = Buffer.from(signaturePart);
  const b = Buffer.from(expectedSignature);

  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return { ok: false, message: "Invalid verification token signature." };
  }

  const parsed = JSON.parse(fromBase64Url(payloadPart)) as TokenPayload;
  if (!parsed.email || !parsed.exp) {
    return { ok: false, message: "Invalid verification token payload." };
  }

  if (parsed.exp < Math.floor(Date.now() / 1000)) {
    return { ok: false, message: "Verification token has expired." };
  }

  return { ok: true, email: parsed.email };
}
