-- Admin offers: per-customer retainers, admin flag, RLS.

alter table public.profiles
  add column if not exists is_admin boolean not null default false;

create table if not exists public.offers (
  id uuid primary key default gen_random_uuid(),
  customer_user_id uuid not null references public.profiles (id) on delete cascade,
  customer_email text,
  amount_cents integer not null check (amount_cents > 0),
  currency text not null default 'usd',
  interval text not null default 'month',
  note text,
  status text not null default 'pending'
    check (status in ('pending', 'accepted', 'declined', 'revoked', 'expired')),
  expires_at timestamptz,
  accepted_at timestamptz,
  declined_at timestamptz,
  revoked_at timestamptz,
  stripe_checkout_session_id text,
  subscription_id text references public.subscriptions (id) on delete set null,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists offers_customer_user_id_idx on public.offers (customer_user_id);
create index if not exists offers_status_idx on public.offers (status);

alter table public.offers enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select is_admin from public.profiles where id = auth.uid()),
    false
  );
$$;

create or replace function public.decline_offer(offer_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.offers
  set
    status = 'declined',
    declined_at = now(),
    updated_at = now()
  where id = offer_id
    and customer_user_id = auth.uid()
    and status = 'pending'
    and (expires_at is null or expires_at > now());

  if not found then
    raise exception 'Offer cannot be declined';
  end if;
end;
$$;

revoke all on function public.is_admin() from public;
revoke all on function public.decline_offer(uuid) from public;
grant execute on function public.is_admin() to authenticated;
grant execute on function public.decline_offer(uuid) to authenticated;

drop policy if exists "profiles_select_admin" on public.profiles;
create policy "profiles_select_admin"
  on public.profiles
  for select
  to authenticated
  using (public.is_admin());

drop policy if exists "offers_select_own" on public.offers;
create policy "offers_select_own"
  on public.offers
  for select
  to authenticated
  using (customer_user_id = auth.uid());

drop policy if exists "offers_select_admin" on public.offers;
create policy "offers_select_admin"
  on public.offers
  for select
  to authenticated
  using (public.is_admin());

drop policy if exists "offers_insert_admin" on public.offers;
create policy "offers_insert_admin"
  on public.offers
  for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "offers_update_admin" on public.offers;
create policy "offers_update_admin"
  on public.offers
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- After you sign in once:
--   update profiles set is_admin = true where email = 'you@domain';
