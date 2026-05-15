---
applyTo: "src/hooks/**"
---

# Hooks Instructions

This document catalogues all hooks in `src/hooks/` and `src/hooks/state/`, documents
their return shapes, and enforces naming and pattern conventions.

---

## Hook Naming Conventions

| Pattern | Purpose | Example |
|---|---|---|
| `useFetch*` | Wraps a single API call; returns `data`, `loading`, `refetch` | `useFetchLocations` |
| `use*Logic` | Encapsulates complex state + thunk dispatch; returns handlers | `useTourBuilderLogic` |
| `use*` (generic) | UI state, device capabilities, auth access, preferences | `useTheme`, `useCameraPermission` |

- All hooks use named exports only.
- Hook filename matches hook name exactly (camelCase).
- State-restoration hooks live in `src/hooks/state/`.

---

## `useFetch*` Hooks — Common Pattern

```ts
const [data, setData] = useState<T[]>([]);
const [loading, setLoading] = useState(false);

const load = async () => {
  try {
    setLoading(true);
    const result = await someServiceFn();
    setData(result);
  } catch (e: any) {
    if (__DEV__) console.error('[useHookName] error', e?.response?.data || e.message);
    Alert.alert('Error', 'User-visible message');
  } finally {
    setLoading(false);
  }
};
```

For hooks that accept dependencies, use an `active` flag to prevent stale state updates
on unmounted components (see `useFetchTourSpots` and `useFetchActivitySpots`):

```ts
useEffect(() => {
  let active = true;
  const load = async () => {
    // ...
    if (active) setData(result);
  };
  load();
  return () => { active = false; };
}, [dep]);
```

---

## Full Hook Catalog

### Auth & Permissions

#### `useAuthWithAdminCheck` (`src/hooks/useAuthWithAdminCheck.tsx`)
Returns auth state plus admin flags. Use everywhere admin-gated UI is rendered.

```ts
const {
  user,            // AuthUser | null
  isAuthenticated, // boolean
  isLoading,       // boolean
  isInitializing,  // boolean
  error,           // string | null
  isAdmin,         // true for 'admin' | 'masterAdmin' | 'SERVICE_ADMIN'
  isMasterAdmin,   // true only for 'masterAdmin'
  userRole,        // UserRole | null
} = useAuthWithAdminCheck();
```

- `isAdmin` returns `true` for all three admin roles (`admin`, `masterAdmin`, `SERVICE_ADMIN`).
- `isMasterAdmin` returns `true` only for `'masterAdmin'`.
- Also exports `useCanPerformAdminActions()` — a convenience bool that returns `isAdmin`.
- **Never gate admin controls using local state — always use this hook.**

#### `useCameraPermission` (`src/hooks/useCameraPermission.ts`)
Requests `expo-camera` permission on mount.

```ts
const { permission, isLoading } = useCameraPermission();
// permission: boolean | null — null until resolved
// isLoading: boolean — true while permission request is in flight
```

- Permission is requested immediately on mount. Do not call it again.
- Both named and default export.

---

### Data Fetching Hooks

#### `useFetchLocations` (`src/hooks/useFetchLocations.ts`)
Fetches all locations on mount.

```ts
const { locations, loading, refetch } = useFetchLocations();
```

- Fetches on mount automatically (no trigger param).
- On error: `Alert.alert('Error', 'Failed to load locations')`.

#### `useFetchHotels` (`src/hooks/useFetchHotels.ts`)
Fetches hotels on demand (not on mount).

```ts
const { hotels, loading, fetchHotels, clearHotels } = useFetchHotels();
// fetchHotels(filters: HotelFilters) — call explicitly to load
// clearHotels() — resets hotel list to []
```

- Does NOT auto-fetch on mount — call `fetchHotels(filters)` explicitly.

#### `useFetchHotelDetail` (`src/hooks/useFetchHotelDetail.ts`)
Fetches a single hotel's detail on demand. Performs background translation.

```ts
const { hotel, loading, fetchHotelDetail, clearHotel } = useFetchHotelDetail();
// fetchHotelDetail(hotelId: string) — async, sets hotel immediately then re-sets after translation
// clearHotel() — resets hotel to null
```

