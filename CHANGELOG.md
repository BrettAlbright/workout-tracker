# Changelog

All notable changes to this template are documented in this file.

The format is inspired by Keep a Changelog and uses semantic-style version sections for template milestones.

## [Unreleased]

### Added

- **Env / docs:** Vitest **`server/config/env.e2e-relax-rate-limit.test.ts`** for **`E2E_RELAX_RATE_LIMIT`** coercion; **`docs/testing.md`** E2E port **5188** / **`--strictPort`** / rate-limit note (see **`docs/troubleshooting.md`**).
- **E2E reliability + catalog a11y:** **`E2E_RELAX_RATE_LIMIT`** in **`server/config/env.ts`** — when true, **`server/app.ts`** skips `/api` rate limiters; **`pnpm run dev:e2e`** exports it and Playwright **`webServer.env`** mirrors it. **`dev:client:e2e`** uses Vite **`--strictPort`** on **5188** so a stale dev server cannot silently force Vite onto another port while Playwright still hits **5188** (misleading **429**s). Smoke specs use **Continue as guest** for **finish workout** and **cardio picker** to cut sign-up churn. Finish confirmation button label **Confirm finish** (was **Finish**) with matching Playwright selector; finish smoke asserts **Open** on the list (no **Completed** label there). **`ExerciseCatalogNav`** adds **`aria-live`** step status, **`nav`** / **`role="group"`**, and **`aria-label`** on category and subgroup controls. Docs: **`docs/configuration.md`**, **`docs/development-workflow.md`**, **`docs/troubleshooting.md`**, **`README.md`** (cardio SQL pointer), **`docs/course-qa-evidence.md`**; tutorial / workouts help copy updated.
- **UI cleanup + finish workout** (proposal **`docs/proposals/ui-cleanup-contextual-help-finish-workout.md`**): **`Input`** / **`Select`** / **`Textarea`** use **`w-full max-w-full min-w-0`** for mobile layouts; **`ContextualHelp`** (**?** → **`Modal`**) on Dashboard, Workouts, Exercises, Profile, Sign-in; shorter copy on primary surfaces; **`patchWorkout`** + **Finish workout** / **Resume editing** on **`WorkoutDetailPage`** (confirm modal); **`POST …/sets`** returns **400** when **`endedAt`** is set (**`assertWorkoutAcceptsNewSets`**); list **Continue** / **Finish** links and resume banner **Finish**; Vitest **`workouts-api.test.ts`**, **`workout-logging-guards.test.ts`**. **Exercises catalog** drill-down (**`ExerciseCatalogNav`**, **`lib/exercise-catalog`**) — category → muscle group (resistance/flexibility) or cardio type (**Standard** / **HIIT** via **`muscleGroup`** on globals); **`database/update-cardio-catalog-subgroups.sql`** for existing DBs; tighter **toast** titles; Playwright **`finish workout from detail`** smoke.
- **Dashboard analytics, goals, tutorial, exercises UX** (proposal **`docs/proposals/dashboard-goals-tutorial-exercises.md`**): **`GET /api/stats/volume-series`**, **`GET /api/stats/summary`** (streak + week-over-week + achievement unlocks), **`/api/goals`** CRUD with **`goal_periods`** evaluation; migration **`0009_goals_achievements`**; client **Recharts** volume chart + data table, **`<progress>`** goals, **`/tutorial`** route and nav link, **Exercises** catalog-first **tabs** + filters + collapsible add-custom; MSW handlers for new endpoints; e2e axe on guest dashboard.
- **Regression tests for dashboard week math and API wiring:** **`server/lib/week-helpers.test.ts`**; **`server/routes/api.test.ts`** **401** (no Bearer) and **503** (no DB) on **`/api/stats/summary`**, **`/api/stats/volume-series`**, and goals routes; **`client/src/lib/api/stats-api.test.ts`** and **`goals-api.test.ts`** for query URLs and fetch shapes.
- **Shell navigation + workouts filters:** **Menu** / **Close** in a sticky header opens a **left drawer** (parent Support-style overlay: scrim `z-[70]`, panel `z-[80]`); nav links and account actions live in the drawer; **toasts** use **`z-[100]`** so they stay above overlays. **Workouts** list filters (**date range**, **status**, **sort**) open in a **`Modal`** (`client/src/components/ui/Modal.tsx`); **CSV export** stays on the page. **`URLSearchParams`** on **`/`** sync filters (`range`, `status`, `sort`=`newest`|`oldest`) with **`replace`**; **`lib/workout-list-url.ts`** parses/serializes. **`Button`** is **`forwardRef`**. Tests: **`workout-list-url.test.ts`**, **`App.test.tsx`** (menu). Proposal: **`docs/proposals/nav-drawer-filters-modal-url-sync.md`**.
- **Display and accessibility (Phase 1):** app shell **text size**, **theme** (**`themeMode`**: `system` \| `light` \| `dark` — **`system`** follows **`prefers-color-scheme`**), and **high contrast** via **`client/src/state/`** (`AppStateProvider` + **`DISPLAY_STORAGE_KEYS`** `wt-*` in **`localStorage`**, including **`wt-theme-mode`**); **`client/src/lib/display-shell.ts`** syncs **`document.documentElement`**; inline boot script in **`client/index.html`** applies the same classes early to reduce shell FOUC. Global CSS in **`client/src/index.css`** (`.app-text-scale-*`, `.app-dark-mode`, `.app-high-contrast`, indigo/amber/toast tuning); **Profile** controls and reset; **`color-scheme`** on `<html>`. Tests: **`display-shell.test.ts`**, **`app-state-store.test.ts`**, **`App.display-shell.test.tsx`**; E2E **`e2e/display-preferences.spec.ts`** (reload persistence via **`localStorage`**, no DB). Proposal: **`docs/proposals/display-and-accessibility-settings.md`**.
- **Display and accessibility (Phase 2):** **`profiles.uiPreferences`** **`jsonb`** (migration **`0008_profile_ui_preferences`**); **`PATCH /api/profile`** and **`GET /api/me`** include merged **`uiPreferences`** (`shared/ui-preferences.ts`, **`server/lib/ui-preferences.ts`** Zod + merge). Client: **`AuthContext`** applies server prefs when **`me.uiPreferences`** changes; **Profile** PATCHes on each control + reset. **`database/schema.sql`** parity. Server tests **`ui-preferences.test.ts`**.

