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

export interface ToastMessage {
    id: string;
    type: 'success' | 'error' | 'info';
    message: string;
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
    toasts: ToastMessage[];

    vehicles: Vehicle[];
    drivers: Driver[];
    trips: Trip[];
    logs: Log[];
    analytics: any;

    // App initialization
    initData: () => Promise<void>;

    // Toasts
    addToast: (message: string, type: 'success' | 'error' | 'info') => void;
    removeToast: (id: string) => void;

    // Actions
    setAuth: (token: string | null, user: AuthUser | null) => void;
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
        const { token, addToast } = get();
        const headers = {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        };

        const response = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            const errorMsg = errData.error || `API Error: ${response.status}`;
            addToast(errorMsg, 'error');

            if (response.status === 401 || response.status === 403) {
                get().setAuth(null, null);
                window.location.href = '/login';
            }

            throw new Error(errorMsg);
        }
        return response.json();
    };

    return {
        token: localStorage.getItem('fleet_token') || null,
        user: JSON.parse(localStorage.getItem('fleet_user') || 'null'),
        toasts: [],
        vehicles: [],
        drivers: [],
        trips: [],
        logs: [],
        analytics: null,

        setAuth: (token, user) => {
            if (token && user) {
                localStorage.setItem('fleet_token', token);
                localStorage.setItem('fleet_user', JSON.stringify(user));
            } else {
                localStorage.removeItem('fleet_token');
                localStorage.removeItem('fleet_user');
            }
            set({ token, user });
        },

        addToast: (message, type) => {
            const id = Math.random().toString(36).substring(2, 9);
            set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
            setTimeout(() => {
                get().removeToast(id);
            }, 3500);
        },

        removeToast: (id) => {
            set((state) => ({ toasts: state.toasts.filter(t => t.id !== id) }));
        },

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
            get().addToast('Vehicle successfully added to registry.', 'success');
            get().initData();
        },

        updateVehicleStatus: async (id, status) => {
            await authFetch(`/vehicles/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
            get().addToast(`Vehicle status updated to ${status.replace('_', ' ')}.`, 'success');
            get().initData();
        },

        addDriver: async (driverData) => {
            await authFetch('/drivers', { method: 'POST', body: JSON.stringify(driverData) });
            get().addToast('Driver successfully onboarded.', 'success');
            get().initData();
        },

        dispatchTrip: async (tripData) => {
            await authFetch('/trips/dispatch', { method: 'POST', body: JSON.stringify(tripData) });
            get().addToast('Trip dispatched successfully!', 'success');
            get().initData();
        },

        completeTrip: async (id, newOdometer) => {
            await authFetch(`/trips/${id}/complete`, { method: 'POST', body: JSON.stringify({ new_odometer: newOdometer }) });
            get().addToast('Trip completed. Odometer updated.', 'success');
            get().initData();
        },

        addLog: async (logData) => {
            await authFetch('/logs', { method: 'POST', body: JSON.stringify(logData) });
            get().addToast(`${logData.log_type} log created successfully.`, 'success');
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
