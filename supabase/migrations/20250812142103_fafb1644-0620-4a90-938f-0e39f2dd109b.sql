
-- Grant 'admin' role to the specified user by email
insert into public.user_roles (user_id, role)
select id, 'admin'::app_role
from auth.users
where email = 'sarkarrahulabcd@gmail.com'
on conflict (user_id, role) do nothing;
