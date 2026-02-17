# Smart Bookmark App

Fullstack & GenAI Micro-Challenge Submission – Abstrabit Technologies Pvt Ltd

---

## Live Demo

**Vercel URL:**
https://your-vercel-url.vercel.app

**GitHub Repository:**
https://github.com/sharmaHarshit2000/smart-bookmarks

---

## Overview

Smart Bookmark App is a secure, real-time bookmark manager built using Next.js (App Router), Supabase, and Tailwind CSS.

Users can authenticate using Google OAuth and manage their private bookmarks with real-time synchronization across tabs and devices.

Each user’s bookmarks are completely private and protected using Supabase Row Level Security (RLS).

---

## Features

### Authentication

* Google OAuth login via Supabase Auth
* Secure session handling using HTTP-only cookies
* Protected routes using Next.js middleware

### Bookmark Management

* Add bookmarks (Title + URL)
* Delete bookmarks
* Bookmarks stored securely per user
* Automatic URL normalization

### Privacy & Security

* Row Level Security (RLS) enabled
* Users can only access their own bookmarks
* No cross-user data access possible

### Real-Time Updates

* Instant sync across tabs
* Uses Supabase Realtime subscriptions
* No page refresh required

### Deployment

* Fully deployed on Vercel
* Production-ready configuration
* Works with external Google accounts

---

## Tech Stack

Frontend

* Next.js 14 (App Router)
* React
* Tailwind CSS

Backend

* Supabase

  * Authentication (Google OAuth)
  * PostgreSQL Database
  * Realtime subscriptions
  * Row Level Security

Deployment

* Vercel

---

## Architecture Overview

Client Layer

* Next.js Client Components
* Supabase Browser Client
* Realtime subscriptions

Server Layer

* Next.js Server Components
* Supabase Server Client
* Middleware for authentication protection

Database Layer

* Supabase PostgreSQL
* RLS policies for data isolation

---

## Database Schema

```sql
create table public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  url text not null,
  created_at timestamptz not null default now()
);
```

---

## Row Level Security Policies

Ensures strict user isolation:

* Users can only SELECT their bookmarks
* Users can only INSERT their bookmarks
* Users can only DELETE their bookmarks

---

## Real-Time Implementation

Realtime updates are implemented using Supabase subscriptions:

```ts
supabase.channel("bookmarks")
.on("postgres_changes", {...})
.subscribe()
```

This ensures:

* Instant updates
* Cross-tab synchronization
* No manual refresh required

---

## Problems Faced and Solutions

### Problem 1: Supabase session handling with Next.js App Router

Issue:
Managing authentication session correctly between server and client.

Solution:
Used Supabase SSR client with Next.js cookies API to persist sessions securely.

---

### Problem 2: Real-time updates not triggering

Issue:
Realtime events were not firing due to incorrect subscription filtering.

Solution:
Added proper user_id filter and ensured correct channel cleanup and re-subscription.

---

### Problem 3: Ensuring strict privacy between users

Issue:
Without proper policies, users could potentially access other users’ bookmarks.

Solution:
Implemented Supabase Row Level Security policies using auth.uid() matching.

---

### Problem 4: Authentication protection on routes

Issue:
Unauthenticated users could access protected pages.

Solution:
Implemented Next.js middleware to protect routes and redirect unauthenticated users.

---

## Security Considerations

* Secure HTTP-only cookies
* Supabase RLS enforcement
* OAuth authentication
* Server-side session validation

---

## How to Run Locally

Clone repository:

```bash
git clone https://github.com/sharmaHarshit2000/smart-bookmarks
cd smart-bookmarks
```

Install dependencies:

```bash
npm install
```

Create `.env.local`

```env
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

Run:

```bash
npm run dev
```

---

## AI Tools Used

Yes, AI tools were used responsibly to improve productivity and code quality.

Tools used:

* ChatGPT – architecture guidance, debugging, best practices
* Supabase Docs – authentication and realtime reference

AI was used as an assistant, while all implementation, integration, and debugging were performed manually.

---

## Hardest Part of the Challenge

The most challenging part was implementing secure authentication with Supabase using Next.js App Router while maintaining proper session handling between client, server components, and middleware.

Ensuring real-time updates worked reliably alongside strict Row Level Security was also technically complex.

---

## Requirements Checklist

| Requirement                | Status    |
| -------------------------- | --------- |
| Google OAuth Login         | Completed |
| Private bookmarks per user | Completed |
| Add bookmark               | Completed |
| Delete bookmark            | Completed |
| Real-time updates          | Completed |
| Vercel deployment          | Completed |
| Secure authentication      | Completed |

---

## Deployment

Production deployment using Vercel:

* Environment variables configured
* Supabase connected
* OAuth redirect configured

---

## Contact Information

Full Name: Harshit Sharma
Email: [harshitsharma9989@gmail.com](mailto:harshitsharma9989@gmail.com)
Contact Number: +91-9369966830

GitHub: https://github.com/sharmaHarshit2000
LinkedIn: https://www.linkedin.com/in/harshitsharma-tech

---

## Submission

This project was developed and submitted as part of the Abstrabit Fullstack & AI/ML Micro-Challenge.

Thank you for reviewing my submission.
