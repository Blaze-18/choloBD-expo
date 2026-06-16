# OAuth Implementation Quick Reference

## 🎯 One-Page Overview

**Backend Status:** ✅ Fully configured for OAuth  
**Mobile Status:** ⚠️ UI placeholders only, no functionality  
**Implementation Time:** 8-13 hours  
**Complexity:** Medium

---

## 📦 What to Install

```bash
npm install expo-auth-session@~5.0.0
npm install @react-native-google-signin/google-signin@~13.0.0
npm install react-native-fbsdk-next@~17.0.0  # Optional
```

**Already installed that we'll use:**
- ✅ `expo-web-browser` (redirects)
- ✅ `expo-linking` (deep links)
- ✅ Redux + Axios (state + HTTP)

---

## 📂 Files to Create (In Order)

### 1. `src/constants/oauth.ts`
**Lines:** ~30  
**Purpose:** OAuth configuration constants

```typescript
export const OAUTH_CONFIG = {
  GOOGLE_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || '',
  FACEBOOK_APP_ID: process.env.EXPO_PUBLIC_FACEBOOK_APP_ID || '',
  REDIRECT_SCHEME: 'cholobd',
};

export const OAUTH_SCOPES = {
  GOOGLE: ['profile', 'email', 'openid'],
  FACEBOOK: ['public_profile', 'email'],
};
```

---

### 2. `src/utils/oauthUtils.ts`
**Lines:** ~50-80  
**Purpose:** OAuth helper functions

**Key Functions:**
```typescript
export function handleOAuthError(error: any): string {
  // Map technical errors to user-friendly messages
  // Examples: "Network error", "Cancelled", "Invalid token"
}

export function validateOAuthToken(token: string): boolean {
  // Ensure token is valid format
}
```

---

### 3. `src/services/api/oauth.ts`
**Lines:** ~60-100  
**Purpose:** OAuth API bridge to backend

**Key Functions:**
```typescript
export async function exchangeOAuthToken(
  provider: 'google' | 'facebook',
  token: string
): Promise<{ accessToken: string; refreshToken: string; user: AuthUser }> {
  // POST /api/auth/oauth/callback
  // Send provider + token
  // Receive JWT + user
}
```

---

### 4. `src/hooks/useGoogleSignIn.ts`
**Lines:** ~100-150  
**Purpose:** Google OAuth flow hook

**Responsibilities:**
- Uses `expo-auth-session/google`
- Handles user prompts
- Exchanges tokens via `oauth.ts` service
- Dispatches Redux action
- Returns `{ signInWithGoogle, isLoading, error }`

---

### 5. `src/hooks/useFacebookSignIn.ts`
**Lines:** ~100-150  
**Purpose:** Facebook OAuth flow hook

**Responsibilities:**
- Uses web browser flow via `expo-auth-session`
- Similar to Google pattern
- Returns `{ signInWithFacebook, isLoading, error }`

---

## 📝 Files to Modify (In Order)

### 1. `src/store/slices/authSlice.ts`
**Add this thunk:**

```typescript
export const loginWithOAuth = createAsyncThunk(
  'auth/loginWithOAuth',
  async (
    payload: { provider: 'google' | 'facebook'; token: string },
    { rejectWithValue }
  ) => {
    try {
      const data = await exchangeOAuthToken(payload.provider, payload.token);
      await saveTokens(data);
      await saveUser(data.user);
      return { tokens: data, user: data.user };
    } catch (e: any) {
      return rejectWithValue(e?.response?.data?.message || e.message);
    }
  }
);
```

**Add to extraReducers:**
```typescript
builder
  .addCase(loginWithOAuth.pending, (state) => {
    state.isLoading = true;
    state.error = null;
  })
  .addCase(loginWithOAuth.fulfilled, (state, action) => {
    state.isLoading = false;
    state.isAuthenticated = true;
    state.user = action.payload.user;
    state.tokens = action.payload.tokens;
  })
  .addCase(loginWithOAuth.rejected, (state, action) => {
    state.isLoading = false;
    state.error = action.payload as string;
  });
```

---

### 2. `src/app/(auth)/login.tsx`
**Current code (~line 95-105):**
```tsx
<View className="flex-row justify-center space-x-3">
  <TouchableOpacity className="items-center flex-1 p-3 bg-white...">
    <Text>{t(TRANSLATION_KEYS.AUTH.LOGIN.GOOGLE)}</Text>
  </TouchableOpacity>
  <TouchableOpacity className="items-center flex-1 p-3 bg-white...">
    <Text>{t(TRANSLATION_KEYS.AUTH.LOGIN.FACEBOOK)}</Text>
  </TouchableOpacity>
</View>
```

