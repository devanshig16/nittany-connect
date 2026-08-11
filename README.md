# Nittany Connect

A minimal, clean site for parents of Penn State students to meet each other, talk trade, occupations, and business, and connect to work together.

Built with Next.js (App Router), Tailwind CSS, Auth.js (Google sign-in), and Prisma + Postgres (Neon).

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
