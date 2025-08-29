-- Enable extensions
create extension if not exists pgcrypto;
create extension if not exists pg_trgm;

-- USERS PROFILE (linked to Supabase auth.users via trigger)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  avatar_url text,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "profiles are readable by anyone"
  on public.profiles for select
  using (true);

create policy "users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create a profile row after signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- POSTS
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references public.profiles(id) on delete cascade,
  media_type text check (media_type in ('image','video')) not null,
  media_url text not null,
  caption text,
  hashtags text[] default '{}',
  created_at timestamptz default now()
);

alter table public.posts enable row level security;

create policy "anyone can read posts"
  on public.posts for select
  using (true);

create policy "authenticated users can insert posts"
  on public.posts for insert
  with check (auth.role() = 'authenticated' and author_id = auth.uid());

create policy "authors can update their posts"
  on public.posts for update
  using (author_id = auth.uid());

create index if not exists idx_posts_created on public.posts (created_at desc);
create index if not exists idx_posts_caption_trgm on public.posts using gin (caption gin_trgm_ops);

-- LIKES
create table if not exists public.likes (
  user_id uuid references public.profiles(id) on delete cascade,
  post_id uuid references public.posts(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, post_id)
);

alter table public.likes enable row level security;

create policy "anyone can read likes"
  on public.likes for select
  using (true);

create policy "auth users can like"
  on public.likes for insert
  with check (auth.role() = 'authenticated' and user_id = auth.uid());

create policy "auth users can unlike"
  on public.likes for delete
  using (user_id = auth.uid());
