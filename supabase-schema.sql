-- Run this in your Supabase SQL Editor

-- Create profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Create policies
create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Create notes table
create table public.notes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  content text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.notes enable row level security;

create policy "Users can view own notes"
  on notes for select
  using ( auth.uid() = user_id );

create policy "Users can insert own notes"
  on notes for insert
  with check ( auth.uid() = user_id );

create policy "Users can update own notes"
  on notes for update
  using ( auth.uid() = user_id );

create policy "Users can delete own notes"
  on notes for delete
  using ( auth.uid() = user_id );

-- Create events table
create table public.events (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  description text,
  date timestamp with time zone not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.events enable row level security;

create policy "Users can view own events"
  on events for select
  using ( auth.uid() = user_id );

create policy "Users can insert own events"
  on events for insert
  with check ( auth.uid() = user_id );

create policy "Users can update own events"
  on events for update
  using ( auth.uid() = user_id );

create policy "Users can delete own events"
  on events for delete
  using ( auth.uid() = user_id );

-- Create checklists table
create table public.checklists (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  items jsonb default '[]'::jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.checklists enable row level security;

create policy "Users can view own checklists"
  on checklists for select
  using ( auth.uid() = user_id );

create policy "Users can insert own checklists"
  on checklists for insert
  with check ( auth.uid() = user_id );

create policy "Users can update own checklists"
  on checklists for update
  using ( auth.uid() = user_id );

create policy "Users can delete own checklists"
  on checklists for delete
  using ( auth.uid() = user_id );

-- Function to handle new user signup
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$;

-- Trigger for new user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
