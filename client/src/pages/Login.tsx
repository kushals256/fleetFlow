import { useState } from 'react';
import { Navigation, Lock, AlertCircle } from 'lucide-react';
import { FormInput } from '../components/FormInput';
import { useNavigate, Link } from 'react-router-dom';
import { useFleetStore } from '../store/fleetStore';

export function Login() {
    const [email, setEmail] = useState('admin@fleetflow.com'); // Autofill the seeded admin
    const [password, setPassword] = useState('password123');
    const [errorMsg, setErrorMsg] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');

        try {
            // 1. Authenticate with real backend
            const res = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Authentication failed');
            }

            // 2. Set token and User Profile in Global Store
            const store = useFleetStore.getState();
            store.setAuth(data.token, data.user);

            // 3. Fire the massive concurrent fetch for all core dashboard data
            await store.initData();

            // 4. Enter App
            navigate('/dashboard');
        } catch (err: any) {
            setErrorMsg(err.message);
        }
    };

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            background: 'var(--bg-primary)'
        }}>

            <div className="glass-panel animate-fade-in" style={{
                width: '100%',
                maxWidth: '400px',
                padding: '2.5rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>

                <div style={{
                    background: 'var(--accent-primary)',
                    padding: '1rem',
                    borderRadius: '16px',
                    marginBottom: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                }}>
                    <Navigation size={32} />
                </div>

                <h2 style={{ marginBottom: '0.5rem' }}>Access FleetFlow</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', textAlign: 'center' }}>
                    Secure fleet & logistics management hub.
                </p>

                {errorMsg && (
                    <div style={{ width: '100%', background: 'var(--danger-bg)', color: 'var(--danger)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                        <AlertCircle size={16} />
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={handleLogin} style={{ width: '100%' }}>
                    <FormInput
                        label="Email Address"
                        type="email"
                        placeholder="admin@fleetflow.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <FormInput
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        icon={<Lock size={18} />}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
                        <a href="#" style={{ fontSize: '0.875rem', color: 'var(--accent-primary)', textDecoration: 'none' }}>Forgot Password?</a>
                    </div>

                    <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.75rem' }}>
                        Login to Dashboard
                    </button>

                    <div style={{ textAlign: 'center', fontSize: '0.875rem', marginTop: '1.5rem' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Don't have an account? </span>
                        <Link to="/register" style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>Register here</Link>
                    </div>
                </form>

                <div style={{ marginTop: '2rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    System Version 1.0.0 (API Integrated)
                </div>
            </div>
        </div>
    );
}
