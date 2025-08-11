
do $$
declare
  v_user_id uuid;
begin
  select id into v_user_id
  from auth.users
  where email = 'sarkarrahulabcd@gmail.com'
  limit 1;

  if v_user_id is null then
    raise exception 'User with email % not found. Please sign up via /auth first, then re-run.', 'sarkarrahulabcd@gmail.com';
  end if;

  insert into public.user_roles (user_id, role)
  values (v_user_id, 'admin'::app_role)
  on conflict (user_id, role) do nothing;
end
$$;
