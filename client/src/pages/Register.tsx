import { useState } from 'react';
import { Navigation, Lock, AlertCircle } from 'lucide-react';
import { FormInput } from '../components/FormInput';
import { useNavigate, Link } from 'react-router-dom';

export function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('MANAGER');
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');

        try {
            const res = await fetch('http://localhost:3000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, role })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            setSuccessMsg('Account created successfully! Redirecting to login...');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
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

                <h2 style={{ marginBottom: '0.5rem' }}>Create Account</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', textAlign: 'center' }}>
                    Join the FleetFlow Management Network.
                </p>

                {errorMsg && (
                    <div style={{ width: '100%', background: 'var(--danger-bg)', color: 'var(--danger)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                        <AlertCircle size={16} />
                        {errorMsg}
                    </div>
                )}

                {successMsg && (
                    <div style={{ width: '100%', background: 'var(--success-bg)', color: 'var(--success)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                        {successMsg}
                    </div>
                )}

                <form onSubmit={handleRegister} style={{ width: '100%' }}>
                    <FormInput
                        label="Email Address"
                        type="email"
                        placeholder="you@company.com"
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

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>System Role</label>
                        <select
                            value={role}
                            onChange={e => setRole(e.target.value)}
                            style={{ padding: '0.75rem' }}
                        >
                            <option value="MANAGER">Fleet Manager</option>
                            <option value="DISPATCHER">Dispatcher</option>
                            <option value="SAFETY_OFFICER">Safety Officer</option>
                            <option value="FINANCE">Finance Analyst</option>
                        </select>
                    </div>

                    <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem' }}>
                        Register Account
                    </button>

                    <div style={{ textAlign: 'center', fontSize: '0.875rem' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Already have an account? </span>
                        <Link to="/login" style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>Login here</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
