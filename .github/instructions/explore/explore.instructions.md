---
applyTo: "src/app/(tabs)/explore/**,src/components/explore/**,src/hooks/useFetchHotels.ts,src/hooks/useFetchHotelDetail.ts,src/hooks/useFetchLocationHotels.ts,src/hooks/useBookingLogic.tsx,src/services/api/hotels.ts,src/services/api/hotelDetail.ts,src/services/api/bookings.ts,src/types/hotels.ts"
---

# Explore Module Instructions

This document covers the hotel browsing, hotel booking, tour browsing, and tour management
features under `src/app/(tabs)/explore/`. Follow these patterns when adding or modifying
explore screens.

---

## Module Responsibilities

- Hotel discovery: search by location, view hotel list, view hotel detail
- Hotel booking: select rooms, enter guest info, submit booking
- Tour browsing: list all tours, view tour detail, book a tour package
- Tour management (admin only): create, edit, and view owned tours
- Tour spot browsing: list and view attraction spots

---

## Route Structure

```
src/app/(tabs)/explore/
├── _layout.tsx          — Wraps entire explore stack in <ExploreProvider>
├── _provider.tsx        — ExploreContext: hotel/booking state shared across screens
├── index.tsx            — Entry point: renders <ExploreInterface isAdmin={isAdmin} />
├── hotel-search.tsx     — Location + date picker; triggers hotel fetch
├── list.tsx             — Hotel list results
├── detail.tsx           — Single hotel detail + room selection
├── booking.tsx          — Guest info form + booking submission
├── tour-list.tsx        — All available tour packages
├── tour-detail.tsx      — Single tour detail; admin sees Edit button
├── tour-create.tsx      — Admin only: create new tour package
├── tour-edit.tsx        — Admin only: edit existing tour package
├── my-tours.tsx         — Admin only: tours created by current user
├── tour-booking.tsx     — Book a tour package
├── tour-spots-list.tsx  — Browse tour attraction spots
└── tour-spots-detail.tsx — Single attraction spot detail
```

---

## Provider Architecture

The `_layout.tsx` wraps the entire explore stack in `<ExploreProvider>`:

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

`ExploreProvider` (in `_provider.tsx`) owns all hotel and booking state for the flow.
Screens access it via the `useExplore()` hook:

```ts
const { locations, hotels, hotelDetail, fetchHotelsByLocation, submitBooking, ... } = useExplore();
```

**What ExploreContext holds:**
- `locations` + `locationsLoading` — fetched on mount via `useFetchLocations`
- `hotels` + `hotelsLoading` — fetched on demand via `useFetchHotels`
- `hotelDetail` + `detailLoading` — fetched on hotel selection via `useFetchHotelDetail`
- Booking form state: `checkInDate`, `checkOutDate`, `guestName`, `guestEmail`, `guestPhoneNumber`, `paymentMethod`, `specialRequests`
- `selectedRoomsMap: Record<roomTypeId, quantity>`
- `submitting` — booking submission in progress

**Key actions in context:**
- `fetchHotelsByLocation(locationId)` — fetches hotels and navigates to `list.tsx`
- `selectHotel(hotelId)` — fetches detail and navigates to `detail.tsx`
- `changeRoomQty(roomTypeId, delta)` — increments/decrements room count, respects `availableCount`
- `submitBooking()` — submits booking via `useBookingLogic`
- `clearAllAndGoToSearch()` — resets all state and navigates back to hotel search

Do not lift hotel or booking state out of `ExploreProvider` into Redux. This state is
scoped to the explore flow and does not need to persist beyond it.

---

## Entry Point Pattern (index.tsx)

The index screen is always thin — it only reads role and delegates rendering:

```tsx
export default function ExploreIndex() {
  const { isAdmin } = useAuthWithAdminCheck();
  return <ExploreInterface isAdmin={isAdmin} />;
}
```

`ExploreInterface` renders different header text and card options based on `isAdmin`.
Admin users see tour management cards (Create Tours, My Tours) in addition to the
standard user cards.

---

## Dual Interface Pattern

`ExploreInterface` accepts an `isAdmin` prop and conditionally renders:
- **User view**: Book Hotel, Browse Attractions, Browse Tours, Create Trip Plan
- **Admin view**: All user options + Create Tours + My Tours

Use `TRANSLATION_KEYS` for all text — no hardcoded strings. `AdminExploreInterface` is
an older component with hardcoded strings; new explore UI must go through `ExploreInterface`
with the `isAdmin` prop instead.

```tsx
interface ExploreInterfaceProps {
  isAdmin?: boolean;
}
```

