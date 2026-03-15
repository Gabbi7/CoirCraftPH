import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, Store, BarChart2, LogOut, ExternalLink, Tags, User, ClipboardList } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import Footer from './Footer.jsx';

const navItems = [
    { to: '/seller', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/seller/inventory', icon: Package, label: 'Inventory' },
    { to: '/seller/storefront', icon: Store, label: 'Storefront' },
    { to: '/seller/reports', icon: BarChart2, label: 'Reports' },
    { to: '/seller/profile', icon: User, label: 'My Profile' },
    { to: '/seller/store', icon: ExternalLink, label: 'Store' },
];

export default function SellerLayout() {
    const { user, signOut } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleSignOut = () => {
        signOut();
        navigate('/');
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f5ece0' }}>
            {/* Sidebar */}
            <aside style={{
                width: '240px',
                background: '#1f3a0f',
                display: 'flex', flexDirection: 'column',
                flexShrink: 0,
                position: 'sticky', top: 0, height: '100vh', overflowY: 'hidden'
            }}>
                {/* Logo */}
                <div style={{ padding: '20px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src="/images/logo-green.png" alt="CoirCraft PH Logo" style={{ height: '28px', width: 'auto', borderRadius: '4px', flexShrink: 0 }} />
                    <span style={{ fontFamily: 'Playfair Display, Georgia, serif', fontWeight: 700, color: 'white', fontSize: '16px', whiteSpace: 'nowrap' }}>
                        CoirCraft <span style={{ color: '#D4A843' }}>PH</span>
                    </span>
                </div>

                {/* Seller badge */}
                <div style={{ padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ background: 'rgba(212,168,67,0.2)', borderRadius: '8px', padding: '8px 12px' }}>
                        <div style={{ color: '#D4A843', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Seller Panel</div>
                        <div style={{ color: 'white', fontSize: '13px', fontWeight: 600, marginTop: '2px' }}>{user?.name}</div>
                    </div>
                </div>

                {/* Nav items */}
                <nav style={{ flex: 1, padding: '12px 8px' }}>
                    {navItems.map(({ to, icon: Icon, label }) => {
                        const active = location.pathname === to || (to !== '/' && to !== '/seller' && location.pathname.startsWith(to));
                        return (
                            <Link key={to} to={to} style={{ textDecoration: 'none', display: 'block', marginBottom: '4px' }}>
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: '12px',
                                    padding: '11px 14px',
                                    borderRadius: '10px',
                                    background: active ? '#D4A843' : 'transparent',
                                    color: active ? 'white' : '#a8c890',
                                    fontWeight: active ? 600 : 500,
                                    fontSize: '14px',
                                    transition: 'all 0.2s',
                                    justifyContent: 'flex-start',
                                }}
                                    onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
                                    onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}>
                                    <Icon size={18} style={{ flexShrink: 0 }} />
                                    {label}
                                </div>
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom */}
                <div style={{ padding: '12px 8px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <div onClick={handleSignOut} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '8px', color: '#e07070', fontSize: '13px', cursor: 'pointer', justifyContent: 'flex-start' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,100,100,0.1)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                        <LogOut size={16} />
                        Sign Out
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <main style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
                <div style={{ flex: 1 }}>
                    <Outlet />
                </div>
                <Footer />
            </main>
        </div>
    );
}
