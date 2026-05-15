-- ═══════════════════════════════════════════════════════════════
-- ELITE ATACADO BRASIL — Schema Supabase
-- Execute este arquivo no SQL Editor do Supabase (https://supabase.com/dashboard)
-- ═══════════════════════════════════════════════════════════════

-- ─── 1. PROFILES (estende auth.users) ────────────────────────
create table if not exists public.profiles (
  id        uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role      text not null default 'member' check (role in ('admin', 'member')),
  active    boolean not null default true,
  created_at timestamptz not null default now()
);

-- ─── 2. SUPPLIERS (fornecedores) ─────────────────────────────
create table if not exists public.suppliers (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  category    text not null,               -- Feminino | Masculino | Infantil | Beleza
  subcategory text not null,
  location    text not null,
  whatsapp    text,                        -- número sem formatação ex: 5511999999999
  instagram   text,                        -- @usuario
  box_number  text,                        -- ex: Box 31, Galeria Crystal
  min_order   text,                        -- ex: 12 peças | R$ 500,00
  shipping    text,                        -- descrição do envio
  image_url   text,                        -- URL da foto
  is_factory  boolean not null default false,
  active      boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ─── 3. FAVORITES (favoritos por usuário) ────────────────────
create table if not exists public.favorites (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  supplier_id uuid not null references public.suppliers(id) on delete cascade,
  created_at  timestamptz not null default now(),
  unique (user_id, supplier_id)
);

-- ═══════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY
-- ═══════════════════════════════════════════════════════════════

alter table public.profiles  enable row level security;
alter table public.suppliers enable row level security;
alter table public.favorites enable row level security;

-- ─── Policies: profiles ───────────────────────────────────────
create policy "Usuário vê próprio perfil"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Usuário atualiza próprio perfil"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Admin vê todos os perfis"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- ─── Policies: suppliers ──────────────────────────────────────
create policy "Membros autenticados veem fornecedores ativos"
  on public.suppliers for select
  to authenticated
  using (active = true);

create policy "Admin vê todos os fornecedores"
  on public.suppliers for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

create policy "Admin gerencia fornecedores"
  on public.suppliers for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- ─── Policies: favorites ──────────────────────────────────────
create policy "Usuário vê próprios favoritos"
  on public.favorites for select
  using (auth.uid() = user_id);

create policy "Usuário adiciona favorito"
  on public.favorites for insert
  with check (auth.uid() = user_id);

create policy "Usuário remove favorito"
  on public.favorites for delete
  using (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════════════
-- FUNÇÕES E TRIGGERS
-- ═══════════════════════════════════════════════════════════════

-- Cria perfil automaticamente ao registrar novo usuário
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    'member'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Atualiza updated_at automaticamente em suppliers
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists suppliers_updated_at on public.suppliers;
create trigger suppliers_updated_at
  before update on public.suppliers
  for each row execute function public.set_updated_at();

-- ═══════════════════════════════════════════════════════════════
-- TORNAR PRIMEIRO USUÁRIO ADMIN (execute após criar sua conta)
-- Substitua 'seu@email.com' pelo e-mail do administrador
-- ═══════════════════════════════════════════════════════════════
/*
update public.profiles
set role = 'admin'
where id = (
  select id from auth.users where email = 'seu@email.com'
);
*/
