-- ============================================================
-- RLS Verification Script — Stage 8 Security Pass
-- Run this in Supabase Dashboard > SQL Editor and review the output.
-- This only READS policy metadata — it does not change anything.
-- ============================================================

-- 1. Confirm RLS is enabled on every table that holds real data
select
  schemaname,
  tablename,
  rowsecurity as rls_enabled
from pg_tables
where schemaname = 'public'
  and tablename in (
    'profiles', 'projects', 'contact_messages', 'settings',
    'blog_posts', 'testimonials', 'skills', 'services'
  )
order by tablename;
-- Expect: rls_enabled = true for every row. If any say false,
-- run: alter table <name> enable row level security;

-- 2. List every policy currently active, per table
select
  tablename,
  policyname,
  cmd as applies_to,
  roles
from pg_policies
where schemaname = 'public'
order by tablename, cmd;
-- Expect to see, at minimum:
--   projects: public select, authenticated insert/update/delete
--   contact_messages: anon+authenticated insert, authenticated select/update/delete
--   settings: public select, authenticated insert/update
--   profiles: authenticated select/update (own row only)

-- 3. Confirm storage bucket policies exist for all three buckets
select
  policyname,
  cmd as applies_to,
  roles
from pg_policies
where schemaname = 'storage' and tablename = 'objects'
order by policyname;
-- Expect entries for project-images, resume, and avatars covering
-- select (public) and insert/update/delete (authenticated).

-- 4. Confirm storage buckets exist and their public/private setting
select id, name, public from storage.buckets;
-- Expect: project-images = true, resume = true, avatars = true
