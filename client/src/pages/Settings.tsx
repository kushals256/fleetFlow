import { useFleetStore } from '../store/fleetStore';
import { User, Shield, Server, Bell, Key } from 'lucide-react';
import { FormInput } from '../components/FormInput';
import { useState } from 'react';

export function Settings() {
    const { user, addToast } = useFleetStore();
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        addToast('Settings updated successfully.', 'success');
    };

    return (
        <div className="animate-fade-in" style={{ maxWidth: '800px' }}>
            <h2>System Settings</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                Manage your account preferences and system configurations.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 1fr) 2fr', gap: '2rem' }}>
                {/* Left Column: Quick Profile */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="glass-panel" style={{ textAlign: 'center', padding: '2rem' }}>
                        <div style={{
                            width: '80px', height: '80px',
                            background: 'var(--accent-primary)',
                            borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 1rem', color: 'white'
                        }}>
                            <User size={40} />
                        </div>
                        <h3>{user?.email || 'admin@fleetflow.com'}</h3>
                        <p style={{ color: 'var(--accent-secondary)', fontWeight: 600, fontSize: '0.875rem' }}>
                            <Shield size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                            {user?.role || 'SYSTEM ADMIN'}
                        </p>
                    </div>

                    <div className="glass-panel">
                        <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                            <Server size={18} /> System Status
                        </h4>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>API Connection</span>
                            <span style={{ color: 'var(--success)' }}>Online</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>Database</span>
                            <span style={{ color: 'var(--success)' }}>Connected</span>
                        </div>
                    </div>
                </div>

                {/* Right Column: Settings Form */}
                <div className="glass-panel">
                    <h3 style={{ marginBottom: '1.5rem' }}>Account Preferences</h3>
                    <form onSubmit={handleSave}>
                        <FormInput
                            label="Email Address"
                            type="email"
                            defaultValue={user?.email || 'admin@fleetflow.com'}
                            disabled
                        />
                        <FormInput
                            label="New Password"
                            type="password"
                            placeholder="••••••••"
                        />
                        <FormInput
                            label="Confirm Password"
                            type="password"
                            placeholder="••••••••"
                        />

                        <div style={{ margin: '2rem 0', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem' }}>
                            <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                <Bell size={18} /> Notifications
                            </h4>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={notificationsEnabled}
                                    onChange={(e) => setNotificationsEnabled(e.target.checked)}
                                    style={{ width: '1.2rem', height: '1.2rem', accentColor: 'var(--accent-primary)' }}
                                />
                                <div>
                                    <div style={{ fontWeight: 500 }}>System Alerts</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Receive toast notifications for system events and warnings.</div>
                                </div>
                            </label>
                        </div>

                        <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Key size={18} /> Save Changes
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
