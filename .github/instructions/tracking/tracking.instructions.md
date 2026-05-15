---
applyTo: "src/app/(tabs)/tracking/**,src/hooks/useQRGeneration.tsx,src/hooks/useQRScanner.tsx,src/hooks/useCameraPermission.ts,src/hooks/useFetchUserHotelBookings.ts,src/hooks/useCurrentBookingsFetch.tsx,src/services/api/qr.ts,src/types/qr.ts"
---

# Tracking Module Instructions

This document covers the booking tracking tab under `src/app/(tabs)/tracking/`, including
hotel booking tracking, package booking tracking, and the QR code check-in system.

---

## Module Responsibilities

- Display the current user's active hotel bookings as trackable cards
- Display tour package bookings with status and cancellation support
- Navigate to booking detail (`/(tabs)/dashboard/[bookingId]`) from tracking cards
- Trigger QR code generation for check-in (`/(tabs)/dashboard/[bookingId]/qr-generate`)
- Provide `SERVICE_ADMIN` users access to the QR scanner for check-in validation
- Surface different card data depending on role (guest name vs hotel name)

---

## Route Structure

```
src/app/(tabs)/tracking/
├── _layout.tsx                    — Plain Stack with no header
├── index.tsx                      — Combined view: hotel bookings + quick actions
├── hotel-bookings.tsx             — Full hotel bookings tracking list
├── package-bookings.tsx           — Tour package bookings tracking list
└── package-bookings/
    └── [packageId].tsx            — Package bookings filtered by a specific package ID
```

---

## Data Source

Tracking screens share bookings data from `useDashboardLogic()`. They do **not** have
their own data-fetching — they reuse the same hook as the dashboard:

```ts
const { bookings, loading, onRefresh } = useDashboardLogic();
```

- Call `onRefresh()` in a `useEffect` on mount to ensure fresh data when navigating to this tab.
- `bookings` is always `any[]` — never `null`.

Package booking detail (`[packageId].tsx`) is the exception: it dispatches
`fetchPackageBookingsByPackageId` from `packageBookingSlice` directly, since it needs
bookings filtered by a specific tour package.

---

## TrackingCard Component

All booking entries are rendered with `<TrackingCard>` from `src/components/ui/TrackingCard.tsx`.

Props vary by role:

```tsx
// Regular user: sees hotel name + their own info
const displayTitle = item.hotel?.name || 'Hotel';
const displaySubtitle = item.user?.userName || item.user?.email;

// SERVICE_ADMIN: sees guest name + hotel name
const displayTitle = item.user?.userName || item.user?.firstName || 'Guest';
const displaySubtitle = item.hotel?.name;
```

- Pass `isServiceAdmin` prop to `TrackingCard` to toggle the layout.
- `onQRPress` navigates to `/(tabs)/dashboard/${bookingId}/qr-generate` — for the guest to generate their QR.
- `onCameraPress` navigates to `/(tabs)/dashboard/service-admin/qr-scanner` — only passed when `isServiceAdmin === true`.

---

## Role-Based Display Logic

Both `index.tsx` and `hotel-bookings.tsx` apply the same role check:

```ts
const isServiceAdmin = auth.user?.role === 'SERVICE_ADMIN';
```

- Regular users: see their own hotel name + check-in/out dates + QR generate button.
- `SERVICE_ADMIN`: sees guest names + camera scan button instead of QR generate.

This check is done inline on `auth.user?.role` — not via `useAuthWithAdminCheck` — because
only `SERVICE_ADMIN` specifically triggers the different display, not all admin roles.

---

## Package Bookings Tracking

`package-bookings.tsx`:
- Uses `usePackageBookingLogic()` for data.
- Supports `BookingStatus` and `PaymentStatus` filter dropdowns.
- Filters are local state — no URL params or Redux for filter state.
- Re-fetches on filter change via `useEffect([statusFilter, paymentFilter])`.

