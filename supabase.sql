create table if not exists public.driver_locations(driver_id text primary key,driver_name text not null,latitude double precision,longitude double precision,accuracy double precision,speed double precision,heading double precision,active boolean not null default false,updated_at timestamptz not null default now());
alter table public.driver_locations enable row level security;
drop policy if exists "v1 read" on public.driver_locations; drop policy if exists "v1 insert" on public.driver_locations; drop policy if exists "v1 update" on public.driver_locations;
create policy "v1 read" on public.driver_locations for select to anon using(true);
create policy "v1 insert" on public.driver_locations for insert to anon with check(driver_id='repartidor-1');
create policy "v1 update" on public.driver_locations for update to anon using(driver_id='repartidor-1') with check(driver_id='repartidor-1');
grant select,insert,update on public.driver_locations to anon;
do $$ begin alter publication supabase_realtime add table public.driver_locations; exception when duplicate_object then null; end $$;