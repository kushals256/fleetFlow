import { Router, Request, Response } from 'express';
import { db } from '../db/database';
import { v4 as uuidv4 } from 'uuid';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

// GET /api/trips - List all trips
router.get('/', authenticateToken, (req: Request, res: Response) => {
    db.all('SELECT * FROM trips', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ trips: rows });
    });
});

// POST /api/trips/dispatch - Complex Transaction Logc
router.post('/dispatch', authenticateToken, requireRole(['MANAGER', 'DISPATCHER']), (req: Request, res: Response) => {
    const { vehicle_id, driver_id, cargo_weight, expected_revenue, origin, destination } = req.body;

    if (!vehicle_id || !driver_id || !cargo_weight || !origin || !destination) {
        return res.status(400).json({ error: 'Missing required trip fields' });
    }

    // 1. Transaction Start
    db.serialize(() => {
        db.run('BEGIN TRANSACTION');

        // 2. Validate Vehicle Capacity & Status
        db.get('SELECT * FROM vehicles WHERE id = ? AND status = "AVAILABLE"', [vehicle_id], (err, vehicle: any) => {
            if (err) return rollback(res, 'Database error during vehicle check');
            if (!vehicle) return rollback(res, 'Vehicle not found or not available');
            if (cargo_weight > vehicle.capacity_kg) return rollback(res, `Cargo exceeds vehicle capacity (${vehicle.capacity_kg}kg)`);

            // 3. Validate Driver Match & Status
            db.get('SELECT * FROM drivers WHERE id = ? AND status = "AVAILABLE"', [driver_id], (err, driver: any) => {
                if (err) return rollback(res, 'Database error during driver check');
                if (!driver) return rollback(res, 'Driver not found or not available');
                if (driver.license_category !== vehicle.type) return rollback(res, 'Driver license category does not match vehicle type');

                // 4. Create Trip and Update Statuses Atomically
                const tripId = `t-${uuidv4()}`;

                db.run(`INSERT INTO trips (id, vehicle_id, driver_id, cargo_weight, expected_revenue, origin, destination, status) VALUES (?, ?, ?, ?, ?, ?, ?, 'DISPATCHED')`,
                    [tripId, vehicle_id, driver_id, cargo_weight, expected_revenue || 0, origin, destination],
                    function (err) {
                        if (err) return rollback(res, 'Failed to create trip record');

                        db.run('UPDATE vehicles SET status = "ON_TRIP" WHERE id = ?', [vehicle_id], (err) => {
                            if (err) return rollback(res, 'Failed to update vehicle status');

                            db.run('UPDATE drivers SET status = "ON_TRIP" WHERE id = ?', [driver_id], (err) => {
                                if (err) return rollback(res, 'Failed to update driver status');

                                db.run('COMMIT', (err) => {
                                    if (err) return rollback(res, 'Transaction commit failed');
                                    res.status(201).json({ message: 'Trip dispatched successfully', tripId });
                                });
                            });
                        });
                    }
                );
            });
        });
    });

    function rollback(res: Response, message: string) {
        db.run('ROLLBACK', () => {
            res.status(400).json({ error: message });
        });
    }
});

// POST /api/trips/:id/complete
router.post('/:id/complete', authenticateToken, requireRole(['MANAGER', 'DISPATCHER']), (req: Request, res: Response) => {
    const tripId = req.params.id;
    const { new_odometer } = req.body;

    db.serialize(() => {
        db.run('BEGIN TRANSACTION');
        db.get('SELECT * FROM trips WHERE id = ? AND status = "DISPATCHED"', [tripId], (err, trip: any) => {
            if (err || !trip) return rollback(res, 'Trip not found or not in DISPATCHED state');

            db.run('UPDATE trips SET status = "COMPLETED" WHERE id = ?', [tripId]);
            db.run('UPDATE vehicles SET status = "AVAILABLE", odometer_km = ? WHERE id = ?', [new_odometer, trip.vehicle_id]);
            db.run('UPDATE drivers SET status = "AVAILABLE" WHERE id = ?', [trip.driver_id]);

            db.run('COMMIT', (err) => {
                if (err) return rollback(res, 'Failed to complete trip');
                res.json({ message: 'Trip completed successfully' });
            });
        });
    });

    function rollback(res: Response, message: string) {
        db.run('ROLLBACK', () => res.status(400).json({ error: message }));
    }
});

export default router;
