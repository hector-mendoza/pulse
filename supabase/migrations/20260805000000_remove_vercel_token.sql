-- Cleanly disconnect the current user's Vercel token: remove the vault
-- secret first, then the pointer row (avoids relying on cascade ordering).
create function public.remove_vercel_token()
returns void
language plpgsql
security definer
set search_path = public, vault
as $$
declare
  v_secret_id uuid;
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;

  select secret_id into v_secret_id
  from public.vercel_tokens
  where user_id = auth.uid();

  if v_secret_id is not null then
    delete from vault.secrets where id = v_secret_id;
  end if;

  delete from public.vercel_tokens where user_id = auth.uid();
end;
$$;

revoke all on function public.remove_vercel_token() from public;
grant execute on function public.remove_vercel_token() to authenticated;
