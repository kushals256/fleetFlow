import { useState } from 'react';
import { useFleetStore, type Driver } from '../store/fleetStore';
import { DataTable } from '../components/DataTable';
import { StatusPill } from '../components/StatusPill';
import { FormInput } from '../components/FormInput';
import { Modal } from '../components/Modal';

export function Drivers() {
    const { drivers, addDriver } = useFleetStore();
    const [isModalOpen, setModalOpen] = useState(false);
    const [newDriver, setNewDriver] = useState<Partial<Driver>>({
        license_category: 'VAN'
    });

    const columns = [
        { key: 'name', header: 'Name' },
        { key: 'license_category', header: 'License Type' },
        { key: 'license_expiry', header: 'Expiry Date', render: (d: Driver) => new Date(d.license_expiry).toLocaleDateString() },
        {
            key: 'safety_score', header: 'Safety Score', render: (d: Driver) => (
                <span style={{ color: d.safety_score >= 90 ? 'var(--success)' : (d.safety_score > 75 ? 'var(--warning)' : 'var(--danger)') }}>
                    {d.safety_score}%
                </span>
            )
        },
        { key: 'status', header: 'Duty Status', render: (d: Driver) => <StatusPill status={d.status} /> },
    ];

    const handleSave = () => {
        if (newDriver.name && newDriver.license_expiry && newDriver.license_category) {
            addDriver({
                name: newDriver.name,
                license_expiry: newDriver.license_expiry,
                license_category: newDriver.license_category as any,
                safety_score: 100 // Default for new drivers
            });
            setModalOpen(false);
            setNewDriver({ license_category: 'VAN' });
        }
    };

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2>Driver Performance & Safety Profiles</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Manage personnel, licenses, and safety metrics.</p>
                </div>
                <button className="btn-primary" onClick={() => setModalOpen(true)}>+ Onboard Driver</button>
            </div>

            <DataTable data={drivers} columns={columns} />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                title="Onboard New Driver"
                footer={
                    <>
                        <button className="btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
                        <button className="btn-primary" onClick={handleSave}>Save Driver</button>
                    </>
                }
            >
                <FormInput
                    label="Full Name"
                    value={newDriver.name || ''}
                    onChange={e => setNewDriver({ ...newDriver, name: e.target.value })}
                />

                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>License Category</label>
                    <select
                        value={newDriver.license_category}
                        onChange={e => setNewDriver({ ...newDriver, license_category: e.target.value as any })}
                    >
                        <option value="VAN">Light Commercial (VAN)</option>
                        <option value="TRUCK">Heavy Duty (TRUCK)</option>
                        <option value="BIKE">Courier (BIKE)</option>
                    </select>
                </div>

                <FormInput
                    label="License Expiry Date"
                    type="date"
                    value={newDriver.license_expiry || ''}
                    onChange={e => setNewDriver({ ...newDriver, license_expiry: e.target.value })}
                />
            </Modal>
        </div>
    );
}
