// Home page and analytics
import { useFleetStore } from '../store/fleetStore';
import { Truck, AlertCircle, CheckCircle, Package } from 'lucide-react';

export function Dashboard() {
    const { vehicles, trips } = useFleetStore();

    // Calculate KPIs
    const activeFleetCount = vehicles.filter(v => v.status === 'ON_TRIP').length;
    const inShopCount = vehicles.filter(v => v.status === 'IN_SHOP').length;
    const totalVehicles = vehicles.length;

    // Guard against divide by zero if no vehicles exist
    const utilizationRate = totalVehicles > 0
        ? Math.round((activeFleetCount / totalVehicles) * 100)
        : 0;

    // Pending cargo is simply trips that haven't 'COMPLETED' yet in this mock
    const pendingCargoCount = trips.filter(t => t.status === 'DISPATCHED' || t.status === 'DRAFT').length;

    return (
        <div className="animate-fade-in">
            <h2>Command Center</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                Real-time overview of fleet operations.
            </p>

            {/* KPI Cards Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2rem'
            }}>

                <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ padding: '1rem', background: 'var(--info-bg)', borderRadius: '12px', color: 'var(--info)' }}>
                        <Truck size={32} />
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase' }}>Active Fleet</p>
                        <h3 style={{ fontSize: '2rem', margin: 0 }}>{activeFleetCount}</h3>
                    </div>
                </div>

                <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ padding: '1rem', background: 'var(--warning-bg)', borderRadius: '12px', color: 'var(--warning)' }}>
                        <AlertCircle size={32} />
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase' }}>In Shop</p>
                        <h3 style={{ fontSize: '2rem', margin: 0 }}>{inShopCount}</h3>
                    </div>
                </div>

                <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ padding: '1rem', background: 'var(--success-bg)', borderRadius: '12px', color: 'var(--success)' }}>
                        <CheckCircle size={32} />
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase' }}>Utilization Rate</p>
                        <h3 style={{ fontSize: '2rem', margin: 0 }}>{utilizationRate}%</h3>
                    </div>
                </div>

                <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ padding: '1rem', background: 'var(--accent-bg, rgba(59, 130, 246, 0.15))', borderRadius: '12px', color: 'var(--accent-primary)' }}>
                        <Package size={32} />
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase' }}>Pending Cargo</p>
                        <h3 style={{ fontSize: '2rem', margin: 0 }}>{pendingCargoCount}</h3>
                    </div>
                </div>

            </div>

            <div className="glass-panel">
                <h3>Recent Activity</h3>
                <p style={{ color: 'var(--text-muted)' }}>Live feed placeholder...</p>
            </div>
        </div>
    );
}
