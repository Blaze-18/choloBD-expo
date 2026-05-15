---
applyTo: "src/app/(tabs)/trip-planner/**,src/store/slices/tripPlannerSlice.ts,src/hooks/useTripPlannerLogic.tsx,src/hooks/useDaySegmentSpots.ts,src/services/api/tripPlanner.ts,src/types/trips.ts,src/components/tripPlanner/**"
---

# Trip Planner Module Instructions

This document covers the trip planning feature under `src/app/(tabs)/trip-planner/`, including
the multi-step creation wizard, trip detail management with day segments, and the supporting
Redux slice and service layer.

---

## Module Responsibilities

- Let authenticated users create personal trip plans for a location over a date range
- Walk users through a 3-step creation wizard: Location → Dates → Spots
- Display trip details with 4 tabs: Hotels, Day Plan, Transport, Itinerary
- Manage day segments: add, edit, delete individual day entries within a trip
- Provide a cost summary breakdown per trip
- Delete trips with a confirmation prompt

---

## Route Structure

```
src/app/(tabs)/trip-planner/
├── _layout.tsx     — Plain Stack, headerShown: false for all screens
├── index.tsx       — Trip list: all user trips + create button
├── create.tsx      — 3-step wizard: location → dates → spots → auto-submit
├── list.tsx        — Alternative trip list (hardcoded strings — legacy, see note)
└── [id].tsx        — Trip detail: TripOverview + 4 horizontal tabs
```

> **Note:** `list.tsx` has hardcoded English strings (not using `TRANSLATION_KEYS`). It is
> a legacy screen. Do not add new features to it — use `index.tsx` as the canonical list.

---

## Creation Wizard Flow (`create.tsx`)

The wizard is a 3-step sequential flow driven by Redux state. Each step is rendered
inside `<SlidingWindow>` which animates the transition between steps.

**Step 0 — Location:**
`<LocationSelection>` → calls `setWizardLocationAction(location)` → slice auto-advances
`wizard.currentStep` to 1 when location is set.

**Step 1 — Dates:**
`<DateRangeSelection>` → calls `setWizardDatesAction(start, end)` → slice stores as ISO
strings and auto-advances `wizard.currentStep` to 2.

**Step 2 — Spots:**
`<SpotsSelection>` → calls `setWizardSpotsAction(spots)` → then immediately calls
`createTrip(tripData)` to submit the plan.

**On mount:** `resetWizardAction()` is called to clear any leftover wizard state from
a previous session.

**Trip name and description** are auto-generated:
```ts
name: `${location.name} Trip`
description: `A ${days}-day trip to ${location.name}`
```

**On success:** Navigate to `/(tabs)/trip-planner/${newTrip.id}` for detail view.

---

## Trip Detail Screen (`[id].tsx`)

- Reads `id` from `useLocalSearchParams<{ id: string }>()`.
- Calls `loadTripDetail(id)` on mount and whenever `id` changes.
- 4 tabs rendered in horizontal tab bar — state is local `useState<TabName>`:

| Tab key | Component | Purpose |
|---|---|---|
| `hotels` | `<HotelsTab>` | Hotel options for the trip |
| `dayplan` | `<DayPlanTab>` | Manage day segments |
| `transport` | `<TransportTab>` | Transport overview |
| `itinerary` | `<ItineraryTab>` | Full itinerary from trip summary |

- Tab bar uses `theme.colors.primary` / `theme.colors['primary-dark']` from `useTheme()` for
  active indicator — not NativeWind class alone.
- A 403 response renders a lock icon + "Access Denied" message, not a generic error.
- `TripOverview` always renders above the tab bar and shows trip metadata.

---

## `useTripPlannerLogic` Hook

All trip planner screens use this single hook. Do not call Redux directly from screens.

**Full return shape (from `TripPlannerLogic` interface):**

