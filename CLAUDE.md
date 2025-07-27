# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Start Development Server
```bash
npm start          # Start Expo development server
npm run android    # Start on Android emulator
npm run ios        # Start on iOS simulator
npm run web        # Start web development server
```

### Code Quality
```bash
npm run lint       # Run ESLint with Expo configuration
```

## Project Architecture

This is a React Native habit tracker app built with Expo Router v5 and file-based routing.

### Routing Structure
- **Root**: `app/_layout.tsx` - Stack navigator with gesture handling and safe area
- **Welcome Flow**: `app/welcome.tsx` - Onboarding screen with animated carousel
- **Main App**: `app/(tabs)/` - Bottom tab navigation with 5 screens:
  - `index.tsx` - Home dashboard with habit tracking
  - `habits.tsx` - Habit management
  - `progress.tsx` - Progress analytics
  - `coach.tsx` - AI coaching features
  - `profile.tsx` - User profile

### Key Components

#### Welcome Screen (`app/welcome.tsx`)
- Animated habit carousel with color extraction
- Uses Reanimated v3 for smooth animations
- Color-based theming system with `ColorProvider`

#### Color System (`components/welcome/color-provider.tsx`)
- Context-based color management
- Dynamic color extraction from images
- Fallback to predefined color schemes
- Uses `utils/color-extractor.ts` for color analysis

#### Custom Hooks
- `hooks/use-debounce.ts` - Debounced state updates
- `hooks/use-debounced-callback.ts` - Debounced function calls
- `hooks/use-image-colors.ts` - Image color extraction

### Technology Stack
- **Framework**: Expo SDK 53 with React Native 0.79
- **Navigation**: Expo Router v5 with typed routes
- **Animations**: React Native Reanimated v3
- **Gestures**: React Native Gesture Handler
- **Icons**: Expo Vector Icons (Ionicons)
- **Styling**: StyleSheet with TypeScript

### Development Notes
- Uses file-based routing with typed routes enabled
- All screens use SafeAreaProvider for proper insets
- Color theming is dynamic based on habit images
- Welcome screen redirects to main app via `router.replace("/(tabs)")`
- Tab navigation uses green accent color (`#34d399`)

### File Organization
```
app/
├── _layout.tsx           # Root stack navigator
├── index.tsx            # Redirects to welcome
├── welcome.tsx          # Onboarding screen
└── (tabs)/              # Tab group
    ├── _layout.tsx      # Tab navigator configuration
    └── [screen].tsx     # Individual tab screens

components/welcome/      # Welcome screen components
hooks/                   # Custom React hooks  
utils/                   # Utility functions
assets/images/habits/    # Habit category images
```

### TypeScript Configuration
- Strict mode enabled
- Path alias `@/*` maps to project root
- Expo TypeScript base configuration