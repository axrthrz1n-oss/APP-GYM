-- Ficha de Treino: banco de dados da conta na nuvem (Supabase).
-- Rode este arquivo uma vez em SQL Editor → New query → Run.
-- Pode rodar de novo sem problema: ele só cria o que ainda não existe.

-- Registros de cada pessoa: treinos (log/sessions/<id>), plano (plan) e configurações (config).
create table if not exists public.user_docs (
  user_id    uuid        not null default auth.uid() references auth.users (id) on delete cascade,
  path       text        not null check (char_length(path) between 1 and 200),
  data       jsonb       not null check (octet_length(data::text) <= 200000),
  updated_at timestamptz not null default now(),
  primary key (user_id, path)
);

alter table public.user_docs enable row level security;

-- Cada pessoa só lê e grava os próprios registros.
drop policy if exists "user_docs: dono lê" on public.user_docs;
create policy "user_docs: dono lê" on public.user_docs
  for select to authenticated using (user_id = auth.uid());

drop policy if exists "user_docs: dono cria" on public.user_docs;
create policy "user_docs: dono cria" on public.user_docs
  for insert to authenticated with check (user_id = auth.uid());

drop policy if exists "user_docs: dono altera" on public.user_docs;
create policy "user_docs: dono altera" on public.user_docs
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "user_docs: dono apaga" on public.user_docs;
create policy "user_docs: dono apaga" on public.user_docs
  for delete to authenticated using (user_id = auth.uid());

-- Avisa o app em tempo real quando outro aparelho da mesma conta salva algo.
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'user_docs'
  ) then
    alter publication supabase_realtime add table public.user_docs;
  end if;
end $$;

-- Uso diário do personal virtual, para limitar o custo da API por pessoa.
-- Ninguém grava aqui direto: só a função personal_use(), chamada pela função "personal".
create table if not exists public.ai_usage (
  user_id uuid not null references auth.users (id) on delete cascade,
  day     date not null,
  count   integer not null default 0,
  primary key (user_id, day)
);

alter table public.ai_usage enable row level security;

drop policy if exists "ai_usage: dono lê" on public.ai_usage;
create policy "ai_usage: dono lê" on public.ai_usage
  for select to authenticated using (user_id = auth.uid());

-- Soma 1 ao uso de hoje de quem chamou e devolve o total do dia.
create or replace function public.personal_use()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  n integer;
begin
  if auth.uid() is null then
    raise exception 'não autenticado';
  end if;
  insert into public.ai_usage as u (user_id, day, count)
  values (auth.uid(), current_date, 1)
  on conflict (user_id, day) do update set count = u.count + 1
  returning u.count into n;
  return n;
end;
$$;

revoke all on function public.personal_use() from public, anon;
grant execute on function public.personal_use() to authenticated;
