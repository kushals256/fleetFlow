import { useState } from "react";
import { useFleetStore, type Trip } from '../store/fleetStore';
import { DataTable } from '../components/DataTable';
import { StatusPill } from '../components/StatusPill';
import { FormInput } from '../components/FormInput';
import { Modal } from '../components/Modal';
import { AlertCircle, Wand2 } from 'lucide-react';

export function Dispatch() {
    const { vehicles, drivers, trips, dispatchTrip, completeTrip, addToast } = useFleetStore();
    const [isModalOpen, setModalOpen] = useState(false);

    // Complete Trip state
    const [isCompleteModalOpen, setCompleteModalOpen] = useState(false);
    const [selectedCompleteTrip, setSelectedCompleteTrip] = useState<Trip | null>(null);
    const [newOdometer, setNewOdometer] = useState<number | ''>('');

    const [errorText, setErrorText] = useState('');

    const [newTrip, setNewTrip] = useState<Partial<Trip>>({
        cargo_weight: 0,
        expected_revenue: 0,
        origin: '',
        destination: ''
    });

    // Only show AVAILABLE vehicles and ON_DUTY drivers in the dropdowns
    const availableVehicles = vehicles.filter(v => v.status === 'AVAILABLE');
    // Simple check for license expiry block (Mock date string comparison)
    const availableDrivers = drivers.filter(d =>
        d.status === 'ON_DUTY' || d.status === 'AVAILABLE'
    );

    const handleSmartMatch = () => {
        if (!newTrip.cargo_weight || newTrip.cargo_weight <= 0) {
            setErrorText('Please enter Cargo Weight first for Smart Match.');
            return;
        }

        // 1. Find smallest capable vehicle (to save fuel/space)
        const capableVehicles = availableVehicles
            .filter(v => v.capacity_kg >= (newTrip.cargo_weight || 0))
            .sort((a, b) => a.capacity_kg - b.capacity_kg);

        if (capableVehicles.length === 0) {
            setErrorText('No available vehicles can handle this cargo weight.');
            return;
        }
        const bestVehicle = capableVehicles[0];

        // 2. Find safest driver with matching license
        const capableDrivers = availableDrivers
            .filter(d => d.license_category === bestVehicle.type)
            .sort((a, b) => b.safety_score - a.safety_score); // Highest score first

        if (capableDrivers.length === 0) {
            setErrorText(`No available drivers with a ${bestVehicle.type} license found.`);
            return;
        }
        const bestDriver = capableDrivers[0];

        setNewTrip({
            ...newTrip,
            vehicle_id: bestVehicle.id,
            driver_id: bestDriver.id
        });

        setErrorText('');
        addToast(`Smart Match Found: ${bestVehicle.model} + ${bestDriver.name} (Safety: ${bestDriver.safety_score})`, 'info');
    };

    const handleDispatch = () => {
        setErrorText('');
        const { vehicle_id, driver_id, cargo_weight, expected_revenue, origin, destination } = newTrip;

        if (!vehicle_id || !driver_id || !cargo_weight || expected_revenue === undefined || !origin || !destination) {
            setErrorText('All fields are required.');
            return;
        }

        const selectedVehicle = vehicles.find(v => v.id === vehicle_id);
        const selectedDriver = drivers.find(d => d.id === driver_id);

        if (!selectedVehicle || !selectedDriver) return;

        // VALIDATION 1: Cargo vs Capacity
        if (cargo_weight > selectedVehicle.capacity_kg) {
            setErrorText(`Cargo weight (${cargo_weight}kg) exceeds vehicle capacity (${selectedVehicle.capacity_kg}kg).`);
            return;
        }

        // VALIDATION 2: License Types
        if (selectedVehicle.type !== selectedDriver.license_category) {
            setErrorText(`Driver license (${selectedDriver.license_category}) does not match vehicle type (${selectedVehicle.type}).`);
            return;
        }

        // Success
        dispatchTrip(newTrip as Omit<Trip, 'id' | 'status'>);
        setModalOpen(false);
        setNewTrip({ cargo_weight: 0, expected_revenue: 0, origin: '', destination: '' });
    };

    const handleComplete = async () => {
        if (!selectedCompleteTrip) return;
        if (newOdometer === '' || newOdometer < 0) {
            setErrorText('Please enter a valid ending odometer reading.');
            return;
        }

        setErrorText('');
        await completeTrip(selectedCompleteTrip.id, Number(newOdometer));
        setCompleteModalOpen(false);
        setSelectedCompleteTrip(null);
        setNewOdometer('');
    };

    const columns = [
        { key: 'id', header: 'Trip ID' },
        { key: 'vehicle_id', header: 'Vehicle ID' },
        { key: 'driver_id', header: 'Driver ID' },
        { key: 'cargo_weight', header: 'Cargo (kg)' },
        { key: 'origin', header: 'Origin' },
        { key: 'destination', header: 'Destination' },
        { key: 'status', header: 'Status', render: (t: Trip) => <StatusPill status={t.status} /> },
        {
            key: 'actions',
            header: '',
            render: (t: Trip) => t.status === 'DISPATCHED' ? (
                <button
                    className="btn-secondary"
                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                    onClick={() => {
                        setSelectedCompleteTrip(t);
                        setCompleteModalOpen(true);
                        setErrorText('');
                    }}
                >
                    Complete
                </button>
            ) : null
        }
    ];

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2>Dispatch Workflow</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Assign drivers and vehicles to incoming cargo.</p>
                </div>
                <button className="btn-primary" onClick={() => setModalOpen(true)}>Create Dispatch</button>
            </div>

            <DataTable data={trips} columns={columns} />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                title="Create New Dispatch"
                footer={
                    <>
                        <button className="btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
                        <button className="btn-primary" onClick={handleDispatch}>Dispatch Trip</button>
                    </>
                }
            >
                {errorText && (
                    <div style={{ background: 'var(--danger-bg)', color: 'var(--danger)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <AlertCircle size={18} />
                        <span style={{ fontSize: '0.875rem' }}>{errorText}</span>
                    </div>
                )}

                <FormInput
                    label="Cargo Weight (kg)"
                    type="number"
                    value={newTrip.cargo_weight || ''}
                    onChange={e => setNewTrip({ ...newTrip, cargo_weight: parseInt(e.target.value) })}
                />

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                    <button
                        type="button"
                        onClick={handleSmartMatch}
                        style={{
                            background: 'var(--accent-secondary)',
                            color: 'white',
                            border: 'none',
                            padding: '0.4rem 0.8rem',
                            borderRadius: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                            boxShadow: '0 0 10px rgba(14, 165, 233, 0.4)'
                        }}
                    >
                        <Wand2 size={14} /> Smart Match Assets
                    </button>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Select Vehicle</label>
                    <select
                        value={newTrip.vehicle_id || ''}
                        onChange={e => setNewTrip({ ...newTrip, vehicle_id: e.target.value })}
                    >
                        <option value="">-- Choose Available Vehicle --</option>
                        {availableVehicles.map(v => (
                            <option key={v.id} value={v.id}>{v.model} ({v.type}) - Max: {v.capacity_kg}kg</option>
                        ))}
                    </select>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Select Driver</label>
                    <select
                        value={newTrip.driver_id || ''}
                        onChange={e => setNewTrip({ ...newTrip, driver_id: e.target.value })}
                    >
                        <option value="">-- Choose Available Driver --</option>
                        {availableDrivers.map(d => (
                            <option key={d.id} value={d.id}>{d.name} (License: {d.license_category})</option>
                        ))}
                    </select>
                </div>

                <FormInput
                    label="Origin"
                    value={newTrip.origin || ''}
                    onChange={e => setNewTrip({ ...newTrip, origin: e.target.value })}
                />

                <FormInput
                    label="Destination"
                    value={newTrip.destination || ''}
                    onChange={e => setNewTrip({ ...newTrip, destination: e.target.value })}
                />

                <FormInput
                    label="Expected Revenue (₹)"
                    type="number"
                    value={newTrip.expected_revenue || ''}
                    onChange={e => setNewTrip({ ...newTrip, expected_revenue: parseInt(e.target.value) })}
                />
            </Modal>

            <Modal
                isOpen={isCompleteModalOpen}
                onClose={() => {
                    setCompleteModalOpen(false);
                    setSelectedCompleteTrip(null);
                    setNewOdometer('');
                    setErrorText('');
                }}
                title={`Mark Trip ${selectedCompleteTrip?.id.substring(0, 8)}... as Complete`}
                footer={
                    <>
                        <button className="btn-secondary" onClick={() => {
                            setCompleteModalOpen(false);
                            setNewOdometer('');
                            setErrorText('');
                        }}>Cancel</button>
                        <button className="btn-primary" onClick={handleComplete}>Confirm Completion</button>
                    </>
                }
            >
                {errorText && (
                    <div style={{ background: 'var(--danger-bg)', color: 'var(--danger)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <AlertCircle size={18} />
                        <span style={{ fontSize: '0.875rem' }}>{errorText}</span>
                    </div>
                )}

                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                    Please enter the vehicle's final odometer reading upon returning to the depot.
                    This will automatically mark the vehicle and driver as AVAILABLE and record the trip as COMPLETED.
                </p>

                <FormInput
                    label="Final Odometer Reading (km)"
                    type="number"
                    value={newOdometer || ''}
                    onChange={e => setNewOdometer(Math.max(0, parseInt(e.target.value)))}
                />
            </Modal>
        </div>
    );
}
