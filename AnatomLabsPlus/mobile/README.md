# AnatomLabs+ Mobile App

React Native mobile application for the Human Performance Science Platform.

## Features

- **Authentication**: Login with demo account or register
- **3D Body Explorer**: Interactive anatomy visualization with muscle details
- **Nutrition Tracking**: BMR, TDEE, and macro calculations based on Mifflin-St Jeor equation
- **Workout Generation**: Science-based workout plans using BuiltWithScience principles
- **Reports & Analytics**: Daily reports and injury prevention monitoring

## Prerequisites

- Node.js 18+
- Expo Go app on your phone (iOS/Android)
- Backend server running on port 3001

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure API URL

**IMPORTANT**: Update the API URL to match your backend server.

Open `src/services/api.ts` and update line 19:

```typescript
const API_BASE_URL = 'http://YOUR_IP_ADDRESS:3001/api';
```

To find your IP address:
- **Mac/Linux**: Run `ifconfig | grep "inet " | grep -v 127.0.0.1`
- **Windows**: Run `ipconfig` and look for IPv4 Address

**Platform-specific URLs:**
- Physical device: `http://YOUR_COMPUTER_IP:3001/api`
- iOS Simulator: `http://localhost:3001/api`
- Android Emulator: `http://10.0.2.2:3001/api`

### 3. Start the Backend

In a separate terminal, start the backend server:

```bash
cd ../backend
npm run dev
```

Wait for: `✓ Server running on http://localhost:3001`

### 4. Start the Mobile App

```bash
npm start
```

### 5. Open on Your Device

1. Open **Expo Go** app on your phone
2. Scan the QR code from the terminal
3. Wait for the app to load (~30 seconds first time)

### 6. Login

**Demo Account:**
- Email: `demo@anatomlabs.com`
- Password: `password123`

Or tap "Use Demo Account" to auto-fill.

## Project Structure

```
mobile/
├── src/
│   ├── components/
│   │   └── BodyViewer3D.tsx       # 3D anatomy viewer
│   ├── context/
│   │   └── AuthContext.tsx        # Authentication state
│   ├── navigation/
│   │   └── AppNavigator.tsx       # Navigation setup
│   ├── screens/
│   │   ├── auth/
│   │   │   └── LoginScreen.tsx    # Login screen
│   │   └── tabs/
│   │       ├── HomeScreen.tsx     # Dashboard
│   │       ├── BodyExplorerScreen.tsx  # 3D + List view
│   │       ├── NutritionScreen.tsx     # BMR/TDEE/Macros
│   │       ├── WorkoutsScreen.tsx      # Workout generation
│   │       └── ReportsScreen.tsx       # Reports & injury risk
│   ├── services/
│   │   └── api.ts                 # API service
│   └── types/
│       └── index.ts               # TypeScript types
├── App.tsx                        # Root component
└── package.json
```

## Tech Stack

- **React Native** with Expo
- **TypeScript**
- **React Navigation** (Stack + Bottom Tabs)
- **React Three Fiber** for 3D visualization
- **Axios** for API calls
- **AsyncStorage** for token persistence

## Screens Overview

### Home Screen
- User stats (BMR, TDEE)
- Profile information
- Quick action buttons

### Body Explorer
- Toggle between 3D and List views
- Interactive muscle selection
- Detailed muscle information
- Best exercises for each muscle

### Nutrition
- BMR and TDEE calculations
- Daily macro targets
- Scientific formulas (transparent)
- Based on Mifflin-St Jeor equation

### Workouts
- Generate custom workout plans
- Goal-based programming
- Experience level adaptation
- View detailed workout schedules

### Reports
- Daily nutrition summary
- Activity tracking
- Training overview
- Injury risk assessment

## Troubleshooting

### "Network request failed"
- Ensure backend is running on port 3001
- Verify API URL in `src/services/api.ts` matches your IP
- Check firewall settings (allow Node.js through firewall)
- Ensure phone and computer are on the same WiFi network

### 3D View Not Working
- Physical device works best for 3D
- Web version has limited 3D support
- Try clearing Expo Go app cache

### Module Resolution Errors
```bash
npm install
npx expo start -c
```

### Picker Not Working
If you see picker-related errors:
```bash
npm install @react-native-picker/picker
```

## Demo Credentials

The backend should be seeded with a demo account:
- Email: `demo@anatomlabs.com`
- Password: `password123`

## Development Commands

```bash
# Start development server
npm start

# Start with cache cleared
npx expo start -c

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run on web (limited 3D support)
npm run web
```

## API Endpoints Used

- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register
- `GET /api/body-parts` - Get body parts
- `GET /api/muscles` - Get all muscles
- `GET /api/muscles/:id` - Get muscle details
- `GET /api/exercises` - Get exercises
- `GET /api/exercises/for-muscle/:id` - Get exercises for muscle
- `POST /api/workouts/generate` - Generate workout
- `GET /api/workouts` - Get workout plans
- `POST /api/nutrition/calculate` - Calculate nutrition
- `GET /api/nutrition` - Get nutrition plan
- `GET /api/reports/daily` - Get daily report
- `GET /api/injury-prevention` - Get injury risk

## Notes

- All calculations are transparent and science-based
- No AI for workout generation (rule-based only)
- Educational focus with detailed explanations
- Designed for science & technology competition
- Cross-platform (iOS + Android)

## Next Steps

1. Test all screens and features
2. Check backend connectivity
3. Verify 3D visualization works
4. Test workout generation
5. Review injury prevention system

## License

MIT License - Educational project for science competition