### Documentation

- **`docs/assumptions.md`** — **Multi-week dashboard APIs**: **`volume-series`** and **`summary`** share the same Monday week-window rules as weekly volume; warmup exclusion vs counts; achievements evaluated on read.
- **`docs/testing.md`** — documents **`week-helpers`** tests, dashboard/goals **401/503** API tests, client **`stats-api`** / **`goals-api`** URL tests, E2E port **5188** / **`--strictPort`** / **`E2E_RELAX_RATE_LIMIT`**, and **`env.e2e-relax-rate-limit`** Vitest coverage.
- **Styleguides** (`docs/styleguide/`) — aligned with code: **`api-client`**, **`lib/api/*`**, **`useAbortableAsyncEffect`**, **`requireUserId`**, **`domain-zod`**, UI primitives; **RHF optional**; parent/multirepo note in **`styleguide/README.md`**.
- **`docs/documentation-guide.md`** — Introduces the doc set and points to **`docs/README.md`** as the canonical index.
- **`docs/README.md`** — “New to full-stack?” reading order; comment standards for teaching-oriented glue files; links to the documentation guide.
- **`docs/project-structure.md`**, **`code-patterns.md`**, **`AGENTS.md`**, **`proposals/optimization-and-abstraction.md`** (marked **Done**).

### Changed

