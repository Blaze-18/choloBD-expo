---
applyTo: "**"
---

# CholoBD Mobile — Global Copilot Instructions

This file is the project-wide instruction source for AI coding agents and developers.
All code written for this project must follow these conventions, derived from the existing
implementation. Module-specific rules live in `.github/instructions/`.

---

## 1. Project Context

**CholoBD** is a mobile-first React Native application for tour and trip planning in Bangladesh. It is built with Expo (managed workflow) and targets Android and iOS.

Core architectural constraints:
- **Feature-based** folder organization: routes, components, hooks, services, and slices are grouped by domain, not by type.
- **Offline-first concerns** are handled via auth state persistence in `expo-secure-store` and async storage.
- **Two supported languages** (English, Bengali) and **two themes** (light, dark) — every feature must fully support both.
- **Role-based access**: four roles (`user`, `admin`, `masterAdmin`, `SERVICE_ADMIN`) determine what UI is rendered.

Tech stack (do not change without justification):

| Concern | Library |
|---|---|
| Framework | Expo ~55 (managed workflow) |
| UI | React Native 0.83 + NativeWind 4 |
| Routing | Expo Router v55 (file-based) |
| State | Redux Toolkit v2 |
| HTTP | Axios v1 via `src/services/api/axiosClient.ts` |
| Forms | react-hook-form v7 + Zod v4 |
| i18n | i18next + react-i18next (EN, BN) |
| Auth Storage | expo-secure-store |
| Styling tokens | `src/constants/theme.ts` |
| Type safety | TypeScript 5.9 — strict mode enabled |

---

## 2. Architecture Rules

### Module Structure
- The project is **feature-based**: each major domain has its own route group, component folder, hooks, and service file(s).
- Feature route groups: `(auth)`, `(tabs)/explore`, `(tabs)/dashboard`, `(tabs)/tracking`, `(tabs)/trip-planner`, `(tour-builder)`.
- Shared infrastructure lives in: `src/store/`, `src/services/api/`, `src/hooks/`, `src/components/ui/`, `src/constants/`, `src/utils/`.

### Where Business Logic Lives
- Business logic belongs in `use*Logic` hooks (e.g. `useTourBuilderLogic`, `useTripPlannerLogic`).
- Data-fetching logic belongs in `useFetch*` hooks.
- Route/screen files (`src/app/**`) must be **thin** — they compose components and call hooks, nothing more.
- Redux slices own async operations (`createAsyncThunk`) and derived state.
- **Business logic must never live inside components or route files.**

### Component Organization
- One component per file, filename matches component name (PascalCase).
- Each component folder exposes its public API via an `index.ts` barrel file.
- Default exports only in Expo Router route files (`src/app/**`). All other components use **named exports**.

### Route File Conventions
- Every route group and nested navigator has a `_layout.tsx`.
- A `_provider.tsx` inside a route group provides context scoped to that group only.
- Route filenames are kebab-case (e.g. `tour-detail.tsx`, `hotel-search.tsx`).

### Service Files
- One file per API domain in `src/services/api/` (e.g. `hotels.ts`, `locations.ts`).
- Named function exports only — no classes.
- All service functions use the axios instance from `axiosClient.ts`.

---

## 3. Coding Standards

### TypeScript
- `strict: true` is enabled. Never disable it or use `any` unless genuinely unavoidable.
- Use the path alias `@/*` → `src/*` for all internal imports.
- Prefer `type` for object shapes; use `interface` for component props and slice state contracts.
- Use `RootState` and `AppDispatch` from `src/store/store.ts` for all Redux typings.
- All props interfaces must be explicitly typed. No implicit `any`.
- Infer TypeScript types directly from Zod schemas:
  ```ts
  export const loginSchema = z.object({ email: z.string().email(), password: z.string().min(6) });
  export type LoginFormData = z.infer<typeof loginSchema>;
  ```

### Functional Components
- Use functional components only. No class components.
- All components are functions; no HOC patterns unless already present.

### Forms & Validation
- All forms use `react-hook-form` with `@hookform/resolvers/zod`.
- Zod schemas live in `src/validators/` (one file per domain). Never define validation inline.

### Hook Naming
| Pattern | Purpose | Example |
|---|---|---|
| `useFetch*` | Wraps a single API call, returns `data`, `loading`, `refetch` | `useFetchLocations` |
| `use*Logic` | Encapsulates complex state, dispatches thunks, returns handlers | `useTourBuilderLogic` |
| `use*` (generic) | UI state, permissions, device capabilities | `useTheme`, `useCameraPermission` |

- Hook files: named exports only, camelCase filename matching the hook name.
- State-restoration hooks live in `src/hooks/state/`.

