---
applyTo: "src/app/(tabs)/dashboard/**,src/hooks/useDashboardLogic.tsx,src/hooks/useServiceAdminLogic.tsx,src/components/interface/UserDashboard.tsx,src/components/interface/ServiceAdminDashboard.tsx"
---

# Dashboard Module Instructions

This document covers the user dashboard, service admin dashboard, and booking detail
screens under `src/app/(tabs)/dashboard/`. Follow these patterns when modifying or
extending the dashboard.

---

## Module Responsibilities

- Display the current user's hotel bookings summary
- Display the current user's tour package bookings
- Provide booking detail view with edit capability (if booking is not CONFIRMED or CANCELLED)
- QR code generation for a specific booking (for guest check-in)
- Service admin sub-section: manage hotel operations, view all bookings, scan QR codes
- Logout from the app

---

## Route Structure

```
src/app/(tabs)/dashboard/
├── _layout.tsx               — Plain Stack with no header
├── index.tsx                 — Entry: renders UserDashboard or ServiceAdminDashboard by role
├── user-bookings.tsx         — Full list of user's hotel bookings
├── package-bookings.tsx      — Full list of user's tour package bookings
├── [bookingId].tsx           — Hotel booking detail + inline edit form
├── [bookingId]/
│   └── qr-generate.tsx       — Generate QR token for a booking (guest use)
└── service-admin/
    ├── index.tsx             — Service admin home: hotel list + quick actions
    ├── current-bookings.tsx  — All hotel bookings for this admin's hotel
    ├── hotel-info.tsx        — Hotel details view
    ├── qr-scanner.tsx        — Camera-based QR scanner for check-in (SERVICE_ADMIN only)
    ├── staff.tsx             — Staff management
    └── your-bookings.tsx     — Bookings filtered to this admin
```

---

## Entry Point Pattern (index.tsx)

The dashboard index is the only place where role-based dashboard switching happens.
It delegates all rendering to two separate components:

```tsx
export default function DashboardPage() {
  const { auth, bookings, handleLogout, onRefresh, onPressBooking } = useDashboardLogic();

  if (auth.user?.role === 'SERVICE_ADMIN') {
    return <ServiceAdminDashboard ... />;
  }

  return <UserDashboard ... />;
}
```

- `SERVICE_ADMIN` role → `ServiceAdminDashboard`
- All other roles → `UserDashboard`
- The index screen itself contains no business logic — all state comes from `useDashboardLogic`.
- It refreshes bookings on every focus event via `useFocusEffect`.

---

## useDashboardLogic Hook

`src/hooks/useDashboardLogic.tsx` is the single source of state for the dashboard and
tracking screens. It is used in: `index.tsx`, `user-bookings.tsx`, `hotel-bookings.tsx`
(tracking), and `tracking/index.tsx`.

Returns:
```ts
{
  auth: AuthState,
  bookings: any[],
  loading: boolean,
  handleLogout: () => Promise<void>,
  onPressBooking: (bookingId: string) => void,
  onRefresh: () => Promise<void>,  // re-fetches first page of bookings
}
```

- `onPressBooking` navigates to `/(tabs)/dashboard/${bookingId}`.
- `handleLogout` dispatches `logoutUser` thunk then redirects to `/(auth)/login`.
- `bookings` is always an array — initialize as `[]`, never `null`.
- Uses `useBookingLogic` internally for the `fetchUserBookings` call (pagination: page 1, limit 20).

Do not add API calls directly to `useDashboardLogic` — delegate to service hooks.

---

## Dynamic Route: [bookingId].tsx

Reads `bookingId` from `useLocalSearchParams<{ bookingId: string }>()`.

Behavior:
- Fetches full booking detail via `useBookingLogic().fetchBookingDetails(bookingId)` on mount.
- Pre-fills edit form fields from the fetched booking.
- Edit is only allowed when `booking.status` is not `'CONFIRMED'` or `'CANCELLED'`.
- Blocked edit shows an `alert()` message (not `Alert.alert` — this is a known inconsistency; keep for now).
- Edit form uses local `useState` for field values, not react-hook-form (no Zod schema for this form).
- Submits via `useBookingLogic().editBooking(...)`.

---

