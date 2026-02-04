# Human Performance Science Platform - Setup Guide

## Prerequisites

### Required Software

1. **Node.js** (v18 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **PostgreSQL** (v14 or higher)
   - Windows: https://www.postgresql.org/download/windows/
   - Verify installation: `psql --version`

3. **Git** (for version control)
   - Download from: https://git-scm.com/
   - Verify installation: `git --version`

4. **Code Editor** (recommended: VS Code)
   - Download from: https://code.visualstudio.com/

### Optional (for mobile development)

5. **Expo CLI**
   ```bash
   npm install -g expo-cli
   ```

6. **Expo Go App** (on your mobile device)
   - iOS: App Store
   - Android: Google Play

## Backend Setup

### Step 1: Install Dependencies

```bash
cd backend
npm install
```

This installs:
- Express.js (web framework)
- Prisma (database ORM)
- TypeScript (type safety)
- JWT (authentication)
- bcryptjs (password hashing)
- All other dependencies

### Step 2: Database Setup

**Create PostgreSQL Database:**

```bash
# Start PostgreSQL (if not running)
# Windows: Start PostgreSQL service from Services app

# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE human_performance_science;

# Exit psql
\q
```

### Step 3: Environment Configuration

**Create `.env` file in `/backend`:**

```bash
cp .env.example .env
```

**Edit `.env`:**

```env
# Database connection
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/human_performance_science?schema=public"

# JWT Secret (use a strong random string)
JWT_SECRET="your-super-secret-jwt-key-minimum-32-characters-long"

# Server configuration
PORT=3001
NODE_ENV="development"

# OpenAI API (optional - only needed for AI calorie recommendations)
# Get from: https://platform.openai.com/api-keys
OPENAI_API_KEY="sk-your-api-key-here"
```

**Replace:**
- `your_password` with your PostgreSQL password
- `JWT_SECRET` with a random 32+ character string
- `OPENAI_API_KEY` with your API key (optional)

### Step 4: Database Migration

**Run Prisma migrations:**

```bash
# Generate Prisma client
npx prisma generate

# Run migrations (creates all tables)
npx prisma migrate dev --name init

# Optional: Open Prisma Studio to view database
npx prisma studio
```

This creates all database tables defined in `prisma/schema.prisma`:
- users
- body_parts
- exercises
- exercise_body_parts
- workout_plans
- workouts
- workout_exercises
- foods
- nutrition_logs
- activity_logs
- muscle_usage_logs
- reports

### Step 5: Seed Database (Optional but Recommended)

**Load sample data:**

```bash
npm run seed
```

This populates the database with:
- Sample body parts (muscles, organs) with educational content
- Example exercises with biomechanics explanations
- Common foods with nutrition data
- Test user account

### Step 6: Start Backend Server

```bash
# Development mode (auto-restart on file changes)
npm run dev

# Production mode
npm run build
npm start
```

**Verify backend is running:**

Open browser and navigate to:
```
http://localhost:3001
```

You should see:
```json
{
  "message": "Human Performance Science Platform API",
  "version": "1.0.0",
  "endpoints": { ... }
}
```

**Test health check:**
```
http://localhost:3001/health
```

## Frontend Setup

### Mobile App (React Native + Expo)

#### Step 1: Install Dependencies

```bash
cd mobile
npm install
```

#### Step 2: Configure API Endpoint

**Create `mobile/.env`:**

```env
API_URL=http://localhost:3001/api
```

**Note:** For physical device testing:
- Find your computer's local IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
- Use: `API_URL=http://192.168.x.x:3001/api`

#### Step 3: Start Expo Development Server

```bash
npx expo start
```

This opens Expo DevTools in your browser.

**Options:**
1. **Expo Go (easiest):**
   - Install Expo Go app on your phone
   - Scan QR code shown in terminal
   - App loads on your device

2. **iOS Simulator (Mac only):**
   - Press `i` in terminal
   - Requires Xcode

3. **Android Emulator:**
   - Press `a` in terminal
   - Requires Android Studio

4. **Web (limited 3D support):**
   - Press `w` in terminal

### Web App (React + Vite)

#### Step 1: Install Dependencies

```bash
cd web
npm install
```

#### Step 2: Configure API Endpoint

**Create `web/.env`:**

```env
VITE_API_URL=http://localhost:3001/api
```

#### Step 3: Start Development Server

```bash
npm run dev
```

Open browser:
```
http://localhost:5173
```

## Testing the Application

### 1. Test Authentication

**Using cURL or Postman:**

```bash
# Register new user
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User",
    "age": 25,
    "gender": "male",
    "weight": 75,
    "height": 180,
    "activityLevel": "moderate",
    "fitnessGoal": "muscle_gain",
    "experienceLevel": "intermediate"
  }'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Save the returned `token` for authenticated requests.

### 2. Test Nutrition Calculation

```bash
curl -X POST http://localhost:3001/api/nutrition/calculate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "age": 25,
    "gender": "male",
    "weight": 75,
    "height": 180,
    "activityLevel": "moderate",
    "fitnessGoal": "muscle_gain"
  }'