### Naming Conventions Summary
| Kind | Convention | Example |
|---|---|---|
| Component | PascalCase | `HotelCard`, `BookingModal` |
| Hook | camelCase `use` prefix | `useFetchHotels`, `useTripPlannerLogic` |
| Service function | camelCase | `fetchHotels`, `createTourPlan` |
| Redux slice | camelCase | `tourBuilderSlice` |
| Redux thunk | camelCase verb | `fetchTourPlans`, `createBooking` |
| Type / Interface | PascalCase | `Hotel`, `TripPlan`, `AuthState` |
| Route file | kebab-case | `tour-detail.tsx`, `hotel-search.tsx` |
| Constant | SCREAMING_SNAKE_CASE | `API_BASE_URL`, `TRANSLATION_KEYS` |

---

## 4. UI / Component Design Rules

### NativeWind + Theme Tokens (Dual Approach)
The project uses **both** NativeWind `className` utility classes and `style={{}}` with
`theme` tokens imported from `src/constants/theme.ts`. Both are valid and often used
together in the same component.

**Use `className` for:**
- Layout, flexbox, padding, margin, border radius, opacity
- Dark mode variants: always add `dark:` counterpart for color-related classes
- Example: `className="flex-1 bg-background dark:bg-background-dark px-4 rounded-lg"`

**Use `style={{}}` with theme tokens for:**
- Computed/dynamic values (e.g. toggled by state or props)
- Platform-specific elevation/shadow using `theme.elevation.*`
- Exact pixel values from `theme.spacing.*`, `theme.radii.*`, `theme.colors.*`

```tsx
import theme from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';

const { isDark } = useTheme();
const bgColor = isDark ? theme.colors['surface-dark'] : theme.colors.surface;

<View style={{ backgroundColor: bgColor }} className="px-4 rounded-lg" />
```

### Dark Mode
- Every component that sets a color **must** provide a `dark:` variant or use
  `isDark` with theme tokens.
- Dark mode is class-based (`darkMode: 'class'` in `tailwind.config.js`).
- Use `useTheme()` hook to read `isDark`.

### Custom Color Tokens
All custom colors are defined in both `tailwind.config.js` (for `className`) and
`src/constants/theme.ts` (for `style`). Never hardcode hex values in components — always
use a token.

### Component Reuse
- Atomic, reusable primitives (buttons, inputs, cards) live in `src/components/ui/`.
- Feature-specific components belong in their domain folder (e.g. `src/components/explore/`).
- Extract a sub-component when a component tree nests more than 3 levels deep.
- Prefer composition (passing children/props) over duplicating markup.

### i18n in UI
- Every user-visible string must use `useTranslation()` + `TRANSLATION_KEYS`. No hardcoded display text.
- When adding a new key, update both `src/locales/en.json` and `src/locales/bn.json` and register it in `src/constants/translationKeys.ts`.

---

## 5. State Management Rules

### What Belongs Where
| State type | Location |
|---|---|
| Server data fetched once | `useFetch*` hook local state |
| Complex cross-screen state | Redux slice (`src/store/slices/`) |
| Auth / tokens | `authSlice` + `expo-secure-store` |
| UI-only ephemeral state | `useState` inside the component |
| User preferences (theme, language) | Context providers + `AsyncStorage` |

### Redux Slice Conventions
- All slices live in `src/store/slices/`.
- Every slice manages its own `isLoading: boolean` and `error: string | null` fields.
- All async operations use `createAsyncThunk` with the `rejectWithValue` pattern:
  ```ts
  export const fetchSomething = createAsyncThunk(
    'sliceName/fetchSomething',
    async (params, { rejectWithValue }) => {
      try {
        return await someApi.getData(params);
      } catch (e: any) {
        return rejectWithValue(e?.response?.data || e.message);
      }
    }
  );
  ```
- Handle `pending`, `fulfilled`, `rejected` in `extraReducers` for every thunk.
- Do not use `createReducer` — always use `createSlice`.
- Use `useAppDispatch` and `useAppSelector` typed wrappers for all Redux access.
- Keep selector logic in hook files, not inline in components.

### Avoiding Duplicated State
- Do not store derived data (e.g. filtered lists) in Redux — compute it in selectors or hooks.
- Do not mirror server state into multiple slices. One source of truth per domain.
- Auth state lives **only** in `authSlice`. Never replicate it in local component state.

---

## 6. API & Data Layer Rules

- All HTTP calls go through the singleton Axios instance from `src/services/api/axiosClient.ts`.
- The `API_BASE_URL` must come from environment variables, imported via `@/constants/api`:
  ```ts
  import { API_BASE_URL } from '@/constants/api';
  ```
