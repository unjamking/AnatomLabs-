/**
 * Health Routes
 *
 * API endpoints for health conditions, allergies, and dietary preferences.
 * Provides master lists for client-side health profile configuration.
 */

import { Router, Response } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { getAllHealthConditionOptions } from '../constants/healthConditions';

const router = Router();

/**
 * GET /api/health/conditions
 * Get all available health conditions, limitations, allergies, and dietary preferences
 * Used by the mobile app to populate health profile selection UI
 */
router.get('/conditions', async (req, res: Response) => {
  try {
    const options = getAllHealthConditionOptions();

    res.json({
      success: true,
      data: options,
      message: 'Health condition options retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching health conditions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch health condition options'
    });
  }
});

/**
 * GET /api/health/conditions/physical-limitations
 * Get only physical limitations
 */
router.get('/conditions/physical-limitations', async (req, res: Response) => {
  try {
    const options = getAllHealthConditionOptions();

    res.json({
      success: true,
      data: options.physicalLimitations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch physical limitations'
    });
  }
});

/**
 * GET /api/health/conditions/medical
 * Get only medical conditions
 */
router.get('/conditions/medical', async (req, res: Response) => {
  try {
    const options = getAllHealthConditionOptions();

    res.json({
      success: true,
      data: options.medicalConditions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch medical conditions'
    });
  }
});

/**
 * GET /api/health/conditions/allergies
 * Get only food allergies
 */
router.get('/conditions/allergies', async (req, res: Response) => {
  try {
    const options = getAllHealthConditionOptions();

    res.json({
      success: true,
      data: options.foodAllergies
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch food allergies'
    });
  }
});

/**
 * GET /api/health/conditions/dietary-preferences
 * Get only dietary preferences
 */
router.get('/conditions/dietary-preferences', async (req, res: Response) => {
  try {
    const options = getAllHealthConditionOptions();

    res.json({
      success: true,
      data: options.dietaryPreferences
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dietary preferences'
    });
  }
});

export default router;
