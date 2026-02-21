import { Router, Request, Response } from 'express';
import { db } from '../db/database';
import { v4 as uuidv4 } from 'uuid';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

// GET /api/logs
router.get('/', authenticateToken, (req: Request, res: Response) => {
    db.all('SELECT * FROM logs ORDER BY date_logged DESC', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ logs: rows });
    });
});

// POST /api/logs - Complex logic: Logging Maintenance triggers Vehicle Status Change
router.post('/', authenticateToken, requireRole(['MANAGER', 'SAFETY_OFFICER']), (req: Request, res: Response) => {
    const { vehicle_id, log_type, cost, liters, description } = req.body;

    if (!vehicle_id || !log_type || !cost) {
        return res.status(400).json({ error: 'Missing required log fields' });
    }

    const id = `l-${uuidv4()}`;

    db.serialize(() => {
        db.run('BEGIN TRANSACTION');

        const stmt = db.prepare(`INSERT INTO logs (id, vehicle_id, log_type, cost, liters, description) VALUES (?, ?, ?, ?, ?, ?)`);
        stmt.run([id, vehicle_id, log_type, cost, liters || null, description || null], function (err) {
            if (err) return rollback(res, err.message);

            // Auto-Logic Trigger: If Maintenance, pull the vehicle out of the dispatcher pool globally
            if (log_type === 'MAINTENANCE') {
                db.run('UPDATE vehicles SET status = "IN_SHOP" WHERE id = ?', [vehicle_id], (err) => {
                    if (err) return rollback(res, 'Failed to update vehicle status for maintenance');
                    commit(res, { id, log_type, result: 'Log saved and vehicle status changed to IN_SHOP' });
                });
            } else {
                // Just a fuel log, no status change needed
                commit(res, { id, log_type, result: 'Fuel log saved successfully' });
            }
        });
        stmt.finalize();
    });

    function commit(res: Response, payload: any) {
        db.run('COMMIT', (err) => {
            if (err) return rollback(res, 'Commit failed');
            res.status(201).json(payload);
        });
    }

    function rollback(res: Response, message: string) {
        db.run('ROLLBACK', () => {
            res.status(400).json({ error: message });
        });
    }
});

export default router;
