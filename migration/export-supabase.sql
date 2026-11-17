-- Run locally with psql, using a read-capable Supabase database connection.
-- This output contains private data and password hashes.
select jsonb_build_object(
  'users', coalesce((
    select jsonb_agg(jsonb_build_object(
      'uid',u.id,'email',u.email,'hash',u.encrypted_password,
      'verified',u.email_confirmed_at is not null,'disabled',coalesce(u.banned_until>now(),false)
    )) from auth.users u join hanga_private.profiles p on p.auth_id=u.id
  ),'[]'),
  'profiles',coalesce((select jsonb_agg(p) from hanga_private.profiles p),'[]'),
  'events',coalesce((select jsonb_agg(e) from hanga_private.events e),'[]'),
  'plans',coalesce((select jsonb_agg(p) from hanga_private.plans p),'[]'),
  'waitlist',coalesce((select jsonb_agg(w) from hanga_private.waitlist w),'[]'),
  'messages',coalesce((select jsonb_agg(m) from hanga_private.messages m),'[]'),
  'notices',coalesce((select jsonb_agg(n) from hanga_private.notices n where n.kind<>'reminder'),'[]'),
  'blocks',coalesce((select jsonb_agg(b) from hanga_private.blocks b),'[]'),
  'reports',coalesce((select jsonb_agg(r) from hanga_private.reports r),'[]'),
  'registration',(select registration from hanga_private.settings)
);
