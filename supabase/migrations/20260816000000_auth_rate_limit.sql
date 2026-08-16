-- Brute-force protection for auth actions (sign in, sign up, magic link,
-- password reset). Tracked per identifier (email or client IP) + action,
-- checked and recorded atomically via a security-definer function so the
-- anon-scoped client used pre-auth can call it without needing broad
-- table access.
create table public.auth_attempts (
  id uuid primary key default gen_random_uuid(),
  identifier text not null,
  action text not null,
  created_at timestamptz not null default now()
);

create index auth_attempts_lookup_idx
  on public.auth_attempts (identifier, action, created_at desc);

alter table public.auth_attempts enable row level security;
-- No policies: only reachable through the security-definer function below.

create function public.check_auth_rate_limit(
  p_identifier text,
  p_action text,
  p_max_attempts int default 5,
  p_window_minutes int default 15
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count int;
begin
  -- Opportunistic cleanup — keeps the table small without needing a cron job.
  delete from public.auth_attempts where created_at < now() - interval '1 day';

  select count(*) into v_count
  from public.auth_attempts
  where identifier = lower(p_identifier)
    and action = p_action
    and created_at > now() - (p_window_minutes || ' minutes')::interval;

  if v_count >= p_max_attempts then
    return false;
  end if;

  insert into public.auth_attempts (identifier, action)
  values (lower(p_identifier), p_action);

  return true;
end;
$$;

revoke all on function public.check_auth_rate_limit(text, text, int, int) from public;
grant execute on function public.check_auth_rate_limit(text, text, int, int) to anon, authenticated;
