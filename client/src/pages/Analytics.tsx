import { useFleetStore } from '../store/fleetStore';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export function Analytics() {
    const { vehicles, trips, logs } = useFleetStore();

    // 1. Calculate Fuel Efficiency for fleet
    const fuelLogs = logs.filter(l => l.log_type === 'FUEL' && l.liters);
    const totalLiters = fuelLogs.reduce((sum, log) => sum + (log.liters || 0), 0);
    const totalKm = vehicles.reduce((sum, v) => sum + v.odometer_km, 0);
    const fleetFuelEfficiency = totalLiters > 0 ? (totalKm / totalLiters).toFixed(2) : 0;

    // 2. Calculate Costs & Revenue
    const totalMaintenanceCost = logs
        .filter(l => l.log_type === 'MAINTENANCE')
        .reduce((sum, log) => sum + log.cost, 0);

    const totalFuelCost = fuelLogs.reduce((sum, log) => sum + log.cost, 0);

    // Revenue is generated from COMPLETED trips
    const totalRevenue = trips
        .filter(t => t.status === 'COMPLETED')
        .reduce((sum, t) => sum + (t.expected_revenue || 0), 0);

    // 3. Vehicle ROI Data for Chart
    const roiData = vehicles.map(v => {
        const vLogs = logs.filter(l => l.vehicle_id === v.id);
        const vMaintCost = vLogs.filter(l => l.log_type === 'MAINTENANCE').reduce((s, l) => s + l.cost, 0);
        const vFuelCost = vLogs.filter(l => l.log_type === 'FUEL').reduce((s, l) => s + l.cost, 0);
        const vRevenue = trips.filter(t => t.vehicle_id === v.id && t.status === 'COMPLETED').reduce((s, t) => s + (t.expected_revenue || 0), 0);

        // Formula from Spec: (Revenue - (Maintenance + Fuel)) / Acquisition Cost
        const netProfit = vRevenue - (vMaintCost + vFuelCost);
        const roi = v.acquisition_cost > 0 ? (netProfit / v.acquisition_cost) * 100 : 0;

        return {
            name: v.license_plate,
            roi: parseFloat(roi.toFixed(2)),
            profit: netProfit
        };
    });

    return (
        <div className="animate-fade-in">
            <h2>Operational Analytics</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                Financial performance and fleet efficiency metrics.
            </p>

            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>

                <div className="glass-panel">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase' }}>Fleet Fuel Efficiency</p>
                            <h3 style={{ fontSize: '2rem', margin: '0.5rem 0' }}>{fleetFuelEfficiency} <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>km/L</span></h3>
                        </div>
                        <div style={{ padding: '0.75rem', background: 'var(--success-bg)', borderRadius: '12px', color: 'var(--success)' }}>
                            <TrendingUp size={24} />
                        </div>
                    </div>
                </div>

                <div className="glass-panel">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase' }}>Total Revenue</p>
                            <h3 style={{ fontSize: '2rem', margin: '0.5rem 0' }}>₹{totalRevenue.toLocaleString()}</h3>
                        </div>
                        <div style={{ padding: '0.75rem', background: 'var(--success-bg)', borderRadius: '12px', color: 'var(--success)' }}>
                            <DollarSign size={24} />
                        </div>
                    </div>
                </div>

                <div className="glass-panel">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase' }}>Operating Costs</p>
                            <h3 style={{ fontSize: '2rem', margin: '0.5rem 0', color: 'var(--danger)' }}>₹{(totalMaintenanceCost + totalFuelCost).toLocaleString()}</h3>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>
                                Maint: ₹{totalMaintenanceCost.toLocaleString()} | Fuel: ₹{totalFuelCost.toLocaleString()}
                            </p>
                        </div>
                        <div style={{ padding: '0.75rem', background: 'var(--danger-bg)', borderRadius: '12px', color: 'var(--danger)' }}>
                            <TrendingDown size={24} />
                        </div>
                    </div>
                </div>

            </div>

            {/* Charts Section */}
            <div className="glass-panel" style={{ height: '400px', marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1.5rem' }}>Vehicle ROI (%)</h3>
                <ResponsiveContainer width="100%" height="80%">
                    <BarChart data={roiData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                        <XAxis dataKey="name" stroke="var(--text-secondary)" />
                        <YAxis stroke="var(--text-secondary)" />
                        <Tooltip
                            contentStyle={{ backgroundColor: 'var(--panel-bg)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                            itemStyle={{ color: 'var(--text-primary)' }}
                        />
                        <Bar dataKey="roi" fill="var(--accent-primary)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Financial Summary Table */}
            <div className="glass-panel">
                <h3 style={{ marginBottom: '1.5rem', textAlign: 'center', color: 'var(--accent-primary)' }}>Financial Summary of Month</h3>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'var(--danger)' }}>
                                <th style={{ padding: '1rem' }}>Month</th>
                                <th style={{ padding: '1rem' }}>Revenue</th>
                                <th style={{ padding: '1rem' }}>Fuel Cost</th>
                                <th style={{ padding: '1rem' }}>Maintenance</th>
                                <th style={{ padding: '1rem' }}>Net Profit</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: '1rem' }}>Jan</td>
                                <td style={{ padding: '1rem' }}>Rs. {totalRevenue.toLocaleString()}</td>
                                <td style={{ padding: '1rem' }}>Rs. {totalFuelCost.toLocaleString()}</td>
                                <td style={{ padding: '1rem' }}>Rs. {totalMaintenanceCost.toLocaleString()}</td>
                                <td style={{ padding: '1rem' }}>Rs. {(totalRevenue - (totalFuelCost + totalMaintenanceCost)).toLocaleString()}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}
