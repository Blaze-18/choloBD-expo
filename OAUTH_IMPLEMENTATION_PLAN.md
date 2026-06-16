# CholoBD Mobile: Google & Facebook OAuth Implementation Plan

## 📋 Executive Summary

The backend is **fully configured** for OAuth sign-in with Google and Facebook. The mobile app has **placeholder UI elements** but no functionality. This plan details how to connect the two with a minimal, maintainable implementation following the project's architecture.

---

## 🎯 Scope

### ✅ In Scope
1. **Google Sign-In** — native + web fallback
2. **Facebook Sign-In** — web browser flow
3. **UI Review & Improvements** — better button styling, loading states, error handling
4. **Deep Link Handling** — OAuth callback routing to the app
5. **Token Flow** — Backend sends tokens → App stores securely → Auto-redirect to dashboard
6. **Error Handling** — User-friendly messages for all failure scenarios

### ❌ Out of Scope
- Email link sign-in
- Phone number authentication
- Biometric sign-in
- Social account linking (future enhancement)

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    CholoBD Mobile App                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            Login/Register Screens                    │  │
│  │  • Email/Password forms (existing)                   │  │
│  │  • Google Sign-In button                             │  │
│  │  • Facebook Sign-In button                           │  │
│  └──────────────────────────────────────────────────────┘  │
│                      ↓                                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │      OAuth Hooks (useGoogleSignIn, etc.)            │  │
│  │  • Manage OAuth flow (open browser, handle redirect) │  │
│  │  • Call OAuth API services                           │  │
│  │  • Dispatch Redux actions                            │  │
│  └──────────────────────────────────────────────────────┘  │
│                      ↓                                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │       OAuth API Services (oauth.ts)                  │  │
│  │  • POST /api/auth/oauth/callback                     │  │
│  │  • Verify OAuth tokens                               │  │
│  └──────────────────────────────────────────────────────┘  │
│                      ↓                                       │
└─────────────────────────────────────────────────────────────┘
                        ↓
           ┌────────────────────────────┐
           │   Backend OAuth Routes     │
           ├────────────────────────────┤
           │ GET /api/auth/google       │
           │ GET /api/auth/google/cb    │
           │ GET /api/auth/facebook     │
           │ GET /api/auth/facebook/cb  │
           │ POST /api/auth/oauth/cb    │
           └────────────────────────────┘
```

---

## 📦 Dependencies to Install

```bash
npm install expo-auth-session@~5.0.0
npm install @react-native-google-signin/google-signin@~13.0.0
npm install react-native-fbsdk-next@~17.0.0  # Optional: web fallback works without it
```

**Note:** These are already in the Expo 55 compatible range. Install and test.

---

## 📁 Files to Create

### 1. `src/services/api/oauth.ts`
**Purpose:** OAuth API integration with backend

```typescript
// Service functions:
- exchangeOAuthToken(provider: 'google' | 'facebook', token: string): Promise<{ accessToken, refreshToken, user }>
- validateOAuthCallback(code: string, state: string): Promise<AuthTokens>
```

**Details:**
- Receives OAuth tokens from Expo Auth Session
- Sends token to backend: `POST /api/auth/oauth/callback?provider=google`
- Backend validates and returns JWT tokens + user
- Handles errors (expired tokens, user creation failures, etc.)

---

### 2. `src/hooks/useGoogleSignIn.ts`
**Purpose:** Encapsulates Google OAuth flow

```typescript
// Returns:
- signInWithGoogle(): Promise<void>
- isLoading: boolean
- error: string | null

// Flow:
1. Prompt user to select Google account
2. Get ID token from Google
3. Pass to oauth.ts service
4. Dispatch loginWithOAuth thunk
5. Handle errors with user-friendly messages
```

**Key Points:**
- Uses `expo-auth-session/google`
- Fallback to web browser if native not available
- Error handling for network/user cancellation
- No UI in hook (pure logic)

---

### 3. `src/hooks/useFacebookSignIn.ts`
**Purpose:** Encapsulates Facebook OAuth flow

```typescript
// Same pattern as Google
// Uses web browser flow (no native FB SDK required)
// Returns access token to backend
```

---

### 4. `src/utils/oauthUtils.ts`
**Purpose:** Helper functions for OAuth

```typescript
- generateOAuthState(): string
- validateOAuthResponse(response: any): boolean
- handleOAuthError(error: any): string (user-friendly message)
```

---

### 5. `src/constants/oauth.ts`
**Purpose:** OAuth configuration

```typescript
export const OAUTH_CLIENT_IDS = {
  GOOGLE: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || '',
  FACEBOOK: process.env.EXPO_PUBLIC_FACEBOOK_APP_ID || '',
};

