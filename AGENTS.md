# AGENTS.md — Narrative

Scope: this entire repository. Deploy target: **Vercel**.
Backend communication happens exclusively via `PUBLIC_BASE_URL_API`.

---

## Project Overview

`Narrative` frontend is a SvelteKit SPA that renders virtual characters, match data,
and analytical bets. Standalone project — infrastructure lives in `narrative-backend`.

---

## Project Structure & Module Organization

narrative/
├── src/
│  ├── app.d.ts # global TypeScript declarations (App namespace)
│  ├── app.html # HTML shell
│  ├── app.css # Tailwind directives + CSS variables for theming
│  ├── lib/
│  │  ├── api/ # typed fetch clients — one file per backend domain
│  │  ├── assets/ # static files: images, fonts, icons
│  │  ├── components/
│  │  │  ├── app/ # Bootstrap, ErrorBoundary, etc.
│  │  │  ├── ui/ # reusable primitives (Button, Input, Modal, Card, etc...)
│  │  │  └── features/ # domain components (CharacterCard, MatchRow, BetForm, etc...)
│  │  ├── hooks/ # custom Svelte hooks (useSomething.svelte.ts, etc...)
│  │  ├── schemas/ # Zod schemas — one file per domain
│  │  ├── stores/ # Svelte 5 rune-based stores
│  │  ├── utils/ # date formatting, string manipulation, etc.
│  │  └── index.ts # barrel — re-exports from $lib
│  └── routes/
│     ├── +layout.svelte # root layout (nav, providers, etc...)
│     ├── +layout.ts # root load function (QueryClient setup)
│     ├── +error.svelte # global error page
│     ├── (app)/ # route group — authenticated area
│     │  ├── +layout.svelte
│     │  ├── characters/
│     │  │  ├── +page.svelte
│     │  │  └── +page.ts # load function prefetch
│     │  └── characters/[id]/
│     │     ├── +page.svelte
│     │     └── +page.ts
│     └── (public)/
│        └── leaderboard/
│           ├── +page.svelte
│           └── +page.ts
├── static/ # public static assets (favicon, OG images)
├── .env # local only, never committed
├── .env.example
├── .gitignore
├── eslint.config.ts
├── svelte.config.ts
├── vite.config.ts
└── AGENTS.md ← you are here

`$lib` alias points to `src/lib/` — SvelteKit sets this up automatically.

---

## Stack

| Tool                   | Notes                                                                                |
| ---------------------- | ------------------------------------------------------------------------------------ |
| SvelteKit              | app framework, file-based routing, SPA mode via `adapter-static` or `adapter-vercel` |
| Svelte 5               | Runes API (`$state`, `$derived`, `$effect`, `$props`)                                |
| TypeScript             | strict mode, no `any`                                                                |
| Tailwind CSS v4        | theming via CSS variables in `app.css`                                               |
| Vite                   | bundler (via SvelteKit)                                                              |
| pnpm                   | package manager — never use npm or yarn                                              |
| ESLint                 | linter + formatter — JS/TS files; `svelte-check` for .svelte                         |
| @tanstack/svelte-query | server state, caching, background refetching                                         |
| @tanstack/svelte-form  | form state + field-level validation                                                  |
| Zod                    | schema validation via `@tanstack/zod-form-adapter`                                   |
| bits-ui                | headless Svelte components (Radix UI equivalent)                                     |
| motion                 | animations (`motion/svelte` or `@motionone/svelte`)                                  |

---

## Environment Variables

```bash
# .env.example
PUBLIC_BASE_URL_API=https://api.narrative.app   # backend base URL, no trailing slash
```

- SvelteKit exposes vars prefixed with `PUBLIC_` to the client automatically.
- Access via `import { PUBLIC_BASE_URL_API } from '$env/static/public'`.
- Private server-only vars (no prefix) via `import { SECRET } from '$env/static/private'` — only in `+page.server.ts` / `+layout.server.ts`, never in components.
- CORS handled by backend.

---

## Tooling Commands

```bash
pnpm dev                # dev server
pnpm build              # production build → .svelte-kit/output + adapter output
pnpm preview            # preview production build
pnpm check              # svelte-check (types in .svelte files)
pnpm lint               # eslint lint (JS/TS)
pnpm format             # prettier format (JS/TS)
pnpm ci                 # eslint + prettier + svelte-check --fail-on-warnings
pnpm test               # vitest
pnpm test:watch         # vitest --watch
pnpm test:coverage      # vitest --coverage
```

`svelte-check` handles `.svelte` file type errors.
`ESLint` handles `.ts` / `.js` files. Both run in CI.

---

## SvelteKit Adapter

Deploy target is Vercel → use `@sveltejs/adapter-vercel`.

```ts
// svelte.config.ts
import adapter from "@sveltejs/adapter-vercel";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

export default {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter(),
    alias: { $lib: "src/lib" },
  },
};
```

SPA mode (no SSR, pure client): set `export const ssr = false` in root `+layout.ts`.
Prefer this to match the original Preact SPA behaviour.

