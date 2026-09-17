-- Billing schema: profiles, subscriptions, payments, webhook idempotency.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  stripe_customer_id text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id text primary key,
  user_id uuid not null references public.profiles (id) on delete cascade,
  stripe_customer_id text not null,
  status text not null,
  amount_cents integer not null default 0,
  currency text not null default 'usd',
  interval text not null default 'month',
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  canceled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.payments (
  id text primary key,
  user_id uuid not null references public.profiles (id) on delete cascade,
  subscription_id text references public.subscriptions (id) on delete set null,
  stripe_payment_intent_id text,
  amount_cents integer not null default 0,
  currency text not null default 'usd',
  status text not null,
  hosted_invoice_url text,
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.stripe_events (
  id text primary key,
  type text not null,
  processed_at timestamptz not null default now()
);

create index if not exists subscriptions_user_id_idx on public.subscriptions (user_id);
create index if not exists payments_user_id_idx on public.payments (user_id);

alter table public.profiles enable row level security;
alter table public.subscriptions enable row level security;
alter table public.payments enable row level security;
alter table public.stripe_events enable row level security;

create policy "profiles_select_own"
  on public.profiles
  for select
  to authenticated
  using (id = auth.uid());

create policy "subscriptions_select_own"
  on public.subscriptions
  for select
  to authenticated
  using (user_id = auth.uid());

create policy "payments_select_own"
  on public.payments
  for select
  to authenticated
  using (user_id = auth.uid());

-- stripe_events has no user_id; service role only.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
