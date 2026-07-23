-- Sabrina Site Database Schema

-- User profiles with roles
create type user_role as enum ('admin', 'manager');

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role user_role not null default 'manager',
  created_at timestamptz not null default now()
);

-- Site settings (admin only)
create table site_settings (
  key text primary key,
  value_en text,
  value_ru text,
  updated_at timestamptz not null default now()
);

-- Page content (About, Contact, Donate)
create table pages (
  slug text primary key,
  title_en text not null default '',
  title_ru text not null default '',
  content_en text not null default '',
  content_ru text not null default '',
  updated_at timestamptz not null default now()
);

-- Videos
create table videos (
  id uuid primary key default gen_random_uuid(),
  title_en text not null default '',
  title_ru text not null default '',
  description_en text not null default '',
  description_ru text not null default '',
  media_url text not null,
  thumbnail_url text,
  sort_order int not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

-- Photos
create table photos (
  id uuid primary key default gen_random_uuid(),
  title_en text not null default '',
  title_ru text not null default '',
  media_url text not null,
  category text not null default 'general',
  sort_order int not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

-- Audio
create table audio (
  id uuid primary key default gen_random_uuid(),
  title_en text not null default '',
  title_ru text not null default '',
  description_en text not null default '',
  description_ru text not null default '',
  media_url text not null,
  cover_url text,
  sort_order int not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

-- News
create table news (
  id uuid primary key default gen_random_uuid(),
  title_en text not null default '',
  title_ru text not null default '',
  content_en text not null default '',
  content_ru text not null default '',
  featured_image text,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

-- Social links
create table social_links (
  id uuid primary key default gen_random_uuid(),
  platform text not null,
  url text not null,
  sort_order int not null default 0,
  visible boolean not null default true
);

-- Seed default pages
insert into pages (slug, title_en, title_ru) values
  ('about', 'About Me', 'Обо мне'),
  ('contact', 'Contact', 'Контакт'),
  ('donate', 'Donate', 'Донат');

-- RLS policies (enable after Supabase setup)
-- alter table profiles enable row level security;
-- Public read for published content, authenticated write for managers/admins
