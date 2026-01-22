# 🚀 Quick Start Guide

Get the Human Performance Science Platform running in **5 minutes**.

## Prerequisites Check

Before starting, verify you have:

```powershell
# Check Node.js (need v18+)
node --version

# Check PostgreSQL (need v14+)
psql --version

# If missing, install from:
# Node.js: https://nodejs.org/
# PostgreSQL: https://www.postgresql.org/download/windows/
```

## Step 1: Database Setup (2 minutes)

```powershell
# Start PostgreSQL (if not running)
# Open Services app → Start "postgresql-x64-14"

# Create database
psql -U postgres -c "CREATE DATABASE human_performance_science;"

# Verify it was created
psql -U postgres -c "\l"
```

## Step 2: Backend Setup (3 minutes)

```powershell
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file
Copy-Item .env.example .env

# IMPORTANT: Edit .env file
# Replace 'your_password' with your PostgreSQL password
notepad .env
```

**Edit `.env`:**
```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/human_performance_science?schema=public"
JWT_SECRET="human-performance-science-secret-key-2026-competition"
PORT=3001
NODE_ENV="development"
```

## Step 3: Initialize Database

```powershell
# Generate Prisma client
npx prisma generate

# Run migrations (creates all tables)
npx prisma migrate dev --name init

# Seed with sample data
npx ts-node src/prisma/seed.ts
```

You should see:
```
🌱 Starting database seed...
✅ Created 10 body parts
✅ Created 6 exercises with muscle activation data
✅ Created 10 foods
✅ Created demo user (email: demo@anatomlabs.com, password: password123)
🎉 Database seeding completed successfully!
```

## Step 4: Start Backend Server

```powershell
npm run dev
```

You should see:
```
╔═══════════════════════════════════════════════════════╗
║  Human Performance Science Platform API               ║
║  Server running on port 3001                          ║
║  Environment: development                             ║
╚═══════════════════════════════════════════════════════╝
```

## Step 5: Test the API

Open a new PowerShell window and test:

### Test 1: Health Check
```powershell
curl http://localhost:3001/health
```

Expected:
```json
{
  "status": "healthy",
  "timestamp": "2026-01-22T...",
  "environment": "development"
}
```

### Test 2: Login
```powershell
$body = @{
    email = "demo@anatomlabs.com"
    password = "password123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:3001/api/auth/login" `
    -Method Post `
    -Body $body `
    -ContentType "application/json"

# Save token for next requests
$token = $response.token
Write-Host "Token: $token"
```

### Test 3: Calculate Nutrition Plan
```powershell
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

$nutritionBody = @{
    age = 25
    gender = "male"
    weight = 75
    height = 180
    activityLevel = "moderate"
    fitnessGoal = "muscle_gain"
} | ConvertTo-Json

$nutrition = Invoke-RestMethod -Uri "http://localhost:3001/api/nutrition/calculate" `
    -Method Post `
    -Headers $headers `
    -Body $nutritionBody

# Display results
Write-Host "`nBMR: $($nutrition.nutritionPlan.bmr) calories"
Write-Host "TDEE: $($nutrition.nutritionPlan.tdee) calories"
Write-Host "Target: $($nutrition.nutritionPlan.targetCalories) calories"
Write-Host "`nMacros:"
Write-Host "  Protein: $($nutrition.nutritionPlan.macros.protein)g"
Write-Host "  Carbs: $($nutrition.nutritionPlan.macros.carbs)g"
Write-Host "  Fat: $($nutrition.nutritionPlan.macros.fat)g"
```

Expected output:
```
BMR: 1750 calories
TDEE: 2713 calories
Target: 3119 calories

Macros:
  Protein: 150g
  Carbs: 428g
  Fat: 87g
```

### Test 4: Get Body Parts
```powershell
$bodyParts = Invoke-RestMethod -Uri "http://localhost:3001/api/body-parts" `
    -Headers @{ "Authorization" = "Bearer $token" }

Write-Host "`nBody Parts in Database:"
$bodyParts.bodyParts | ForEach-Object { Write-Host "  - $($_.name) ($($_.type))" }
```

Expected:
```
Body Parts in Database:
  - Pectoralis Major (muscle)
  - Latissimus Dorsi (muscle)
  - Quadriceps (muscle)
  - Hamstrings (muscle)
  - Deltoids (muscle)
  - Gluteus Maximus (muscle)
  - Heart (organ)
  - Lungs (organ)
  - Biceps Brachii (muscle)
  - Triceps Brachii (muscle)
