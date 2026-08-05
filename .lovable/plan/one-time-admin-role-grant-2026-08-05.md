# One-time admin role grant

Give the existing account **lorentzen212@gmail.com** the `admin` role so the Instant Edits Save bar works.

## The single change

One data insert into `public.user_roles`:

```sql
INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'admin'::app_role FROM auth.users u
WHERE u.email = 'lorentzen212@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;
```

The user id is looked up by email, so no id is hardcoded, and `ON CONFLICT DO NOTHING` guarantees no duplicate row.

## Explicitly not touched

- No application code
- No RLS policies, database functions or triggers
- No schema changes
- No other users, no `staff` or `customer` roles
- No auth settings, no secrets

## After it runs

I will verify that exactly one `admin` row exists for that account and that `user_roles` contains nothing else. You then only need to reload the page — the role is read live from the database on each check, so no sign-out or token refresh is needed.

This is a data change, so it needs build mode (or approval) before I can apply it.