> This project is pure SPA — no SSR, no `+page.server.ts`, no server-only secrets.
> All data fetching happens client-side via TanStack Query.

---

## Routing Convention (SvelteKit file-based)

| File              | Purpose                                          |
| ----------------- | ------------------------------------------------ |
| `+page.svelte`    | Page UI component                                |
| `+page.ts`        | Universal load function (runs client + server)   |
| `+page.server.ts` | Server-only load (avoid in SPA mode)             |
| `+layout.svelte`  | Wraps child routes                               |
| `+layout.ts`      | Load function for layout (QueryClient init here) |
| `+error.svelte`   | Error boundary UI for route segment              |
| `(group)/`        | Route group — no URL segment, just file org      |
| `[param]/`        | Dynamic segment                                  |
| `[[optional]]/`   | Optional segment                                 |

---

## Reactivity — Svelte 5 Runes

Runes replace both `@preact/signals` and component-local `useState`.
They are the single reactivity primitive — learn them deeply.

### Core Runes

```svelte
<script lang="ts">
  // $state — reactive variable (replaces useState + signal)
  let count = $state(0);
  let filter = $state<string | null>(null);

  // $derived — computed value (replaces computed())
  const doubled = $derived(count * 2);
  const label = $derived(filter ?? "All leagues");

  // $effect — side effect (replaces useEffect + effect())
  $effect(() => {
    console.log("filter changed:", filter);
    return () => {
      /* cleanup */
    };
  });

  // $props — typed component props (replaces defineProps)
  const { character, onClick }: { character: Character; onClick?: () => void } =
    $props();
</script>
```

### Store-like Rune Modules

```ts
// lib/stores/filters.svelte.ts
export const filters = $state({
  league: null as string | null,
  season: 2025,
});

export const filterLabel = $derived.by(() =>
  filters.league ? `${filters.league} · ${filters.season}` : "All leagues",
);
```

```svelte
<!-- components/features/LeagueFilter.svelte -->
<script lang="ts">
  import { filterLabel, filters } from "$lib/stores/filters.svelte";
</script>

<button
  onclick={() => {
    filters.league = "PL";
  }}
>
  {filterLabel}
</button>
```

> `.svelte.ts` extension is required for rune-based modules outside `.svelte` files.

### When to Use What

| State type                     | Tool                            |
| ------------------------------ | ------------------------------- |
| Component-local state          | `$state` rune                   |
| Derived/computed values        | `$derived` / `$derived.by`      |
| Side effects                   | `$effect`                       |
| Cross-component reactive state | `$state` in `.svelte.ts` module |
| Async / server data            | TanStack Svelte Query           |
| Form state                     | TanStack Svelte Form            |
| DOM refs                       | `bind:this`                     |

---

## Error Handling — `svelte:boundary`

Svelte 5 introduces `<svelte:boundary>` — the native error boundary.

```svelte
<!-- routes/+layout.svelte -->
<svelte:boundary>
  <slot />

  {#snippet failed(error, reset)}
    <div class="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 class="text-2xl font-bold">Something went wrong</h1>
      <p class="text-muted-foreground text-sm">{(error as Error).message}</p>
      <button class="btn" onclick={reset}>Try again</button>
    </div>
  {/snippet}
</svelte:boundary>
```

For route-level errors (404, load failures) — use `+error.svelte`:

```svelte
<!-- routes/+error.svelte -->
<script lang="ts">
  import { page } from "$app/state";
</script>

<h1>{page.status} — {page.error?.message}</h1>
```

---

## Async & Suspense — `{#await}`

Svelte's native async pattern. No Suspense component needed.

```svelte
<script lang="ts">
  import { createQuery } from "@tanstack/svelte-query";
  import { getCharacter } from "$lib/api/characters";

  const { id }: { id: string } = $props();

  const query = createQuery({
    queryKey: ["character", id],
    queryFn: () => getCharacter(id),
  });
</script>

{#if $query.isPending}
  <CharacterSkeleton />
{:else if $query.isError}
  <ErrorCard message={$query.error.message} />
{:else}
  <CharacterProfile character={$query.data} />
{/if}
```

For one-off promises (not queries):

```svelte
{#await loadSomething()}
  <Spinner />
{:then data}
  <DataView {data} />
{:catch error}
  <ErrorCard message={error.message} />
{/await}
```

---

## TanStack Query Setup

```ts
// routes/+layout.ts
import { QueryClient } from "@tanstack/svelte-query";

export const load = () => ({
  queryClient: new QueryClient({
    defaultOptions: {
      queries: { staleTime: 60_000, retry: 1 },
    },
  }),
});
```

```svelte
<!-- routes/+layout.svelte -->
<script lang="ts">
  import { QueryClientProvider } from "@tanstack/svelte-query";

  const { data, children } = $props();
</script>

<QueryClientProvider client={data.queryClient}>
  {@render children()}
</QueryClientProvider>
```

### QueryKey Convention

Always follow `['domain', ...specifics]` shape:

