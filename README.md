# CholoBD Mobile 📱

A cross-platform mobile application for **CholoBD**, built using the Expo framework and React Native.
This project is a **mobile port** of the existing web application (Next.js + Express), focusing on delivering a smooth and scalable mobile user experience.

---

## 🚀 Project Overview

CholoBD Mobile aims to bring the core features of the web-based travel planner into a mobile-friendly interface.

The application will allow users to:

* Explore **tourist spots, hotels, and activities**
* Build custom travel plans
* Manage bookings and payments
* Access personalized dashboards

---

## 🛠️ Tech Stack

* **Framework:** Expo (React Native)
* **Language:** TypeScript
* **Routing:** Expo Router
* **State Management:** Redux Toolkit
* **API Layer:** Axios
* **Forms & Validation:** React Hook Form + Zod
* **Styling:** NativeWind (Tailwind CSS for React Native)
* **Storage:** AsyncStorage + SecureStore
* **Maps:** react-native-maps
* **Animations:** Reanimated + Gesture Handler

---

## 📦 Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/Blaze-18/choloBD-expo.git
cd cholobd-mobile
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npx expo start
```

### 4. Run on device

* Scan QR using **Expo Go** (Android/iOS)
* Or press:

  * `a` → Android Emulator
  * `w` → Web

---

## 📁 Project Structure

```
src/
│
├── app/                      # Expo Router (navigation structure)
│   ├── (auth)/               # Authentication flows
│   ├── (tabs)/               # Bottom tab navigation
│   ├── (info)/               # Info modules
│   │   ├── tour-spots/
│   │   ├── hotels/
│   │   └── activity-spots/
│   ├── (shop)/               # Payment & wallet
│   ├── (tour-builder)/       # Tour planning
│   ├── booking/
│   ├── dashboard/
│   ├── _layout.tsx
│   └── index.tsx
│
├── components/               # Reusable UI components
│   ├── ui/                   # UI components (buttons, cards, etc.)
│   ├── forms/                # Form components
│   ├── homepage/             # Homepage-specific components
│   ├── layout/               # Layout wrappers
│   ├── modals/               # Modal components (SideScroller, etc.)
│   │   └── SideScroller.tsx  # Navigation side drawer
│   ├── navigation/           # Navigation components
│   └── modules/              # Feature-specific modules
│
├── services/                 # API & business logic layer
│   └── api/                  # API endpoints & hooks
│       ├── axiosClient.ts    # Axios instance configuration
│       ├── hotels.ts         # Hotel API calls (useFetchHotels)
│       ├── locations.ts      # Location API calls (useFetchLocations)
│       └── hotelDetail.ts    # Hotel detail API calls (useFetchHotelDetail)
│
├── hooks/                    # Custom React hooks
│   ├── useBookingLogic.tsx
│   ├── useCameraPermission.ts
│   ├── useTheme.ts
│   ├── state/                # State-specific hooks
│   └── utils/                # Hook utilities
│
├── store/                    # Redux store & slices
│   ├── store.ts
│   └── slices/               # Redux slice definitions
│       └── authSlice.ts
│
├── types/                    # TypeScript interfaces & types
│   ├── auth.ts               # Authentication types
│   ├── hotels.ts             # Hotel, RoomType, HotelDetail interfaces
│   ├── locations.ts          # Location interface
│   └── qr.ts                 # QR code types
│
├── lib/                      # Configurations & utilities
│   └── secureStore.ts        # Secure storage utilities
│
├── utils/                    # Utility functions
├── validators/               # Zod validation schemas
│   └── auth.ts
├── constants/                # App constants
│   ├── api.ts
│   └── theme.ts
├── providers/                # Context providers
│   └── ThemeProvider.tsx
│
└── assets/                   # Static assets
    ├── fonts/
    ├── icons/
    └── images/
```

## ⚙️ Scripts

```bash
npm start          # Start Expo server
npm run android    # Run on Android
npm run ios        # Run on iOS
npm run web        # Run on Web
```
---

## 📌 Notes

* This project uses **Expo Managed Workflow**
* Native folders (`/android`, `/ios`) are not included
* Environment variables should be stored in `.env` (not committed)

## 👨‍💻 Contributors

* Shahriar Anan
* Nafis Iqbal

---
