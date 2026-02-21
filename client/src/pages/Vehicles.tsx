// Vehicles managment page

import { useState } from "react";
import { useFleetStore, type Vehicle } from '../store/fleetStore';
import { DataTable } from '../components/DataTable';
import { StatusPill } from '../components/StatusPill';
import { FormInput } from '../components/FormInput';
import { Modal } from '../components/Modal';

export function Vehicles() {
    const { vehicles, addVehicle, updateVehicleStatus } = useFleetStore();
    const [isModalOpen, setModalOpen] = useState(false);
    const [newVehicle, setNewVehicle] = useState<Partial<Vehicle>>({
        type: 'VAN',
        region: 'North',
        odometer_km: 0
    });

    const columns = [
        { key: 'model', header: 'Model' },
        { key: 'license_plate', header: 'License Plate' },
        { key: 'type', header: 'Type' },
        { key: 'region', header: 'Region' },
        { key: 'capacity_kg', header: 'Capacity (kg)', render: (v: Vehicle) => v.capacity_kg.toLocaleString() },
        { key: 'odometer_km', header: 'Odometer (km)', render: (v: Vehicle) => v.odometer_km.toLocaleString() },
        { key: 'status', header: 'Status', render: (v: Vehicle) => <StatusPill status={v.status} /> },
        {
            key: 'actions',
            header: 'Actions',
            render: (v: Vehicle) => (
                <select
                    value={v.status}
                    onChange={(e) => updateVehicleStatus(v.id, e.target.value as any)}
                    style={{ width: 'auto', padding: '0.25rem', fontSize: '0.75rem', background: 'transparent' }}
                >
                    <option value="AVAILABLE">Available</option>
                    <option value="IN_SHOP">In Shop</option>
                    <option value="RETIRED">Retired</option>
                </select>
            )
        }
    ];

    const handleCreate = () => {
        if (newVehicle.model && newVehicle.license_plate && newVehicle.capacity_kg) {
            addVehicle(newVehicle as Omit<Vehicle, 'id' | 'status'>);
            setModalOpen(false);
            setNewVehicle({ type: 'VAN', region: 'North', odometer_km: 0 }); // Reset
        }
    };

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2>Vehicle Registry</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Manage your physical assets.</p>
                </div>
                <button className="btn-primary" onClick={() => setModalOpen(true)}>+ Add Vehicle</button>
            </div>

            <DataTable data={vehicles} columns={columns} />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                title="Add New Vehicle"
                footer={
                    <>
                        <button className="btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
                        <button className="btn-primary" onClick={handleCreate}>Save Vehicle</button>
                    </>
                }
            >
                <FormInput
                    label="Model"
                    placeholder="e.g. Ford Transit"
                    value={newVehicle.model || ''}
                    onChange={e => setNewVehicle({ ...newVehicle, model: e.target.value })}
                />
                <FormInput
                    label="License Plate"
                    placeholder="e.g. ABC-123"
                    value={newVehicle.license_plate || ''}
                    onChange={e => setNewVehicle({ ...newVehicle, license_plate: e.target.value })}
                />
                <FormInput
                    label="Capacity (kg)"
                    type="number"
                    value={newVehicle.capacity_kg || ''}
                    onChange={e => setNewVehicle({ ...newVehicle, capacity_kg: parseInt(e.target.value) })}
                />

                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Type</label>
                    <select
                        value={newVehicle.type}
                        onChange={e => setNewVehicle({ ...newVehicle, type: e.target.value as any })}
                    >
                        <option value="VAN">Van</option>
                        <option value="TRUCK">Truck</option>
                        <option value="BIKE">Bike</option>
                    </select>
                </div>
            </Modal>
        </div>
    );
}