**Replace with:**
```tsx
import { useGoogleSignIn } from '../../hooks/useGoogleSignIn';
import { useFacebookSignIn } from '../../hooks/useFacebookSignIn';

// In component:
const { signInWithGoogle, isLoading: googleLoading, error: googleError } = useGoogleSignIn();
const { signInWithFacebook, isLoading: fbLoading, error: fbError } = useFacebookSignIn();

// In JSX (~line 95):
<View className="flex-row gap-3">
  <TouchableOpacity 
    onPress={signInWithGoogle}
    disabled={googleLoading || fbLoading || auth.isLoading}
    className="flex-1 flex-row items-center justify-center gap-2 
               p-4 rounded-xl bg-white border border-gray-200
               dark:bg-gray-900 dark:border-gray-700
               disabled:opacity-60"
  >
    {googleLoading ? (
      <ActivityIndicator color={theme.colors.primary} size="small" />
    ) : (
      <>
        <Ionicons name="logo-google" size={20} color="#1F2937" />
        <Text className="font-semibold text-gray-900 dark:text-white">
          {t(TRANSLATION_KEYS.AUTH.LOGIN.SIGN_IN_GOOGLE)}
        </Text>
      </>
    )}
  </TouchableOpacity>

  <TouchableOpacity 
    onPress={signInWithFacebook}
    disabled={googleLoading || fbLoading || auth.isLoading}
    className="flex-1 flex-row items-center justify-center gap-2 
               p-4 rounded-xl bg-[#1877F2]
               disabled:opacity-60"
  >
    {fbLoading ? (
      <ActivityIndicator color="white" size="small" />
    ) : (
      <>
        <Ionicons name="logo-facebook" size={20} color="white" />
        <Text className="font-semibold text-white">
          {t(TRANSLATION_KEYS.AUTH.LOGIN.SIGN_IN_FACEBOOK)}
        </Text>
      </>
    )}
  </TouchableOpacity>
</View>

{googleError && <ErrorBanner message={googleError} />}
{fbError && <ErrorBanner message={fbError} />}
```

---

### 3. `src/app/(auth)/register.tsx`
**Similar changes to login**  
**Additional:**
- Make role selection optional (skip if OAuth)
- Add OAuth buttons at bottom

---

### 4. `src/constants/translationKeys.ts`
**Add to AUTH.LOGIN section:**
```typescript
SIGN_IN_GOOGLE: 'auth.login.signInGoogle',
SIGN_UP_GOOGLE: 'auth.login.signUpGoogle',
SIGN_IN_FACEBOOK: 'auth.login.signInFacebook',
SIGN_UP_FACEBOOK: 'auth.login.signUpFacebook',
OR_CONTINUE: 'auth.login.orContinueWith',
OAUTH_ERROR: 'auth.login.oauthError',
OAUTH_CANCELLED: 'auth.login.oauthCancelled',
```

---

### 5. `src/locales/en.json`
**Add section:**
```json
{
  "auth": {
    "login": {
      "signInGoogle": "Sign in with Google",
      "signUpGoogle": "Sign up with Google",
      "signInFacebook": "Sign in with Facebook",
      "signUpFacebook": "Sign up with Facebook",
      "orContinueWith": "Or continue with",
      "oauthError": "Sign-in failed. Please try again.",
      "oauthCancelled": "Sign-in was cancelled."
    }
  }
}
```

**Bengali (`src/locales/bn.json`):**
```json
{
  "auth": {
    "login": {
      "signInGoogle": "গুগল দিয়ে সাইন ইন করুন",
      "signUpGoogle": "গুগল দিয়ে সাইন আপ করুন",
      "signInFacebook": "ফেসবুক দিয়ে সাইন ইন করুন",
      "signUpFacebook": "ফেসবুক দিয়ে সাইন আপ করুন",
      "orContinueWith": "অথবা এর সাথে চালিয়ে যান",
      "oauthError": "সাইন-ইন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।",
      "oauthCancelled": "সাইন-ইন বাতিল করা হয়েছে।"
    }
  }
}
```

---

### 6. `.env`
```
EXPO_PUBLIC_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
EXPO_PUBLIC_FACEBOOK_APP_ID=YOUR_FACEBOOK_APP_ID
EXPO_PUBLIC_API_BASE_URL=https://expressjs-cholobd-backend-668d84e20b2a.herokuapp.com
```

---

### 7. `app.json`
**Add plugin:**
```json
{
  "expo": {
    "plugins": [
      [
        "@react-native-google-signin/google-signin",
        {
          "iosClientId": "YOUR_IOS_CLIENT_ID.apps.googleusercontent.com"
        }
      ]
    ],
    "ios": {
      "bundleIdentifier": "com.cholobd.mobile"
    },
    "android": {
      "package": "com.cholobd.mobile"
    }
  }
}
```

---

### 8. `package.json`
**Add dependencies:**
```json
{
  "dependencies": {
    "expo-auth-session": "~5.0.0",
    "@react-native-google-signin/google-signin": "~13.0.0",
    "react-native-fbsdk-next": "~17.0.0"
  }
}
```

---

## 🚦 Testing Checklist

### Google Sign-In
- [ ] Tap "Sign in with Google"
- [ ] Browser opens (native or web)
- [ ] Select account
- [ ] Grant permissions
- [ ] Redirect to app with token
- [ ] Token exchanged successfully
- [ ] User logged in automatically
- [ ] Persists after app restart