```ts
// List state
trips: TripPlan[];
totalTrips: number;
currentPage: number;
isTripsLoading: boolean;
tripsError: TripApiError | null;

// Detail state
currentTrip: TripPlan | null;
currentSegments: UserSegment[];
isTripLoading: boolean;
tripError: TripApiError | null;

// Summary state
tripSummary: TripSummary | null;
isSummaryLoading: boolean;
summaryError: TripApiError | null;

// Form state
isFormSubmitting: boolean;
formError: TripApiError | null;

// Filters
filters: TripFilters;

// Wizard state
wizardCurrentStep: number;
wizardSelectedLocation: Location | null;
wizardStartDate: Date | null;        // Converted from ISO string in slice
wizardEndDate: Date | null;          // Converted from ISO string in slice
wizardSelectedSpots: Spot[];

// Trip list actions
loadTrips(filters?: TripFilters): Promise<void>;
refreshTrips(): Promise<void>;
updateTripFilters(newFilters: TripFilters): void;
resetTripFilters(): void;

// Trip detail actions
loadTripDetail(tripId: string): Promise<void>;
createTrip(data: CreateTripData): Promise<TripPlan>;
updateTrip(tripId: string, data: UpdateTripData): Promise<void>;
deleteTrip(tripId: string): Promise<void>;
clearCurrentTripData(): void;

// Segment actions
addSegment(tripId: string, data: CreateSegmentData): Promise<UserSegment>;
updateSegment(tripId: string, segmentId: string, data: UpdateSegmentData): Promise<void>;
deleteSegment(tripId: string, segmentId: string): Promise<void>;

// Summary actions
loadTripSummary(tripId: string): Promise<void>;
clearSummaryData(): void;

// Wizard actions
setWizardLocationAction(location: Location | null): void;
setWizardDatesAction(startDate: Date, endDate: Date): void;
setWizardSpotsAction(spots: Spot[]): void;
setWizardStepAction(step: number): void;
resetWizardAction(): void;

// General
clearFormError(): void;
clearAllData(): void;
```

---

## Redux Slice (`tripPlannerSlice`)

### State shape

```ts
interface TripPlannerState {
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
    startDate: string | null;      // ISO string (not Date object)
    endDate: string | null;        // ISO string (not Date object)
    selectedSpots: Spot[];
  };
}
```

> **Important:** Dates in the slice are stored as **ISO strings**, not `Date` objects.
> The hook converts them to `Date` objects before exposing `wizardStartDate`/`wizardEndDate`.

### Thunks

| Thunk | Action type | Notes |
|---|---|---|
| `fetchTrips` | `tripPlanner/fetchTrips` | Returns `{ trips, pagination }` |
| `fetchTripDetail` | `tripPlanner/fetchTripDetail` | Returns full `TripPlan` with segments |
| `fetchTripSummary` | `tripPlanner/fetchTripSummary` | Cost breakdown |
| `createTripAsync` | `tripPlanner/createTrip` | Returns new `TripPlan` |
| `updateTripAsync` | `tripPlanner/updateTrip` | Payload: `{ id, payload }` |
| `deleteTripAsync` | `tripPlanner/deleteTrip` | Returns deleted `tripId` |
| `addSegmentAsync` | `tripPlanner/addSegment` | Payload: `{ tripId, payload }` |
| `updateSegmentAsync` | `tripPlanner/updateSegment` | Payload: `{ tripId, segmentId, payload }` |
| `deleteSegmentAsync` | `tripPlanner/deleteSegment` | Payload: `{ tripId, segmentId }` |

### Wizard auto-advance
- Setting a location (`setWizardLocation`) automatically sets `currentStep = 1`.
- Setting dates (`setWizardDates`) automatically sets `currentStep = 2`.
- Spots (`setWizardSpots`) does NOT auto-advance — the wizard screen calls `createTrip` directly.

---

## `useDaySegmentSpots` Hook

Used by `DaySegmentCard` to fetch tour spots and activity spots for a specific location.

```ts
const {
  tourSpots,         // Spot[]
  activitySpots,     // Spot[]
  spotsLoading,
  getTourSpotName,   // (spotId: string) => string
  getActivitySpotName, // (spotId: string) => string
  refetch,
} = useDaySegmentSpots(locationId, shouldFetch);
```

