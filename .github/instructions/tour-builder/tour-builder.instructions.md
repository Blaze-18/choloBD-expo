---
applyTo: "src/app/(tour-builder)/**,src/store/slices/tourBuilderSlice.ts,src/hooks/useTourBuilderLogic.tsx,src/services/api/tourBuilder.ts,src/validators/tours.ts,src/types/tours.ts,src/components/tourBuilder/**"
---

# Tour Builder Module Instructions

This document covers the tour package management system, including the Redux slice,
business logic hook, API service, validation schemas, and UI components used by admin
users to create and manage tour packages.

---

## Module Overview

The tour builder is **admin-only** functionality. Regular users (`user` role) can view
and book tour packages via the Explore module, but only `admin`, `masterAdmin`, and
`SERVICE_ADMIN` users can create, edit, or delete them.

> **Route group status:** `src/app/(tour-builder)/` is currently **empty**. All tour
> management UI is accessed from within the Explore module (`ExploreInterface` with
> `isAdmin=true`). Do not add screens to `(tour-builder)/` without the corresponding
> explore integration.

---

## Architecture

Tour builder state lives in Redux (`tourBuilderSlice`). All access from screens and
components goes through `useTourBuilderLogic()`.

The hook exposes `isAdmin` (from `useAuthWithAdminCheck`) — admin-only mutations
(`createTour`, `updateTour`, `deleteTour`) throw immediately if `isAdmin` is `false`.
This is a client-side guard in addition to server-side enforcement.

---

## `useTourBuilderLogic` Hook

**Return shape (`TourBuilderLogic` interface):**

```ts
// State
tours: TourPackage[];          // Currently loaded list
selectedTour: TourPackage | null; // Detail/edit target
isLoading: boolean;            // listLoading || detailLoading
isFormSubmitting: boolean;     // formLoading
error: TourApiError | null;    // listError || detailError
formError: TourApiError | null;
filters: TourFilters;
isAdmin: boolean;              // from useAuthWithAdminCheck

// Actions
loadTourList(filters?: TourFilters): Promise<void>;
loadTourDetail(tourId: string): Promise<void>;
createTour(data: CreateTourPlanData): Promise<void>;
updateTour(tourId: string, data: UpdateTourPlanData): Promise<void>;
deleteTour(tourId: string): Promise<void>;
updateFilters(newFilters: TourFilters): void;
resetFilters(): void;
clearForm(): void;
clearErrors(): void;
```

**Admin guard pattern (enforced inside the hook):**
```ts
const createTour = async (data) => {
  if (!isAdmin) throw new Error('Insufficient permissions to create tour');
  // ...
};
```

Do not add admin checks in screens/components — the hook enforces them.

---

## Redux Slice (`tourBuilderSlice`)

### State shape

```ts
interface TourBuilderState {
  list: TourPackage[];
  listLoading: boolean;
  listError: TourApiError | null;

  detail: TourPackage | null;
  detailLoading: boolean;
  detailError: TourApiError | null;

  formLoading: boolean;
  formError: TourApiError | null;

  filters: TourFilters;
  adminMode: boolean;   // Tracked but not used by UI — do not expose in hook
}
```

### Thunks

| Thunk | Action type | Use case |
|---|---|---|
| `fetchTourPlans` | `tourBuilder/fetchTourPlans` | Public list with optional filters |
| `fetchTourPlansByAdmin` | `tourBuilder/fetchTourPlansByAdmin` | Admin's own packages; pass `'me'` or a specific adminId |
| `fetchTourPlanDetail` | `tourBuilder/fetchTourPlanDetail` | Single package by ID |
| `createTourPlanAsync` | `tourBuilder/createTourPlan` | Admin: create package |
| `updateTourPlanAsync` | `tourBuilder/updateTourPlan` | Admin: update; payload `{ id, payload }` |
| `deleteTourPlanAsync` | `tourBuilder/deleteTourPlan` | Admin: delete |

**`fetchTourPlansByAdmin`** defaults to `adminId = 'me'`. Callers can omit it:
```ts
dispatch(fetchTourPlansByAdmin()); // fetches current admin's tours
dispatch(fetchTourPlansByAdmin({ adminId: 'me', filters: { isActive: true } }));
```

---

## Service Layer (`src/services/api/tourBuilder.ts`)

All functions call `getApiInstance()` and return unwrapped data.

Error mapping: each function catches and rethrows via `mapApiError()`:

| Status | `type` field | Typical message |
|---|---|---|
| 400 | `VALIDATION` | "Validation failed. Check your input." |
| 404 | `NOT_FOUND` | "Tour package or location not found." |
| 409 | `CONFLICT` | "Tour may already exist or is in use by bookings." |
| 500 | `SERVER` | "Server error. Please try again later." |

**Notable functions used by `useDaySegmentSpots`:**

```ts
// Also used outside tourBuilderSlice — in useDaySegmentSpots (trip planner)
export async function getTourSpots(locationId?: string): Promise<Spot[]>
export async function getActivitySpots(locationId?: string): Promise<Spot[]>
```

These are shared with the trip planner wizard. Do not move them to a different service file.

---

## Key Types (`src/types/tours.ts`)

