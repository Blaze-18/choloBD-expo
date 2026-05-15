---
applyTo: "src/app/**/_layout.tsx,src/app/**/index.tsx,src/app/_layout.tsx,src/app/index.tsx"
---

# Navigation Instructions

This document covers the Expo Router file-based navigation architecture: provider
hierarchy, route groups, layout files, and redirect logic.

---

## Route Structure Overview

```
src/app/
├── _layout.tsx           ← Root layout — providers + startup orchestration
├── index.tsx             ← Auth redirect entry point
├── globals.css           ← NativeWind global styles
├── (auth)/
│   ├── login.tsx
│   └── register.tsx      ← No _layout.tsx in (auth) — Stack comes from root
├── (tabs)/
│   ├── _layout.tsx       ← Bottom tab navigator (5 tabs)
│   ├── index.tsx         ← Homepage tab
│   ├── explore/
│   │   ├── _layout.tsx   ← Stack + ExploreProvider
│   │   ├── _provider.tsx ← ExploreProvider context
│   │   └── *.tsx         ← 14 screens (see explore.instructions.md)
│   ├── dashboard/
│   │   └── _layout.tsx + screens
│   ├── tracking/
│   │   └── _layout.tsx + screens
│   └── trip-planner/
│       └── _layout.tsx + screens
├── (tour-builder)/       ← Empty route group (no screens yet)
└── debug/
    └── theme.tsx         ← Dev-only theme debug screen
```

---

## Root `_layout.tsx` — Provider Hierarchy

```tsx
export default function RootLayout() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
```

Provider order (outermost → innermost):

1. **`<Provider store={store}>`** — Redux store
2. **`<LanguageProvider>`** — i18n init + language persistence
3. **`<ThemeProvider>`** — dark/light mode
4. **`<AppContentLayout>`** — startup orchestration
5. **`<SafeAreaProvider>`** — only shown after splash is done

`AppContent` composes `LanguageProvider` → `ThemeProvider` → `AppContentLayout`.

---

## `AppContentLayout` — Startup Sequence

This is NOT a route file — it is an internal component in `_layout.tsx`. It handles:

1. `useAuthInitializer(API_BASE_URL)` — configure Axios, register logout callback, restore auth
2. `usePreloadAssets()` → `isReady` — fonts + asset preloading
3. Custom splash screen display:
   - While `!assetsReady` → show `<CustomSplash delay={0} />` indefinitely
   - While `!splashDone` (assets ready but no transition yet) → show `<CustomSplash delay={2500} onComplete={() => setSplashDone(true)} />`
   - Once `splashDone` → hide native splash, render `<SafeAreaProvider>` + `<Stack>`

**Auth guard in `AppContentLayout`:**
```tsx
useEffect(() => {
  if (auth.isInitializing) return;
  if (!auth.isAuthenticated && !auth.tokens && splashDone) {
    router.replace('/(auth)/login');
  }
}, [auth.isAuthenticated, auth.tokens, auth.isInitializing, splashDone]);
```

This is the **global auth guard** — it fires any time auth state changes (e.g. token
expiry via Axios interceptor), redirecting the user back to login from anywhere in the app.

Do not replicate this guard in individual screens. One source of truth.

---

## Root `index.tsx` — Entry Redirect

```tsx
export default function RootRedirect() {
  const auth = useSelector((s: RootState) => s.auth);
  // ...
  useEffect(() => {
    if (auth.isInitializing) return;
    if (auth.isAuthenticated && auth.tokens) {
      router.replace('/(tabs)');
    } else {
      router.replace('/(auth)/login');
    }
  }, [auth.isAuthenticated, auth.tokens, auth.isInitializing]);

  return <ActivityIndicator />;  // Shown while initializing
}
```

- Always waits for `auth.isInitializing === false` before redirecting.
- Authenticated → `/(tabs)` (which lands on the homepage tab `index.tsx`).
- Unauthenticated → `/(auth)/login`.
- Shows an `ActivityIndicator` while auth is initializing.

---

