-- =========================================================================
-- AUTO-CREATE PROFILE ON AUTH SIGN-UP
-- =========================================================================
-- This trigger fires after a new user is inserted into auth.users.
-- It creates the corresponding row in the public.profiles table so that
-- the RLS policies and role-based redirects work correctly from the very
-- first session.
-- =========================================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role, barbershop_id)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'role', 'client'),
    -- Admins and barbers get associated to the default shop automatically.
    -- Clients get NULL (they are not shop staff).
    case
      when coalesce(new.raw_user_meta_data->>'role', 'client') in ('admin', 'barber')
      then '11111111-1111-1111-1111-111111111111'::uuid
      else null
    end
  )
  on conflict (id) do nothing; -- Idempotent: never fail if called twice
  return new;
end;
$$;

-- Attach the trigger to auth.users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =========================================================================
-- RLS POLICIES
-- =========================================================================
-- Allow any authenticated user to read and update their own profile.
-- (These are additive to any existing policies in the init migration.)
-- =========================================================================

-- Allow newly registered clients to insert their own profile row as a fallback
-- (the trigger covers this, but this policy is a safety net if needed from the client).
do $$ begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename  = 'profiles'
      and policyname = 'Users can insert own profile'
  ) then
    execute 'create policy "Users can insert own profile" on profiles
             for insert with check (auth.uid() = id)';
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename  = 'profiles'
      and policyname = 'Users can update own profile'
  ) then
    execute 'create policy "Users can update own profile" on profiles
             for update using (auth.uid() = id)';
  end if;
end $$;