- **Phase 2 exercises UX + recents (proposal `docs/proposals/phased-ux-and-supersets.md`):** custom exercise creation now requires **muscle group** (server + client validation), catalog includes both global and custom active exercises, custom exercise editing moved to an **Edit modal** with row-style rendering, and workout detail adds **Clear recents** (API `DELETE /api/exercises/recents?workoutType=...`). E2E stability updated: `dev:e2e` exports `E2E_RELAX_RATE_LIMIT=true`, Playwright `webServer.env` mirrors it, and `dev:client:e2e` uses Vite `--strictPort`.
- **Clear recents persistence:** clear-recents cutoff state moved from in-memory process state to DB-backed `exercise_recent_clears` with migration **`0010_nappy_iron_monger`**, so recents clears survive app restarts and deploys.
- **Phase 3 dashboard/tutorial (proposal `docs/proposals/phased-ux-and-supersets.md`):** dashboard weekly stats and volume trend are unified inside one accessible tabbed insights container (tablist, roving focus, arrow/home/end keyboard support), goals helper subheading text was removed, and tutorial now includes an expanded walkthrough plus a practical FAQ/troubleshooting section.
- **Phase 4 supersets (proposal `docs/proposals/phased-ux-and-supersets.md`):** added `workout_set_groups` plus nullable `workout_sets.groupId` (migration **`0011_absent_slapstick`**), set create/patch APIs now support `groupId` and `createGroup`, workout detail can start or continue superset grouping from the UI, grouped sets render in superset containers, and CSV export now includes `superset_group_id`.
- **Phase 4 follow-up optimization + coverage:** set-write server flow now uses `getWorkoutSessionForSetWrite` (workout ownership/type + aggregate next index) and centralized superset group validation to avoid duplicated checks; client superset compose state moved into `useSupersetComposer`; new tests cover set payload variants, integration group constraints, WorkoutDetail superset behavior, and smoke export assertions for `superset_group_id`.
- **Set-write hardening:** set creation now runs in a transaction so superset-group creation and set insert succeed/fail together; `workout_sets` now enforces unique `(workoutId, setIndex)` with index support (`0012_polite_aaron_stack`), and duplicate set-index writes return **409** with a retry-safe message.
- **Superset + reorder follow-up:** workout detail now groups supersets by shared `groupId` even when grouped sets are non-contiguous in `setIndex`; set reordering via `PATCH /api/sets/:id` now performs a transactional full-workout reindex to avoid uniqueness collisions during moves.
- **Server integration test coverage:** `server/routes/api-idor.test.ts` now runs whenever a Postgres URL is available (`TEST_DATABASE_URL` preferred, fallback to `DATABASE_URL`) so local `pnpm run test` includes IDOR + set-index reorder assertions in typical dev setups.
- **About page alignment:** refreshed `About` copy to match current app capabilities (weekly analytics, custom exercises, supersets, export semantics) and added a direct pointer to `Tutorial` for task-based walkthrough guidance.
- **Phase 1 UX cleanup (proposal `docs/proposals/phased-ux-and-supersets.md`):** removed top subheading copy on sign-in/workouts/exercises/dashboard and goals helper text; workouts start controls are full-width on mobile; workouts filters and CSV guidance/actions are consolidated in the filters modal; workouts page dashboard/tutorial links were removed; set form wording simplified (`Warm-up`, rest placeholder `e.g. 90 seconds`). Tests updated in `client/src/App.test.tsx`.
- **Auth / database errors:** common Postgres failures (missing tables **`42P01`**, connection refused, bad host/credentials) from **`POST /api/auth/guest`** and demo sign-up/sign-in are mapped to **503** with a **`client_error`** message pointing at **`pnpm run db:migrate`** / **`DATABASE_URL`** instead of an opaque **500** (`getDbFailureHint` in **`server/lib/pg-errors.ts`**, used in **`auth-service.ts`**).
- **Client API layout:** types and calls split under **`client/src/lib/api/`** (**`types`**, **`auth-api`**, **`exercise-api`**, **`workouts-api`**, **`stats-api`**); **`workout-api.ts`** re-exports for existing **`@/lib/workout-api`** imports.
- **`useAbortableAsyncEffect`** (**`client/src/lib/use-abortable-async-effect.ts`**) — shared abort + error toast for data loads; used on **`DashboardPage`**, **`WorkoutsPage`**, **`ExercisesPage`** (refresh via **`loadKey`**), **`WorkoutDetailPage`**.
- **`api-client.test.ts`** — covers **`mergeApiRequestInit`** (Accept, Bearer, JSON **`Content-Type`**, credentials).
- **`mondayWeekStartISOInZoneNow`** in **`week.ts`** — dashboard no longer imports Luxon directly; Luxon stays encapsulated in **`week`**.
- **`ProfilePage`** — weight unit control uses **`FieldLabel`** + **`Select`** (aligned with other forms).
- **`exercise-controller`** — `workoutType` query values pass through without `as WorkoutType` (`workoutTypeSchema` infers **`WorkoutType`**).
- **Server:** **`requireUserId(req)`** in **`server/lib/request-user.ts`** replaces repeated auth checks in controllers.
- **Client:** **`Textarea`** UI primitive; **`parseRestSecondsInput`** (**`client/src/lib/parse-rest-seconds.ts`**) shared for log-set / edit-set rest fields; tests in **`parse-rest-seconds.test.ts`**.
- **Client:** **`client/src/lib/api-client.ts`** centralizes **`credentials: 'include'`**, Bearer token, JSON defaults, **`fetchJson`**, **`fetchNoContent`**, and **`apiFetch`**; **`workout-api.ts`** delegates to it (CSV download still handles blob + filename). UI primitives **`FieldLabel`** and **`Select`**; **`WorkoutsPage`**, **`ExercisesPage`**, and **`WorkoutDetailPage`** use them. Feature splits: **`features/workouts/WorkoutResumeBanner`**, **`WorkoutListFilters`**, **`SetRowCard`**; **`features/exercises/CustomExerciseRow`**, **`ArchivedExerciseRow`**.
- **API route wiring:** async handlers use **`asyncHandler`** (**`server/lib/async-handler.ts`**) in **`server/routes/api.ts`**; controllers no longer wrap every action in **`try/catch`**. **`GET /api/auth/oidc/callback`** remains a plain handler (redirect-based errors). Shared **`workoutTypeSchema`** and param schemas live in **`server/lib/domain-zod.ts`** (from **`shared/workout-types`**). **`GET /api/auth/oidc/login`** invalid query params now return the standard validation envelope (same **400** as before) instead of a custom message. Server ESLint allows **`_*`** unused args under **`server/**/\*.ts`\*\*.
- **`docs/proposals/workout-tracker-build-plan.md`** — §3 migration note through **0007**; **§15** slice 6 (workout types) **Done**; slices 1–6 **Done** overall.
- **`docs/course-qa-evidence.md`**, **`docs/testing.md`**, **`docs/README.md`** — document **all tests passing** (**`pnpm run ci:local`** + **`pnpm run test:e2e`**); §4 OIDC **Pass** (production Auth0 / split-host); **Tester(s):** Brett Albright; cross-browser §3 optional Firefox/WebKit; sign-off updated.
- **`docs/deployment/README.md`** — expanded **Verify** into API smoke, browser checklist (guest → workout → set), optional demo/OIDC, and troubleshooting pointer.
- **`server/config/env.ts`** — trim OIDC-related env strings at load so pasted **`AUTH_OIDC_REDIRECT_URI`** cannot include trailing newlines (Auth0 **redirect_uri** errors).
- **`docs/deployment/auth0-setup.md`** — §0 ordered checklist for OIDC when Vercel + Render are already deployed; troubleshooting row for newline in callback URL.
- **`client/src/features/auth/AuthContext.tsx`** — ignore stale **`readMe`** results so a slow initial **401** cannot clear storage after guest (or other) login completes (fixes split-deploy / slow-network race).
- **`render.yaml`** — web service **`plan: starter`** (lighter cost than Pro for minimal traffic).
- **`docs/deployment/neon-account-setup.md`** — expanded Neon + Render **`DATABASE_URL`** / **`CORS_ORIGIN`** walkthrough.

