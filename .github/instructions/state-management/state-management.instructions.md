---
applyTo: "src/store/**"
---

# State Management Instructions

This document covers the Redux store configuration, all 4 slices, typing conventions,
and correct dispatch/selector patterns for the CholoBD app.

---

## Store Configuration (`src/store/store.ts`)

```ts
export const store = configureStore({
  reducer: {
    auth: authReducer,
    tourBuilder: tourBuilderReducer,
    tripPlanner: tripPlannerReducer,
    packageBooking: packageBookingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

The store is wired in the root layout via `<Provider store={store}>` wrapping the entire
app. Do not add a second `Provider` anywhere.

---

## Redux Access Pattern

There are **no** `useAppDispatch`/`useAppSelector` typed wrappers in this codebase.
The actual pattern used everywhere is:

```ts
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';

const dispatch = useDispatch<AppDispatch>();
const someValue = useSelector((state: RootState) => state.sliceName.field);
```

Always import `RootState` and `AppDispatch` from `@/store/store`. Do not use plain
`useDispatch()` without the `<AppDispatch>` type parameter.

---

## Slice Overview

| Slice name | State key | Responsibilities |
|---|---|---|
| `authSlice` | `auth` | Login, register, OAuth, logout, token refresh, role |
| `tourBuilderSlice` | `tourBuilder` | Tour package CRUD, filters, admin mode |
| `tripPlannerSlice` | `tripPlanner` | User trip plans, segments, wizard, cost summary |
| `packageBookingSlice` | `packageBooking` | Tour package purchases, cancellations, stats |

All slices live in `src/store/slices/`. Do not add business logic to slice files —
use `use*Logic` hooks for that.

---

## Slice Patterns (required for all slices)

### State shape
Every slice must have:
- `isLoading: boolean` (or domain-specific loading fields like `listLoading`, `formLoading`)
- `error: string | null` (or typed `*Error | null`)

### Thunk pattern
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

### extraReducers pattern
Handle all three lifecycle cases for every thunk:
```ts
extraReducers: (builder) => {
  builder
    .addCase(fetchSomething.pending, (state) => {
      state.isLoading = true;
      state.error = null;   // Clear stale errors on new fetch
    })
    .addCase(fetchSomething.fulfilled, (state, action) => {
      state.isLoading = false;
      state.data = action.payload;
    })
    .addCase(fetchSomething.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
}
```

**Always clear `error` on `pending`** — stale errors must not persist into new fetches.

### Synchronous reducers
Use `createSlice.reducers` for synchronous state changes (set filters, wizard steps,
clear errors, clear data). Never use `createReducer` standalone.

---

## `authSlice` (`src/store/slices/authSlice.ts`)

**State key:** `state.auth`

Key state fields:
```ts
isAuthenticated: boolean;
isInitializing: boolean;   // true during startup token check
tokens: AuthTokens | null;
user: User | null;
isLoading: boolean;
error: string | null;
```

Thunks: `initializeAuth`, `loginUser`, `registerUser`, `logoutUser`, `loginWithOAuth`

- `registerUser` uses **raw `axios`** (not `getApiInstance()`) — intentional bypass of
  the auth interceptor for a public endpoint. Do not change this.
- After logout, `clearTokens()` is called from `secureStore.ts` before the thunk resolves.
- `isInitializing` remains `true` until `initializeAuth` completes (pending → fulfilled/rejected).

---

## `tourBuilderSlice` (`src/store/slices/tourBuilderSlice.ts`)

**State key:** `state.tourBuilder`

Key state fields:
```ts
list: TourPackage[];
listLoading: boolean;
listError: TourApiError | null;
detail: TourPackage | null;
detailLoading: boolean;
detailError: TourApiError | null;
formLoading: boolean;
formError: TourApiError | null;
filters: TourFilters;
adminMode: boolean;  // Not used by UI — internal flag
```

Thunks: `fetchTourPlans`, `fetchTourPlansByAdmin`, `fetchTourPlanDetail`,
`createTourPlanAsync`, `updateTourPlanAsync`, `deleteTourPlanAsync`

The hook (`useTourBuilderLogic`) exposes `isLoading = listLoading || detailLoading`
and `error = listError || detailError` — components never read these fields separately.

---

## `tripPlannerSlice` (`src/store/slices/tripPlannerSlice.ts`)

**State key:** `state.tripPlanner`

Key state fields:
```ts
list: TripPlan[];
pagination: PaginationInfo | null;
listLoading: boolean;
listError: TripApiError | null;
currentTrip: TripPlan | null;
currentSegments: UserSegment[];
detailLoading: boolean;
detailError: TripApiError | null;
tripSummary: TripSummary | null;
summaryLoading: boolean;
summaryError: TripApiError | null;
formLoading: boolean;
formError: TripApiError | null;
filters: TripFilters;
wizard: {
  currentStep: number;           // 0, 1, or 2
  selectedLocation: Location | null;
  startDate: string | null;      // ISO string — not Date object
  endDate: string | null;        // ISO string — not Date object
  selectedSpots: Spot[];
};
```

Thunks: `fetchTrips`, `fetchTripDetail`, `fetchTripSummary`, `createTripAsync`,
`updateTripAsync`, `deleteTripAsync`, `addSegmentAsync`, `updateSegmentAsync`,
`deleteSegmentAsync`

Wizard reducers (synchronous): `setWizardLocation`, `setWizardDates`, `setWizardSpots`,
`setWizardStep`, `resetWizard`

**Dates are stored as ISO strings**, not `Date` objects. The `useTripPlannerLogic` hook
converts them to `Date` before exposing `wizardStartDate`/`wizardEndDate`.

---

## `packageBookingSlice` (`src/store/slices/packageBookingSlice.ts`)

**State key:** `state.packageBooking`

Key state fields:
```ts
bookings: PackageBooking[];
bookingsLoading: boolean;
bookingsError: PackageBookingError | null;
pagination: { total, limit, offset, hasMore };
currentBooking: PackageBooking | null;
currentBookingLoading: boolean;
currentBookingError: PackageBookingError | null;
purchaseLoading: boolean;
purchaseError: PackageBookingError | null;
lastPurchasedBooking: PackageBooking | null;
cancelLoading: boolean;
cancelError: PackageBookingError | null;
filters: PackageBookingFilters;
stats: Record<string, PackageBookingStats>;  // keyed by packageId
statsLoading: boolean;
statsError: PackageBookingError | null;
```

Thunks: `purchasePackageAsync`, `fetchUserPackageBookings`,
`fetchPackageBookingsByPackageId`, `cancelPackageBookingAsync`

---

## Provider Hierarchy

```
<Provider store={store}>          — root _layout.tsx
  <LanguageProvider>              — context for language switching
    <ThemeProvider>               — context for dark/light mode
      <SafeAreaProvider>          — safe area context (inside auth check)
        <Stack />
      </SafeAreaProvider>
    </ThemeProvider>
  </LanguageProvider>
</Provider>
```

`SafeAreaProvider` is inside `AppContentLayout` (only rendered after splash), not at the
root. Do not move it outside the auth check wrapper.

---

## What Belongs in Redux

| ✅ Put in Redux | ❌ Do NOT put in Redux |
|---|---|
| Auth state (user, tokens, role) | User preferences (theme, language — use Context) |
| Tour packages list + detail | Explore hotel state (in ExploreProvider context) |
| Trip plans + segments | Hotel bookings fetched once (in useFetch* hooks) |
| Package bookings | Derived/filtered data — compute in selectors or hooks |
| Cross-screen state | UI-only ephemeral state (use useState) |

---

## Constraints

- All 4 slices use `createSlice` — never use `createReducer` standalone.
- Do not add a 5th slice without a cross-screen state requirement. Local hook state is
  preferred for single-screen data.
- Never store derived data (filtered lists, computed values) in Redux. Compute in hooks.
- Auth state lives only in `authSlice` — never mirror it in local state.
- `src/store/index.ts/` is an empty folder — it is not a barrel file. Import from
  `@/store/store` directly.
