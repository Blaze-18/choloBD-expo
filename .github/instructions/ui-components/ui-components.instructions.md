---
applyTo: "src/components/ui/**,src/constants/theme.ts,tailwind.config.js"
---

# UI Components Instructions

This document covers the shared primitive components in `src/components/ui/`, the dual
styling system (NativeWind + theme tokens), the color token system, and dark mode rules.

---

## Dual Styling Approach

Components use **both** NativeWind `className` and `style={{}}` with theme tokens from
`src/constants/theme.ts`. Both are always valid — often used together in the same element.

**Use `className` for:**
- Layout: `flex-1`, `flex-row`, `items-center`, `justify-between`, `overflow-hidden`
- Spacing: `px-4`, `py-2`, `mb-3`, `gap-2`
- Border radius: `rounded-xl`, `rounded-2xl`, `rounded-full`
- Static colors with dark variants: `bg-white dark:bg-surface-dark`, `text-text dark:text-text-dark`
- Borders: `border border-border dark:border-border-dark`
- Opacity: `active:opacity-75`

**Use `style={{}}` with theme tokens for:**
- Dynamic/computed colors (toggled by state or props)
- `elevation` and `shadow*` values (always from `theme.elevation.*`)
- Exact pixel values: `theme.spacing.*`, `theme.radii.*`
- Icon colors (must be hex strings, not className)

```tsx
import { theme } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';

const { isDark } = useTheme();
const textColor = isDark ? theme.colors['text-dark'] : theme.colors.text;

<View
  style={{ backgroundColor: isDark ? theme.colors['surface-dark'] : theme.colors.surface, elevation: 2 }}
  className="px-4 py-3 rounded-xl border border-border dark:border-border-dark"
/>
```

---

## Color Tokens

All colors are defined identically in both `tailwind.config.js` (for `className`) and
`src/constants/theme.ts` (for `style`). **Never hardcode hex values** — always use a token.

### Full token list

| Token | Light | Dark token |
|---|---|---|
| `primary` | `#0066FF` | `primary-dark` → `#5DADE2` |
| `secondary` | `#7C3AED` | `secondary-dark` → `#E0AAFF` |
| `accent` | `#06B6D4` | `accent-dark` → `#4FD1E8` |
| `background` | `#F5F7FB` | `background-dark` → `#0A0D14` |
| `surface` | `#FFFFFF` | `surface-dark` → `#15192E` |
| `surface-2` | `#F1F5F9` | `surface-2-dark` → `#1F2847` |
| `text` | `#0F172A` | `text-dark` → `#F0F4F8` |
| `muted` | `#475569` | `muted-dark` → `#9CA3AF` |
| `border` | `#E6E9EE` | `border-dark` → `#2D3B5F` |
| `success` | `#16A34A` | `success-dark` → `#4ADE80` |
| `success-light` | `#22C55E` | `success-light-dark` → `#86EFAC` |
| `warning` | `#F59E0B` | `warning-dark` → `#FBBF24` |
| `error` | `#DC2626` | `error-dark` → `#FF6B6B` |

> **Note:** `success-light` / `success-light-dark` exist in `theme.ts` but NOT in
> `tailwind.config.js`. Use `style={{}}` for these two tokens, not `className`.

---

## Dark Mode

- Dark mode is **class-based** (`darkMode: 'class'` in `tailwind.config.js`).
- The `dark` class is applied to the root `View` inside `ThemeProvider`.
- Every component that sets a color **must** provide a `dark:` variant or use `isDark`
  with theme tokens. Never set a color without a dark mode counterpart.
- `useTheme()` returns `{ isDark, mode, setMode, toggle }`.
- Three modes: `'light'`, `'dark'`, `'system'`. Preference persisted in `AsyncStorage`
  under key `'app_theme_mode'`. There is also a `FORCE_DARK = false` flag in
  `ThemeProvider.tsx` for development — do not change it.

---

## `src/constants/theme.ts` — Additional Tokens

Beyond colors, the theme exports:

```ts
theme.spacing  = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 }
theme.radii    = { sm: 8, md: 12, lg: 20, pill: 9999 }
theme.elevation = {
  sm: { shadowColor, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
  md: { shadowColor, shadowOpacity: 0.08, shadowRadius: 12, elevation: 6 },
  lg: { shadowColor, shadowOpacity: 0.12, shadowRadius: 24, elevation: 12 },
}
theme.zIndex = { dropdown: 1000, modal: 1100, sticky: 1020 }
theme.typography.sizes = { xs: 12, sm: 14, md: 16, lg: 20, xl: 24, '2xl': 32 }
```

Use `theme.elevation.sm` / `theme.elevation.md` / `theme.elevation.lg` for all card and
modal shadows — never hardcode `elevation` or `shadowOpacity` values.

---

## Shared UI Components (`src/components/ui/`)

