---
applyTo: "src/app/(auth)/**,src/store/slices/authSlice.ts,src/hooks/useAuthWithAdminCheck.tsx,src/hooks/state/useAuthInitializer.ts,src/lib/secureStore.ts,src/validators/auth.ts,src/types/auth.ts"
---

# Auth Module Instructions

This document covers all authentication and authorization logic in CholoBD Mobile.
Follow these patterns exactly when modifying or extending the auth system.

---

## Module Responsibilities

- User login and registration via JWT
- Token persistence in `expo-secure-store`
- Auth state initialization on app startup
- Token refresh on 401 responses (handled automatically by Axios)
- Role-based access control for UI rendering
- Logout (local token clearing + server-side session invalidation)

---

## Route Structure

```
src/app/(auth)/
├── login.tsx     — Email/password login form
└── register.tsx  — Registration form with role selection
```

There is no `_layout.tsx` in `(auth)/` — the root `_layout.tsx` handles this group.
Both routes use default exports (Expo Router requirement).

---

## Auth State Shape

Defined in `src/types/auth.ts`. Do not extend without updating the slice accordingly.

```ts
type UserRole = 'user' | 'admin' | 'masterAdmin' | 'SERVICE_ADMIN';

type AuthUser = {
  id: string;
  email: string;
  userName: string;
  role: UserRole;
  imageUrl?: string;
  userStatus?: string;
};

type AuthState = {
  user: AuthUser | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitializing: boolean;  // true until SecureStore read completes on startup
  error: string | null;
};
```

- `isInitializing: true` until `initializeAuth` thunk completes. Always check this
  before redirecting — never redirect while initializing.
- `error` must be cleared on component unmount via `dispatch(clearError())`.

---

## Async Thunks

All auth operations are `createAsyncThunk` actions in `authSlice.ts`:

| Thunk | Endpoint | Description |
|---|---|---|
| `initializeAuth` | (none — reads SecureStore) | Restores tokens and user on app start |
| `loginUser` | `POST /api/auth/login-jwt` | Email/password login |
| `registerUser` | `POST /api/auth/register-jwt` | New account creation |
| `logoutUser` | `POST /api/auth/logout-jwt` | Clears tokens locally and on server |
| `loginWithOAuth` | (none — token passed in) | OAuth callback token ingestion |

- `registerUser` uses a direct `axios` call (not the intercepted instance) to avoid
  triggering the auth interceptor on a public endpoint. Do not change this.
- `logoutUser` clears tokens locally even if the server call fails.

---

## Token Storage

All token I/O goes through `src/lib/secureStore.ts`. Never read or write auth tokens anywhere else.

Stored keys:
- `accessToken`
- `refreshToken`
- `userId`
- `userRole`
- `userData` (serialized full `AuthUser` object)

Functions:
- `saveTokens(tokens)` / `getTokens()` / `clearTokens()`
- `saveUserIdAndRole(userId, role)` / `clearUserIdAndRole()`
- `saveUser(user)` / `getUser()` / `clearUser()`

Do not use `AsyncStorage` for any auth data.

---

## Validation Schemas

Defined in `src/validators/auth.ts`. Never define login or register validation inline.

```ts
// Login
export const loginSchema = z.object({
  email: z.string().min(1).email(),
  password: z.string().min(6),
});
export type LoginForm = z.infer<typeof loginSchema>;

// Register
export const registerSchema = z.object({
  userName: z.string().min(1),
  email: z.string().min(1).email(),
  password: z.string().min(6),
  confirm: z.string().min(6),
  role: z.enum(['MASTER_ADMIN', 'SERVICE_ADMIN', 'EMPLOYEE', 'USER']),
}).refine((d) => d.password === d.confirm, { path: ['confirm'] });
export type RegisterForm = z.infer<typeof registerSchema>;
```

---

## Route File Pattern

Both `login.tsx` and `register.tsx` follow this exact pattern:

```tsx
export default function Login() {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((s: RootState) => s.auth);
  const { isDark } = useTheme();
  const { t } = useTranslation();

  // 1. Hook up react-hook-form with zodResolver
  const { register, setValue, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  // 2. Register fields manually (RN has no native onChange)
  useEffect(() => { register('email'); register('password'); }, [register]);

  // 3. Dispatch thunk on submit
  const onSubmit = (values: LoginForm) => void dispatch(loginUser(values));

  // 4. Redirect on successful auth
  useEffect(() => {
    if (auth.isAuthenticated) router.replace('/(tabs)/dashboard');
  }, [auth.isAuthenticated, auth.isLoading, auth.error]);

  // 5. Clear error on unmount
  useEffect(() => () => { void dispatch(clearError()); }, []);
}
```

- Auth routes redirect to `/(tabs)/dashboard` on `isAuthenticated === true`.
- Always use `router.replace` (not `push`) for auth redirects to prevent back-navigation to login.
- Field values are set via `setValue` with `onChangeText` — not with `Controller` from react-hook-form.

---

## App Startup Auth Flow

`useAuthInitializer(baseURL)` runs inside `AppContentLayout` in `_layout.tsx`:

1. Calls `configureApi(baseURL)` — creates the Axios singleton with the correct base URL.
2. Registers the logout callback on the Axios interceptor via `setLogoutCallback`.
3. Dispatches `initializeAuth` — reads tokens and user from SecureStore into Redux.

This hook must only be called once, at the root layout level. Do not call it inside screens.

---

## Role-Based Access

Use `useAuthWithAdminCheck()` from `src/hooks/useAuthWithAdminCheck.tsx`.

```ts
const { user, isAdmin, isMasterAdmin, userRole, isAuthenticated } = useAuthWithAdminCheck();
```

| Field | Meaning |
|---|---|
| `isAdmin` | `true` for roles: `admin`, `masterAdmin`, `SERVICE_ADMIN` |
| `isMasterAdmin` | `true` only for `masterAdmin` |
| `userRole` | Raw `UserRole` string or `null` |

Use `useCanPerformAdminActions()` when only needing a boolean guard:

```tsx
const canAct = useCanPerformAdminActions();
if (!canAct) return null;
```

Never gate privileged UI based on local component state — always derive from this hook.

---

## Redirect Logic (Root Layout)

The root `AppContentLayout` in `_layout.tsx` has a persistent auth watcher:

```ts
useEffect(() => {
  if (auth.isInitializing) return;  // wait for SecureStore read
  if (!auth.isAuthenticated && !auth.tokens && splashDone) {
    router.replace('/(auth)/login');
  }
}, [auth.isAuthenticated, auth.tokens, auth.isInitializing, splashDone]);
```

Do not add additional redirect watchers in individual screens. Centralize auth redirects here.

---

## Error Handling

- `authSlice` sets `state.error` on `rejected` thunks.
- Display `auth.error` inline in the form (e.g. below the submit button), not via `Alert.alert`.
- Always dispatch `clearError()` on screen unmount to prevent stale errors showing on re-mount.
- The slice clears `error` to `null` on every `pending` dispatch.

---

## Constraints

- Do not store tokens in `AsyncStorage`, local state, or Context — only in SecureStore via `src/lib/secureStore.ts`.
- Do not replicate the Axios 401 refresh logic anywhere else — it is handled once in `axiosClient.ts`.
- Do not add a new auth endpoint call without a corresponding thunk in `authSlice.ts`.
- Do not read `auth.user.role` directly to gate UI — use `useAuthWithAdminCheck()`.
