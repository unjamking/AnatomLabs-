/**
 * Workout Filter Service
 *
 * Filters and modifies workout exercises based on user's health conditions
 * and physical limitations to ensure safe and appropriate exercise selection.
 */

import {
  PHYSICAL_LIMITATIONS,
  MEDICAL_CONDITIONS,
  getPhysicalLimitation,
  getMedicalCondition,
  PhysicalLimitation,
  MedicalCondition
} from '../constants/healthConditions';

export interface WorkoutExerciseTemplate {
  exerciseName: string;
  sets: number;
  reps: string;
  rest: number;
  notes: string;
  targetMuscles: string[];
}

export interface FilteredExercise extends WorkoutExerciseTemplate {
  wasModified: boolean;
  originalExercise?: string;
  modificationNotes?: string[];
  safetyNotes?: string[];
}

export interface UserHealthContext {
  physicalLimitations: string[];
  medicalConditions: string[];
}

export interface WorkoutFilterResult {
  exercises: FilteredExercise[];
  removedExercises: { name: string; reason: string }[];
  modifiedExercises: { original: string; replacement: string; reason: string }[];
  warnings: string[];
  recommendations: string[];
  healthModifications: {
    totalRemoved: number;
    totalModified: number;
    limitations: string[];
    conditions: string[];
  };
}

/**
 * Build a set of all contraindicated exercises based on user's conditions
 */
function buildContraindicationSet(healthContext: UserHealthContext): Set<string> {
  const contraindicated = new Set<string>();

  // Add exercises contraindicated by physical limitations
  for (const limitationId of healthContext.physicalLimitations) {
    const limitation = getPhysicalLimitation(limitationId);
    if (limitation) {
      limitation.contraindicatedExercises.forEach(ex =>
        contraindicated.add(ex.toLowerCase())
      );
    }
  }

  // Add exercises to avoid from medical conditions
  for (const conditionId of healthContext.medicalConditions) {
    const condition = getMedicalCondition(conditionId);
    if (condition) {
      condition.exerciseRestrictions.avoid.forEach(ex =>
        contraindicated.add(ex.toLowerCase())
      );
    }
  }

  return contraindicated;
}

/**
 * Build a set of exercises that need modification/caution
 */
function buildModificationSet(healthContext: UserHealthContext): Set<string> {
  const needsModification = new Set<string>();

  for (const limitationId of healthContext.physicalLimitations) {
    const limitation = getPhysicalLimitation(limitationId);
    if (limitation) {
      limitation.modifyExercises.forEach(ex =>
        needsModification.add(ex.toLowerCase())
      );
    }
  }

  for (const conditionId of healthContext.medicalConditions) {
    const condition = getMedicalCondition(conditionId);
    if (condition) {
      condition.exerciseRestrictions.caution.forEach(ex =>
        needsModification.add(ex.toLowerCase())
      );
    }
  }

  return needsModification;
}

/**
 * Get alternative exercises for a contraindicated exercise
 */
function getAlternativeExercise(
  exerciseName: string,
  healthContext: UserHealthContext,
  contraindicated: Set<string>
): { alternative: string | null; source: string } {
  const lowerName = exerciseName.toLowerCase();

  // Check each limitation for safe alternatives
  for (const limitationId of healthContext.physicalLimitations) {
    const limitation = getPhysicalLimitation(limitationId);
    if (limitation && limitation.safeAlternatives) {
      for (const [key, alternatives] of Object.entries(limitation.safeAlternatives)) {
        if (lowerName.includes(key.toLowerCase())) {
          // Find an alternative that isn't also contraindicated
          for (const alt of alternatives) {
            if (!contraindicated.has(alt.toLowerCase())) {
              return { alternative: alt, source: limitation.name };
            }
          }
        }
      }
    }
  }

  return { alternative: null, source: '' };
}

/**
 * Collect all warnings from user's conditions
 */
function collectWarnings(healthContext: UserHealthContext): string[] {
  const warnings: string[] = [];

  for (const limitationId of healthContext.physicalLimitations) {
    const limitation = getPhysicalLimitation(limitationId);
    if (limitation) {
      warnings.push(...limitation.warnings);
    }
  }

  for (const conditionId of healthContext.medicalConditions) {
    const condition = getMedicalCondition(conditionId);
    if (condition) {
      warnings.push(...condition.exerciseRestrictions.warnings);
    }
  }

  // Remove duplicates
  return [...new Set(warnings)];
}

/**
 * Collect recommended exercise types from conditions
 */
function collectRecommendations(healthContext: UserHealthContext): string[] {
  const recommendations: string[] = [];

  for (const conditionId of healthContext.medicalConditions) {
    const condition = getMedicalCondition(conditionId);
    if (condition && condition.exerciseRestrictions.recommended.length > 0) {
      recommendations.push(
        `Recommended for ${condition.name}: ${condition.exerciseRestrictions.recommended.join(', ')}`
      );
    }
  }

  return recommendations;
}

/**
 * Check if exercise name matches any in the set (fuzzy matching)
 */
function matchesExerciseSet(exerciseName: string, exerciseSet: Set<string>): boolean {
  const lowerName = exerciseName.toLowerCase();

  // Direct match
  if (exerciseSet.has(lowerName)) {
    return true;
  }

  // Check if any set item is contained in the exercise name
  for (const setItem of exerciseSet) {
    if (lowerName.includes(setItem) || setItem.includes(lowerName)) {
      return true;
    }
  }

  return false;
}

/**
 * Get modification notes for an exercise based on user's conditions
 */
