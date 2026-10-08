# Posty

A managed Expo app that lists [jsonplaceholder](https://jsonplaceholder.typicode.com) Posts, shows a
Post with its Comments, searches by title, and keeps Favorites that work offline. It runs as a
development build (no Expo Go), with three side-by-side Variants, a token-driven design system,
and CI that builds and runs end-to-end tests on both platforms for every pull request.

|       | Posts                                                      | Post detail                                                 | Favorites                                                      |
| ----- | ---------------------------------------------------------- | ----------------------------------------------------------- | -------------------------------------------------------------- |
| Light | <img src="docs/screenshots/posts-light.png" width="220" /> | <img src="docs/screenshots/detail-light.png" width="220" /> | <img src="docs/screenshots/favorites-light.png" width="220" /> |
| Dark  | <img src="docs/screenshots/posts-dark.png" width="220" />  | <img src="docs/screenshots/detail-dark.png" width="220" />  | <img src="docs/screenshots/favorites-dark.png" width="220" />  |

## Who did what

This project was built in two phases, on purpose:

- **Foundation — designed and built by the human.** Architecture and folder structure, the Axios
  networking layer, server state with TanStack Query, client state with Zustand and MMKV, the design
  token pipeline, the three Variants and env validation, the base tests, and CI/CD (GitHub Actions
  and EAS, with fingerprint reuse and Maestro). The human made the architectural decisions and gave
  the directions; the AI wrote the code from them; the human reviewed and adjusted it, created the
  files, ran every command and made every commit.
- **Features — implemented by the AI** from specs and tickets the human wrote: the Posts list,
  search, Post detail, Favorites (toggle, sync, offline tab) and deep links. Each feature landed as
  a pull request with tests and Maestro flows, reviewed against the repo's standards and its ticket,
  and was verified on the iOS simulator and in CI before merging.

## Getting started

Requirements: [Bun](https://bun.sh), Xcode (iOS) and/or Android Studio (Android), and access to
the project's EAS account (environment values live in EAS, nothing secret is committed).

```bash
bun install
bun run ios            # development Variant on the iOS simulator
bun run android        # development Variant on an Android emulator
```

`bun run ios` / `android` pull the Variant's environment into `.env` (`bun run env:use <variant>`)
and run `expo run`. With `buildCacheProvider: 'eas'`, a native build matching the local fingerprint
is downloaded from EAS when one exists, so most runs skip the native compile.

### Variants

| Variant     | App name      | Scheme           | Run locally                                   |
| ----------- | ------------- | ---------------- | --------------------------------------------- |
| development | Posty (Dev)   | `posty-dev://`   | `bun run ios` / `bun run android`             |
| staging     | Posty (Stage) | `posty-stage://` | `bun run ios:stage` / `bun run android:stage` |
| production  | Posty         | `posty://`       | EAS `production` profile                      |

Each Variant has its own bundle ID, name, icon badge and scheme, so all three install side by side.
Staging is a Release build for simulators and emulators; CI tests this binary.

### Design system

Design systems live in `design-systems/<name>/` as W3C design tokens (the format Figma Variables
export). `bun run ds:apply --ds=posty` validates one and generates the typed Unistyles themes in
`src/design-system/generated/` (try `--ds=lagoon` to swap the whole look). `bun run ds:check` fails
if the generated files are out of date. The app follows the device's light/dark setting.

### Tests

```bash
bun run check          # ds:check + typecheck + lint + unit/integration tests (what CI runs)
bun run test           # Jest only
bun run ios:stage      # install the staging app first: the E2E scripts target it
bun run e2e:ios        # Maestro flows against the installed staging app
bun run e2e:android
```

- **Unit and integration:** Jest + React Native Testing Library, with the API mocked at the network
  level by MSW, so tests go through the real Axios client, interceptors and Zod schemas.
- **End to end:** Maestro flows per platform in `.maestro/` (list and paging, search → detail with
  comments, favorites, the Favorites tab, deep links on cold and warm start).

### CI

Every pull request to `main` (and every push to it) runs on GitHub Actions:

1. `check` (design-system drift, typecheck, lint, tests).
2. Per platform: compute the native fingerprint. If a staging build for it already exists (GitHub
   cache, then EAS), reuse it and repack it with the new JS; otherwise build it, on the GitHub
   runner by default or on EAS when the `BUILD_RUNNER` repository variable is `eas`. The artifact
   link is posted on the PR.
3. Per platform: install that artifact on an emulator (Ubuntu) or simulator (macOS) and run the
   Maestro flows; videos and JUnit reports are uploaded and summarized on the PR.

## Architecture

```
src/
  app/            Expo Router routes only (thin: each exports a screen)
  features/
    posts/        api, model, hooks, components, controllers, screens
    favorites/    store, hooks, components, controllers, screens
  shared/         api (Axios + ApiError), query, components, lib
  design-system/  generated themes, Unistyles setup, navigation theme
  config/         Variant + env validation
```

Key decisions (the full ADRs are kept out of the repository):

- **Feature folders with one direction of dependency:** `app → features → shared`, enforced by
  ESLint. Components are presentational; controllers own state, queries and navigation; screens only
  place a controller.
- **Networking:** a single Axios client in `shared/api`. Every failure becomes a typed `ApiError`
  (`network`, `timeout`, `http`, `parse`) and every response is validated with Zod.
- **Server state:** TanStack Query with a key factory per feature. The list is an infinite query
  (20 per page, total from `X-Total-Count`) keyed by the debounced, regex-escaped search. The detail
  is one request, `/posts/:id?_embed=comments`, cached for five minutes so revisits are instant.
- **Client state:** Favorites are the only persisted state, in Zustand over MMKV, versioned with a
  migration. They store snapshots of the Posts (and Comments, once the detail was opened), so the
  Favorites tab and a Favorite's detail render offline with an "Offline · updated X ago" notice.
  Screens that fetch Posts refresh those snapshots explicitly.
- **Navigation:** native tabs, each with its own stack and a shared detail route; native header
  search. Deep links (`posts/:id`, `favorites`, `favorites/posts/:id`) work on cold and warm start
  and keep the tab's list underneath so back returns to it. Invalid ids show "Post not found".
- **Strict TypeScript:** `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, and
  `any` banned by ESLint. Type assertions are avoided by convention (Zod parsing and type guards
  instead), not by a lint rule.