### Facebook Sign-In
- [ ] Tap "Sign in with Facebook"
- [ ] Browser opens
- [ ] Select account
- [ ] Grant permissions
- [ ] Redirect to app with token
- [ ] Token exchanged successfully
- [ ] User logged in

### Error Scenarios
- [ ] Cancel OAuth prompt → "Sign-in cancelled"
- [ ] Network timeout → "Network error, retry"
- [ ] Invalid token → "Sign-in failed"
- [ ] User not found → "Account error"

### UI/UX
- [ ] Loading spinner shows during flow
- [ ] Buttons disabled while loading
- [ ] Error displayed prominently
- [ ] Dark mode looks good
- [ ] Responsive on mobile (< 375px)

---

## 🔗 Backend Integration Points

### Your Backend Already Has
```
GET  /api/auth/google
GET  /api/auth/google/callback
GET  /api/auth/facebook
GET  /api/auth/facebook/callback
POST /api/auth/oauth/callback?provider=google|facebook
```

### Flow
```
Mobile → POST /api/auth/oauth/callback
         {
           provider: 'google' | 'facebook',
           token: 'ID_TOKEN_FROM_PROVIDER'
         }

Backend Response
         {
           data: {
             accessToken: 'JWT',
             refreshToken: 'JWT',
             user: { id, email, userName, role, ... }
           }
         }
```

---

## 🎯 Implementation Order

1. **Create base files** (constants, utils, services)
2. **Create hooks** (Google, Facebook)
3. **Update Redux** (thunk + reducers)
4. **Update UI** (login, register)
5. **Add translations**
6. **Update env + config**
7. **Test end-to-end**

---

## ⚡ Common Pitfalls to Avoid

❌ **Don't:** Store tokens in AsyncStorage  
✅ **Do:** Use `expo-secure-store` via `secureStore.ts`

❌ **Don't:** Hardcode OAuth IDs in code  
✅ **Do:** Use `.env` variables + `app.json`

❌ **Don't:** Block UI during OAuth flow  
✅ **Do:** Show loading spinner + disable buttons

❌ **Don't:** Forget error handling  
✅ **Do:** Handle cancellation, network errors, invalid tokens

❌ **Don't:** Skip dark mode support  
✅ **Do:** Test with `useTheme()` + `isDark`

❌ **Don't:** Duplicate logic between Google/Facebook  
✅ **Do:** Extract common patterns to `oauthUtils.ts`

---

## 🔑 Key Files Reference

| File | Size | Purpose |
|------|------|---------|
| `src/constants/oauth.ts` | ~30 lines | Config |
| `src/utils/oauthUtils.ts` | ~50 lines | Helpers |
| `src/services/api/oauth.ts` | ~80 lines | API bridge |
| `src/hooks/useGoogleSignIn.ts` | ~120 lines | Google flow |
| `src/hooks/useFacebookSignIn.ts` | ~120 lines | Facebook flow |
| `src/store/slices/authSlice.ts` | +50 lines | Redux thunk |
| `src/app/(auth)/login.tsx` | +40 lines | UI update |
| `src/app/(auth)/register.tsx` | +40 lines | UI update |

**Total New/Modified Code:** ~550-600 lines

---

## 📞 Quick Help

**Q: Where do I get Google Client ID?**  
A: Google Cloud Console → Create OAuth app → Web + Android + iOS

**Q: Where do I get Facebook App ID?**  
A: Facebook Developers → Create app → Settings

**Q: Should I use native or web OAuth?**  
A: Use native when available (better UX), web as fallback

**Q: Can I skip Facebook SDK?**  
A: Yes, `expo-auth-session` handles web-only flow

**Q: How long does the OAuth flow take?**  
A: 1-3 seconds (depends on network + user actions)

**Q: Will my backend work as-is?**  
A: Yes, backend is ready. Mobile just needs to call the endpoints.

---

## 📚 Reference Links

- **Expo Auth Session:** https://docs.expo.dev/build/authentication/
- **Google Sign-In:** https://github.com/react-native-google-signin/google-signin
- **Facebook SDK:** https://github.com/thespacemanatee/react-native-fbsdk-next
- **Secure Store:** https://docs.expo.dev/build/secured-code/

---

## ✅ Final Checklist Before Deployment

- [ ] All dependencies installed
- [ ] OAuth credentials in `.env`
- [ ] `app.json` updated with plugins
- [ ] All translation keys added
- [ ] Both EN and BN translations complete
- [ ] Redux thunk working
- [ ] Hooks fully implemented
- [ ] UI components updated
- [ ] Error handling in place
- [ ] Dark mode tested
- [ ] Tested on iOS device
- [ ] Tested on Android device
- [ ] Deep link working
- [ ] Tokens persisted correctly
- [ ] Code follows project conventions
- [ ] No console errors/warnings
- [ ] Documentation updated

---

**Estimated Total Time:** 8-13 hours  
**Estimated Deployment Date:** Within 1-2 days