function getModificationNotes(
  exerciseName: string,
  healthContext: UserHealthContext
): string[] {
  const notes: string[] = [];
  const lowerName = exerciseName.toLowerCase();

  for (const limitationId of healthContext.physicalLimitations) {
    const limitation = getPhysicalLimitation(limitationId);
    if (limitation) {
      // Check if this exercise needs modification for this limitation
      for (const modEx of limitation.modifyExercises) {
        if (lowerName.includes(modEx.toLowerCase())) {
          notes.push(`Modified for ${limitation.name}: Use lighter weight and controlled movements`);
        }
      }
    }
  }

  for (const conditionId of healthContext.medicalConditions) {
    const condition = getMedicalCondition(conditionId);
    if (condition) {
      for (const cautionEx of condition.exerciseRestrictions.caution) {
        if (lowerName.includes(cautionEx.toLowerCase())) {
          notes.push(`Caution (${condition.name}): Monitor intensity and symptoms`);
        }
      }

      // Add max intensity warning if applicable
      if (condition.exerciseRestrictions.maxIntensity) {
        notes.push(
          `Max intensity: ${condition.exerciseRestrictions.maxIntensity} (due to ${condition.name})`
        );
      }
    }
  }

  return notes;
}

/**
 * Main filter function - filters workout exercises based on health context
 */
export function filterWorkoutForHealth(
  exercises: WorkoutExerciseTemplate[],
  healthContext: UserHealthContext
): WorkoutFilterResult {
  // Return unmodified if no health conditions
  if (
    healthContext.physicalLimitations.length === 0 &&
    healthContext.medicalConditions.length === 0
  ) {
    return {
      exercises: exercises.map(ex => ({
        ...ex,
        wasModified: false
      })),
      removedExercises: [],
      modifiedExercises: [],
      warnings: [],
      recommendations: [],
      healthModifications: {
        totalRemoved: 0,
        totalModified: 0,
        limitations: [],
        conditions: []
      }
    };
  }

  const contraindicated = buildContraindicationSet(healthContext);
  const needsModification = buildModificationSet(healthContext);
  const warnings = collectWarnings(healthContext);
  const recommendations = collectRecommendations(healthContext);

  const filteredExercises: FilteredExercise[] = [];
  const removedExercises: { name: string; reason: string }[] = [];
  const modifiedExercises: { original: string; replacement: string; reason: string }[] = [];

  for (const exercise of exercises) {
    const exerciseName = exercise.exerciseName;
    const isContraindicated = matchesExerciseSet(exerciseName, contraindicated);

    if (isContraindicated) {
      // Try to find an alternative
      const { alternative, source } = getAlternativeExercise(
        exerciseName,
        healthContext,
        contraindicated
      );

      if (alternative) {
        // Replace with alternative
        filteredExercises.push({
          ...exercise,
          exerciseName: alternative,
          wasModified: true,
          originalExercise: exerciseName,
          modificationNotes: [`Replaced ${exerciseName} due to ${source}`],
          safetyNotes: getModificationNotes(alternative, healthContext)
        });

        modifiedExercises.push({
          original: exerciseName,
          replacement: alternative,
          reason: source
        });
      } else {
        // Remove entirely
        removedExercises.push({
          name: exerciseName,
          reason: 'Contraindicated for your health conditions'
        });
      }
    } else if (matchesExerciseSet(exerciseName, needsModification)) {
      // Keep but add modification notes
      const modNotes = getModificationNotes(exerciseName, healthContext);

      filteredExercises.push({
        ...exercise,
        wasModified: modNotes.length > 0,
        modificationNotes: modNotes,
        safetyNotes: modNotes.length > 0 ? ['Use lighter weight', 'Focus on form'] : []
      });

      if (modNotes.length > 0) {
        modifiedExercises.push({
          original: exerciseName,
          replacement: exerciseName + ' (modified)',
          reason: 'Exercise modified for safety'
        });
      }
    } else {
      // Keep as-is
      filteredExercises.push({
        ...exercise,
        wasModified: false
      });
    }
  }

  // Get limitation and condition names for summary
  const limitationNames = healthContext.physicalLimitations
    .map(id => getPhysicalLimitation(id)?.name || id)
    .filter(Boolean);

  const conditionNames = healthContext.medicalConditions
    .map(id => getMedicalCondition(id)?.name || id)
    .filter(Boolean);

  return {
    exercises: filteredExercises,
    removedExercises,
    modifiedExercises,
    warnings,
    recommendations,
    healthModifications: {
      totalRemoved: removedExercises.length,
      totalModified: modifiedExercises.length,
      limitations: limitationNames,
      conditions: conditionNames
    }
  };
}

/**
 * Quick check if a workout needs filtering
 */
export function needsHealthFiltering(healthContext: UserHealthContext): boolean {
  return (
    healthContext.physicalLimitations.length > 0 ||
    healthContext.medicalConditions.length > 0
  );
}

/**
 * Get a summary of health-based workout modifications
 */
export function getHealthFilterSummary(healthContext: UserHealthContext): string {
  if (!needsHealthFiltering(healthContext)) {
    return 'No health-based modifications needed.';
  }

  const parts: string[] = [];

  if (healthContext.physicalLimitations.length > 0) {
    const names = healthContext.physicalLimitations
      .map(id => getPhysicalLimitation(id)?.name)
      .filter(Boolean);
    parts.push(`Physical limitations: ${names.join(', ')}`);
  }

  if (healthContext.medicalConditions.length > 0) {
    const names = healthContext.medicalConditions
      .map(id => getMedicalCondition(id)?.name)
      .filter(Boolean);
    parts.push(`Medical conditions: ${names.join(', ')}`);
  }

  return `Workout modified for: ${parts.join('; ')}`;
}