## `(auth)/` Group

No `_layout.tsx` inside `(auth)/` — the root Stack navigator handles the auth screens.

Routes:
- `/(auth)/login` → `login.tsx`
- `/(auth)/register` → `register.tsx`

After successful login, dispatch `loginUser` thunk → auth guard in `AppContentLayout`
detects `isAuthenticated: true` and redirects to `/(tabs)`. Do not call `router.replace`
from the login screen directly.

---

## `(tabs)/_layout.tsx` — Tab Navigator

5 tabs configured:

| Tab screen name | Route | Tab label key | Icon |
|---|---|---|---|
| `index` | `/(tabs)` | `TRANSLATION_KEYS.TABS.HOMEPAGE` | `home` |
| `explore` | `/(tabs)/explore` | `TRANSLATION_KEYS.TABS.EXPLORE` | `compass` |
| `dashboard` | `/(tabs)/dashboard` | `TRANSLATION_KEYS.TABS.DASHBOARD` | `person` |
| `tracking` | `/(tabs)/tracking` | `TRANSLATION_KEYS.TABS.TRACKING` | `checkmark-done` |
| `trip-planner` | `/(tabs)/trip-planner` | `TRANSLATION_KEYS.TABS.TRIP_PLANNER` | `map` |

**`trip-planner` is hidden from the tab bar** (`href: null`). It is navigated to
programmatically from the explore or dashboard screens.

Tab bar styling:
- Colors from `theme.colors` via `useTheme()` — `primary`/`primary-dark` for active,
  `muted`/`muted-dark` for inactive.
- Background from `surface`/`surface-dark`. Border from `border`/`border-dark`.
- Height: `60 + bottomInset`. iOS padding: `bottomInset`. Android padding: `bottomInset + 8`.
- All tab icons are from `@expo/vector-icons/Ionicons`.
- `headerShown: false` globally.

---

## Route Group Layout Pattern

Every route group that needs a stack navigator has a `_layout.tsx` with:

```tsx
export default function GroupLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
```

Groups that need group-scoped context wrap the Stack in a `_provider.tsx`:

```tsx
// _layout.tsx
export default function ExploreLayout() {
  return (
    <ExploreProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </ExploreProvider>
  );
}
```

The `_provider.tsx` file exports the Provider component and its `useContext` hook.
Only the `explore` group currently uses this pattern.

---

## Navigation Conventions

- **All route files use `default export`** (required by Expo Router).
- **Non-route files use named exports** (components, hooks, providers).
- Route filenames are kebab-case: `hotel-search.tsx`, `tour-detail.tsx`.
- `_layout.tsx` files must not contain business logic — they set up navigation structure only.
- `_provider.tsx` files set up context scoped to the route group only.
- Route files (`src/app/**`) must be **thin** — compose components, call hooks, no logic.

---

## Adding a New Screen

1. Create the route file in the appropriate group folder (kebab-case filename).
2. Use a default export.
3. Compose `use*Logic` hooks and UI components — no business logic in the file.
4. If the screen needs a new tab, add it to `(tabs)/_layout.tsx` with a `TRANSLATION_KEYS` label.
5. If the screen is group-local context, add it to the group's `_provider.tsx` — not a new Redux slice.
6. Never add `headerShown: true` screens without a matching back-navigation design.

---

## Constraints

- Never redirect via `router.push` / `router.replace` inside route files for auth flows —
  the root `AppContentLayout` guard handles that.
- The `(auth)/` group has no `_layout.tsx`. Do not add one unless there is a specific need.
- The `(tour-builder)/` group is currently empty. Do not add screens to it without
  coordinating with the explore flow (see `tour-builder.instructions.md`).
- `trip-planner` tab is hidden from the tab bar (`href: null`). This is intentional.
- Do not put global providers (Redux, i18n, theme) inside route group layouts.
  They belong in the root `_layout.tsx` only.
- The provider order (Redux → Language → Theme) must be preserved.
- `debug/theme.tsx` is a development-only screen — do not include it in production navigation flows.
