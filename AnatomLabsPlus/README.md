# Human Performance Science Platform

> An educational platform combining human anatomy, movement science, and performance tracking

## 🎯 Project Overview

This is NOT a fitness app. This is an **EDUCATIONAL + PERFORMANCE SCIENCE PLATFORM** designed for international science & technology competition, combining:

- **Interactive 3D Human Anatomy** - Educational tool for understanding the human body
- **Science-Based Workout Programming** - Rule-based workout generation following BuiltWithScience principles
- **Nutrition Science** - Real BMR/TDEE calculations and macro distribution
- **Injury Prevention** - Muscle usage tracking and overtraining detection
- **Performance Tracking** - Activity monitoring and comprehensive reporting

## 🏗️ Architecture

### Tech Stack

**Backend:**
- Node.js + TypeScript
- Express.js
- PostgreSQL + Prisma ORM
- JWT Authentication
- OpenAI (limited use for calorie recommendations only)

**Mobile:**
- React Native (Expo)
- React Three Fiber (3D visualization)
- React Navigation

**Web:**
- React + Vite
- Three.js
- Recharts (data visualization)

### Project Structure

```
AnatomLabs+/
├── backend/                 # Node.js + Express API
│   ├── src/
│   │   ├── routes/         # API endpoints
│   │   ├── services/       # Business logic
│   │   │   ├── nutritionCalculator.ts  # BMR, TDEE, macros
│   │   │   ├── workoutGenerator.ts     # Workout programming
│   │   │   └── injuryPrevention.ts     # Overuse detection
│   │   ├── middleware/     # Auth, validation
│   │   └── server.ts       # Express app
│   └── prisma/
│       ├── schema.prisma   # Database schema
│       └── seed.ts         # Sample data
├── mobile/                  # React Native app
├── web/                     # React web app
├── docs/                    # Documentation
└── tools/sample-data/       # Seed data files
```

## 🔬 Scientific Foundations

### 1. Nutrition Calculations (Fully Transparent)

**BMR (Basal Metabolic Rate):**
- Formula: Mifflin-St Jeor Equation
  - Men: `BMR = 10×weight(kg) + 6.25×height(cm) - 5×age + 5`
  - Women: `BMR = 10×weight(kg) + 6.25×height(cm) - 5×age - 161`

**TDEE (Total Daily Energy Expenditure):**
- `TDEE = BMR × Activity Multiplier`
- Activity levels: sedentary (1.2), light (1.375), moderate (1.55), active (1.725), very active (1.9)

**Macro Distribution:**
- Protein: 1.6-2.3g/kg based on goal
- Fat: 20-30% of calories
- Carbs: Remaining calories

### 2. Workout Programming (Rule-Based)

**Based on BuiltWithScience 2025 principles:**
- Frequency-based split selection (2-6 days/week)
- Volume landmarks (10-20 sets per muscle per week)
- Exercise selection for maximum muscle activation
- Progressive overload framework
- Sport-specific templates (football, basketball, volleyball, boxing, swimming)

**No AI workout generation** - Pure algorithmic logic for transparency

### 3. Injury Prevention

**Tracks:**
- Muscle usage frequency
- Recovery time per muscle (based on physiology)
- Training intensity
- Cumulative fatigue

**Detects:**
- Insufficient recovery
- Excessive training frequency
- Muscle imbalances
- Overtraining patterns

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL (v14+)
- npm or yarn

### Backend Setup

```bash
cd backend
npm install

# Configure environment
cp .env.example .env
# Edit .env with your database credentials

# Setup database
npx prisma migrate dev
npx prisma generate

# Seed data
npm run seed

# Start development server
npm run dev
```

Server runs on `http://localhost:3001`

### Mobile Setup

```bash
cd mobile
npm install
npx expo start
```

### Web Setup

```bash
cd web
npm install
npm run dev
```

## 📡 API Documentation

See `docs/API.md` for complete API reference.

**Main Endpoints:**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/body-parts` - List all body parts
- `GET /api/body-parts/:id` - Get body part details with educational info
- `GET /api/exercises` - List exercises
- `GET /api/exercises/for-muscle/:muscleId` - Get exercises for specific muscle
- `POST /api/workouts/generate` - Generate workout plan
- `POST /api/nutrition/calculate` - Calculate nutrition plan
- `GET /api/reports/daily` - Get daily report

## 🎨 Key Features

### 1. Interactive 3D Body

- **3 toggleable layers:**
  1. Full body
  2. Muscles + bones
  3. Skeleton + organs

- **Educational content for each part:**
  - What it is
  - What it does
  - Why it matters
  - How it works during movement

- **For muscles only:**
  - Ranked exercise recommendations (most → least effective)
  - Exercise difficulty, equipment, activation explanation
  - Direct integration with workout plans

### 2. Workout System

- Goal-based programming (muscle gain, fat loss, endurance, etc.)
- Experience-level adaptation (beginner, intermediate, advanced)
- Frequency-based split selection (2-6 days/week)
- Sport-specific training
- Exercise explanations with biomechanics

### 3. Nutrition Tracker

- Food logging with comprehensive nutrition data
- Real-time macro/micro tracking
- Daily nutrition reports with 0-100% charts
- Deficiency/excess warnings
- Water tracking

### 4. Activity Tracking

- Daily steps
- Calorie burn calculation: `calories = steps × weight_kg × 0.0005`
- Integration with nutrition calculations

### 5. Injury Prevention

- Real-time muscle usage monitoring
- Overuse pattern detection
- Rest day recommendations
- Alternative exercise suggestions
- Risk level assessment (low/moderate/high/very high)

### 6. Reporting

- Daily, weekly, monthly reports
- Visual charts for all metrics
- Training frequency analysis
- Recovery indicators
- Overtraining warnings

## 🤖 AI Usage (Strictly Limited)

**AI is used ONLY for:**
- Advanced calorie intake recommendations

**Requirements:**
- Must show reasoning
- Must reference user data
- Must be overridable by user

**NOT used for:**
- Workout generation (rule-based only)
- Anatomy explanations (pre-written educational content)
- Exercise selection (algorithm-based)

## 🏆 Competition Strengths

1. **Scientific Rigor:** All calculations are transparent and explainable
2. **Educational Value:** Teaches anatomy and physiology through interaction
3. **Practical Application:** Real features that solve real problems
4. **Code Quality:** Clean, commented, judge-friendly codebase
5. **No Black Boxes:** Every decision can be explained and justified
6. **Scalable Architecture:** Professional-grade backend design

## 📚 Documentation

- `docs/ARCHITECTURE.md` - Detailed architecture explanation
- `docs/API.md` - Complete API reference
- `docs/SETUP.md` - Development environment setup

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Mobile tests
cd mobile
npm test
```

## 📄 License

MIT License - Educational project for science competition

## 👥 Contributors

Built for international science & technology competition

---

**Note for Judges:** This platform demonstrates the practical application of human physiology, biomechanics, and nutrition science through software engineering. Every calculation is scientifically grounded and explainable.