```

**Expected response:**
```json
{
  "bmr": 1750,
  "tdee": 2713,
  "targetCalories": 3119,
  "macros": {
    "protein": 150,
    "carbs": 428,
    "fat": 87,
    "proteinPercentage": 19,
    "carbsPercentage": 55,
    "fatPercentage": 25
  },
  "micronutrients": { ... },
  "explanation": {
    "bmrFormula": "BMR calculated using Mifflin-St Jeor equation...",
    "tdeeCalculation": "TDEE = BMR × activity multiplier...",
    "calorieAdjustment": "+15% calorie surplus...",
    "macroRationale": "High protein (2.0g/kg)..."
  }
}
```

### 3. Test Workout Generation

```bash
curl -X POST http://localhost:3001/api/workouts/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "goal": "muscle_gain",
    "experienceLevel": "intermediate",
    "daysPerWeek": 4
  }'
```

### 4. Test Body Parts Endpoint

```bash
curl http://localhost:3001/api/body-parts \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Common Issues & Solutions

### Issue: "Port 3001 already in use"

**Solution:**
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Or change PORT in .env file
```

### Issue: "Database connection failed"

**Solution:**
1. Verify PostgreSQL is running
2. Check DATABASE_URL in `.env`
3. Verify database exists:
   ```bash
   psql -U postgres -c "\l"
   ```
4. Check credentials (username/password)

### Issue: "Prisma Client not generated"

**Solution:**
```bash
npx prisma generate
```

### Issue: "Module not found" errors

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: Expo app won't connect to backend

**Solution:**
1. Use computer's local IP address (not localhost)
2. Ensure phone and computer are on same WiFi
3. Check firewall isn't blocking port 3001
4. Try: `API_URL=http://192.168.x.x:3001/api`

### Issue: TypeScript errors

**Solution:**
```bash
# Rebuild TypeScript
npm run build

# Or restart TypeScript server in VS Code
# Cmd+Shift+P > "TypeScript: Restart TS Server"
```

## Development Workflow

### Backend Development

```bash
# Terminal 1: Run backend
cd backend
npm run dev

# Terminal 2: Watch database
cd backend
npx prisma studio

# Terminal 3: Run tests (when implemented)
cd backend
npm test
```

### Frontend Development

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Mobile app
cd mobile
npx expo start

# OR Web app
cd web
npm run dev
```

## Production Deployment

### Backend

```bash
# Build TypeScript
cd backend
npm run build

# Start production server
NODE_ENV=production npm start
```

### Environment Variables (Production)

```env
DATABASE_URL="postgresql://user:pass@production-db-url:5432/dbname"
JWT_SECRET="STRONG-RANDOM-SECRET-MINIMUM-32-CHARS"
NODE_ENV="production"
PORT=3001
```

**Security checklist:**
- [ ] Strong JWT_SECRET (32+ random characters)
- [ ] Secure database credentials
- [ ] HTTPS enabled
- [ ] CORS configured for production domain
- [ ] Rate limiting enabled
- [ ] Environment variables secured

### Mobile App

```bash
# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

### Web App

```bash
cd web
npm run build

# Output in: web/dist/
# Deploy to: Vercel, Netlify, or any static hosting
```

## Database Management

### Backup Database

```bash
pg_dump -U postgres human_performance_science > backup.sql
```

### Restore Database

```bash
psql -U postgres human_performance_science < backup.sql
```

### Reset Database

```bash
cd backend
npx prisma migrate reset
```

**Warning:** This deletes all data!

### View Database

```bash
# Prisma Studio (GUI)
npx prisma studio

# Or psql (CLI)
psql -U postgres human_performance_science
```

## Debugging

### Backend Logs

```bash
# Development: logs in terminal
npm run dev

# Production: use PM2 or similar
pm2 start dist/server.js --name api
pm2 logs api
```

### Frontend Logs

**Mobile (Expo):**
- Logs appear in terminal where `expo start` is running
- Shake device → "Show Dev Menu" → "Debug Remote JS"

**Web:**
- Open browser DevTools (F12)
- Check Console tab

### Database Queries

**Enable Prisma query logging:**

```typescript
// Add to prisma client initialization
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});
```

## Next Steps

1. **Explore the API:**
   - Use Postman/Insomnia to test all endpoints
   - See `docs/API.md` for complete reference

2. **Review Sample Data:**
   - Open Prisma Studio: `npx prisma studio`
   - Browse body_parts, exercises, foods tables

3. **Understand Architecture:**
   - Read `docs/ARCHITECTURE.md`
   - Review service layer code
   - Understand calculation engines

4. **Start Development:**
   - Mobile: Build 3D body viewer
   - Web: Create dashboard UI
   - Backend: Implement remaining API routes

## Support & Resources

- **Documentation:** All docs in `/docs` folder
- **Code Comments:** Every service is heavily documented
- **Prisma Docs:** https://www.prisma.io/docs/
- **Expo Docs:** https://docs.expo.dev/
- **Three.js Docs:** https://threejs.org/docs/

---

**Ready for Competition:**
This setup creates a fully functional backend with scientific calculations, ready to demonstrate to judges. All features are explainable and transparent.