```

## Explore with Prisma Studio

Visual database browser:

```powershell
npx prisma studio
```

Opens in browser at `http://localhost:5555`

Explore:
- **users** - Demo user account
- **body_parts** - Educational anatomy content
- **exercises** - Biomechanics explanations
- **foods** - Nutrition database
- **exercise_body_parts** - Muscle activation rankings

## What You Just Built

✅ **Complete Backend API** with:
- JWT authentication
- Scientific nutrition calculations (BMR, TDEE, macros)
- Educational anatomy database
- Exercise library with biomechanics
- Food database with nutrition data

✅ **Ready to Demonstrate:**
- Transparent calculations (all formulas documented)
- Educational content (anatomy + physiology)
- Professional code quality
- Judge-friendly explanations

## Next Steps

### 1. Explore the API
```powershell
# See all available endpoints
curl http://localhost:3001/
```

### 2. Read Documentation
- `README.md` - Project overview
- `docs/ARCHITECTURE.md` - System design
- `docs/API.md` - API reference
- `docs/SETUP.md` - Detailed setup

### 3. Review the Code
- `backend/src/services/nutritionCalculator.ts` - BMR/TDEE calculations
- `backend/src/services/workoutGenerator.ts` - Workout programming logic
- `backend/src/services/injuryPrevention.ts` - Overuse detection
- `backend/prisma/schema.prisma` - Database design

### 4. Generate a Workout Plan

```powershell
$workoutBody = @{
    goal = "muscle_gain"
    experienceLevel = "intermediate"
    daysPerWeek = 4
} | ConvertTo-Json

$workout = Invoke-RestMethod -Uri "http://localhost:3001/api/workouts/generate" `
    -Method Post `
    -Headers $headers `
    -Body $workoutBody

# Display workout plan
Write-Host "`nWorkout Plan: $($workout.name)"
Write-Host $workout.description
Write-Host "`nRationale: $($workout.rationale)"
```

## Troubleshooting

### "Database connection failed"
```powershell
# Check PostgreSQL is running
Get-Service *postgresql*

# If stopped, start it
Start-Service postgresql-x64-14
```

### "Port 3001 already in use"
```powershell
# Find what's using the port
netstat -ano | findstr :3001

# Kill the process (replace <PID> with actual PID)
taskkill /PID <PID> /F
```

### "Module not found"
```powershell
# Reinstall dependencies
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

### "Prisma Client not generated"
```powershell
npx prisma generate
```

## Competition Demo Script

When presenting to judges:

### 1. Show Scientific Calculations (2 min)
```powershell
# Calculate nutrition for different goals
# Show how formulas work transparently
```

### 2. Show Educational Content (2 min)
```powershell
# Browse body parts in Prisma Studio
# Click on a muscle, show its educational content
```

### 3. Show Workout Generation (2 min)
```powershell
# Generate different workout splits
# Explain the rule-based logic
```

### 4. Show Code Quality (2 min)
```powershell
# Open nutritionCalculator.ts in VS Code
# Show documented formulas and explanations
```

### 5. Explain Architecture (2 min)
- Point to ARCHITECTURE.md diagram
- Explain service layer separation
- Highlight transparent, judge-friendly design

## Success Checklist

- [x] Backend server running
- [x] Database seeded with sample data
- [x] API responding to requests
- [x] Nutrition calculations working
- [x] Authentication working
- [x] Educational content loaded
- [x] Ready to demonstrate

## You're Ready! 🎉

Your Human Performance Science Platform is now:
- ✅ **Functional** - All core features working
- ✅ **Scientific** - Real calculations, transparent formulas
- ✅ **Educational** - Teaching anatomy through data
- ✅ **Professional** - Production-quality code
- ✅ **Explainable** - Every decision justified

**Perfect for competition judging.**

---

Questions? Check:
- `docs/SETUP.md` for detailed instructions
- `docs/ARCHITECTURE.md` for system design
- Code comments for inline explanations
