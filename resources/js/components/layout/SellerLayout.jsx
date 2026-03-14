import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, Store, BarChart2, Leaf, LogOut, ChevronRight, ExternalLink } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.jsx';

const navItems = [
    { to: '/seller', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/seller/inventory', icon: Package, label: 'Inventory' },
    { to: '/seller/storefront', icon: Store, label: 'Storefront' },
    { to: '/seller/reports', icon: BarChart2, label: 'Reports' },
];

export default function SellerLayout() {
    const { user, signOut } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);

    const handleSignOut = () => {
        signOut();
        navigate('/');
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f5ece0' }}>
            {/* Sidebar */}
            <aside style={{
                width: collapsed ? '72px' : '240px',
                background: '#1f3a0f',
                display: 'flex', flexDirection: 'column',
                transition: 'width 0.3s ease',
                flexShrink: 0,
                position: 'sticky', top: 0, height: '100vh', overflowY: 'auto'
            }}>
                {/* Logo */}
                <div style={{ padding: collapsed ? '20px 12px' : '20px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ background: '#D4A843', borderRadius: '8px', padding: '6px', flexShrink: 0 }}>
                        <Leaf size={18} color="white" />
                    </div>
                    {!collapsed && (
                        <span style={{ fontFamily: 'Playfair Display, Georgia, serif', fontWeight: 700, color: 'white', fontSize: '16px', whiteSpace: 'nowrap' }}>
                            CocoFiber <span style={{ color: '#D4A843' }}>PH</span>
                        </span>
                    )}
                </div>

                {/* Seller badge */}
                {!collapsed && (
                    <div style={{ padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        <div style={{ background: 'rgba(212,168,67,0.2)', borderRadius: '8px', padding: '8px 12px' }}>
                            <div style={{ color: '#D4A843', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Seller Panel</div>
                            <div style={{ color: 'white', fontSize: '13px', fontWeight: 600, marginTop: '2px' }}>{user?.name}</div>
                        </div>
                    </div>
                )}

                {/* Nav items */}
                <nav style={{ flex: 1, padding: '12px 8px' }}>
                    {navItems.map(({ to, icon: Icon, label }) => {
                        const active = location.pathname === to || (to !== '/seller' && location.pathname.startsWith(to));
                        return (
                            <Link key={to} to={to} style={{ textDecoration: 'none', display: 'block', marginBottom: '4px' }}>
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: '12px',
                                    padding: collapsed ? '12px' : '11px 14px',
                                    borderRadius: '10px',
                                    background: active ? '#D4A843' : 'transparent',
                                    color: active ? 'white' : '#a8c890',
                                    fontWeight: active ? 600 : 500,
                                    fontSize: '14px',
                                    transition: 'all 0.2s',
                                    justifyContent: collapsed ? 'center' : 'flex-start',
                                }}
                                    onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
                                    onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}>
                                    <Icon size={18} style={{ flexShrink: 0 }} />
                                    {!collapsed && label}
                                </div>
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom */}
                <div style={{ padding: '12px 8px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <Link to="/" style={{ textDecoration: 'none', display: 'block', marginBottom: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '8px', color: '#a8c890', fontSize: '13px', cursor: 'pointer', justifyContent: collapsed ? 'center' : 'flex-start' }}>
                            <ExternalLink size={16} />
                            {!collapsed && 'View Storefront'}
                        </div>
                    </Link>
                    <div onClick={handleSignOut} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '8px', color: '#e07070', fontSize: '13px', cursor: 'pointer', justifyContent: collapsed ? 'center' : 'flex-start' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,100,100,0.1)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                        <LogOut size={16} />
                        {!collapsed && 'Sign Out'}
                    </div>
                </div>

                {/* Collapse toggle */}
                <button onClick={() => setCollapsed(!collapsed)} style={{
                    position: 'absolute', top: '50%', right: '-12px',
                    background: '#D4A843', border: 'none', borderRadius: '50%',
                    width: '24px', height: '24px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)', zIndex: 10
                }}>
                    <ChevronRight size={12} color="white" style={{ transform: collapsed ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 0.3s' }} />
                </button>
            </aside>

            {/* Main content */}
            <main style={{ flex: 1, overflow: 'auto' }}>
                <Outlet />
            </main>
        </div>
    );
}