### Added

- **`pnpm run db:reset`** — runs **`database/reset.sh`**: `DROP SCHEMA public CASCADE`, then **`db:migrate`** + **`db:seed`**. For local dev and optional **Render Shell** full wipes; documented in **`README.md`**, **`docs/development-workflow.md`**, **`docs/deployment/README.md`**.

- **Workout types (Resistance / Cardio / Flexibility):** migration **`0007_workout_and_exercise_types`** — **`workouts.workoutType`** and **`exercise_types.category`** (default **`resistance`**). **`GET /api/exercises`** and **`GET /api/exercises/recents`** accept optional **`workoutType`**; create/patch workout and create/patch custom exercise carry type/category; **`POST /api/workouts/:id/sets`** returns **400** when the exercise **`category`** does not match the workout’s **`workoutType`**. CSV export adds **`workout_type`** and **`exercise_category`**. UI: type when starting a workout, badges, filtered picker/recents; shared **`shared/workout-types.ts`**. Integration test in **`api-idor.test.ts`** (requires **`TEST_DATABASE_URL`**). E2E: cardio workout exercise list in **`e2e/smoke.spec.ts`**.
- **Deploy / existing databases:** ship **`pnpm run db:migrate`** so **0007** applies on hosted Postgres. **`db:seed`** skips inserting globals when any global row already exists — use **`database/seed-global-exercises-append.sql`** (idempotent) or a controlled DB reset if you need the expanded catalog on an old database.
- **Global exercise seed:** expanded starter catalog — more **resistance** movements for chest, back, legs, shoulders, and arms; additional **cardio** and **flexibility** entries (`server/scripts/seed.ts`). Applies on fresh DBs when **`db:seed`** runs and no global exercises exist yet.

