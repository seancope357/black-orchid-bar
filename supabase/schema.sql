-- Extensions & Enums
create extension if not exists "uuid-ossp";
create type app_role as enum ('client', 'bartender', 'admin');
create type approval_status as enum ('pending', 'approved', 'rejected');
create type booking_status as enum ('inquiry', 'confirmed', 'completed', 'cancelled');

-- Core User Tables
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  role app_role default 'client',
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.bartender_details (
  user_id uuid references public.profiles(id) on delete cascade primary key,
  stripe_account_id text,
  approval_status approval_status default 'pending',
  hourly_rate integer,
  years_experience integer,
  is_tabc_certified boolean default false,
  specialties text[],
  service_area text,
  bio text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Commerce & Bookings
create table public.bookings (
  id uuid default uuid_generate_v4() primary key,
  client_id uuid references public.profiles(id) on delete cascade,
  bartender_id uuid references public.profiles(id) on delete cascade,
  event_date timestamp with time zone not null,
  event_duration_hours integer not null,
  guest_count integer not null,
  event_type text,
  special_requests text,
  status booking_status default 'inquiry',
  total_amount numeric(10,2),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Dry Hire & Knowledge Base
create table public.service_addons (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  price numeric(10,2) not null,
  unit text not null,
  category text,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.shopping_guides (
  id uuid default uuid_generate_v4() primary key,
  spirit_type text not null,
  standard_pour_oz numeric(4,2) not null,
  servings_per_bottle integer not null,
  recommended_brand_call text,
  recommended_brand_premium text,
  recommended_brand_top_shelf text,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.cocktails (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  type text not null,
  ingredients text[] not null,
  glassware text,
  method text,
  flavor_profile text,
  difficulty text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.safety_rules (
  id uuid default uuid_generate_v4() primary key,
  category text not null,
  rule_text text not null,
  severity text default 'medium',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Stripe Logging
create table public.payments (
  id uuid default uuid_generate_v4() primary key,
  booking_id uuid references public.bookings(id) on delete set null,
  stripe_payment_intent_id text unique,
  stripe_charge_id text,
  amount_cents integer not null,
  currency text default 'usd',
  status text not null,
  metadata jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Security (RLS)
alter table public.profiles enable row level security;
alter table public.bartender_details enable row level security;
alter table public.bookings enable row level security;
alter table public.service_addons enable row level security;
alter table public.shopping_guides enable row level security;
alter table public.cocktails enable row level security;
alter table public.safety_rules enable row level security;
alter table public.payments enable row level security;

-- RLS Policies for Profiles
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- RLS Policies for Bartender Details
create policy "Approved bartenders are viewable by everyone"
  on public.bartender_details for select
  using (approval_status = 'approved' or auth.uid() = user_id);

create policy "Bartenders can insert their own details"
  on public.bartender_details for insert
  with check (auth.uid() = user_id);

create policy "Bartenders can update their own details"
  on public.bartender_details for update
  using (auth.uid() = user_id);

-- RLS Policies for Bookings
create policy "Users can view their own bookings"
  on public.bookings for select
  using (auth.uid() = client_id or auth.uid() = bartender_id);

create policy "Clients can create bookings"
  on public.bookings for insert
  with check (auth.uid() = client_id);

create policy "Participants can update bookings"
  on public.bookings for update
  using (auth.uid() = client_id or auth.uid() = bartender_id);

-- RLS Policies for Knowledge Base (Public Read)
create policy "Public knowledge: service addons"
  on public.service_addons for select
  using (true);

create policy "Public knowledge: shopping guides"
  on public.shopping_guides for select
  using (true);

create policy "Public knowledge: cocktails"
  on public.cocktails for select
  using (true);

create policy "Public knowledge: safety rules"
  on public.safety_rules for select
  using (true);

-- RLS Policies for Payments
create policy "Users can view their own payments"
  on public.payments for select
  using (
    exists (
      select 1 from public.bookings
      where bookings.id = payments.booking_id
      and (bookings.client_id = auth.uid() or bookings.bartender_id = auth.uid())
    )
  );

-- Indexes for Performance
create index idx_profiles_role on public.profiles(role);
create index idx_bartender_details_approval_status on public.bartender_details(approval_status);
create index idx_bookings_client_id on public.bookings(client_id);
create index idx_bookings_bartender_id on public.bookings(bartender_id);
create index idx_bookings_event_date on public.bookings(event_date);
create index idx_bookings_status on public.bookings(status);
create index idx_payments_booking_id on public.payments(booking_id);
create index idx_payments_stripe_payment_intent_id on public.payments(stripe_payment_intent_id);

-- Updated At Triggers
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger handle_updated_at before update on public.profiles
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at before update on public.bartender_details
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at before update on public.bookings
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at before update on public.payments
  for each row execute procedure public.handle_updated_at();
