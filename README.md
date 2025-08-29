# Memely Starter (No-Code-Friendly MVP)

A minimal meme + 30s video sharing web app you can deploy with **Vercel** (frontend) and **Supabase** (Auth + DB + Storage). 
No complex backend required. This MVP supports:

- Email magic-link sign-in (Supabase Auth)
- Upload images (PNG/JPEG/WebP) or short videos (MP4 ≤ 30s) to Supabase Storage
- Create posts with captions
- Home feed with infinite-like scrolling (simple "Load more" button in MVP)
- Like posts

## What you need
1. A free **Supabase** account (supabase.com).
2. A free **Vercel** account (vercel.com).

---

## 1) Set up Supabase

1. Create a new Supabase project. Copy your **Project URL** and **Anon Key**.
2. In Supabase > SQL editor, run the SQL in `supabase.sql` (from this repo).
3. Go to **Storage** and create two buckets:
   - `images` (public)
   - `videos` (public)
4. In **Authentication > Providers**, keep **Email** enabled (magic link). You can also enable **Google** later.
5. In **Authentication > URL Configuration**, set your **Site URL** to your future Vercel domain (you can update later).

## 2) Deploy the app to Vercel

1. Create a new GitHub repo from these files (upload the zip or push).
2. On Vercel, import the repo and set the following **Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL` = your Supabase Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your Supabase anon key
   - `NEXT_PUBLIC_SITE_URL` = your site URL (e.g. https://yourapp.vercel.app)
3. Click **Deploy**.

## 3) Local dev (optional)
```bash
npm install
npm run dev
```

Open http://localhost:3000

## Usage
- Go to `/login` to sign in (email magic link)
- Go to `/upload` to add memes or videos (max 30s)
- Home page `/` shows the feed newest-first.

## Notes
- This is an MVP. For serious production, add: moderation, CDN, webhooks for video processing/transcoding. 
- Video is stored and streamed directly from Supabase Storage. Keep files short (≤ 30s) and moderate size to ensure smooth playback.

## Troubleshooting
- If you see auth errors, ensure your `NEXT_PUBLIC_SITE_URL` matches the domain in Supabase Auth settings (or add it as an additional redirect).
- Ensure both storage buckets are **public** and that the RLS policies from `supabase.sql` were executed.