Navigation handlers inside `ExploreInterface` are memoized with `useMemo` because they
are passed to child card components — this is an intentional and measured optimization.

---

## Hotel Search Flow

```
hotel-search.tsx
  → user picks location (ExploreSearchForm) + check-in/out dates (DatePickerInput)
  → calls fetchHotelsByLocation(locationId) from context
  → ExploreProvider fetches hotels and pushes to list.tsx

list.tsx
  → shows hotel cards from context hotels[]
  → user selects hotel → calls selectHotel(hotelId)
  → ExploreProvider fetches detail and pushes to detail.tsx

detail.tsx
  → shows hotel info + room types
  → user adjusts rooms via changeRoomQty
  → navigates to booking.tsx

booking.tsx
  → guest info form (guestName, guestEmail, etc.)
  → calls submitBooking() from context
  → on success: calls clearAllAndGoToSearch()
```

- Check-in and check-out dates must both be set before hotel search is allowed.
- Validation failure shows `Alert.alert` (not inline error) — consistent with the
  rest of the hook-driven error pattern.

---

## Tour Flow

```
tour-list.tsx
  → reads from tourBuilderSlice via useSelector
  → navigates to tour-detail.tsx with { id } param

tour-detail.tsx
  → reads id from useLocalSearchParams<{ id: string }>()
  → dispatches fetchTourPlanDetail(id) on mount
  → shows Edit button only when isAdmin === true

tour-create.tsx / tour-edit.tsx
  → admin only; guard with useAuthWithAdminCheck()
  → use tourBuilderSlice thunks for CRUD

tour-booking.tsx
  → user books a tour package
  → uses packageBookingSlice
```

Tour data lives in **Redux** (`tourBuilderSlice`), unlike hotel data which lives in
`ExploreProvider` context. Do not move tour state into context.

---

## API Services Used

| Service file | Used for |
|---|---|
| `src/services/api/hotels.ts` | `fetchHotels(filters)` — hotel list with optional filters |
| `src/services/api/hotelDetail.ts` | `fetchHotelDetail(id)` — single hotel with room types |
| `src/services/api/bookings.ts` | Hotel booking submission |
| `src/services/api/tourBuilder.ts` | Tour plan CRUD (via tourBuilderSlice thunks) |
| `src/services/api/tourSpots.ts` | Tour attraction spots |
| `src/services/api/locations.ts` | Location list for search form |

All calls go through the Axios instance from `axiosClient.ts`. Never call `axios` directly.

---

## Hooks Used

| Hook | Purpose |
|---|---|
| `useFetchLocations` | Loads locations for the search form dropdown |
| `useFetchHotels` | Fetches hotel list by filters (used inside ExploreProvider) |
| `useFetchHotelDetail` | Fetches single hotel detail (used inside ExploreProvider) |
| `useBookingLogic` | Encapsulates hotel booking submission state and handler |
| `useAuthWithAdminCheck` | Determines if current user can see admin-only actions |

---

## Admin-Only Screens

The following screens must not be reachable by non-admin users:
- `tour-create.tsx`
- `tour-edit.tsx`
- `my-tours.tsx`

Guard access at the top of each screen:

```tsx
const { isAdmin } = useAuthWithAdminCheck();
if (!isAdmin) return null; // or router.back()
```

The Edit button on `tour-detail.tsx` is conditionally rendered via `isAdmin` and must
stay that way. Do not show admin actions based on local state.

---

## State Management Summary

| State | Lives in |
|---|---|
| Locations list | `ExploreProvider` context (via `useFetchLocations`) |
| Hotels list | `ExploreProvider` context (via `useFetchHotels`) |
| Hotel detail | `ExploreProvider` context (via `useFetchHotelDetail`) |
| Booking form fields | `ExploreProvider` context (`useState`) |
| Selected rooms | `ExploreProvider` context (`useState`) |
| Tour packages | `tourBuilderSlice` (Redux) |
| Tour detail | `tourBuilderSlice` (Redux) |
| Package bookings | `packageBookingSlice` (Redux) |

---

## Constraints

- Do not add hotel or booking state to Redux — it belongs in `ExploreProvider`.
- Do not access `ExploreContext` outside of the `(tabs)/explore` route group.
- All user-visible text in explore screens must use `TRANSLATION_KEYS` + `useTranslation()`.
- Admin-only actions must always be guarded with `useAuthWithAdminCheck()`.
- Room quantity changes must respect `availableCount` from hotel detail data.
- Date validation (check-in/check-out) must occur before triggering a hotel search.
