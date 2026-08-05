# Investigation: "You need to be signed in as an admin to save."

No code, data, policies or roles were changed.

## Current admin-check mechanism

Two independent checks, both backed by the **`user_roles` database table** — not app_metadata, not user_metadata, not profiles, not an email allowlist, not a hardcoded ID, not a Lovable workspace role.

1. UI check (`src/components/instant-edits/InstantEdits.tsx`, lines ~62-80): reads the signed-in user, then queries `user_roles` for a row with `user_id = <you>` and `role = 'admin'`. Controls whether the Save bar is offered.
2. Server check (`src/lib/siteEdits.functions.ts`, `saveSiteEdits`, lines 62-68): after validating the bearer token, calls the database function `has_role(_user_id, 'admin')`. If false it returns `{ ok:false, reason:'forbidden' }` — this is the exact source of the message you see.

RLS also enforces it independently: `site_edits` INSERT/UPDATE/DELETE policies require `has_role(auth.uid(),'admin')`; SELECT is public, which is why saved edits render for all visitors.

## Root cause found

Your account exists (`lorentzen212@gmail.com`, last sign-in 2026-08-05 15:14 UTC), but the `user_roles` table contains **no rows at all** — so no one is an admin yet. The check is working correctly; the grant is simply missing.

## Required value

A row in `public.user_roles`:
- `user_id` = your auth user id
- `role` = `admin` (enum `app_role`: admin | staff | customer)

## Session refresh needed?

No. The role is read live from the database on every check, not from a JWT claim. After the row exists you only need to reload the page (the UI admin check runs on mount). A full sign-out/sign-in is not required.

## Safest way to grant it

`user_roles` intentionally has **no INSERT policy** (denied for all app users), so the row cannot be created from the app or by a signed-in user — that is the anti-privilege-escalation design. It must be inserted server-side with elevated access, which I can do as a one-row, one-time data change scoped to your user id only:

- Insert exactly one row: your user id + `admin`.
- Nothing else touched: no policy changes, no schema changes, no new grants, no other users.

## Recommended next step

Approve this and I will insert that single `user_roles` row for `lorentzen212@gmail.com`, then you reload the page and the Instant Edits Save bar becomes active. If you'd rather grant admin to a different account, tell me which email first.