- Sets the hotel state immediately after the initial fetch (English content), then silently
  re-sets state after `translateDescriptionIfNeeded` + `translateDisplayStringListIfNeeded`
  complete. This is intentional — do not remove the two-phase setState.
- Translation is skipped if the current i18n language is English.

#### `useFetchLocationHotels` (`src/hooks/useFetchLocationHotels.ts`)
Fetches hotels for a specific location on demand.

```ts
const { hotels, loading, fetchHotelsForLocation } = useFetchLocationHotels();
// fetchHotelsForLocation(locationId, { minRating?, hotelType? })
```

- Always passes `isActive: true` to the hotels service.

#### `useFetchTourSpots` (`src/hooks/useFetchTourSpots.ts`)
Fetches tour spots, re-fetches when filter dependencies change.

```ts
const { spots, isLoading, error } = useFetchTourSpots(filters?: TourSpotFilters);
```

- Subscribes to `filters.isPopular`, `filters.locationId`, `filters.minRating` as
  `useEffect` deps (not the whole `filters` object — avoids reference churn).
- Uses `active` flag to prevent stale updates.
- Returns `error: string | null` (not `Alert`) — caller handles display.

#### `useFetchActivitySpots` (`src/hooks/useFetchActivitySpots.ts`)
Fetches activity spots for a location.

```ts
const { spots, isLoading, error } = useFetchActivitySpots(locationId: string | undefined);
```

- Returns early (empty array) when `locationId` is `undefined`.
- Uses `active` flag. Returns `error: string | null`.

#### `useFetchUserHotelBookings` (`src/hooks/useFetchUserHotelBookings.ts`)
Fetches hotel bookings for a specific trip's location.

```ts
const { bookings, loading } = useFetchUserHotelBookings(trip: TripPlan | null);
```

- Reads `userId` from Redux `state.auth.user.id`.
- Fetches ALL user bookings then filters client-side by `trip.primaryLocation.name`
  (case-insensitive match). This is intentional — the API has no location filter.
- Returns `[]` silently on error (non-critical display).

#### `useCurrentBookingsFetch` (`src/hooks/useCurrentBookingsFetch.tsx`)
Fetches hotel bookings for the SERVICE_ADMIN's hotel with pagination.

```ts
const {
  bookings,
  pagination,    // { total, page, limit, pages } | null
  loading,
  error,         // string | null
  currentPage,
  setCurrentPage,
  refetch,
} = useCurrentBookingsFetch(limit = 20);
```

- Calls `useServiceAdminLogic().fetchProfile()` on mount to get `serviceEntityId`
  (the hotel ID). Fails gracefully with an error message if none is assigned.
- Paginates via `currentPage` state. Re-fetches when `currentPage` changes.

---

### Logic Hooks (Business Logic)

#### `useBookingLogic` (`src/hooks/useBookingLogic.tsx`)
Handles hotel room booking submission.

```ts
const { submitting, handleBooking, loadingBookings } = useBookingLogic();
// handleBooking(bookingData, onSuccess?) — async
```

- Reads `auth.user.id` from Redux. Blocks and shows `Alert` if not authenticated.
- `handleBooking` wraps `submitBooking` and calls `onSuccess` if provided.
- Input validation before API call: hotelId required, both dates required, at least one room selected.

#### `usePackageBookingLogic` (`src/hooks/usePackageBookingLogic.tsx`)
Handles tour package purchase and cancellation via Redux thunks.

```ts
const {
  handlePurchase,          // (tourPackageId, data?, onSuccess?) => Promise
  handleCancelBooking,     // (bookingId, data?, onSuccess?) => Promise
  refreshBookings,         // () => Promise<void>
  fetchBookingDetail,      // (bookingId) => Promise
  clearPurchase,           // () => void
  clearCancel,             // () => void
  isLoading,               // boolean
  error,                   // string | null
  bookings,                // PackageBooking[]
  bookingDetail,           // PackageBookingDetail | null
  lastPurchasedBooking,    // PackageBooking | null
} = usePackageBookingLogic();
```

- Dispatches thunks from `packageBookingSlice` via `useDispatch<AppDispatch>()`.
- Reads from `state.packageBooking` and `state.auth`.