- **`shouldFetch`** defaults to `true`. Pass `false` to defer loading until needed.
- In `DaySegmentCard`, `shouldFetch` is wired to `isEditMode` — spots are only loaded
  when the user enters edit mode for a segment, not on initial display.
- Uses `getTourSpots(locationId)` and `getActivitySpots(locationId)` from
  `src/services/api/tourBuilder.ts` (not `tripPlanner.ts`).
- Does **not** use Redux — local `useState` only.

---

## Service Layer (`src/services/api/tripPlanner.ts`)

All functions call `getApiInstance()` and return unwrapped data.

Error handling: each function catches errors and rethrows via `mapApiError()`, which maps
HTTP status codes to typed `TripApiError` objects:

| Status | `type` field | Typical message |
|---|---|---|
| 400 | `VALIDATION` | "Validation failed. Check your input." |
| 401 | `UNAUTHORIZED` | "Unauthorized. Please login again." |
| 403 | `FORBIDDEN` | "Access denied. You do not own this trip." |
| 404 | `NOT_FOUND` | "Trip plan or segment not found." |
| 409 | `CONFLICT` | "Cannot delete trip with confirmed bookings." |
| 500 | `SERVER` | "Server error. Please try again later." |

The `[id].tsx` screen checks `tripError.type === 'FORBIDDEN'` specifically to show the
lock icon — do not change this to a generic error display.

---

## Key Types (`src/types/trips.ts`)

```ts
type TripStatus = 'PLANNING' | 'SAVED' | 'BOOKED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

interface TripPlan {
  id: string;
  name: string;
  description?: string;
  status: TripStatus;
  primaryLocationId: string;
  startDate: string;
  endDate: string;
  estimatedBudget: number;
  participantCount: number;
  userSegments?: UserSegment[];
  // ...more fields
}

interface UserSegment {
  id: string;
  userTripPlanId: string;
  dayNumber: number;
  segmentOrder: number;
  customNotes?: string;
  startTime?: string;
  endTime?: string;
  estimatedCost: number;
  hotelRoomBookingId?: string;
  transportBookingId?: string;
  activityBookingId?: string;
  customTourSpotId?: string;
  customActivitySpotId?: string;
  hotelDetails?: SegmentBookingDetails;
  transportDetails?: SegmentBookingDetails;
  activityDetails?: SegmentBookingDetails;
}
```

---

## `SlidingWindow` Component

Used only in `create.tsx` to animate the 3-step wizard. Do not use it for other purposes.

```tsx
<SlidingWindow currentStep={wizardCurrentStep}>
  <LocationSelection ... />
  <DateRangeSelection ... />
  <SpotsSelection ... />
</SlidingWindow>
```

- Animates with `Animated.timing` on `translateX`, driven by `currentStep`.
- Duration is 400ms. Do not change.
- Children must be the exact 3 wizard components — do not reorder or add more.

---

## Deletion Pattern

Both `index.tsx` and `list.tsx` use `Alert.alert` with the `destructive` style button:

```ts
Alert.alert('Delete Trip', `Are you sure ...?`, [
  { text: 'Cancel', style: 'cancel' },
  { text: 'Delete', style: 'destructive', onPress: () => deleteTrip(tripId) },
]);
```

Use this exact pattern when adding delete confirmations to any new trip actions.

---

## Constraints

- All screens must call actions from `useTripPlannerLogic()` — never dispatch to
  `tripPlannerSlice` directly from a screen.
- Trip creation auto-generates name/description — do not add a manual name input to the wizard.
- `list.tsx` has hardcoded strings — do not add features to it. New work targets `index.tsx`.
- Do not add a 4th wizard step — the flow is fixed at Location → Dates → Spots → Submit.
- Empty trip list must show an explicit empty state + create button, never a blank screen.
- All user-visible strings must use `TRANSLATION_KEYS` + `useTranslation()`.
