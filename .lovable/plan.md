# Instant Edits: lagre endringer permanent

I dag lagrer Instant Edits kun i din egen nettleser (localStorage), så endringene forsvinner i andre nettlesere og for besøkende. Denne planen gjør endringene til ekte, lagrede endringer i databasen med umiddelbar effekt etter at du trykker **Save**.

## Slik blir opplevelsen

1. Du åpner Instant Edits og redigerer tekst/stil som i dag (fortsatt umiddelbar visuell effekt lokalt).
2. Panelet viser en tydelig statuslinje: "Ulagrede endringer (N)".
3. Du trykker **Save changes** → endringene lagres i databasen, og statusen blir "Lagret".
4. Alle besøkende på siden ser endringene med én gang de laster siden — også etter publisering.
5. **Discard** forkaster ulagrede endringer og går tilbake til sist lagrede versjon.
6. "Reset this element" / "Reset all edits on this page" blir også lagringsbare handlinger (sletter lagrede endringer når du trykker Save).

## Hvem kan redigere

Bare innloggede brukere med `admin`-rollen kan lagre. Alle andre (inkludert utloggede besøkende) ser resultatet, men får ikke redigeringsknappen. Er du ikke admin når du trykker Save, får du en tydelig melding om at du må logge inn som admin.

## Teknisk

**Database (migrasjon)**
- Ny tabell `public.site_edits`: `id`, `route text not null`, `element_path text not null`, `edit jsonb not null`, `updated_by uuid`, `created_at`, `updated_at` + unik nøkkel `(route, element_path)` og trigger `set_updated_at`.
- GRANT: `SELECT` til `anon` og `authenticated`; `SELECT, INSERT, UPDATE, DELETE` til `authenticated`; `ALL` til `service_role`.
- RLS på: `SELECT` for alle (`using (true)`), skrive-policyer (`INSERT/UPDATE/DELETE`) kun for `has_role(auth.uid(), 'admin')`.

**Server**
- `src/lib/siteEdits.functions.ts`:
  - `listSiteEdits` (offentlig, server publishable client) — henter alle edits for en rute.
  - `saveSiteEdits` (`.middleware([requireSupabaseAuth])`) — sjekker `has_role(..., 'admin')` via `context.supabase`, upserter endrede rader og sletter fjernede for ruten.

**Klient**
- `src/lib/instantEdits/store.ts`: behold localStorage som "arbeidskopi" (ulagret utkast), men legg til henting/skriving mot serveren og en `dirty`-sammenligning mot sist lagrede sett.
- `src/components/instant-edits/InstantEdits.tsx`: legg til Save/Discard-knapper med statusindikator og toast (sonner) ved suksess/feil. Knappen for å åpne verktøyet vises kun for admin (i tillegg til dagens dev/`?edit`-regel).
- Ny liten komponent `SiteEditsApplier` montert i `src/routes/__root.tsx`: laster lagrede edits for gjeldende rute og påfører dem for *alle* besøkende, med samme retry-løkke som i dag (for elementer som rendres sent).

**Merk om robusthet:** edits identifiseres i dag med en DOM-sti (barne-indekser fra `<body>`). Når vi senere endrer sidenes struktur i kode, kan en lagret sti peke på feil element. Planen beholder samme metode, men lagrer i tillegg `tagName` + tekst-signatur som en enkel sanity-sjekk, slik at en edit hoppes over hvis elementet åpenbart ikke matcher.