export const OAUTH_REDIRECT_SCHEMES = {
  GOOGLE: 'com.googleusercontent.apps.cholobd',
  FACEBOOK: 'fb123456789',
};

export const OAUTH_SCOPES = {
  GOOGLE: ['profile', 'email', 'openid'],
  FACEBOOK: ['public_profile', 'email'],
};
```

---

## 🔧 Files to Modify

### 1. **`src/store/slices/authSlice.ts`**

**Add new thunk:**
```typescript
export const loginWithOAuth = createAsyncThunk(
  'auth/loginWithOAuth',
  async (
    payload: { provider: 'google' | 'facebook'; token: string },
    { rejectWithValue }
  ) => {
    // Call oauth.ts service
    // Save tokens & user
    // Return { tokens, user }
  }
);

// Add to extraReducers to handle pending/fulfilled/rejected
```

---

### 2. **`src/app/(auth)/login.tsx`**

**Current:**
```tsx
<TouchableOpacity className="items-center flex-1 p-3 bg-white...">
  <Text>{t(TRANSLATION_KEYS.AUTH.LOGIN.GOOGLE)}</Text>
</TouchableOpacity>
```

**New:**
```tsx
const { signInWithGoogle, isLoading: googleLoading, error: googleError } = useGoogleSignIn();

<TouchableOpacity 
  onPress={signInWithGoogle} 
  disabled={googleLoading || auth.isLoading}
  className="items-center flex-1 p-3 bg-white..."
>
  {googleLoading ? (
    <ActivityIndicator color={theme.colors.primary} />
  ) : (
    <>
      <Ionicons name="logo-google" size={20} />
      <Text>{t(TRANSLATION_KEYS.AUTH.LOGIN.SIGN_IN_GOOGLE)}</Text>
    </>
  )}
</TouchableOpacity>