| Query              | Key                              |
|--------------------|----------------------------------|
| All characters     | `['characters']`                 |
| Single character   | `['characters', id]`             |
| Character bets     | `['characters', id, 'bets']`     |
| Matches with filter| `['matches', { league, season }]`|

Never use raw strings without domain prefix — causes cache collisions.

---

## Forms Pattern (TanStack Svelte Form)

```svelte
<script lang="ts">
  import { createForm } from "@tanstack/svelte-form";
  import { zodValidator } from "@tanstack/zod-form-adapter";
  import { bets } from "$lib/api/bets";
  import { betSchema } from "$lib/schemas/bets";

  const form = createForm({
    defaultValues: { confidence: 50, outcome: "" },
    validators: { onChange: zodValidator(betSchema) },
    onSubmit: async ({ value }) => {
      await bets.create(value);
    },
  });
</script>

<form onsubmit={form.handleSubmit}>
  <form.Field name="outcome">
    {#snippet children(field)}
      <input
        value={field.state.value}
        oninput={(e) => field.handleChange(e.currentTarget.value)}
      />
    {/snippet}
  </form.Field>
</form>
```

---

## API Layer (`src/lib/api/`)

- One file per backend domain: `matches.ts`, `characters.ts`, `bets.ts`.
- All functions return typed promises — never `any`.
- Thin base client in `lib/api/http.client.ts` — handles base URL, auth headers, error parsing.
- Errors thrown as typed `ApiError` instances.
- Components never call `fetch` directly — always through `$lib/api/`.

```ts
// lib/api/http.client.ts
import { PUBLIC_BASE_URL_API } from "$env/static/public";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

export const http = {
  get: async <T>(path: string): Promise<T> => {
    const res = await fetch(`${PUBLIC_BASE_URL_API}${path}`);
    if (!res.ok) throw new ApiError(res.status, await res.text());
    return res.json() as Promise<T>;
  },
};
```

---

## Code Style

### TypeScript

- `strict: true`, no exceptions.
- No `any`. Use `unknown` and narrow explicitly.
- Prefer `type` over `interface` unless declaration merging needed.
- Arrow functions for all non-method functions and event handlers.

### Svelte Components

- Functional components only (Svelte is already functional by nature).
- Component files: `PascalCase.svelte`. Rune-store files: `camelCase.svelte.ts`.
- Hook-like utilities: `useCamelCase.svelte.ts`.
- Use `$props()` rune for all props — no legacy `export let`.
- Use `{@render children()}` for slot-like composition (Svelte 5 snippets).
- Avoid `<slot>` — prefer `{#snippet}` + `{@render}`.

### Tailwind v4

- No `themes/` directory. All tokens as CSS variables in `app.css`.
- No inline `style=` for values that belong in Tailwind classes.
- Mobile-first: `sm:` `md:` `lg:`.

### Imports

- Use `$lib/` alias for everything under `src/lib/`.
- Use `$app/state`, `$app/navigation` for SvelteKit internals.
- Order: external → `$lib/` → `$app/` → relative. ESLint enforces sorting.

---

## Documentation — JSDoc

Write JSDoc for all exported functions, components, stores, and types.

```svelte
<!--
  @component
  Displays a virtual character card with avatar, name, role, and win rate.

  @param character - Character data object from the API.
  @param onclick - Optional selection handler.
-->
<script lang="ts">
  const { character, onclick }: { character: Character; onclick?: () => void } =
    $props();
</script>
```

```ts
/**
 * Fetches paginated match list for the given league season.
 * Refetches automatically when `leagueId` or `season` changes.
 *
 * @param leagueId - API-Sports league identifier.
 * @param season - Four-digit year (e.g. 2025).
 * @returns TanStack Query result with typed `Match[]` data.
 */
export const useMatches = (leagueId: number, season: number) =>
  createQuery({
    queryKey: ["matches", leagueId, season],
    queryFn: () => matches.list(leagueId, season),
  });
```

---

## Testing Guidelines

Vitest (`happy-dom`) + `@testing-library/svelte`.
Discover pattern: `src/**/*.{test,spec}.{js,ts,svelte.test.ts}`.

- Place tests alongside source files.
- Use Testing Library for UI behaviour.
- `@testing-library/svelte` renders Svelte 5 components correctly with `render()`.
- Run `pnpm test` before pushing.

---

## What NOT to Do

- Do not install `react`, `react-dom`, or `preact` as dependencies.
- Do not use `moment.js` — use native `Intl` or `date-fns`.
- Do not create a `themes/` directory.
- Do not use `$effect` for data fetching — use `TanStack Query` instead.
- Do not call `fetch` directly in components.
- Do not use legacy Svelte 4 APIs: `export let`, `$:`, `<slot>`, `createEventDispatcher`.
- Do not use `on:click` — use `onclick` (Svelte 5 event attribute syntax).
- Do not commit `dist/`, `.svelte-kit/`, `.env`, or secrets.
- Do not use `// @ts-ignore` — fix the type properly.