```ts
type TourType = 'ADVENTURE' | 'CULTURAL' | 'BEACH' | 'CITY_TOUR' | 'NATURE'
  | 'RELIGIOUS' | 'HISTORICAL' | 'MIXED';

type TransportServiceType = 'BUS' | 'FLIGHT' | 'TRAIN' | 'CAR_RENTAL' | 'FERRY' | 'SELF_MANAGED';

type HotelOptionType = 'LUXURY' | 'BUDGET' | 'BOUTIQUE' | 'RESORT' | 'HOSTEL' | 'GUESTHOUSE' | 'APARTMENT';

interface TourPackage {
  id: string;
  packageName: string;
  shortDescription?: string;
  tourType: TourType;
  duration: number;          // days
  maxGroupSize?: number;
  location: { id: string; name: string; };
  totalBudget: number;
  rating?: number;
  isActive: boolean;
  isPopular: boolean;
  daySegments: TourDaySegment[];
}

interface TourDaySegmentInput {
  dayNumber: number;
  tourSpotId: string;
  activitySpotId?: string;
  transportOption: TransportServiceType;
  transportQuality?: TransportQualityType; // depends on transportOption
  hotelOption: HotelOptionType;
}

// Enriched response with resolved names
interface TourDaySegment extends TourDaySegmentInput {
  id?: string;
  tourSpotName: string;
  activitySpotName?: string;
}
```

**`TRANSPORT_QUALITY_MAP`** — constant exported from `types/tours.ts`. Use it to determine
valid `transportQuality` values for a given `transportOption`:
- `BUS`: 7 quality options
- `FLIGHT`: 4 quality options
- `TRAIN`: 6 quality options
- `CAR_RENTAL`, `FERRY`, `SELF_MANAGED`: `null` (quality not applicable)

---

## Validation Schemas (`src/validators/tours.ts`)

All form submissions must be validated with these schemas before dispatch:

```ts
// Create
export const CreateTourPlanSchema: z.ZodObject<...>
export type CreateTourPlanData = z.infer<typeof CreateTourPlanSchema>

// Update (all fields optional)
export const UpdateTourPlanSchema: z.ZodObject<...>
export type UpdateTourPlanData = z.infer<typeof UpdateTourPlanSchema>

// Single segment
export const TourDaySegmentInputSchema: z.ZodObject<...>

// Utility validators (return ValidationResult, not throw)
export function validateCreateTourPlan(data: any): ValidationResult
export function validateUpdateTourPlan(data: any): ValidationResult
export function validateSegmentsForDuration(segments, duration): ValidationResult
```

`validateSegmentsForDuration` checks that segment `dayNumber` values do not exceed
`duration`. Always call this before submitting day segments.

---

## UI Components (`src/components/tourBuilder/`)

| Component | Purpose |
|---|---|
| `TourBuilderForm` | Create/edit form with `react-hook-form` + `Controller` (NOT the RN register pattern) |
| `DaySegmentCard` | Displays a single day segment; switches between `DaySegmentCardDisplay` and `DaySegmentCardEdit` |
| `DaySegmentCardDisplay` | Read-only view of a segment |
| `DaySegmentCardEdit` | Inline edit mode for a segment |
| `TourBuilderCard` | CTA card shown to admins to enter tour creation |
| `TourFilterBar` | Filter panel for location, tour type, budget, active/popular toggles |
| `TourListCard` | Card for displaying a single tour in a list |
| `TourBookingForm` | Booking form for users to book a tour package |
| `TourSpotModal` | Modal for selecting a tour spot |
| `ActivitySpotModal` | Modal for selecting an activity spot |
| `PackageBookingCard` | Card showing a booked package |
| `LoadingIndicator` | Local spinner used in this module |
| `ErrorAlert` | Error display for form-level errors |
| `DetailRow` | Single row in a tour detail view |

### `TourBuilderForm` — important patterns

- Uses `react-hook-form` with `Controller` (not the `register` + `setValue` pattern
  used in auth forms). This is because it has dropdowns and custom inputs.
- `daySegments` are managed in local `useState<TourDaySegmentInput[]>` — not in form state.
- On submit: merges `{ ...formValues, daySegments }` before calling `onSubmit` prop.
- The form calls `validateSegmentsForDuration(daySegments, duration)` before calling
  `onSubmit` to guard against mismatched day counts.
- Accepts `locations` as a prop (fetched by the parent screen, not internally).

### `DaySegmentCard` — edit mode pattern

- `isEnriched` prop: `true` when showing an existing segment with resolved names (from
  server), `false` when adding a new segment (raw IDs only).
- `isEditable` prop: shows edit/delete controls when `true`.
- `useDaySegmentSpots(locationId, isEditMode)` — spots are only loaded when in edit mode.
- On save: calls `onUpdate({ dayNumber, ...editData })`.
- On cancel: resets local `editData` to the original `segment` props.

---

## Filters (`TourFilters`)

```ts
interface TourFilters {
  locationId?: string;
  tourType?: TourType;
  isActive?: boolean;
  isPopular?: boolean;
  minBudget?: number;
  maxBudget?: number;
}
```

- `TourFilterBar` manages filter state locally. It calls `onFilterChange(filters)` on
  every change — there is no "Apply" button. The parent must call `loadTourList(filters)`
  in response.
- `resetFilters()` from `useTourBuilderLogic` dispatches `clearFilters()` to Redux.

---

## Constraints

- Admin mutations (`createTour`, `updateTour`, `deleteTour`) must only be called if
  `isAdmin === true`. The hook enforces this, but do not bypass it by dispatching thunks
  directly from screens.
- Do not add tour management screens to `(tour-builder)/` unless the explore module also
  integrates them — the route group is currently unused.
- `getTourSpots` and `getActivitySpots` in `tourBuilder.ts` are shared with the trip
  planner — do not move or rename them.
- Always validate `daySegments` count against `duration` before submission.
- Day segment `transportQuality` is only valid for BUS, FLIGHT, TRAIN — do not send it
  for CAR_RENTAL, FERRY, or SELF_MANAGED.
- All user-visible strings must use `TRANSLATION_KEYS` + `useTranslation()`. Note:
  `TourFilterBar` has some hardcoded strings — treat as legacy, do not copy that pattern.
