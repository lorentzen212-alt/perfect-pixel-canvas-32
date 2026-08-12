# Claude Code — Project Instructions

This file tells Claude Code how to work safely with this repository.

## Project overview

- **Framework**: TanStack Start (React 19, TypeScript)
- **Styling**: Tailwind CSS v4
- **Backend/DB**: Supabase (migrations in `supabase/migrations/`)
- **Package manager**: Bun (`bun.lock` present; use `bun` for all installs/runs)
- **Connected to**: [Lovable](https://lovable.dev) — every commit pushed to the main branch syncs back to Lovable and appears in the editor.

## Workflow: Lovable → Claude Code → repository → Lovable

1. A task is described in the Lovable editor.
2. Claude Code receives the task and makes changes in this repository.
3. Changes are committed and pushed to the main branch.
4. Lovable picks up the new commits automatically and validates the build.

**Critical**: keep the branch in a working state at all times. Never force-push, rebase, or amend commits that have already been pushed — doing so rewrites history on Lovable's side and the user will lose their project history.

## Safe-editing guidance

- Make the smallest change that satisfies the task.
- Do not rename or move files unless the task explicitly requires it.
- Do not change `package.json` dependencies unless the task explicitly requires it.
- Do not change `vite.config.ts`, `tsconfig.json`, or `eslint.config.js` unless the task explicitly requires it.
- Keep every commit in a buildable state — confirm with `bun run build` before committing.
- For Supabase schema changes, add a migration file in `supabase/migrations/` and do not modify existing migration files.
- Components live in `src/components/`, route pages in `src/routes/`, shared utilities in `src/lib/`.

## Build and validation commands

```bash
# Install dependencies (first time or after package.json changes)
bun install

# Type-check + compile
bun run build

# Lint (ESLint + Prettier check)
bun run lint

# Format source files
bun run format

# Local dev server
bun run dev
```

Run `bun run build` and `bun run lint` before every commit to ensure the project is clean.

## Project conventions

- **TypeScript**: strict mode enabled (`tsconfig.json`). Avoid `any`; use proper types.
- **Styling**: use Tailwind utility classes. Avoid inline styles unless absolutely necessary.
- **Components**: use shadcn/ui primitives (already installed in `src/components/ui/`).
- **Routing**: file-based routes via TanStack Router. Route files go in `src/routes/`. After adding a route, run `bun run dev` once to regenerate `src/routeTree.gen.ts` (auto-generated — do not edit by hand).
- **Data fetching**: use TanStack Query (`@tanstack/react-query`) for server state.
- **Forms**: react-hook-form + zod for validation.
- **Imports**: use path alias `@/` (maps to `src/`).
- **Commit messages**: short imperative sentence, e.g. `feat: add user profile page`.
