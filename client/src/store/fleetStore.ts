import { create } from 'zustand';
import { type StatusType } from '../components/StatusPill';

const API_BASE = 'http://localhost:3000/api';

// --- Type Definitions ---
export interface Vehicle {
    id: string;
    model: string;
    license_plate: string;
    type: 'TRUCK' | 'VAN' | 'BIKE';
    region: string;
    capacity_kg: number;
    odometer_km: number;
    acquisition_cost: number;
    status: StatusType;
}

export interface Driver {
    id: string;
    name: string;
    license_expiry: string;
    license_category: 'TRUCK' | 'VAN' | 'BIKE';
    safety_score: number;
    status: StatusType;
}

export interface Trip {
    id: string;
    vehicle_id: string;
    driver_id: string;
    cargo_weight: number;
    expected_revenue: number;
    origin: string;
    destination: string;
    status: StatusType;
}

export interface Log {
    id: string;
    vehicle_id: string;
    log_type: 'FUEL' | 'MAINTENANCE';
    cost: number;
    liters?: number;
    description?: string;
    date_logged: string;
}

interface AuthUser {
    id: string;
    email: string;
    role: string;
}

// --- Zustand Store Interface ---
interface FleetState {
    token: string | null;
    user: AuthUser | null;

    vehicles: Vehicle[];
    drivers: Driver[];
    trips: Trip[];
    logs: Log[];
    analytics: any;

    // App initialization
    initData: () => Promise<void>;

    // Actions
    setAuth: (token: string, user: AuthUser) => void;
    addVehicle: (v: Omit<Vehicle, 'id' | 'status'>) => Promise<void>;
    updateVehicleStatus: (id: string, status: StatusType) => Promise<void>;
    addDriver: (d: Omit<Driver, 'id' | 'status'>) => Promise<void>;
    dispatchTrip: (t: Omit<Trip, 'id' | 'status'>) => Promise<void>;
    completeTrip: (id: string, newOdometer: number) => Promise<void>;
    addLog: (l: Omit<Log, 'id'>) => Promise<void>;

    fetchAnalytics: () => Promise<void>;
}

export const useFleetStore = create<FleetState>((set, get) => {
    // Helper to fetch with auth token
    const authFetch = async (endpoint: string, options: RequestInit = {}) => {
        const { token } = get();
        const headers = {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        };

        const response = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.error || `API Error: ${response.status}`);
        }
        return response.json();
    };

    return {
        token: null,
        user: null,
        vehicles: [],
        drivers: [],
        trips: [],
        logs: [],
        analytics: null,

        setAuth: (token, user) => set({ token, user }),

        initData: async () => {
            try {
                const [vRes, dRes, tRes, lRes, aRes] = await Promise.all([
                    authFetch('/vehicles'),
                    authFetch('/drivers'),
                    authFetch('/trips'),
                    authFetch('/logs'),
                    authFetch('/analytics')
                ]);
                set({
                    vehicles: vRes.vehicles,
                    drivers: dRes.drivers,
                    trips: tRes.trips,
                    logs: lRes.logs,
                    analytics: aRes
                });
            } catch (e) {
                console.error("Failed to initialize data", e);
            }
        },

        addVehicle: async (vehicleData) => {
            await authFetch('/vehicles', { method: 'POST', body: JSON.stringify(vehicleData) });
            get().initData();
        },

        updateVehicleStatus: async (id, status) => {
            await authFetch(`/vehicles/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
            get().initData();
        },

        addDriver: async (driverData) => {
            await authFetch('/drivers', { method: 'POST', body: JSON.stringify(driverData) });
            get().initData();
        },

        dispatchTrip: async (tripData) => {
            await authFetch('/trips/dispatch', { method: 'POST', body: JSON.stringify(tripData) });
            get().initData();
        },

        completeTrip: async (id, newOdometer) => {
            await authFetch(`/trips/${id}/complete`, { method: 'POST', body: JSON.stringify({ new_odometer: newOdometer }) });
            get().initData();
        },

        addLog: async (logData) => {
            await authFetch('/logs', { method: 'POST', body: JSON.stringify(logData) });
            get().initData();
        },

        fetchAnalytics: async () => {
            try {
                const data = await authFetch('/analytics');
                set({ analytics: data });
            } catch (e) {
                console.error('Failed to fetch analytics', e);
            }
        }
    };
});
