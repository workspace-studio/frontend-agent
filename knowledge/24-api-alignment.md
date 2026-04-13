# API Alignment — Cross-Repo Workflow

Use this workflow when the user says "backend changed, update frontend" or "align with new API" — any task where the frontend must match updated backend contracts.

## Pre-Work: Find the Backend Repo

Check sibling directories in the workspace for the backend:
- `../znjan-ws/`, `../*-ws`, `../*-api`, `../backend`, `../server`

If a backend repo exists, it is the **authoritative source** — NEVER rely solely on the frontend's local `openapi.json` (it can be stale).

## Read Authoritative Sources (in order)

1. **Backend DTOs** — `<backend>/src/modules/<domain>/dto/*.dto.ts`
   - Field names (exact casing)
   - Enum values (from `@IsEnum(EnumName)` validation)
   - Required vs optional (`@IsOptional`)
   - Types (`@ApiProperty`, `@IsString`, `@IsNumber`)

2. **Prisma schema** — `<backend>/prisma/schema.prisma`
   - Database-level enum values (may differ from DTO-level)
   - Relations and cascade rules
   - Recent migrations in `<backend>/prisma/migrations/` — especially renames (`ALTER TYPE ... RENAME VALUE`)

3. **Controllers** — `<backend>/src/modules/<domain>/*.controller.ts`
   - HTTP methods (`@Get`, `@Post`, `@Patch`, `@Delete`)
   - Route paths and parameters
   - Response types

## Use Parallel Explore Subagents

For cross-repo tasks, spawn two Explore subagents in parallel:
- **Agent A** (backend): reads DTOs + Prisma schema + controllers for the domain
- **Agent B** (frontend): reads current models, actions, stores, views for the domain

The main agent then diffs the results. This turns a multi-turn research phase into a single round-trip.

## Present Change List BEFORE Editing

For ANY API alignment task touching 3+ files, present a numbered change list first. Get user confirmation before editing any code.

Example:
```
Na temelju backend DTO-ova, evo promjena:
1. EntityStatus enum: INACTIVE → BLOCKED (for users)
2. Field rename: reservationCount → activeReservationCount
3. blockUser: DELETE /users/{id} → PATCH /users/{id} with { entityStatus: 'BLOCKED' }
4. Model: AdminUserModel → UserModel (flatten activeReservationCount)
OK?
```

This prevents the edit→reject→re-edit loop. NEVER skip this step for multi-file changes.

## Apply in Dependency Order

1. Models (`src/models/`)
2. Actions / services (`src/actions/`, `src/services/`)
3. Stores (`src/stores/` or `src/valtio/`)
4. Views (`src/views/`)
5. **Skeletons** (`loading.tsx`, `*Skeleton.tsx`) — do NOT forget these
6. Translations (`messages/<locale>/`)
7. Config (`src/config/`)

## Ripple-Grep Checklist

After each structural change, grep to find references that need updating:

| Change | Grep for |
|--------|---------|
| Renamed enum value | old value across `src/` + `messages/` |
| Renamed field | old name across `src/` + `messages/` |
| Renamed model/interface | old name across `src/` |
| Added/removed table column | `Skeleton` in same view dir |
| Changed action signature | action name in views/ |
| New translation key | verify ALL locale files updated |

## Never Remove Visible UI Without Asking

If the spec diff suggests removing a visible UI element (table column, card field, chip, label), ALWAYS ask the user first. It's a product decision, not a code cleanup. The spec describes what the API returns — it does not dictate what the UI shows.

## Validate

```bash
yarn lint && yarn build
```

## Flag Stale Files

If local `openapi.json` disagrees with the backend, tell the user at the end:
- Option A: update `openapi.json` to match backend
- Option B: delete it from frontend — always read backend DTOs
- Option C: add a regeneration script (`curl <backend>/swagger-json > openapi.json`)

Never leave landmines for the next session.

## Rules

- NEVER edit code before reading backend DTOs + Prisma schema when a backend repo exists
- NEVER rely solely on frontend's local `openapi.json` — it can be stale
- NEVER guess enum values — read `@IsEnum` decorator source
- NEVER remove visible UI elements based on spec diff alone — ask first
- ALWAYS present a numbered change list for 3+ file API alignment tasks
- ALWAYS update skeleton/loading components when table columns change
- ALWAYS grep for renamed identifiers across `src/` + `messages/` after changes