// Similar for Facebook
// Show googleError if present
```

---

### 3. **`src/app/(auth)/register.tsx`**

**Add:**
- "Or sign up with Google/Facebook" section
- Same OAuth buttons as login
- Don't require role selection for OAuth users (backend decides)

**Note:** Registration flow differs:
- OAuth sign-up → no role picker → user role defaults to 'USER'
- Backend can auto-set role based on email domain or later

---

### 4. **`src/constants/translationKeys.ts`**

**Add OAuth-related keys:**
```typescript
AUTH: {
  LOGIN: {
    GOOGLE: 'auth.login.google',  // Keep existing
    FACEBOOK: 'auth.login.facebook',  // Keep existing
    SIGN_IN_GOOGLE: 'auth.login.signInGoogle',  // NEW
    SIGN_UP_GOOGLE: 'auth.login.signUpGoogle',  // NEW
    SIGN_IN_FACEBOOK: 'auth.login.signInFacebook',  // NEW
    OR_CONTINUE_WITH: 'auth.login.orContinueWith',  // NEW
    OAUTH_ERROR: 'auth.login.oauthError',  // NEW
    OAUTH_CANCELLED: 'auth.login.oauthCancelled',  // NEW
  },
  REGISTER: {
    SIGN_UP_WITH_GOOGLE: 'auth.register.signUpWithGoogle',
    SIGN_UP_WITH_FACEBOOK: 'auth.register.signUpWithFacebook',
    // ... others
  },
}
```

---

### 5. **`src/locales/en.json` & `src/locales/bn.json`**

**Add translations:**
```json
{
  "auth": {
    "login": {
      "google": "Google",
      "facebook": "Facebook",
      "signInGoogle": "Sign in with Google",
      "signUpGoogle": "Sign up with Google",
      "signInFacebook": "Sign in with Facebook",
      "orContinueWith": "Or continue with",
      "oauthError": "An error occurred during sign-in. Please try again.",
      "oauthCancelled": "Sign-in was cancelled."
    }
  }
}
```

**Bengali translations** (if needed, use translator):
```json
{
  "auth": {
    "login": {
      "google": "গুগল",
      "facebook": "ফেসবুক",
      "signInGoogle": "গুগল দিয়ে সাইন ইন করুন",
      ...
    }
  }
}
```

---

### 6. **`package.json`**

```json
{
  "dependencies": {
    "expo-auth-session": "~5.0.0",
    "@react-native-google-signin/google-signin": "~13.0.0"
  }
}
```

---

### 7. **`.env`**

```
EXPO_PUBLIC_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID_HERE
EXPO_PUBLIC_FACEBOOK_APP_ID=YOUR_FACEBOOK_APP_ID_HERE
EXPO_PUBLIC_API_BASE_URL=https://expressjs-cholobd-backend-668d84e20b2a.herokuapp.com
```

---

### 8. **`app.json`**

```json
{
  "expo": {
    "scheme": "cholobd",
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

## 🎨 UI Review & Improvements

### Current Issues ❌
1. **Placeholder Buttons** — No icons, generic text
2. **No Loading States** — User doesn't know action is in progress
3. **Poor Contrast** — White buttons on light background
4. **No Error Display** — Failures silently ignored
5. **Mobile Optimization** — Buttons too small on small screens

### Proposed Improvements ✅

#### Login Screen Redesign
```
┌──────────────────────────────────────────┐
│  [CholoBD Logo]                          │
│                                          │
│  Welcome Back!                           │
│  Sign in to your account                 │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │ Email address                  ✓   │  │
│  └────────────────────────────────────┘  │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │ Password                       ✓   │  │
│  └────────────────────────────────────┘  │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │   SIGN IN                          │  │
│  └────────────────────────────────────┘  │
│                                          │
│  ─────────────  or continue with ────────  │
│                                          │
│  ┌──────────┐      ┌──────────┐         │
│  │  🔵 G    │      │  🔵 F    │         │
│  │ GOOGLE   │      │ FACEBOOK │         │
│  └──────────┘      └──────────┘         │
│                                          │
│  Don't have an account?  [Sign Up →]    │
│                                          │
└──────────────────────────────────────────┘
```

#### Button Styling Improvements
```typescript
// Google Button
<TouchableOpacity 
  className="flex-row items-center justify-center gap-2 p-3 rounded-lg 
             bg-[#1F2937] dark:bg-[#111827] active:opacity-80"
>
  <Ionicons name="logo-google" size={20} color="#FFFFFF" />
  <Text className="font-semibold text-white">
    {t(TRANSLATION_KEYS.AUTH.LOGIN.SIGN_IN_GOOGLE)}
  </Text>
</TouchableOpacity>

// Facebook Button
<TouchableOpacity 
  className="flex-row items-center justify-center gap-2 p-3 rounded-lg 
             bg-[#1877F2] active:opacity-80"
>
  <Ionicons name="logo-facebook" size={20} color="#FFFFFF" />
  <Text className="font-semibold text-white">
    {t(TRANSLATION_KEYS.AUTH.LOGIN.SIGN_IN_FACEBOOK)}
  </Text>
</TouchableOpacity>
```

#### Error Display
```typescript
{googleError && (
  <View className="p-3 rounded-lg bg-danger/10 border border-danger">
    <Text className="text-sm text-danger">{googleError}</Text>
  </View>
)}
```

#### Loading State
```typescript
{googleLoading && (
  <View className="absolute inset-0 rounded-lg bg-black/20 flex items-center justify-center">
    <ActivityIndicator color={theme.colors.primary} size="large" />
  </View>
)}
```

---

## 🔄 OAuth Flow Sequence Diagram

```
User                Mobile App              Backend
  │                    │                       │
  ├─ Tap "Sign in...─->│                       │
  │                    │─ Open browser ──────>│
  │                    │  (OAuth consent)      │
  │                    │                       │
  │                    │<─ Callback + code ────│
  │                    │                       │
  │                    ├─ Exchange code ──────>│
  │                    │  for access token     │
  │                    │  (via /oauth/callback)│
  │                    │                       │
  │                    │<─ Return JWT + user ──│
  │                    │                       │
  │<─ Redirect to ──────│                       │
  │  Dashboard          │                       │
```

---

## 🔐 Security Considerations

### ✅ What's Secure
- **Token Storage:** `expo-secure-store` (encrypted hardware-backed storage)
- **HTTPS Only:** Backend uses HTTPS, no plaintext tokens in URLs
- **JWT Validation:** Backend validates all tokens server-side
- **PKCE Flow:** `expo-auth-session` uses PKCE for web flow
- **State Parameter:** Prevents CSRF attacks

### ⚠️ What to Monitor
- Ensure Google Client ID from `.env` matches OAuth app
- Ensure Facebook App ID matches
- Test deep link callback on both iOS and Android
- Validate that tokens expire correctly (backend controls)

---

## 🚀 Implementation Roadmap

### Phase 1: Foundation (Estimated: 2-3 hours)
- [ ] Install dependencies
- [ ] Create `oauth.ts` service
- [ ] Create `useGoogleSignIn` hook
- [ ] Add translation keys
- [ ] Update `.env` and `app.json`

### Phase 2: Integration (Estimated: 2-3 hours)
- [ ] Create Redux thunk `loginWithOAuth`
- [ ] Connect OAuth buttons in login screen
- [ ] Add loading/error states
- [ ] Test with backend

### Phase 3: UI Polish (Estimated: 1-2 hours)
- [ ] Improve button styling
- [ ] Add icons (Ionicons)
- [ ] Implement error modals
- [ ] Dark mode support

### Phase 4: Testing & Fixes (Estimated: 2-3 hours)
- [ ] Test Google sign-in on iOS
- [ ] Test Google sign-in on Android
- [ ] Test Facebook sign-in
- [ ] Deep link callback testing
- [ ] Error scenario testing

### Phase 5: Registration & Polish (Estimated: 1-2 hours)
- [ ] Add OAuth to registration screen
- [ ] Simplify registration flow for OAuth
- [ ] Final UI review
- [ ] Documentation

**Total Estimated Time:** 8-13 hours

---

## 📝 Testing Checklist

### Google Sign-In
- [ ] Android: Native prompt works
- [ ] iOS: Native prompt works
- [ ] Web fallback works (if native unavailable)
- [ ] Token exchange successful
- [ ] User created in database (first-time)
- [ ] Existing user can re-sign
- [ ] Error: Invalid token → user-friendly message
- [ ] Error: Network timeout → retry UI

### Facebook Sign-In
- [ ] Web browser opens correctly
- [ ] Callback returns to app
- [ ] Token exchange successful
- [ ] Deep link handling works
- [ ] User created in database
- [ ] Error scenarios handled

### General
- [ ] Dark mode buttons look good
- [ ] Loading spinner centered
- [ ] Error messages clear and actionable
- [ ] No crashes on back/cancel
- [ ] Tokens persist across app restart
- [ ] Role selection not required for OAuth

---

## 📚 Reference Documentation

- **Expo Auth Session:** https://docs.expo.dev/build/authentication/
- **Google Sign-In:** https://github.com/react-native-google-signin/google-signin
- **Secure Store:** https://docs.expo.dev/build/secured-code/
- **OAuth 2.0 PKCE:** https://tools.ietf.org/html/rfc7636

---

## ⚡ Quick Start Commands

```bash
# Install dependencies
npm install expo-auth-session@~5.0.0 @react-native-google-signin/google-signin@~13.0.0

# Update app.json with OAuth plugins
# Update .env with Google Client ID and Facebook App ID

# Build for testing
npm run android  # or ios

# Test OAuth flow end-to-end
```

---

## 📞 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "Invalid OAuth token" | Verify Google/Facebook app credentials match |
| Deep link not working | Check `app.json` scheme and URL structure |
| User created but role incorrect | Backend defaults to 'USER', can be updated later |
| White screen after OAuth | Check network; ensure backend is responding |
| Android manifest error | Run `npm run android` with latest Expo |
| iOS pod issues | `cd ios && pod repo update && pod install && cd ..` |

---

## 🎬 Next Steps

1. **Review this plan** with the team
2. **Install dependencies** in Phase 1
3. **Create OAuth files** per the structure
4. **Test with backend** OAuth endpoints
5. **Polish UI** based on design feedback
6. **Deploy** to beta testers

---

Generated: 2026-06-16