## QR Code Generation: [bookingId]/qr-generate.tsx

- Reads `bookingId` from `useLocalSearchParams`.
- On mount, calls `useQRGeneration().generateQRToken(bookingId)`.
- Displays the QR token via `<QRCodeDisplay>` component from `src/components/ui/`.
- Sets a 10-minute expiry time locally (not from server) for display purposes only.
- On missing `bookingId`: `Alert.alert` + `router.back()`.
- Does not poll or auto-refresh — user must navigate back and re-enter to get a new code.

---

## Package Bookings: package-bookings.tsx

- Uses `usePackageBookingLogic()` for fetching and cancellation.
- Supports client-side filtering by `BookingStatus` and `PaymentStatus`.
- Re-fetches when `statusFilter` or `paymentFilter` changes (tracked via `useEffect`).
- Filter values default to `'ALL'`.
- Cancellation is confirmed via `Alert.alert` with destructive confirm pattern.

---

## Service Admin Section

The `service-admin/` sub-group is accessible only to `SERVICE_ADMIN` role users.

| Screen | Purpose |
|---|---|
| `index.tsx` | Loads hotel data via `useServiceAdminLogic().fetchMyHotel()` |
| `current-bookings.tsx` | All bookings for the admin's hotel |
| `hotel-info.tsx` | Hotel profile view |
| `qr-scanner.tsx` | Camera QR scanner → calls `useQRScanner().scanQRCode(token)` |
| `staff.tsx` | Staff list management |
| `your-bookings.tsx` | Bookings filtered to this admin user |

- `qr-scanner.tsx` uses `<QRCodeScanner>` UI component and `useQRScanner` hook.
- On scan success: shows `<QRBookingDetailsDisplay>` with booking info.
- On scan failure: `Alert.alert` with the error message from `useQRScanner.error`.
- "Scan Another" resets `scannedBooking` state and clears error.

Do not add QR scanning logic inline in the screen — it belongs in `useQRScanner`.

---

## Booking Status Constraints

From `src/types/packageBookings.ts`:

```ts
type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'REFUNDED' | 'NO_SHOW';
type PaymentStatus = 'UNPAID' | 'PAID';
```

- `CONFIRMED` and `CANCELLED` bookings cannot be edited.
- Cancellation is only available from `package-bookings.tsx` via `usePackageBookingLogic`.
- Hotel booking edits are available from `[bookingId].tsx` for non-final statuses.

---

## Hooks Used

| Hook | Purpose |
|---|---|
| `useDashboardLogic` | Central state for bookings list, logout, navigation |
| `useBookingLogic` | Hotel booking fetch, detail, edit |
| `usePackageBookingLogic` | Package booking fetch, cancel |
| `useQRGeneration` | Generate QR token for a booking |
| `useQRScanner` | Validate QR token via camera scan |
| `useServiceAdminLogic` | Service admin hotel/profile fetch |

---

## Components Used

| Component | Location |
|---|---|
| `UserDashboard` | `src/components/interface/UserDashboard.tsx` |
| `ServiceAdminDashboard` | `src/components/interface/ServiceAdminDashboard.tsx` |
| `BookingCard` | `src/components/ui/bookingCard.tsx` |
| `PackageBookingCard` | `src/components/tourBuilder/PackageBookingCard.tsx` |
| `QRCodeDisplay` | `src/components/ui/QRCodeDisplay.tsx` |
| `QRCodeScanner` | `src/components/ui/QRCodeScanner.tsx` |
| `QRBookingDetailsDisplay` | `src/components/ui/QRBookingDetailsDisplay.tsx` |
| `HotelBookingForm` | `src/components/forms/hotelBookingForm.tsx` |

---

## Constraints

- Do not read `auth.user.role` directly to gate whole screens — use `useDashboardLogic` which already reads from `authSlice`.
- `SERVICE_ADMIN` routing to `service-admin/qr-scanner` is the only place camera is used in the dashboard — do not add camera usage elsewhere here.
- Empty booking lists must always show a placeholder message, never a blank screen.
- All user-visible strings must use `TRANSLATION_KEYS` + `useTranslation()`.
- Do not store booking lists in Redux — `useDashboardLogic` owns them in local state.