#### `useDashboardLogic` (`src/hooks/useDashboardLogic.tsx`)
See `dashboard.instructions.md` for full return shape.

#### `useServiceAdminLogic` (`src/hooks/useServiceAdminLogic.tsx`)
See `dashboard.instructions.md` for full return shape.

#### `useTourBuilderLogic` (`src/hooks/useTourBuilderLogic.tsx`)
See `tour-builder.instructions.md` for full return shape.

#### `useTripPlannerLogic` (`src/hooks/useTripPlannerLogic.tsx`)
See `trip-planner.instructions.md` for full return shape.

#### `useDaySegmentSpots` (`src/hooks/useDaySegmentSpots.ts`)
See `trip-planner.instructions.md` for return shape.

---

### QR Hooks

#### `useQRGeneration` (`src/hooks/useQRGeneration.tsx`)
Generates a QR token for a booking.

```ts
const { loading, error, generateQRToken } = useQRGeneration();
// generateQRToken(bookingId: string): Promise<string | null>
// throws on error — caller must catch
```

- `generateQRToken` throws on failure so the caller can handle it (e.g. show `Alert`).
- Both named and default export.

#### `useQRScanner` (`src/hooks/useQRScanner.tsx`)
Validates a scanned QR token against the API.

```ts
const { loading, error, scanQRCode, clearError } = useQRScanner();
// scanQRCode(qrToken: string): Promise<QRBookingDetail | null>
// throws on error — caller must catch
```

- Maps specific HTTP error codes to human-readable messages (401, 403, 404, 410, 400, 5xx).
- `clearError()` resets `error` to `null`.
- Both named and default export.

---

### Preference Hooks

#### `useTheme` (`src/hooks/useTheme.ts`)
```ts
const { isDark, mode, setMode, toggle } = useTheme();
// isDark: boolean — primary value for conditional styling
// mode: 'light' | 'dark' | 'system'
// setMode(mode): void
// toggle(): void — cycles light → dark → system
```

#### `useLanguageSwitcher` (`src/hooks/useLanguageSwitcher.ts`)
```ts
const {
  currentLanguage, isBengali, isEnglish,
  toggleLanguage, setBengali, setEnglish, setLanguage,
} = useLanguageSwitcher();
```

---

### State Hooks (`src/hooks/state/`)

#### `useAuthInitializer` (`src/hooks/state/useAuthInitializer.ts`)
Called once from `AppContentLayout` in the root `_layout.tsx`. Not for use elsewhere.

```ts
useAuthInitializer(baseURL: string)
```

- Calls `configureApi(baseURL)` → sets `setLogoutCallback` → dispatches `initializeAuth()`.
- All three must happen in this order.
- Registers the Axios logout callback so the interceptor can dispatch `logoutUser()`.

#### `usePreloadAssets` (`src/hooks/usePreloadAssets.ts`)
Tracks font + asset loading readiness.

```ts
const { isReady, fontsLoaded } = usePreloadAssets();
```

- Calls `SplashScreen.preventAutoHideAsync()` on mount.
- Uses `SecureStore.getItemAsync('auth_token')` to pre-warm session — does not dispatch
  to Redux. This is NOT where auth state is restored; `useAuthInitializer` handles that.
- Returns `isReady: true` even on error, to prevent the app being stuck.

---

## Constraints

- Do not define business logic in components or route files — use `use*Logic` hooks.
- Do not call service functions directly from components — always through a hook.
- `useFetch*` hooks use local `useState` (not Redux) unless the data is cross-screen.
- Use `__DEV__` guard for all `console.error` logging in hooks.
- Use `Alert.alert` for one-time error notifications in `useFetch*` and `use*Logic` hooks.
  For `error: string | null` return patterns (e.g. `useQRScanner`), the caller handles display.
- Do not add `useMemo`/`useCallback` to hooks without a measured performance reason.
  Exceptions already in the codebase (`useQRGeneration`, `useQRScanner`, `useBookingLogic`)
  are intentional.
- `useAuthInitializer` is called only from `AppContentLayout`. Do not call it from other hooks.
- `usePreloadAssets` is called only from `AppContentLayout`. Do not duplicate asset loading.
- If a hook is used in more than one feature, move it to `src/hooks/` (it is probably
  already there — check before creating a new one).
