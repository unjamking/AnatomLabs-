# 📱 Mobile App Quick Start

Get the Human Performance Science mobile app running in 5 minutes!

## Prerequisites Check

✅ Node.js 18+ installed  
✅ npm or yarn installed  
✅ Smartphone with Expo Go app installed (iOS/Android)

## Step 1: Start Backend (Terminal 1)

```powershell
cd backend
npm install
npm run dev
```

Wait for: `✓ Server running on http://localhost:3001`

## Step 2: Start Mobile App (Terminal 2)

```powershell
cd mobile
npm start
```

## Step 3: Configure API URL

**IMPORTANT**: Before scanning QR code, update the API URL:

1. Find your computer's IP address:
   ```powershell
   ipconfig
   ```
   Look for **IPv4 Address** (e.g., `192.168.1.100`)

2. Open `mobile/src/services/api.ts`

3. Update line 13:
   ```typescript
   const API_BASE_URL = 'http://YOUR_IP_HERE:3001/api'
   // Example: 'http://192.168.1.100:3001/api'
   ```

4. Save the file (it will auto-reload)

## Step 4: Open on Phone

1. Open **Expo Go** app
2. Scan the QR code from Terminal 2
3. Wait for app to load (~30 seconds first time)

## Step 5: Login

**Demo Account:**
- Email: `demo@anatomlabs.com`
- Password: `password123`

Or click **"Use Demo Account"** button to auto-fill

## ✨ Features to Demo

### 1. Home Dashboard
- View user stats
- Navigate to features

### 2. Body Explorer (Most Impressive!)
- Tap "Body Explorer"
- **3D View**: Rotate with finger, tap red spheres (muscles)
- **List View**: Browse all muscles
- Each muscle shows scientific info

### 3. Nutrition
- See calculated BMR & TDEE
- View macro targets (protein, carbs, fats)
- Based on Mifflin-St Jeor equation

### 4. Workouts
- Generate science-based workout plan
- Uses BuiltWithScience principles
- No AI - pure rule-based logic

### 5. Reports
- Performance metrics
- **Injury Prevention**: Overuse pattern detection
- Risk analysis with recommendations

## Troubleshooting

### "Network request failed"
- Backend not running → Start Terminal 1
- Wrong IP address → Update `api.ts` with correct IP
- Firewall blocking → Allow Node.js through firewall

### "Unable to resolve module"
```powershell
cd mobile
npm install
npx expo start -c
```

### 3D model not showing
- Physical device works best
- Web version has limited 3D support
- Try clearing app cache in Expo Go

### QR code not scanning
- Use tunnel mode: `npx expo start --tunnel`
- Manually enter URL shown in terminal

## Platform-Specific URLs

If testing on emulator/simulator:

**iOS Simulator (macOS)**
```typescript
const API_BASE_URL = 'http://localhost:3001/api'
```

**Android Emulator**
```typescript
const API_BASE_URL = 'http://10.0.2.2:3001/api'
```

**Physical Device**
```typescript
const API_BASE_URL = 'http://YOUR_COMPUTER_IP:3001/api'
```

## File Structure Created

```
mobile/
├── src/
│   ├── components/
│   │   └── BodyViewer3D.tsx          # 3D anatomy viewer (Three.js)
│   ├── context/
│   │   └── AuthContext.tsx           # Auth state management
│   ├── screens/
│   │   ├── auth/
│   │   │   └── LoginScreen.tsx       # ✅ Login with demo
│   │   ├── HomeScreen.tsx            # ✅ Dashboard
│   │   ├── BodyExplorerScreen.tsx    # ✅ 3D + List view
│   │   ├── NutritionScreen.tsx       # ✅ BMR/TDEE/Macros
│   │   ├── WorkoutsScreen.tsx        # ✅ Plan generation
│   │   └── ReportsScreen.tsx         # ✅ Injury prevention
│   ├── services/
│   │   └── api.ts                    # Backend API client
│   └── types/
│       └── index.ts                  # TypeScript definitions
└── App.tsx                           # Navigation setup
```

## Tech Stack

- **React Native** + Expo
- **TypeScript**
- **React Navigation** (screens)
- **Three.js** + @react-three/fiber (3D)
- **Axios** (API calls)
- **AsyncStorage** (token persistence)

## Lines of Code

- **API Service**: 202 lines
- **Types**: 212 lines
- **Auth Context**: 102 lines
- **Login Screen**: 185 lines
- **Home Screen**: 232 lines
- **Body Explorer**: 267 lines
- **3D Viewer**: 168 lines
- **Nutrition Screen**: 354 lines
- **Workouts Screen**: 259 lines
- **Reports Screen**: 316 lines
- **Navigation**: 82 lines

**Total Mobile Code: ~2,400 lines** (excluding node_modules)

## Next: Competition Presentation

The mobile app is **fully functional** and ready to demo alongside the backend. Key selling points:

1. **Real Science**: Mifflin-St Jeor, BuiltWithScience, overuse detection
2. **3D Visualization**: Interactive anatomy learning
3. **No AI Gimmicks**: Transparent calculations
4. **Cross-Platform**: iOS + Android from one codebase
5. **Production-Ready**: Clean architecture, TypeScript, proper state management

Good luck! 🚀
