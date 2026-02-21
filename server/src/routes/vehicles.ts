import { Router, Request, Response } from 'express';
import { db } from '../db/database';
import { v4 as uuidv4 } from 'uuid';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

// GET /api/vehicles - List all vehicles
router.get('/', authenticateToken, (req: Request, res: Response) => {
    db.all('SELECT * FROM vehicles', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ vehicles: rows });
    });
});

// POST /api/vehicles - Add new vehicle (Only Managers)
router.post('/', authenticateToken, requireRole(['MANAGER']), (req: Request, res: Response) => {
    const { model, license_plate, type, region, capacity_kg, odometer_km = 0, acquisition_cost = 0 } = req.body;
    const id = `v-${uuidv4()}`;

    db.run(
        `INSERT INTO vehicles (id, model, license_plate, type, region, capacity_kg, odometer_km, acquisition_cost, status) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'AVAILABLE')`,
        [id, model, license_plate, type, region, capacity_kg, odometer_km, acquisition_cost],
        function (err) {
            if (err) return res.status(400).json({ error: err.message });
            res.status(201).json({ id, model, status: 'AVAILABLE' });
        }
    );
});

// PATCH /api/vehicles/:id/status - Update vehicle status
router.patch('/:id/status', authenticateToken, requireRole(['MANAGER', 'DISPATCHER']), (req: Request, res: Response) => {
    const { status } = req.body;

    db.run(
        `UPDATE vehicles SET status = ? WHERE id = ?`,
        [status, req.params.id],
        function (err) {
            if (err) return res.status(400).json({ error: err.message });
            if (this.changes === 0) return res.status(404).json({ error: 'Vehicle not found' });
            res.json({ message: 'Status updated' });
        }
    );
});

export default router;
