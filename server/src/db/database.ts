import sqlite3 from 'sqlite3';
import path from 'path';

const dbPath = path.resolve(__dirname, '../../fleetflow.sqlite');

export const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        initializeDatabase();
    }
});

function initializeDatabase() {
    db.serialize(() => {
        // 1. Users Table (for Authentication & RBAC)
        db.run(`CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('MANAGER', 'DISPATCHER', 'SAFETY_OFFICER', 'FINANCE'))
    )`);

        // 2. Vehicles Table
        db.run(`CREATE TABLE IF NOT EXISTS vehicles (
      id TEXT PRIMARY KEY,
      model TEXT NOT NULL,
      license_plate TEXT UNIQUE NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('TRUCK', 'VAN', 'BIKE')),
      region TEXT NOT NULL,
      capacity_kg INTEGER NOT NULL,
      odometer_km INTEGER NOT NULL DEFAULT 0,
      acquisition_cost REAL NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'AVAILABLE' CHECK(status IN ('AVAILABLE', 'ON_TRIP', 'IN_SHOP', 'RETIRED'))
    )`);

        // 3. Drivers Table
        db.run(`CREATE TABLE IF NOT EXISTS drivers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      license_expiry TEXT NOT NULL,
      license_category TEXT NOT NULL CHECK(license_category IN ('TRUCK', 'VAN', 'BIKE')),
      safety_score INTEGER NOT NULL DEFAULT 100,
      status TEXT NOT NULL DEFAULT 'AVAILABLE' CHECK(status IN ('AVAILABLE', 'ON_DUTY', 'ON_TRIP', 'SUSPENDED'))
    )`);

        // 4. Trips Table
        db.run(`CREATE TABLE IF NOT EXISTS trips (
      id TEXT PRIMARY KEY,
      vehicle_id TEXT NOT NULL,
      driver_id TEXT NOT NULL,
      cargo_weight INTEGER NOT NULL,
      expected_revenue REAL NOT NULL,
      origin TEXT NOT NULL,
      destination TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'DRAFT' CHECK(status IN ('DRAFT', 'DISPATCHED', 'COMPLETED', 'CANCELLED')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (vehicle_id) REFERENCES vehicles(id),
      FOREIGN KEY (driver_id) REFERENCES drivers(id)
    )`);

        // 5. Logs Table
        db.run(`CREATE TABLE IF NOT EXISTS logs (
      id TEXT PRIMARY KEY,
      vehicle_id TEXT NOT NULL,
      log_type TEXT NOT NULL CHECK(log_type IN ('FUEL', 'MAINTENANCE')),
      cost REAL NOT NULL,
      liters REAL,
      description TEXT,
      date_logged DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
    )`);

        console.log('Database schema initialized.');
    });
}
