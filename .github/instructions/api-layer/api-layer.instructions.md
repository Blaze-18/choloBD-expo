---
applyTo: "src/services/api/**,src/constants/api.ts,src/lib/secureStore.ts"
---

# API Layer Instructions

This document covers the Axios client singleton, all service files in `src/services/api/`,
the base URL convention, token storage, and the shared error-mapping pattern.

---

## Base URL (`src/constants/api.ts`)

```ts
const envBase = process.env.API_BASE_URL || process.env.EXPO_PUBLIC_API_BASE_URL;
export const API_BASE_URL = envBase || '192.168.0.103:5000';

export const DEEP_LINK_SCHEME = process.env.DEEP_LINK_SCHEME || 'cholobd://auth/callback';
```

- Always import `API_BASE_URL` from `@/constants/api` — never hardcode a host or IP.
- Set `API_BASE_URL` or `EXPO_PUBLIC_API_BASE_URL` in `.env` for your environment.
- The fallback IP (`192.168.0.103:5000`) is a dev placeholder. It will not work in
  other environments without the env variable set.

---

## Axios Client (`src/services/api/axiosClient.ts`)

The app uses a **singleton Axios instance** created once at startup.

### Initialization

`createApi(baseURL)` is called in `useAuthInitializer` with `API_BASE_URL`:
```ts
// In useAuthInitializer.ts:
createApi(API_BASE_URL);
```

After that, all service files call `getApiInstance()` to get the shared instance:
```ts
export function getApiInstance(): AxiosInstance {
  if (!api) throw new Error('API not created. Call createApi(baseURL) first.');
  return api;
}
```

Never call `axios.create()` directly in a service or hook. Always use `getApiInstance()`.

### Request Interceptor
Automatically reads `accessToken` from `expo-secure-store` via `getTokens()` and injects
`Authorization: Bearer <token>` on every request.

### Response Interceptor — 401 Token Refresh
On a 401 response:
1. Marks the request with `_retry = true` to prevent infinite loops.
2. Reads `refreshToken` from secure store.
3. Calls `POST /api/auth/refresh` with `{ refreshToken }` using **raw `axios`** (not the
   intercepted instance) to avoid recursive 401 handling.
4. On success: saves new tokens via `saveTokens()`, retries the original request.
5. On failure: clears all tokens via `clearTokens()`, calls the registered `onLogout`
   callback, rejects the promise.

### Logout Callback
`setLogoutCallback(cb)` registers a function to be called when token refresh fails.
This is set in `useAuthInitializer` to dispatch `logoutUser` thunk.

Do not replicate refresh or logout logic elsewhere. The interceptor handles it globally.

### Timeout
Default timeout is **10 000 ms** (10 seconds). Do not override per-request unless there
is a documented performance reason.

---

## Service Files Reference

All service files live in `src/services/api/`. Each file owns one API domain.
All functions return **unwrapped data** (not the raw Axios response).

| File | Domain | Key functions |
|---|---|---|
| `axiosClient.ts` | HTTP client | `createApi`, `getApiInstance`, `setLogoutCallback` |
| `hotels.ts` | Hotel list | `fetchHotels(filters?)` → `Hotel[]` |
| `hotelDetail.ts` | Hotel detail | `fetchHotelById(hotelId)` → `HotelDetail \| null` |
| `bookings.ts` | Hotel bookings CRUD | `createBooking`, `getUserBookings`, `getHotelBookings`, `getBookingById`, `updateBooking` |
| `hotelBookings.ts` | Trip segment hotel data | `fetchUserHotelBookings(locationId?)`, `filterBookingsByLocation`, `formatBookingForDisplay` |
| `locations.ts` | Locations list | `fetchLocations()` → `Location[]` |
| `qr.ts` | QR check-in | `generateQRToken(bookingId)`, `scanQRCode(qrToken)` |
| `packageBookings.ts` | Package booking CRUD | `purchasePackage`, `getUserPackageBookings`, `cancelPackageBooking` |
| `tourBuilder.ts` | Tour packages CRUD + spots | `getTourPlans`, `getTourPlansByAdmin`, `getTourPlan`, `createTourPlan`, `updateTourPlan`, `deleteTourPlan`, `getTourSpots`, `getActivitySpots` |
| `tourSpots.ts` | Tour spots standalone | `getTourSpots(filters?)`, `getTourSpotDetail(id)` |
| `activitySpots.ts` | Activity spots standalone | `getActivitySpots(locationId)` |
| `tripPlanner.ts` | Trip plan CRUD + segments | `createTrip`, `getTrips`, `getTripDetails`, `updateTrip`, `deleteTrip`, `addSegment`, `updateSegment`, `deleteSegment`, `getTripSummary` |
| `users.ts` | User profile + hotel | `getUserProfile`, `getMyHotel(hotelId?)` |
| `translation.ts` | Lingva translation proxy | `translateText(text, targetLang)` — uses AsyncStorage cache |

