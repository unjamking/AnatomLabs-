import { Router, Request, Response } from 'express';

const router = Router();

// GET /api/exercises
router.get('/', async (req: Request, res: Response) => {
  try {
    // TODO: Implement get exercises
    res.status(501).json({ message: 'Get exercises endpoint not yet implemented' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/exercises/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    // TODO: Implement get exercise by id
    res.status(501).json({ message: 'Get exercise endpoint not yet implemented' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
