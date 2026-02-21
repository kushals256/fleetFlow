import { db } from './database';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

async function seedDatabase() {
    console.log('Seeding database...');

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);
    const adminId = `user-${uuidv4()}`;

    db.serialize(() => {
        // 1. Insert Default Admin User
        db.run(
            `INSERT OR IGNORE INTO users (id, email, password_hash, role) VALUES (?, ?, ?, ?)`,
            [adminId, 'admin@fleetflow.com', passwordHash, 'MANAGER']
        );

        // 2. Insert Mock Vehicles
        const v1 = `v-${uuidv4()}`;
        const v2 = `v-${uuidv4()}`;
        const v3 = `v-${uuidv4()}`;

        db.run(`INSERT OR IGNORE INTO vehicles (id, model, license_plate, type, region, capacity_kg, odometer_km, acquisition_cost, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [v1, 'Ford Transit 250', 'ABC-1234', 'VAN', 'North', 1500, 45000, 35000, 'AVAILABLE']);
        db.run(`INSERT OR IGNORE INTO vehicles (id, model, license_plate, type, region, capacity_kg, odometer_km, acquisition_cost, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [v2, 'Chevy Express', 'XYZ-9876', 'VAN', 'South', 1200, 80000, 28000, 'IN_SHOP']);
        db.run(`INSERT OR IGNORE INTO vehicles (id, model, license_plate, type, region, capacity_kg, odometer_km, acquisition_cost, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [v3, 'Mack Anthem', 'TRK-5555', 'TRUCK', 'North', 15000, 125000, 150000, 'ON_TRIP']);

        // 3. Insert Mock Drivers
        const d1 = `d-${uuidv4()}`;
        const d2 = `d-${uuidv4()}`;

        db.run(`INSERT OR IGNORE INTO drivers (id, name, license_expiry, license_category, safety_score, status) VALUES (?, ?, ?, ?, ?, ?)`,
            [d1, 'Alex Johnson', '2027-05-12', 'VAN', 98, 'AVAILABLE']);
        db.run(`INSERT OR IGNORE INTO drivers (id, name, license_expiry, license_category, safety_score, status) VALUES (?, ?, ?, ?, ?, ?)`,
            [d2, 'Sarah Smith', '2026-10-15', 'TRUCK', 100, 'ON_TRIP']);

        console.log('Seed complete! Login with admin@fleetflow.com / password123');
    });
}

// Give DB a second to initialize tables before seeding
setTimeout(seedDatabase, 1000);
