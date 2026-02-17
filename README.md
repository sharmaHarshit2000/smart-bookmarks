# Smart Bookmark App

Fullstack & GenAI Micro-Challenge Submission -- Abstrabit Technologies
Pvt Ltd

------------------------------------------------------------------------

## Live Demo

**Vercel URL:**\
https://smart-bookmarks-omega.vercel.app

**GitHub Repository:**\
https://github.com/sharmaHarshit2000/smart-bookmarks

------------------------------------------------------------------------

## Overview

Smart Bookmark App is a secure, real-time bookmark manager built using
Next.js (App Router), Supabase, and Tailwind CSS.

Users can authenticate using Google OAuth and manage their private
bookmarks with real-time synchronization across tabs and devices.

Each user's bookmarks are completely private and protected using
Supabase Row Level Security (RLS).

------------------------------------------------------------------------

## Features

### Authentication

-   Google OAuth login via Supabase Auth\
-   Secure session handling using HTTP-only cookies\
-   Protected routes using Next.js middleware

### Bookmark Management

-   Add bookmarks (Title + URL)\
-   Delete bookmarks\
-   Automatic URL normalization\
-   Private per-user storage

### Privacy & Security

-   Row Level Security (RLS) enabled\
-   Strict user isolation\
-   Server-side session validation

### Real-Time Updates

-   Instant sync across tabs and devices\
-   Uses Supabase Realtime subscriptions\
-   No page refresh required

------------------------------------------------------------------------

## Tech Stack

**Frontend** - Next.js 14 (App Router) - React - Tailwind CSS

**Backend** - Supabase - Authentication (Google OAuth) - PostgreSQL
Database - Realtime subscriptions - Row Level Security

**Deployment** - Vercel

------------------------------------------------------------------------

## Architecture Overview

**Client Layer** - Next.js Client Components - Supabase Browser Client -
Realtime subscriptions

**Server Layer** - Next.js Server Components - Supabase Server Client -
Middleware authentication protection

**Database Layer** - Supabase PostgreSQL - RLS policies for strict
isolation

------------------------------------------------------------------------

## Database Schema

``` sql
create table public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  url text not null,
  created_at timestamptz not null default now()
);
```

------------------------------------------------------------------------

## Row Level Security Policies

``` sql
alter table public.bookmarks enable row level security;

create policy "Bookmarks readable by owner"
on public.bookmarks
for select
to authenticated
using (auth.uid() = user_id);

create policy "Bookmarks insertable by owner"
on public.bookmarks
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Bookmarks deletable by owner"
on public.bookmarks
for delete
to authenticated
using (auth.uid() = user_id);
```

------------------------------------------------------------------------

## Real-Time Implementation

``` ts
supabase.channel("bookmarks")
.on("postgres_changes", {
  event: "*",
  schema: "public",
  table: "bookmarks",
  filter: `user_id=eq.${user.id}`,
}, callback)
.subscribe()
```

------------------------------------------------------------------------

## Environment Variables

Required variables:

    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

Configure these in Vercel Project Settings.

------------------------------------------------------------------------

## How to Run Locally

Clone repository:

``` bash
git clone https://github.com/sharmaHarshit2000/smart-bookmarks
cd smart-bookmarks
```

Install dependencies:

``` bash
npm install
```

Create `.env.local`:

``` env
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

Run:

``` bash
npm run dev
```

------------------------------------------------------------------------

## Problems Faced and Solutions

**Problem:** Supabase session handling with Next.js App Router\
**Solution:** Used Supabase SSR client with cookies API.

**Problem:** Real-time updates not triggering\
**Solution:** Implemented proper channel filtering and cleanup.

**Problem:** Ensuring strict privacy\
**Solution:** Implemented Row Level Security policies.

**Problem:** Protecting routes\
**Solution:** Used Next.js middleware authentication guard.

------------------------------------------------------------------------

## Production Architecture

User → Vercel (Next.js + Middleware)\
→ Supabase Auth (Google OAuth)\
→ Supabase PostgreSQL (RLS-secured database)\
→ Supabase Realtime (live updates)

------------------------------------------------------------------------

## AI Tools Used

-   ChatGPT -- architecture guidance, debugging, best practices\
-   Supabase Documentation -- authentication and realtime reference

AI was used responsibly as an assistant.

------------------------------------------------------------------------

## Contact

Harshit Sharma\
Email: harshitsharma9989@gmail.com\
GitHub: https://github.com/sharmaHarshit2000\
LinkedIn: https://www.linkedin.com/in/harshitsharma-tech

------------------------------------------------------------------------

## Submission

Submitted as part of Abstrabit Fullstack & GenAI Micro-Challenge.