- **Richer set logging (slice 5):** migration **`0006_set_warmup_rest`** — **`isWarmup`**, **`restSeconds`** on **`workout_sets`**; **`WorkoutDetailPage`** notes, warm-up, rest, edit/delete sets, **Same as last**; weekly volume excludes warm-ups; CSV adds **`is_warmup`**, **`rest_seconds`**.
- **Exercise library (slice 4):** migration **`0005_exercise_archive`** (`archivedAt` on **`exercise_types`**); **`GET /api/exercises/recents`**, **`GET /api/exercises/archived`**, **`PATCH /api/exercises/:exerciseTypeId`**; **`ExercisesPage`** (rename, archive, restore); **Recent** chips on **`WorkoutDetailPage`**.
- **Timezone-aware weekly volume (slice 3):** optional **`timezone`** query on **`GET /api/stats/weekly-volume`**; **`resolveWeeklyVolumeWindow`** in **`stats-service`** (Luxon); dashboard uses profile **`timezone`** and **`mondayWeekStartISOInZone`**; tests in **`stats-service.test.ts`** and **`week.test.ts`**.
- **CSV export (slice 2):** **`GET /api/export/workout-sets.csv`** (optional **`from`/`to`** on workout start time); **`downloadWorkoutSetsCsv`** in **`workout-api`**; **Download CSV** on **`WorkoutsPage`** aligned with date range preset; **`server/services/export-service`**, **`csv`** / **`csv-build`** helpers and tests.
- **Workout history (slice 1):** **`GET /api/workouts`** query filters (`from`, `to`, `status`, `sort`); **`WorkoutsPage`** presets (all time / this week / this month, local calendar), status and sort controls, **`EmptyState`** when filters match nothing, **Resume** banner when an active workout exists but is hidden by filters; **`client/src/lib/date-range-presets.ts`** + unit tests. E2E uses **`workouts-page-heading`** test id for stable assertions.
- **E2E accessibility:** **`e2e/a11y.spec.ts`** (axe critical/serious + keyboard focus on guest); **`@axe-core/playwright`**; Playwright projects **chromium** + **mobile-chrome**, optional **`PW_FULL_BROWSERS=1`** for Firefox/WebKit when host deps installed. **`docs/course-qa-evidence.md`** and **`docs/testing.md`** updated with verification notes.
- **Course report (Phase 4 docs):** **`docs/course-qa-evidence.md`**, **`docs/troubleshooting.md`**, **`docs/demo-script.md`**; **`docs/testing.md`** — optional **§11.F/G** notes; **`README.md`** / **`docs/README.md`** links.
- **Deploy (bible-support stack):** root **`render.yaml`**; Vercel + Render + Neon documented as **default** split layout; **`AUTH_FRONTEND_ORIGIN`** on the API so OIDC redirects return to the Vercel SPA (not the Render host). **`client/vercel.json`**, **`client/.env.example`**, **`api-base-url`**, **`smoke:deploy`**. Docs hub, **`vercel-render.md`**, **`auth0-setup.md`**, account setup guides, optional **`render-neon.md`** monolith path.
- **OIDC / OAuth (Path A):** `AUTH_OIDC_*` and session env validation; `openid-client`; `GET /api/auth/oidc/login` (PKCE), `GET /api/auth/oidc/callback`, `POST /api/auth/logout`, `GET /api/auth/options`; signed cookies `wt_oidc_login` / `wt_session`; `sub` → `users.authSubject`; `authMiddleware` accepts **Bearer** then session cookie; client `credentials: 'include'`, sign-in page OIDC + gated demo, `auth_error` query handling. Docs: `docs/configuration.md`, `docs/deployment/README.md`, `docs/deployment/auth0-setup.md`, `docs/data-flow.md`, `docs/assumptions.md`, `docs/architecture.md`, `docs/testing.md`, `docs/security-notes.md`, `docs/styleguide/backend-patterns.md`, `docs/README.md`, `docs/decisions/README.md`; ADR 0001 and build plan §11 updated. `server/.env.example` extended; **`AGENTS.md`** links testing, security, and deployment guides.
- **Continue as guest:** `POST /api/auth/guest` creates a server user with `authSubject` `guest:<uuid>` and returns a JWT; **`GET /api/me`** and **`PATCH /api/profile`** include **`isGuest`**. Sign-in page adds **Continue as guest**; nav and workouts/profile copy explain guest vs named accounts. Tests (MSW, API, optional Postgres IDOR, Playwright smoke).