| Component | Export | Purpose |
|---|---|---|
| `AdminCard` | named | Generic action card for admin sections; shows title + chevron |
| `BookingCard` | named | Hotel booking summary card; role-aware (guest name vs hotel name) |
| `bookingHistoryUI` | — | Booking history list UI |
| `CameraQRScanner` | named | Low-level expo-camera wrapper for barcode scanning |
| `DatePickerInput` | named | Custom calendar modal date picker (no native date picker) |
| `exploreHotelDetailUI` | — | Hotel detail UI |
| `hotelListUI` | — | Hotel list UI |
| `LanguageToggle` | default | Switch toggle for EN↔BN; accepts `size` + `textColor` props |
| `QRBookingDetailsDisplay` | — | Displays booking info after a successful QR scan |
| `QRCodeDisplay` | named+default | Renders a `react-native-qrcode-svg` QR code with expiry label |
| `QRCodeScanner` | named | Combined scanner: camera mode + manual token input fallback |
| `roomTypeSelectorUI` | — | Room type selection UI |
| `SearchableLocationInput` | named | Searchable dropdown for location selection |
| `TrackingCard` | named | Booking tracking card; role-aware action buttons |
| `userInfoUI` | — | User info display |

---

### `BookingCard`
- Reads `auth.user?.role` from Redux to determine `isServiceAdmin` — shows guest name
  for admins, hotel name for users.
- Status badge color is driven by `theme.colors[status]` via `getStatusColor()`.
- Does not accept `isServiceAdmin` as a prop — it reads it internally from Redux.

### `TrackingCard`
Props: `title`, `subtitle?`, `checkInDate?`, `checkOutDate?`, `onDetailsPress`,
`onQRPress`, `onCameraPress?`, `isServiceAdmin?`

- `onQRPress` — shown to all users (QR generate button).
- `onCameraPress` — shown only when `isServiceAdmin === true` (camera scan button).
- Does NOT read Redux internally; `isServiceAdmin` is passed by the parent.

### `SearchableLocationInput`
- Filters locations client-side on every keystroke via `useMemo`.
- Shows a dropdown modal below the input field; closes on outside press.
- `useMemo` on `filteredLocations` is intentional — do not remove it.
- Location display format: `"Name (Type, State)"` via `getLocationDisplay()`.

### `DatePickerInput`
- Fully custom calendar — does NOT use `@react-native-community/datetimepicker`.
- Opens in a `Modal`. Supports `minDate` to prevent past date selection.
- Values are `string` in `YYYY-MM-DD` format — not `Date` objects.
- `minDate` defaults the calendar to that month.

### `QRCodeDisplay`
- Uses `react-native-qrcode-svg` (not `react-native-qrcode`).
- Always renders on a white background regardless of theme (QR codes require high contrast).
- `expiresAt` prop accepts an ISO date string; shows formatted time only (not date).
- Uses `success-light` / `success-light-dark` border tokens — these are `style={{}}` only.

### `QRCodeScanner`
- Composes `CameraQRScanner` for camera mode.
- Falls back to a manual text input for environments where camera is unavailable.
- Passes `onScan` callback with the decoded `qrToken` string.
- `isLoading` disables input while a scan is being processed.

### `CameraQRScanner`
- Wraps `expo-camera`'s `CameraView` component.
- Uses `useCameraPermission` hook — does NOT request permission internally.
- Debounces scans: ignores the same code scanned within 1 second (via `useRef` timestamp).
- Re-enables scanning 2 seconds after a successful scan.
- `onSwitchToManual` prop: called when user taps the manual-input fallback button.

### `LanguageToggle`
- Default export. Uses `useLanguageSwitcher()` hook internally.
- Props: `textColor` (hex string), `isDark` (bool), `size` (`'small'|'medium'|'large'`).
- Displays current language → target language with a `→` separator.
- Does not use `TRANSLATION_KEYS` for language labels — uses `getLanguageLabel()` utility.

### `AdminCard`
- No Redux access. Purely presentational.
- Props: `title`, `subtitle?`, `onPress?`.
- All strings must be passed as props — no internal display text.

---

## Elevation Pattern

All cards use inline `elevation` from `theme.elevation.*`, not NativeWind utilities:

```tsx
<View
  style={theme.elevation.sm}
  className="rounded-xl bg-surface dark:bg-surface-dark"
/>
```

Or directly: `style={{ elevation: 2 }}` for simple cases already in the codebase.
Both are acceptable — do not mix `shadow*` CSS classes with `style elevation`.

---

## Constraints

- Never hardcode hex color values in components. Always use a token.
- Every color-setting `className` must have a `dark:` counterpart.
- Do not use `@react-native-community/datetimepicker` — use `DatePickerInput`.
- `success-light` and `success-light-dark` tokens are only in `theme.ts`, not Tailwind.
- `LanguageToggle` is a **default** export — all other UI components are **named** exports.
- Do not add camera or permission logic to `QRCodeScanner` — that belongs in `CameraQRScanner` and `useCameraPermission`.
- All new UI components in this folder must support both light and dark modes.
- If a new color is needed, add it to BOTH `tailwind.config.js` and `theme.ts`.
