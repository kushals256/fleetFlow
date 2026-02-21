import { Router, Request, Response } from 'express';
import { db } from '../db/database';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

// GET /api/analytics
router.get('/', authenticateToken, requireRole(['MANAGER', 'FINANCE']), (req: Request, res: Response) => {
    // We need to calculate Fleet Fuel Efficiency, Operating Costs, Total Revenue, and ROI.

    db.serialize(() => {
        let fleetFuelEfficiency = 0;
        let totalRevenue = 0;
        let operatingCosts = 0;
        const roiData: any[] = [];

        // 1. Total Liters and Km for Fleet Fuel Efficiency
        db.get(`
      SELECT SUM(liters) as totalLiters FROM logs WHERE log_type = 'FUEL' AND liters IS NOT NULL
    `, (err, fuelResult: any) => {
            if (err) return res.status(500).json({ error: 'DB Error connecting fuel logs' });

            db.get(`SELECT SUM(odometer_km) as totalKm FROM vehicles`, (err, vehicleResult: any) => {
                const totalLiters = fuelResult?.totalLiters || 0;
                const totalKm = vehicleResult?.totalKm || 0;
                fleetFuelEfficiency = totalLiters > 0 ? parseFloat((totalKm / totalLiters).toFixed(2)) : 0;

                // 2. Revenue and Operating Costs
                db.get(`SELECT SUM(expected_revenue) as rev FROM trips WHERE status = 'COMPLETED'`, (err, revRes: any) => {
                    totalRevenue = revRes?.rev || 0;

                    db.get(`SELECT SUM(cost) as costs FROM logs`, (err, costRes: any) => {
                        operatingCosts = costRes?.costs || 0;

                        // 3. Vehicle-specific ROI
                        db.all(`
                  SELECT 
                    v.id, v.license_plate, v.acquisition_cost,
                    IFNULL(SUM(CASE WHEN t.status = 'COMPLETED' THEN t.expected_revenue ELSE 0 END), 0) as vehicleRevenue,
                    IFNULL((SELECT SUM(cost) FROM logs WHERE vehicle_id = v.id), 0) as vehicleCost
                  FROM vehicles v
                  LEFT JOIN trips t ON v.id = t.vehicle_id
                  GROUP BY v.id
               `, (err, vehiclesRes: any[]) => {
                            if (vehiclesRes) {
                                vehiclesRes.forEach(vData => {
                                    const netProfit = vData.vehicleRevenue - vData.vehicleCost;
                                    const roi = vData.acquisition_cost > 0 ? (netProfit / vData.acquisition_cost) * 100 : 0;
                                    roiData.push({
                                        name: vData.license_plate,
                                        roi: parseFloat(roi.toFixed(2)),
                                        profit: netProfit
                                    });
                                });
                            }

                            // Send final aggregations
                            res.json({
                                fleetFuelEfficiency,
                                totalRevenue,
                                operatingCosts,
                                roiData
                            });
                        });
                    });
                });
            });
        });
    });
});

export default router;