### Fixed

- **Rate limiting / Render health checks:** **`/api/health`** and **`/api/ready`** now skip the **`/api`** read rate limiter (via the limiter's **`skip`** option, matching on **`baseUrl + path`**), so frequent platform health checks no longer get **429** and use up the shared budget. Other **`/api`** routes stay limited; **`RATE_LIMIT_MAX`** / **`RATE_LIMIT_WINDOW_MS`** are unchanged. **`server/app.ts`** also sets **`trust proxy`** to **1** in production so IP-keyed limits see the client IP behind Render's proxy instead of one shared proxy address. Vitest **`server/routes/api-rate-limit.test.ts`**.
- **`client/src/index.css`:** keep **`@import 'tailwindcss'`** (not `url('tailwindcss')`). **Stylelint** `import-notation` **--fix** rewrote the import so **`@tailwindcss/vite`** did not run and **Tailwind utilities disappeared**; disabled for that line with **`stylelint-disable-next-line`**.

- **`database/reset.sh`:** also **`DROP SCHEMA IF EXISTS drizzle CASCADE`** (Drizzle’s migration journal); dropping only **`public`** made **`drizzle-kit migrate`** no-op while **`public`** stayed empty. Sourcing **`server/.env`** uses **`set -a`** / **`export DATABASE_URL`** for the same DB as **`psql`**. Post-migrate check for **`exercise_types`**; **`db:seed`** exits **1** on failure.

- **`profiles.displayName`:** removed global unique index so **multiple OIDC users** can share the same display name (e.g. same Google “name” on different accounts). **Demo** sign-in still matches only `demo:*` accounts; demo sign-up rejects a name if another **demo** row already uses it. **Drizzle** `DrizzleQueryError` is unwrapped in **`isPgUniqueViolation`** so PG **`23505`** is detected on the `cause` chain.
- **OIDC split deploy (Vercel + Render):** after successful IdP callback, redirect to the SPA includes **`#oidc_token=`** (Bearer JWT in the fragment) when **`AUTH_FRONTEND_ORIGIN`** is set, so **`/api/me`** works even when browsers block cross-site session cookies; client bootstraps the token from the hash before render.
- **Postgres SSL:** `pg` pool no longer forces TLS. SSL is enabled only when **`DB_SSL=true`** or **`DATABASE_URL`** includes **`sslmode=require|verify-ca|verify-full`**, fixing **`db:seed`** / CI against local Postgres (e.g. GitHub Actions service) that does not support SSL.
- **Drizzle migrations / CI:** `database/migrations/0003_bouncy_gwen_stacy.sql` plus `meta/0003_snapshot.json` and journal entry align Drizzle Kit snapshot format with `server/db/schema.ts` without dropping `profiles_display_name_unique` (no DDL beyond `SELECT 1`), satisfying the PR migration policy when the schema file changes.

### Added

- **CI / Husky parity with template:** **`/.github/workflows/audit-scheduled.yml`** (weekly **`pnpm audit --audit-level high`**). Root script **`pnpm run ci:local`** (lint → tsc → test → build). Husky **`pre-push`** runs **`ci:local`** so pushes match core GitHub quality gates. Docs policy treats **`CONTRIBUTING.md`**, **`AGENTS.md`**, and **`CHANGELOG.md`** as documentation updates. **`docs/development-workflow.md`** and PR template document CI, local parity, and E2E expectations.

- **`CONTRIBUTING.md`** — PR checks, changelog and rules-registry discipline, optional parent-workspace scope; **`AGENTS.md`** expanded with workspace layout, copy-paste agent prompt, rule-precedence note, and link to contributing.
- **Proposal / docs index:** `docs/proposals/workout-tracker-build-plan.md` updated (MVP checkboxes, agent/workspace workflow, doc map rows); `docs/README.md` and `docs/proposals/README.md` cross-link contributor entry points; **`README.md`** links **`CONTRIBUTING.md`**.

- **Workout tracker domain (MVP):** Drizzle schema and migration for `users`, `profiles`, `exercise_types`, `workouts`, `workout_sets`; seed global exercises; JWT demo auth (sign-up / sign-in by display name); REST APIs for profile, exercises, workouts, sets, and weekly volume (`reps × weight`); React UI for sign-in, workout list, log sets, dashboard, and profile. **Removed** starter todo CRUD demo.
- `docs/assumptions.md` for UTC weekly stats and auth placeholder notes.
- `server/lib/volume.ts` plus unit tests for volume calculation.
- **409** responses for duplicate **display name** on demo sign-up and profile update (`profiles_display_name_unique`); sign-up runs in a DB transaction so a failed profile insert does not leave an orphan user.
- Server package renamed to `workout-tracker-server` (version aligned with root `0.1.0`).
- **Docs:** `docs/styleguide/*` (patterns, UI, DB, observability) ported from the bible-support template and adapted for workout-tracker; new **`docs/styleguide/security-and-authz.md`**. **`docs/rules-registry.md`**, **`docs/rules-usage-guide.md`**, **`docs/configuration.md`**, **`docs/deployment/README.md`**. **`.cursor/rules/`** aligned with registry, including **`authz-data-ownership`** for multi-tenant safety. Root **`AGENTS.md`** for command summary.
- **`docs/data-flow.md`** with auth/API/DB flow and mermaid diagrams. **Light PWA:** `manifest.webmanifest`, production-only **`sw.js`** (installability, no API caching), HTML meta + title.
- **Drizzle:** **`database/migrations/meta/0002_snapshot.json`** (introspected final schema) for kit parity with migration **`0002_workout_domain`**.
- **Security tests:** `server/routes/api-idor.test.ts` (cross-user **404** on workouts/sets) when **`TEST_DATABASE_URL`** is set; CI **quality** job adds **Postgres 16**, migrate/seed, and passes **`TEST_DATABASE_URL`** for **`pnpm run test`**.
- **E2E:** `@playwright/test`, **`playwright.config.ts`**, **`e2e/smoke.spec.ts`**, **`pnpm run dev:e2e`** (Vite **127.0.0.1:5188**). CI runs **`pnpm exec playwright install chromium --with-deps`** then **`pnpm run test:e2e`**.
- **PWA icons:** **`client/public/icon-192.png`**, **`icon-512.png`** via **`scripts/gen-pwa-icons.mjs`** (**sharp** in **`onlyBuiltDependencies`**). **`eslint-plugin-n`** added for ESLint standard config resolution.
- **Proposal:** **`docs/proposals/workout-tracker-build-plan.md`** (rebuilt master plan: R0–R9, docs map, deliverables, OIDC follow-up) and **`docs/proposals/README.md`**.

- Established backend layering with concrete examples:
  - `server/app.ts` for app composition
  - `server/routes/api.ts` for route modules
  - `server/controllers/hello-controller.ts`
  - `server/controllers/health-controller.ts`
  - `server/services/health-service.ts`
  - `server/db/pool.ts`
- Added `GET /api/health` endpoint demonstrating route -> controller -> service -> db flow.
- Added project documentation set under `docs/`:
  - `docs/README.md`
  - `docs/architecture.md`
  - `docs/project-structure.md`
  - `docs/development-workflow.md`
  - `docs/templates/feature-doc-template.md`
- Added CI workflow `/.github/workflows/ci.yml` for pull requests and manual runs.
- Added PR template `/.github/pull_request_template.md` with testing + documentation checklists.
- Added docs-policy CI gate requiring docs updates when application/config files change.
- Added pnpm workspace file: `pnpm-workspace.yaml`.
- Added pnpm lockfile: `pnpm-lock.yaml`.
- Added full test scaffolding with Vitest across frontend and backend.
- Added frontend unit test setup (`client/src/test/setup.ts`) and sample component test (`client/src/App.test.tsx`).
- Added MSW-based frontend API mock pattern (`client/src/test/handlers.ts`, `client/src/test/server.ts`).
- Added backend sample tests:
  - `server/services/health-service.test.ts` (service unit tests with mocked db layer)
  - `server/routes/api.test.ts` (API route tests via Supertest)
- Added `pnpm run test:changed` for fast local feedback by running only tests related to changed files.
- Added runtime pinning with `.nvmrc` and `engines` in root `package.json`.
- Added server environment validation module (`server/config/env.ts`) using `zod`.
- Added structured logging via `pino` and request logging via `pino-http`.
- Added Drizzle ORM + Drizzle Kit integration with schema/migration scaffolding.
- Added example Drizzle-backed CRUD endpoints for todos (`/api/todos`).
- Added idempotent database seed flow (`pnpm run db:seed`) and starter todo data.

### Changed

- Upgraded development environment:
  - Devcontainer uses Node 22 via feature (`ghcr.io/devcontainers/features/node:1`).
  - Devcontainer uses persistent bind mount to `/workspace` from local folder.
- Migrated package management from npm to pnpm:
  - Added `packageManager` in root `package.json`.
  - Converted root scripts to `pnpm` commands.
  - Updated Husky pre-commit to `pnpm exec lint-staged`.
  - Updated CI and deploy workflows to use pnpm setup/install/run.
  - Updated docs and README commands from npm to pnpm.
- Hardened CI/CD and project workflow:
  - Deploy workflow updated to `actions/checkout@v4`.
  - Deploy script changed from force push to normal push (`git push origin main:pub`).
  - Added docs-policy + quality checks in CI pipeline.
- Upgraded major runtime/tooling stacks:
  - React 19 + Vite 7 (`client`)
  - Express 5 (`server`)
  - Node 22 (devcontainer/CI)
  - TypeScript/ESLint ecosystem refresh across root + client
  - Husky v9-compatible prepare/hook behavior
- Refactored server startup into bootstrap/app composition split:
  - `server.ts` now focuses on process startup.
  - `app.ts` handles middleware/routes/static/error wiring.
- Updated Express fallback route for Express 5 compatibility:
  - from `*` to `/{*path}`.
- Updated README to match current stack, setup, CI, docs-policy, and pnpm workflows.
- Updated CI to run tests (`pnpm run test`) alongside lint, typecheck, and build.
- Added minimum coverage thresholds in Vitest configs for frontend and backend.

### Fixed

- Resolved empty workspace issue in devcontainer by introducing explicit workspace bind mount.
- Fixed GitHub Actions failure (`Unable to locate executable file: pnpm`) by adding `pnpm/action-setup` before `actions/setup-node`.
- Removed Husky deprecation warning source by deleting deprecated `/.husky/_/husky.sh` and modernizing hook usage.

### Removed

- Removed npm lockfiles:
  - `package-lock.json`
  - `client/package-lock.json`
  - `server/package-lock.json`

## [2.0.0] - Template Baseline

### Added

- Initial full-stack TypeScript template structure with:
  - React client (`client`)
  - Express server (`server`)
  - PostgreSQL scripts (`database`)
  - deployment workflow scaffold