`package-bookings/[packageId].tsx`:
- Reads `packageId` from `useLocalSearchParams<{ packageId: string }>()`.
- Dispatches `fetchPackageBookingsByPackageId({ tourPackageId: packageId })` on mount and on pull-to-refresh.
- Allows cancellation via `usePackageBookingLogic().handleCancelBooking()`.
- Cancel is confirmed with `Alert.alert` using the destructive button pattern.

---

## QR Code System

### Guest Side — QR Generation
**Hook:** `useQRGeneration` (`src/hooks/useQRGeneration.tsx`)
**Screen:** `/(tabs)/dashboard/[bookingId]/qr-generate.tsx`

```ts
const { generateQRToken, loading, error } = useQRGeneration();
const token = await generateQRToken(bookingId); // returns qrToken string or null
```

- Returns a `qrToken` string from `src/services/api/qr.ts`.
- The expiry display is set to 10 minutes from generation time — calculated locally, not from the server.
- Errors: caught in screen with `Alert.alert('Failed to Generate QR', error)`.
- Token is stored in local `useState` — not in Redux.

### Staff Side — QR Scanning
**Hook:** `useQRScanner` (`src/hooks/useQRScanner.tsx`)
**Screen:** `/(tabs)/dashboard/service-admin/qr-scanner.tsx`

```ts
const { scanQRCode, loading, error, clearError } = useQRScanner();
const booking = await scanQRCode(qrToken); // returns QRBookingDetail or null
```

- The hook maps HTTP status codes to user-friendly error messages:

| Status | Mapped message |
|---|---|
| 401 (Invalid QR token) | "QR code is invalid or expired" |
| 401 (does not belong to hotel) | "Not authorized to check in at this hotel" |
| 410 | "QR code has expired" |
| 400 (cancelled) | "Booking has been cancelled" |
| 404 | "Booking not found" |
| 403 | "Employee does not have a hotel assigned" |
| 5xx | "Unable to validate — check connection" |

- Do not add error message mapping in the screen — it belongs in `useQRScanner`.
- `clearError()` must be called when resetting the scanner UI.
- On success: display `<QRBookingDetailsDisplay booking={scannedBooking} />`.
- "Scan Another" button calls `resetScan()` which sets `scannedBooking` to `null` and calls `clearError()`.

### Camera Permission
**Hook:** `useCameraPermission` (`src/hooks/useCameraPermission.ts`)

- Must be requested before the camera component mounts.
- The scanner screen (`qr-scanner.tsx`) relies on the `<QRCodeScanner>` component handling
  permission internally — do not duplicate the request in the screen.

---

## Navigation from Tracking

| Action | Destination |
|---|---|
| Press booking detail | `/(tabs)/dashboard/${bookingId}` |
| Press QR button (guest) | `/(tabs)/dashboard/${bookingId}/qr-generate` |
| Press camera button (admin) | `/(tabs)/dashboard/service-admin/qr-scanner` |

All navigation uses `router.push` — not `router.replace` — so back navigation works.

---

## Hooks Used

| Hook | Purpose |
|---|---|
| `useDashboardLogic` | Hotel bookings list + refresh |
| `usePackageBookingLogic` | Package bookings list + cancellation |
| `useQRGeneration` | Generate QR token for a hotel booking |
| `useQRScanner` | Validate scanned QR token (SERVICE_ADMIN only) |
| `useCameraPermission` | Camera permission state |

---

## Constraints

- Do not duplicate data-fetching in tracking screens — reuse `useDashboardLogic` for hotel bookings.
- Do not add QR token logic inline in screens — always use `useQRGeneration` or `useQRScanner`.
- Empty states must be shown explicitly — never render a blank list.
- All user-visible strings must use `TRANSLATION_KEYS` + `useTranslation()`.
- `SERVICE_ADMIN` camera access is limited to `service-admin/qr-scanner` — do not add camera elsewhere in tracking.
- Do not store QR tokens in Redux or AsyncStorage — local `useState` only.
