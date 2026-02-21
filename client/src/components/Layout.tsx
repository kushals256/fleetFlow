import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Truck, Users, Settings, LogOut, Navigation, Send, Activity, PieChart } from 'lucide-react';
import './Layout.css';

// We import the pages
import { Dashboard } from '../pages/Dashboard';
import { Vehicles } from '../pages/Vehicles';
import { Dispatch } from '../pages/Dispatch';
import { Logs } from '../pages/Logs';
import { Analytics } from '../pages/Analytics';
import { Drivers } from '../pages/Drivers';

export function Layout() {
    const location = useLocation();

    return (
        <div className="layout-container">
            {/* Sidebar Navigation */}
            <aside className="sidebar glass-panel">
                <div className="sidebar-brand">
                    <Navigation className="brand-icon" size={28} />
                    <h2>FleetFlow</h2>
                </div>

                <nav className="sidebar-nav">
                    <Link to="/dashboard" className={`nav-item ${location.pathname === '/dashboard' ? 'active' : ''}`}>
                        <LayoutDashboard size={20} />
                        <span>Command Center</span>
                    </Link>
                    <Link to="/dispatch" className={`nav-item ${location.pathname === '/dispatch' ? 'active' : ''}`}>
                        <Send size={20} />
                        <span>Dispatch</span>
                    </Link>
                    <Link to="/vehicles" className={`nav-item ${location.pathname === '/vehicles' ? 'active' : ''}`}>
                        <Truck size={20} />
                        <span>Vehicles</span>
                    </Link>
                    <Link to="/logs" className={`nav-item ${location.pathname === '/logs' ? 'active' : ''}`}>
                        <Activity size={20} />
                        <span>Maintenance & Logs</span>
                    </Link>
                    <Link to="/analytics" className={`nav-item ${location.pathname === '/analytics' ? 'active' : ''}`}>
                        <PieChart size={20} />
                        <span>Analytics</span>
                    </Link>

                    <Link to="/drivers" className={`nav-item ${location.pathname === '/drivers' ? 'active' : ''}`}>
                        <Users size={20} />
                        <span>Drivers</span>
                    </Link>
                    <a href="#" className="nav-item">
                        <Settings size={20} />
                        <span>Settings</span>
                    </a>
                </nav>

                <div className="sidebar-footer">
                    <Link to="/" className="nav-item logout-btn">
                        <LogOut size={20} />
                        <span>Logout</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="main-content">
                <header className="top-header">
                    <div className="header-info">
                        <span className="user-role-badge">MANAGER</span>
                        <span className="user-email">admin@fleetflow.com</span>
                    </div>
                </header>

                <div className="content-area animate-fade-in">
                    <Routes>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/dispatch" element={<Dispatch />} />
                        <Route path="/vehicles" element={<Vehicles />} />
                        <Route path="/logs" element={<Logs />} />
                        <Route path="/analytics" element={<Analytics />} />
                        <Route path="/drivers" element={<Drivers />} />
                        {/* Future placeholders */}
                        <Route path="*" element={<h2>🚧 Under Construction</h2>} />
                    </Routes>
                </div>
            </main>
        </div>
    );
}
