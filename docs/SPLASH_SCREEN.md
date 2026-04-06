# Splash Screen Implementation Guide

## Overview
The splash screen is implemented with a clean, theme-aware approach using Expo's native splash + a custom React component for smooth branding.

## File Structure
```
src/
├── components/splash/
│   ├── SplashScreen.tsx       # Custom splash component with rounded image
│   └── index.ts               # Exports
├── hooks/
│   └── usePreloadAssets.ts    # Hook to preload assets & fonts
└── app/_layout.tsx            # App root - orchestrates splash flow

assets/splash/
└── splash.png                 # Square image (will be rounded)

app.json                        # Native splash config
```

## How It Works
1. **App starts** → Expo shows native splash (quick, from app.json)
2. **React loads** → `RootLayout` initializes with Redux & ThemeProvider
3. **Assets preload** → `usePreloadAssets()` loads fonts and data
4. **Custom splash** → `SplashScreen` component fades in (2.5s display)
5. **Smooth fade** → Custom splash fades out over 400ms
6. **Native hide** → `SplashScreen.hideAsync()` removes native splash
7. **Main app** → Safe area + theme provider + stack navigator

## Features
✅ Theme-aware background (respects light/dark mode)
✅ Rounded image corners (borderRadius: 40)
✅ Smooth fade transition
✅ Preloads fonts and critical assets
✅ Clean code structure (hook + component + config)
✅ Responsive and accessible

## Customization

### Change Display Duration
Edit `src/app/_layout.tsx`:
```tsx
<CustomSplash delay={2500} /> // 2.5 seconds
```

### Change Image Rounding
Edit `src/components/splash/SplashScreen.tsx`:
```tsx
borderRadius: 40, // Increase/decrease this value
```

### Add More Preload Tasks
Edit `src/hooks/usePreloadAssets.ts`:
```tsx
// Add fonts:
const [fontsLoaded] = useFonts({
  'CustomFont': require('../../assets/fonts/CustomFont.ttf'),
});

// Or fetch initial data, etc.
```

## Packages Required

Already installed:
- ✅ `expo-splash-screen` — Native splash control
- ✅ `expo-font` — Font preloading

No additional packages needed! Everything is built-in.

## Testing
1. Run the app: `npx expo start`
2. Note the splash appears for ~2.5 seconds with rounded logo
3. Toggle dark mode on device — splash background adapts
4. Hot reload doesn't show splash (native feature only on cold start)

## Performance Notes
- Native splash shows instantly (0ms perceived delay)
- Custom splash shows only during React init (~1-2s)
- `usePreloadAssets` prevents flash of unstyled content
- Font preloading is optional but recommended

## Accessibility
- The rounded logo uses `resizeMode="contain"` for visibility across devices
- Small app icon at bottom uses 60% opacity for visual hierarchy
- All components respect theme for contrast (WCAG AA)

---

For updates, modify `SplashScreen.tsx` or `usePreloadAssets.ts` as needed.
