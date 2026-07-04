This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create your local env file from the committed template:

```bash
cp .env.example .env.local
```

Then fill these values in `.env.local` (for local development), and set production values in Vercel:

- `NEXT_PUBLIC_APP_URL` (local development URL, usually `http://localhost:3000`)
- `APP_BASE_URL` (production public domain, for example `https://yourdomain.com`)
- `EMAIL_VERIFICATION_SECRET` (generate with `openssl rand -base64 48`)
- `SMTP_HOST` (`smtp.gmail.com` for Gmail)
- `SMTP_PORT` (`587`)
- `SMTP_SECURE` (`false` for 587)
- `SMTP_USER` (your full Gmail address)
- `SMTP_PASS` (Google App Password)
- `MAIL_FROM` (example: `NextStep Talent <your-gmail@gmail.com>`)

For Vercel deployments, set `APP_BASE_URL` in the Production environment to avoid verification emails containing localhost links.

Note: Do not commit `.env.local`. It is ignored by git for security.

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