- The Axios client automatically handles Bearer token injection, 401 token refresh, and logout on refresh failure. Do not replicate this logic.
- Service functions return **unwrapped data** (not the raw Axios response):
  ```ts
  export async function fetchLocations(): Promise<Location[]> {
    const res = await getApiInstance().get('/api/locations');
    return res.data.data;
  }
  ```
- Never call `axios` directly in components or hooks — always go through a service function in `src/services/api/`.
- All loading and error states from API calls must be tracked: either in `useState` (for `useFetch*` hooks) or in the Redux slice `isLoading` / `error` fields.

---

## 7. Performance Rules

- Do not use `React.memo`, `useMemo`, or `useCallback` preemptively. Add them only when a measurable performance issue is identified.
- Keep components small and focused. Extract sub-components before a component grows beyond ~150 lines.
- Do not define functions inline in JSX render (e.g. `onPress={() => doX()}`) for expensive operations — extract them as named handlers.
- Preload assets and restore auth state in `usePreloadAssets` and `useAuthInitializer` — do not add blocking logic directly to `_layout.tsx`.
- Avoid large component trees for list items — keep FlatList/ScrollView item components lean.

---

## 8. Error Handling Standards

- API errors are mapped to user-friendly messages via `src/utils/errorHandling.ts`. Use `mapTourApiError()` (or domain equivalent) before displaying errors.
- Use `Alert.alert` for one-time error notifications triggered from hooks. Do not use toast libraries.
- For persistent error states visible in UI, dispatch the error string to the slice's `error` field and read it in the component.
- Always log with `if (__DEV__) console.error('[HookOrComponentName] ...', e?.response?.data || e.message)` in development.
- Always handle empty states explicitly — show a message or placeholder when a list is empty, not a blank screen.
- Slices must clear `error` on new `pending` dispatches to avoid stale error display.

---

## 9. Security & Safety

- Never expose secrets, API keys, or credentials in frontend code or logs.
- `API_BASE_URL` comes from environment variables only — never hardcode a URL or IP in source files.
- Auth tokens are stored exclusively in `expo-secure-store` via `src/lib/secureStore.ts`. Never put tokens in `AsyncStorage` or component state.
- Do not log token values or user credentials even in development mode.
- Always validate user input on the UI side with Zod schemas before sending to the API — even if the backend also validates.
- Admin-only controls must be guarded by `useAuthWithAdminCheck()`. Never rely on local state to gate privileged UI.

---

## 10. Reusability Rules

- Prefer composition over duplication: pass children or render props rather than copy-pasting markup.
- Shared utility functions belong in `src/utils/`. Feature-specific helpers stay inside the feature folder.
- A hook that is used in more than one feature should be moved to `src/hooks/`.
- A component used in more than one feature should be moved to `src/components/ui/`.
- Do not create a new abstraction for a one-time use case — only extract when reuse is confirmed.

---

## 11. Do Not Do

- **Do not** write business logic inside components or route files — use `use*Logic` hooks.
- **Do not** call `axios` or `fetch` directly in components or hooks — always use a service function.
- **Do not** bypass the `authSlice` for auth state — never store auth data in local state.
- **Do not** hardcode display strings — always use `TRANSLATION_KEYS` and `useTranslation()`.
- **Do not** hardcode hex color values — always use tokens from `tailwind.config.js` or `theme.ts`.
- **Do not** hardcode `API_BASE_URL` or any endpoint URL — use `@/constants/api`.
- **Do not** introduce new libraries, patterns, or architectural layers without justification.
- **Do not** create a new component, hook, or service file that duplicates existing functionality.
- **Do not** use `any` type to silence TypeScript errors — fix the type properly.
- **Do not** put global state (like auth or bookings) into React Context — use Redux.
- **Do not** add `React.memo`, `useMemo`, or `useCallback` without a measured reason.
- **Do not** render admin controls based on local state — always use the auth hook.

---

## 12. AI Behavior Instructions (Copilot-Specific)

- Always read and follow existing patterns in the relevant module before generating new code.
- Infer conventions from the codebase. When in doubt, look at an existing similar hook, component, or slice.
- Prefer minimal, targeted changes over broad refactors.
- Do not invent new architecture, folder structures, or naming patterns.
- Match the naming convention of the file you are editing.
- When adding a feature, follow the exact same structure as the closest existing feature.
- Do not add comments, docstrings, or type annotations to code you did not change.
- Do not add error handling for scenarios that cannot happen at runtime.
- Do not add logging beyond what already exists in the file you are editing.
- If a module-specific instruction file exists in `.github/instructions/`, follow it. It takes precedence over general rules here for that domain.
