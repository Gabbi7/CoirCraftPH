import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Leaf, Menu, X, ChevronDown, User, ClipboardList, Store, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useCart } from '../../contexts/CartContext.jsx';
import { Storefront } from '../../lib/db.js';

export default function Header() {
    const { user, signOut, isSeller } = useAuth();
    const { itemCount } = useCart();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const config = Storefront.get();

    const navLinks = [
        { to: '/', label: 'Home' },
        { to: '/featured', label: 'Featured' },
        { to: '/products', label: 'Products' },
        ...(!isSeller ? [{ to: '/signup?role=seller', label: 'Sell on CoirCraft' }] : []),
    ];

    const handleSignOut = () => {
        signOut();
        setDropdownOpen(false);
        navigate('/');
    };

    return (
        <>
            {/* Top Announcement Banner */}
            {config?.banner_text && (
                <div style={{ background: '#1f3a0f', color: 'white', textAlign: 'center', padding: '8px 16px', fontSize: '13px', fontWeight: 500, letterSpacing: '0.02em' }}>
                    {config.banner_text}
                </div>
            )}

            {/* Main header */}
            <header style={{ background: 'rgba(255,248,240,0.95)', borderBottom: '1px solid #e5d5c0', backdropFilter: 'blur(12px)' }}
                className="sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-2 group" style={{ textDecoration: 'none' }}>
                            <img src="/images/logo-green.png" alt="CoirCraft PH Logo" style={{ height: '32px', width: 'auto', borderRadius: '4px' }} className="group-hover:scale-105 transition-transform" />
                            <div>
                                <span style={{ fontFamily: 'Playfair Display, Georgia, serif', fontWeight: 700, color: '#2D5016', fontSize: '18px' }}>CoirCraft</span>
                                <span style={{ color: '#D4A843', fontWeight: 700, fontSize: '18px' }}> PH</span>
                            </div>
                        </Link>

                        {/* Desktop Nav */}
                        <nav className="hidden md:flex items-center gap-8">
                            {navLinks.map(link => (
                                <Link key={link.to} to={link.to}
                                    style={{
                                        textDecoration: 'none',
                                        color: location.pathname === link.to ? '#2D5016' : '#5a4030',
                                        fontWeight: location.pathname === link.to ? 600 : 500,
                                        fontSize: '15px',
                                        borderBottom: location.pathname === link.to ? '2px solid #2D5016' : '2px solid transparent',
                                        paddingBottom: '2px',
                                        transition: 'all 0.2s',
                                    }}>
                                    {link.label}
                                </Link>
                            ))}
                        </nav>

                        {/* Right side */}
                        <div className="flex items-center gap-3">
                            {/* Cart */}
                            <Link to="/cart" style={{ textDecoration: 'none', position: 'relative' }}>
                                <button style={{ background: 'white', border: '1.5px solid #e5d5c0', borderRadius: '10px', padding: '8px', cursor: 'pointer', transition: 'all 0.2s' }}
                                    className="hover:border-green-600 hover:shadow-sm">
                                    <ShoppingCart size={18} color="#2D5016" />
                                    {itemCount > 0 && (
                                        <span style={{
                                            position: 'absolute', top: '-6px', right: '-6px',
                                            background: '#D4A843', color: 'white',
                                            borderRadius: '50%', width: '18px', height: '18px',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '10px', fontWeight: 700,
                                        }}>
                                            {itemCount > 9 ? '9+' : itemCount}
                                        </span>
                                    )}
                                </button>
                            </Link>

                            {/* User dropdown or Sign In */}
                            {user ? (
                                <div style={{ position: 'relative' }}>
                                    <button onClick={() => setDropdownOpen(!dropdownOpen)}
                                        style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#2D5016', color: 'white', border: 'none', borderRadius: '10px', padding: '8px 14px', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}>
                                        <User size={16} />
                                        <span className="hidden sm:block">{user.name.split(' ')[0]}</span>
                                        <ChevronDown size={14} style={{ transition: 'transform 0.2s', transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0)' }} />
                                    </button>
                                    {dropdownOpen && (
                                        <div style={{
                                            position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                                            background: 'white', border: '1px solid #e5d5c0', borderRadius: '12px',
                                            boxShadow: '0 8px 24px rgba(0,0,0,0.12)', minWidth: '200px',
                                            padding: '8px', zIndex: 100,
                                        }}
                                            onMouseLeave={() => setDropdownOpen(false)}>
                                            <div style={{ padding: '12px 14px 8px', borderBottom: '1px solid #f0e8d8', marginBottom: '4px' }}>
                                                <div style={{ fontWeight: 700, fontSize: '14px', color: '#1a1a1a' }}>{user.name}</div>
                                                <div style={{ fontSize: '12px', color: '#888' }}>{user.email}</div>
                                                <span style={{ background: '#e8f0e0', color: '#2D5016', fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '99px', marginTop: '4px', display: 'inline-block' }}>
                                                    {user.role}
                                                </span>
                                            </div>
                                            {[
                                                { to: '/profile', icon: <User size={14} />, label: 'Profile' },
                                                { to: '/transactions', icon: <ClipboardList size={14} />, label: 'Transactions' },
                                                ...(isSeller ? [{ to: '/seller', icon: <Store size={14} />, label: 'Seller Panel' }] : []),
                                            ].map(item => (
                                                <Link key={item.to} to={item.to} style={{ textDecoration: 'none' }}
                                                    onClick={() => setDropdownOpen(false)}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '8px', color: '#333', fontSize: '14px', cursor: 'pointer', transition: 'background 0.15s' }}
                                                        onMouseEnter={e => e.currentTarget.style.background = '#f5ece0'}
                                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                                        {item.icon}{item.label}
                                                    </div>
                                                </Link>
                                            ))}
                                            <div onClick={handleSignOut} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '8px', color: '#c0392b', fontSize: '14px', cursor: 'pointer', marginTop: '2px', borderTop: '1px solid #f0e8d8', transition: 'background 0.15s' }}
                                                onMouseEnter={e => e.currentTarget.style.background = '#fff5f5'}
                                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                                <LogOut size={14} /> Sign Out
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link to="/signin" style={{ textDecoration: 'none' }}>
                                    <button style={{ background: '#2D5016', color: 'white', border: 'none', borderRadius: '10px', padding: '8px 18px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, transition: 'all 0.2s' }}
                                        onMouseEnter={e => { e.currentTarget.style.background = '#1f3a0f'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                                        onMouseLeave={e => { e.currentTarget.style.background = '#2D5016'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                                        Sign In
                                    </button>
                                </Link>
                            )}

                            {/* Mobile menu button */}
                            <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}
                                style={{ background: 'white', border: '1.5px solid #e5d5c0', borderRadius: '8px', padding: '6px', cursor: 'pointer' }}>
                                {mobileOpen ? <X size={18} color="#2D5016" /> : <Menu size={18} color="#2D5016" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile menu */}
                {mobileOpen && (
                    <div style={{ borderTop: '1px solid #e5d5c0', background: 'white', padding: '16px' }}>
                        {navLinks.map(link => (
                            <Link key={link.to} to={link.to} style={{ textDecoration: 'none' }}
                                onClick={() => setMobileOpen(false)}>
                                <div style={{ padding: '12px 16px', borderRadius: '8px', color: '#333', fontWeight: 500, marginBottom: '4px' }}>
                                    {link.label}
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </header>
        </>
    );
}
