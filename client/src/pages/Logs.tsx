import { useState } from 'react';
import { useFleetStore, type Log } from '../store/fleetStore';
import { DataTable } from '../components/DataTable';
import { StatusPill } from '../components/StatusPill';
import { FormInput } from '../components/FormInput';
import { Modal } from '../components/Modal';

export function Logs() {
    const { logs, vehicles, addLog } = useFleetStore();
    const [isModalOpen, setModalOpen] = useState(false);
    const [newLog, setNewLog] = useState<Partial<Log>>({
        log_type: 'FUEL',
        date_logged: new Date().toISOString().split('T')[0]
    });

    const columns = [
        { key: 'date_logged', header: 'Date', render: (l: Log) => new Date(l.date_logged).toLocaleDateString() },
        { key: 'vehicle_id', header: 'Vehicle', render: (l: Log) => vehicles.find(v => v.id === l.vehicle_id)?.model || l.vehicle_id },
        { key: 'log_type', header: 'Type', render: (l: Log) => <StatusPill status={l.log_type === 'FUEL' ? 'COMPLETED' : 'IN_SHOP'} /> },
        { key: 'cost', header: 'Cost (₹)', render: (l: Log) => `₹${l.cost.toFixed(2)}` },
        { key: 'liters', header: 'Liters', render: (l: Log) => l.liters ? `${l.liters} L` : '-' },
        { key: 'description', header: 'Notes' },
    ];

    const handleSave = () => {
        if (newLog.vehicle_id && newLog.cost && newLog.log_type) {
            addLog({
                vehicle_id: newLog.vehicle_id,
                log_type: newLog.log_type,
                cost: Number(newLog.cost),
                liters: newLog.liters ? Number(newLog.liters) : undefined,
                description: newLog.description,
                date_logged: newLog.date_logged || new Date().toISOString()
            });
            setModalOpen(false);
            setNewLog({ log_type: 'FUEL', date_logged: new Date().toISOString().split('T')[0] });
        }
    };

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2>Expense & Maintenance Logs</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Track fleet health and operating costs.</p>
                </div>
                <button className="btn-primary" onClick={() => setModalOpen(true)}>+ Add Log</button>
            </div>

            <DataTable data={logs} columns={columns} />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                title="Record New Expense"
                footer={
                    <>
                        <button className="btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
                        <button className="btn-primary" onClick={handleSave}>Save Log</button>
                    </>
                }
            >
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Log Type</label>
                    <select
                        value={newLog.log_type}
                        onChange={e => setNewLog({ ...newLog, log_type: e.target.value as any })}
                    >
                        <option value="FUEL">Fuel</option>
                        <option value="MAINTENANCE">Maintenance / Repair</option>
                    </select>
                    {newLog.log_type === 'MAINTENANCE' && (
                        <p style={{ fontSize: '0.75rem', color: 'var(--warning)', marginTop: '0.5rem' }}>
                            Warning: Logging maintenance will automatically switch this vehicle's status to 'In Shop' and remove it from the Dispatcher.
                        </p>
                    )}
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Vehicle</label>
                    <select
                        value={newLog.vehicle_id || ''}
                        onChange={e => setNewLog({ ...newLog, vehicle_id: e.target.value })}
                    >
                        <option value="">-- Choose Vehicle --</option>
                        {vehicles.map(v => (
                            <option key={v.id} value={v.id}>{v.model} ({v.license_plate})</option>
                        ))}
                    </select>
                </div>

                <FormInput
                    label="Total Cost (₹)"
                    type="number"
                    value={newLog.cost || ''}
                    onChange={e => setNewLog({ ...newLog, cost: Number(e.target.value) })}
                />

                {newLog.log_type === 'FUEL' && (
                    <FormInput
                        label="Liters Filled"
                        type="number"
                        value={newLog.liters || ''}
                        onChange={e => setNewLog({ ...newLog, liters: Number(e.target.value) })}
                    />
                )}

                <FormInput
                    label="Description / Shop Notes"
                    value={newLog.description || ''}
                    onChange={e => setNewLog({ ...newLog, description: e.target.value })}
                />

                <FormInput
                    label="Date"
                    type="date"
                    value={newLog.date_logged || ''}
                    onChange={e => setNewLog({ ...newLog, date_logged: e.target.value })}
                />
            </Modal>
        </div>
    );
}
