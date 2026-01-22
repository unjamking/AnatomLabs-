import { Router, Request, Response } from 'express';

const router = Router();

// GET /api/body-parts
router.get('/', async (req: Request, res: Response) => {
  try {
    // TODO: Implement get body parts
    res.status(501).json({ message: 'Get body parts endpoint not yet implemented' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/body-parts/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    // TODO: Implement get body part by id
    res.status(501).json({ message: 'Get body part endpoint not yet implemented' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