---

## Shared Error-Mapping Pattern

Service files that need typed errors (tourBuilder, tripPlanner, packageBookings) define
a local `mapApiError(error)` function that maps HTTP status codes to a domain-specific
typed error object. The pattern is consistent across all three:

```ts
function mapApiError(error: any): DomainApiError {
  if (error?.response?.status === 400) return { type: 'VALIDATION', statusCode: 400, message: '...', details: ... };
  if (error?.response?.status === 401) return { type: 'UNAUTHORIZED', ... };
  if (error?.response?.status === 403) return { type: 'FORBIDDEN', ... };
  if (error?.response?.status === 404) return { type: 'NOT_FOUND', ... };
  if (error?.response?.status === 409) return { type: 'CONFLICT', ... };
  if (error?.response?.status === 500) return { type: 'SERVER', ... };
  return { type: 'UNKNOWN', statusCode: error?.response?.status || 0, message: error?.message || '...' };
}
```

- Simple service files (`hotels.ts`, `bookings.ts`, `locations.ts`, `qr.ts`) do not
  use `mapApiError` — they let errors propagate to the calling hook.
- Do not add `mapApiError` to a service file that doesn't already have one.

---

## `src/lib/secureStore.ts`

Wraps `expo-secure-store` with a safe API that also falls back to `localStorage` on web.

**Five stored keys:**

| Key | Content |
|---|---|
| `accessToken` | JWT access token |
| `refreshToken` | JWT refresh token |
| `userId` | Authenticated user's ID |
| `userRole` | Authenticated user's role string |
| `userData` | Serialized user object (JSON string) |

**Exported functions:**

```ts
saveTokens(tokens: AuthTokens): Promise<void>
getTokens(): Promise<AuthTokens | null>   // returns null if either token missing
clearTokens(): Promise<void>              // removes accessToken + refreshToken only
saveUserIdAndRole(userId: string, role: string): Promise<void>
saveUserData(userData: any): Promise<void>
getUserData(): Promise<any | null>
clearAll(): Promise<void>                 // clears all 5 keys
```

- `clearTokens()` only removes the two token keys — it does NOT clear `userId`,
  `userRole`, or `userData`.
- `clearAll()` clears everything — only called during full logout.
- The axios interceptor calls `getTokens()` and `saveTokens()` / `clearTokens()` directly.
  Do not call these from components or hooks — use `authSlice` thunks.

---

## `translation.ts` — Special Case

`src/services/api/translation.ts` is not backed by the app's backend. It calls
**public Lingva Translate instances** (open-source Google Translate proxy).

- Has a two-layer cache: **in-memory** (`Map`) + **`AsyncStorage`** persistence.
- Cache key format: `"targetLang|sourceText"`.
- Cache is loaded lazily on first call.
- Tries multiple Lingva instances in order; falls back if one fails.
- This file uses `AsyncStorage` directly (not `expo-secure-store`) — acceptable because
  it stores non-sensitive translation cache, not auth data.

---

## `users.ts` — Dual-Endpoint Pattern

`getMyHotel()` has a **fallback** pattern due to a backend migration:
1. Tries `GET /api/v1/hotels/my-hotel` (new endpoint).
2. If that fails or returns non-200, falls back to `GET /api/hotels/my` (old endpoint).
3. Only throws if both fail.

Do not "fix" this by removing the fallback — the backend may still have both endpoints
in different deployment environments.

---

## Constraints

- Never call `axios` directly in components, hooks, or slices — always go through a
  service function in `src/services/api/`.
- Never call `axios.create()` directly — use `getApiInstance()` after `createApi` runs.
- Never hardcode a URL, host, IP, or port in a service file — use the instance's
  `baseURL` (set at `createApi` time).
- Never store tokens in `AsyncStorage` — only `expo-secure-store` via `secureStore.ts`.
- Do not create a new service file for an endpoint that belongs to an existing domain
  file. Check existing files before adding new ones.
- Service functions must return unwrapped data, not the raw Axios response object.
- All loading and error states from API calls must be tracked: in `useState` for
  `useFetch*` hooks, or in Redux slice `isLoading`/`error` fields.
