import { Router, Request, Response } from 'express';
import { db } from '../db/database';
import { v4 as uuidv4 } from 'uuid';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

// GET /api/drivers - List all drivers
router.get('/', authenticateToken, (req: Request, res: Response) => {
    db.all('SELECT * FROM drivers', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ drivers: rows });
    });
});

// POST /api/drivers - Add new driver (Managers & Safety Officers)
router.post('/', authenticateToken, requireRole(['MANAGER', 'SAFETY_OFFICER']), (req: Request, res: Response) => {
    const { name, license_expiry, license_category } = req.body;
    const id = `d-${uuidv4()}`;

    db.run(
        `INSERT INTO drivers (id, name, license_expiry, license_category, safety_score, status) 
     VALUES (?, ?, ?, ?, 100, 'AVAILABLE')`,
        [id, name, license_expiry, license_category],
        function (err) {
            if (err) return res.status(400).json({ error: err.message });
            res.status(201).json({ id, name, status: 'AVAILABLE' });
        }
    );
});

export default router;
