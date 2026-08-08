-- Vercel tokens: one per user, value stored encrypted via Supabase Vault.
-- The plaintext token never lands in a client-writable column — it only
-- ever exists inside vault.secrets, written and read through the
-- security-definer functions below.
create extension if not exists supabase_vault cascade;

create table public.vercel_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  secret_id uuid not null references vault.secrets (id) on delete cascade,
  label text not null default 'default',
  created_at timestamptz not null default now()
);

alter table public.vercel_tokens enable row level security;

create policy "Users can view their own token metadata"
  on public.vercel_tokens for select
  using (auth.uid() = user_id);

create policy "Users can delete their own token"
  on public.vercel_tokens for delete
  using (auth.uid() = user_id);

-- Store (or replace) the current user's Vercel token.
create function public.store_vercel_token(p_token text, p_label text default 'default')
returns void
language plpgsql
security definer
set search_path = public, vault
as $$
declare
  v_old_secret_id uuid;
  v_new_secret_id uuid;
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;

  select secret_id into v_old_secret_id
  from public.vercel_tokens
  where user_id = auth.uid();

  v_new_secret_id := vault.create_secret(p_token, auth.uid()::text || '-vercel-token');

  insert into public.vercel_tokens (user_id, secret_id, label)
  values (auth.uid(), v_new_secret_id, p_label)
  on conflict (user_id)
  do update set secret_id = excluded.secret_id, label = excluded.label;

  if v_old_secret_id is not null then
    delete from vault.secrets where id = v_old_secret_id;
  end if;
end;
$$;

revoke all on function public.store_vercel_token(text, text) from public;
grant execute on function public.store_vercel_token(text, text) to authenticated;

-- Server-only: decrypt the current user's token for calling the Vercel API.
-- Not granted to anon/authenticated — only reachable via the service role
-- from trusted server code (see lib/vercel-api.js in phase 3).
create function public.get_decrypted_vercel_token(p_user_id uuid)
returns text
language plpgsql
security definer
set search_path = public, vault
as $$
declare
  v_token text;
begin
  select decrypted_secret into v_token
  from vault.decrypted_secrets ds
  join public.vercel_tokens vt on vt.secret_id = ds.id
  where vt.user_id = p_user_id;

  return v_token;
end;
$$;

revoke all on function public.get_decrypted_vercel_token(uuid) from public, authenticated, anon;
