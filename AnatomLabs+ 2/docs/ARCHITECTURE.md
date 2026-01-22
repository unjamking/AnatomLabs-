# Human Performance Science Platform - Architecture

## Table of Contents
1. [System Overview](#system-overview)
2. [Design Philosophy](#design-philosophy)
3. [Technology Stack](#technology-stack)
4. [Database Architecture](#database-architecture)
5. [Backend Services](#backend-services)
6. [API Design](#api-design)
7. [Frontend Architecture](#frontend-architecture)
8. [3D Visualization](#3d-visualization)
9. [Security](#security)
10. [Scalability](#scalability)

## System Overview

### High-Level Architecture

```
┌──────────────┐         ┌──────────────┐
│              │         │              │
│  Mobile App  │◄───────►│   Web App    │
│ (React Native│         │   (React)    │
│              │         │              │
└──────┬───────┘         └──────┬───────┘
       │                        │
       │     HTTP/REST API      │
       └────────┬───────────────┘
                │
       ┌────────▼────────┐
       │                 │
       │  Express API    │
       │  (TypeScript)   │
       │                 │
       └────────┬────────┘
                │
       ┌────────▼────────┐
       │                 │
       │  PostgreSQL     │
       │   Database      │
       │                 │
       └─────────────────┘
```

### Data Flow

1. **User Authentication:**
   ```
   Client → POST /api/auth/login → JWT Token → Client Storage
   ```

2. **Workout Generation:**
   ```
   Client → POST /api/workouts/generate (user params)
          ↓
   workoutGenerator.ts (rule-based logic)
          ↓
   Database (save workout plan)
          ↓
   Client (workout with exercise details)
   ```

3. **Nutrition Calculation:**
   ```
   Client → POST /api/nutrition/calculate (user data)
          ↓
   nutritionCalculator.ts (BMR → TDEE → Macros)
          ↓
   Client (nutrition plan with explanations)
   ```

4. **3D Body Interaction:**
   ```
   Client → GET /api/body-parts
          ↓
   Database (anatomical data)
          ↓
   3D Model (render with click handlers)
          ↓
   User clicks muscle → Educational modal + exercises
   ```

## Design Philosophy

### 1. Scientific Transparency
**Principle:** Every calculation must be explainable to judges.

**Implementation:**
- All formulas documented in code comments
- API responses include explanation fields
- No black-box AI for core features
- Sample calculations in tests

**Example:**
```typescript
// nutritionCalculator.ts
export function calculateBMR(userData: UserPhysicalData): number {
  // Mifflin-St Jeor Equation (most accurate for modern populations)
  // Men: BMR = 10×W + 6.25×H - 5×A + 5
  // Women: BMR = 10×W + 6.25×H - 5×A - 161
  const baseBMR = 10 * weight + 6.25 * height - 5 * age;
  return gender === 'male' ? baseBMR + 5 : baseBMR - 161;
}
```

### 2. Educational First
**Principle:** Teach science through interaction.

**Implementation:**
- Each body part has detailed educational content
- Exercise descriptions explain biomechanics
- Visual feedback shows muscle activation
- Reports explain metrics in plain language

### 3. Production-Grade Code
**Principle:** Judge-friendly but professional.

**Implementation:**
- TypeScript for type safety
- Clear separation of concerns
- Comprehensive error handling
- Documented API contracts
- Database migrations for reproducibility

## Technology Stack

### Backend

**Runtime:** Node.js v18+
- Event-driven, non-blocking I/O
- Large ecosystem
- Excellent TypeScript support

**Framework:** Express.js
- Minimal, unopinionated
- Extensive middleware ecosystem
- Easy to understand for judges

**Language:** TypeScript
- Type safety prevents runtime errors
- Better IDE support
- Self-documenting code

**Database:** PostgreSQL
- ACID compliance
- Complex queries for reporting
- JSON support for flexible data
- Mature and reliable

**ORM:** Prisma
- Type-safe database client
- Automatic migrations
- Excellent TypeScript integration
- Clear schema definition

**Authentication:** JWT (jsonwebtoken)
- Stateless authentication
- Industry standard
- Easy to implement and understand

**AI:** OpenAI API (limited use)
- ONLY for calorie recommendations
- Must provide reasoning
- User can override

### Frontend (Mobile)

**Framework:** React Native (Expo)
- Cross-platform (iOS + Android)
- Single codebase
- Fast development
- Large component library

**3D:** React Three Fiber
- React wrapper for Three.js
- Declarative 3D
- Performance optimized

**Navigation:** React Navigation
- Standard for React Native
- Configurable
- Native feel

**State:** React Context + Hooks
- Built-in solution
- No additional libraries
- Easy to understand

**Charts:** Recharts
- React-based
- Responsive
- Customizable

### Frontend (Web)

**Framework:** React + Vite
- Fast build tool
- Hot module replacement
- Optimized production builds

**3D:** Three.js
- Industry standard for WebGL
- Rich feature set
- Good documentation

## Database Architecture

### Schema Design Principles

1. **Normalization:** Minimize redundancy while maintaining query performance
2. **Relationships:** Clear foreign key relationships for data integrity
3. **Extensibility:** JSON fields for flexible data structures
4. **Audit Trail:** createdAt/updatedAt timestamps on all entities

### Core Entities

```prisma
User (authentication + physical data)
  ↓
  ├─→ WorkoutPlan (user's training program)
  │     ├─→ Workout (individual sessions)
  │     │     └─→ WorkoutExercise (exercises in session)
  │     │           └─→ Exercise
  │
  ├─→ NutritionLog (food intake tracking)
  │     └─→ Food (nutrition database)
  │
  ├─→ ActivityLog (steps, movement)
  │
  ├─→ MuscleUsageLog (injury prevention)
  │     └─→ BodyPart (anatomy database)
  │
  └─→ Report (generated insights)

BodyPart ←→ Exercise (many-to-many)
  └─→ ExerciseBodyPart (activation ranking)
```

### Key Tables

#### Users
```sql
- Physical attributes (age, gender, weight, height)
- Activity level
- Fitness goal
- Experience level
→ Used for personalized calculations
```

#### BodyParts
```sql
- Educational content (description, function, importance)
- Movement mechanics
- 3D model positioning
- Recovery time (for injury prevention)
→ Educational core of platform
```

#### Exercises
```sql
- Instructions and descriptions
- Biomechanical explanations
- Sport-specific tags
- Difficulty level
→ Links anatomy to practical application
```

#### MuscleUsageLogs
```sql
- Tracks when muscles are trained
- Intensity of training
- Recovery status
→ Powers injury prevention system
```

### Indexes

```sql
-- User lookups
CREATE INDEX idx_users_email ON users(email);

-- Nutrition logs by user and date
CREATE INDEX idx_nutrition_user_date ON nutrition_logs(userId, date);

-- Activity logs by user and date
CREATE INDEX idx_activity_user_date ON activity_logs(userId, date);

-- Muscle usage by user and body part
CREATE INDEX idx_muscle_usage ON muscle_usage_logs(userId, bodyPartId, date);

-- Exercise search by category
CREATE INDEX idx_exercises_category ON exercises(category);
```

## Backend Services

### Service Layer Architecture

```
Routes (HTTP handlers)
   ↓
Controllers (request validation, response formatting)
   ↓
Services (business logic)
   ↓
Database (Prisma ORM)
```

### Core Services

#### 1. nutritionCalculator.ts

**Purpose:** All nutrition-related calculations

**Functions:**
- `calculateBMR()` - Basal Metabolic Rate
- `calculateTDEE()` - Total Daily Energy Expenditure
- `calculateTargetCalories()` - Goal-adjusted calories
- `calculateMacros()` - Protein/carb/fat distribution
- `calculateMicronutrientTargets()` - Vitamin/mineral needs
- `calculateCaloriesFromSteps()` - Activity energy expenditure

**Input:** User physical data (age, gender, weight, height, activity level, goal)

**Output:** Complete nutrition plan with explanations

**Scientific Basis:**
- Mifflin-St Jeor equation (validated BMR formula)
- Activity multipliers (research-based)
- Protein targets (sports nutrition guidelines)

#### 2. workoutGenerator.ts

**Purpose:** Rule-based workout programming

**Functions:**
- `generateWorkoutPlan()` - Main entry point
- Split generators for 2-6 days per week
- Sport-specific templates
- Exercise selection algorithms

**Logic Flow:**
```
1. Assess parameters (goal, experience, frequency)
2. Select appropriate split
3. Choose exercises for each workout
4. Determine sets/reps based on goal
5. Add biomechanical explanations
```

**Based on BuiltWithScience Principles:**
- Volume landmarks (10-20 sets per muscle per week)
- Frequency optimization
- Exercise order (compounds first)
- Progressive overload

**NO AI** - Pure algorithmic logic

#### 3. injuryPrevention.ts

**Purpose:** Detect overtraining and prevent injuries

**Functions:**
- `assessInjuryRisk()` - Analyze usage patterns
- `isMuscleFullyRecovered()` - Recovery status
- `calculateRestDaysNeeded()` - Recommendations
- `generateRecoveryPlan()` - Structured rest protocol
- `calculateCumulativeFatigue()` - Long-term tracking

**Detection Patterns:**
1. Insufficient recovery (muscle trained before recovered)
2. Excessive frequency (>3x per week at high intensity)
3. High cumulative fatigue (accumulated stress)
4. Muscle imbalances (unequal development)

**Output:**
- Risk level (low/moderate/high/very_high)
- Specific overused muscles
- Actionable recommendations
- Alternative exercise suggestions

## API Design

### REST Principles

1. **Resource-based URLs**
   ```
   GET    /api/exercises          - List all
   GET    /api/exercises/:id      - Get specific
   POST   /api/exercises          - Create new
   PUT    /api/exercises/:id      - Update
   DELETE /api/exercises/:id      - Delete
   ```

2. **HTTP Methods**
   - GET: Retrieve data (no side effects)
   - POST: Create resources or trigger actions
   - PUT/PATCH: Update existing resources
   - DELETE: Remove resources

3. **Status Codes**
   - 200: Success
   - 201: Created
   - 400: Bad request (validation error)
   - 401: Unauthorized
   - 403: Forbidden
   - 404: Not found
   - 500: Server error

4. **Consistent Response Format**
   ```typescript
   // Success
   {
     data: { ... },
     meta: { timestamp, version }
   }
   
   // Error
   {
     error: "Error type",
     message: "Human-readable message",
     details: { field: "error" }  // Optional validation errors
   }
   ```

### Authentication Flow

```
1. POST /api/auth/register
   Body: { email, password, name, age, gender, ... }
   Response: { user, token }

2. POST /api/auth/login
   Body: { email, password }
   Response: { user, token }

3. Subsequent requests:
   Header: Authorization: Bearer <token>
```

### Key Endpoints

See `docs/API.md` for complete reference.

## Frontend Architecture

### Mobile App Structure

```
mobile/
├── src/
│   ├── screens/          # Full-screen views
│   │   ├── Auth/
│   │   ├── Home/
│   │   ├── Anatomy/      # 3D body viewer
│   │   ├── Workouts/
│   │   ├── Nutrition/
│   │   └── Reports/
│   ├── components/       # Reusable UI components
│   │   ├── BodyModel3D/  # 3D viewer component
│   │   ├── NutritionChart/
│   │   └── ExerciseCard/
│   ├── navigation/       # App navigation structure
│   ├── services/         # API client
│   ├── context/          # Global state
│   └── utils/            # Helper functions
└── assets/               # Images, fonts, 3D models
```

### State Management

**User Context:**
```typescript
const UserContext = {
  user: User | null,
  token: string | null,
  nutritionPlan: NutritionCalculation,
  workoutPlan: WorkoutPlan,
  login, logout, updateProfile
}
```

**Data Context:**
```typescript
const DataContext = {
  bodyParts: BodyPart[],
  exercises: Exercise[],
  foods: Food[],
  loadBodyParts, loadExercises
}
```

## 3D Visualization

### Three.js Implementation

**Model Layers:**
```javascript
const layers = {
  fullBody: { visible: true, meshes: [...] },
  musclesBones: { visible: false, meshes: [...] },
  skeletonOrgans: { visible: false, meshes: [...] }
};

function toggleLayer(layerName) {
  Object.keys(layers).forEach(key => {
    layers[key].visible = (key === layerName);
  });
}
```

**Click Detection:**
```javascript
function onMeshClick(intersectedObject) {
  const bodyPartId = intersectedObject.userData.bodyPartId;
  const bodyPart = await api.getBodyPart(bodyPartId);
  
  // Highlight selected muscle
  highlightMesh(intersectedObject);
  
  // Show educational modal
  showBodyPartModal(bodyPart);
  
  // If muscle, load exercises
  if (bodyPart.type === 'muscle') {
    const exercises = await api.getExercisesForMuscle(bodyPartId);
    showExerciseList(exercises);
  }
}
```

**Performance Optimization:**
- Level of Detail (LOD) for complex meshes
- Frustum culling
- Texture compression
- Lazy loading of educational content

## Security

### Authentication

**JWT Tokens:**
- Signed with secret key
- 7-day expiration
- Payload: { userId, iat, exp }
- No sensitive data in token

**Password Security:**
```typescript
import bcrypt from 'bcryptjs';

// Registration
const hashedPassword = await bcrypt.hash(password, 10);

// Login
const isValid = await bcrypt.compare(password, user.password);
```

### API Security

1. **Rate Limiting:** Prevent abuse
2. **Input Validation:** Sanitize all inputs
3. **SQL Injection:** Prevented by Prisma ORM
4. **XSS:** Sanitized responses
5. **CORS:** Configured allowed origins

### Data Privacy

- User passwords hashed (never stored plain)
- JWT tokens in secure storage (mobile)
- HTTPS in production
- No third-party analytics (competition version)

## Scalability

### Current Architecture

**Designed for:**
- 1000+ concurrent users
- Fast response times (<200ms API)
- Efficient database queries

### Future Optimizations

1. **Caching:**
   - Redis for frequently accessed data
   - CDN for static assets (3D models)

2. **Database:**
   - Read replicas for reports
   - Partitioning large tables

3. **API:**
   - Load balancing (multiple server instances)
   - GraphQL for flexible queries

4. **Frontend:**
   - Progressive Web App (PWA)
   - Offline-first architecture

---

**Design Decisions:**
Every architectural choice prioritizes clarity, maintainability, and scientific accuracy—perfect for competition judging.
