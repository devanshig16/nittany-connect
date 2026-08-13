# Nittany Connect

A directory for parents of Penn State students to find each other by occupation, industry, and what they're looking for — trade work, business connections, hiring — instead of relying on word of mouth in a Facebook group.

Solo-built end to end: Next.js (App Router), Tailwind CSS, Auth.js (Google sign-in), Prisma + Postgres (Neon).

## Features

- Google sign-in via Auth.js
- Editable member profile (occupation, industry, company, bio, what you're looking for, links)
- Directory of public member profiles

## Local development

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in the values:

   ```bash
   cp .env.example .env
   ```

   - `DATABASE_URL` — a Postgres connection string (see [Database setup](#database-setup))
   - `AUTH_SECRET` — generate with `npx auth secret`
   - `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` — from the [Google Cloud Console](https://console.cloud.google.com/apis/credentials) (see [Google sign-in setup](#google-sign-in-setup))

3. Push the schema to your database:

   ```bash
   npx prisma db push
   ```

4. Run the dev server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Database setup

This project uses [Neon](https://neon.tech) Postgres with Prisma's `@prisma/adapter-neon` driver adapter (works well on Vercel's serverless/edge runtime).

1. Create a free project at [neon.tech](https://neon.tech) (or add the Neon integration from the Vercel dashboard: Storage → Create Database → Neon).
2. Copy the pooled connection string into `DATABASE_URL`.
3. Run `npx prisma db push` to create the tables (or `npx prisma migrate dev` once you want tracked migrations).

## Google sign-in setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/apis/credentials) and create (or select) a project.
2. Configure the OAuth consent screen (External, add your email as a test user while unpublished).
3. Create an **OAuth client ID** of type **Web application**.
4. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (local dev)
   - `https://<your-vercel-domain>/api/auth/callback/google` (production)
5. Copy the **Client ID** and **Client secret** into `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET`.

## Deploying to Vercel

1. Push this repo to GitHub (already done if you're reading this from the repo).
2. Import the repo at [vercel.com/new](https://vercel.com/new).
3. Add the Neon integration (Storage tab) or set `DATABASE_URL` manually in Project Settings → Environment Variables.
4. Add `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET` in Project Settings → Environment Variables.
5. Update the Google OAuth client's authorized redirect URI to include your production domain.
6. Deploy. After the first deploy, run `npx prisma db push` locally (pointed at the production `DATABASE_URL`) or set up a migration step in CI.
