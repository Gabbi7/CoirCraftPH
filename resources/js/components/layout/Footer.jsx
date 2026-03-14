import { Leaf, MapPin, Phone, Mail, Facebook, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer style={{ background: '#1f3a0f', color: '#d4e8c0' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                    {/* Brand */}
                    <div className="md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <div style={{ background: '#D4A843', borderRadius: '8px', padding: '6px' }}>
                                <Leaf size={18} color="white" />
                            </div>
                            <span style={{ fontFamily: 'Playfair Display, Georgia, serif', fontWeight: 700, color: 'white', fontSize: '18px' }}>
                                CocoFiber <span style={{ color: '#D4A843' }}>PH</span>
                            </span>
                        </div>
                        <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#a8c890' }}>
                            Sustainably harvested coconut coir products from Philippine farms, bringing nature's best to your home and garden.
                        </p>
                        <div className="flex gap-3 mt-5">
                            {[Facebook, Instagram].map((Icon, i) => (
                                <button key={i} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '8px', cursor: 'pointer', transition: 'all 0.2s' }}
                                    onMouseEnter={e => { e.currentTarget.style.background = '#D4A843'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}>
                                    <Icon size={16} color="white" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 style={{ color: 'white', fontWeight: 700, marginBottom: '16px', fontSize: '15px' }}>Quick Links</h3>
                        {[
                            { to: '/', label: 'Home' },
                            { to: '/products', label: 'Products' },
                            { to: '/cart', label: 'My Cart' },
                            { to: '/transactions', label: 'My Orders' },
                        ].map(link => (
                            <Link key={link.to} to={link.to} style={{ textDecoration: 'none', display: 'block', marginBottom: '10px', color: '#a8c890', fontSize: '14px', transition: 'color 0.2s' }}
                                onMouseEnter={e => { e.target.style.color = '#D4A843'; }}
                                onMouseLeave={e => { e.target.style.color = '#a8c890'; }}>
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 style={{ color: 'white', fontWeight: 700, marginBottom: '16px', fontSize: '15px' }}>Categories</h3>
                        {['Coir Rope', 'Coir Mat', 'Coir Net', 'Coir Pot', 'Coir Board', 'Coir Fiber', 'Coir Grow Bag'].map(cat => (
                            <Link key={cat} to={`/products?cat=${encodeURIComponent(cat)}`} style={{ textDecoration: 'none', display: 'block', marginBottom: '10px', color: '#a8c890', fontSize: '14px', transition: 'color 0.2s' }}
                                onMouseEnter={e => { e.target.style.color = '#D4A843'; }}
                                onMouseLeave={e => { e.target.style.color = '#a8c890'; }}>
                                {cat}
                            </Link>
                        ))}
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 style={{ color: 'white', fontWeight: 700, marginBottom: '16px', fontSize: '15px' }}>Contact Us</h3>
                        {[
                            { Icon: MapPin, text: 'Quezon City, Metro Manila, Philippines' },
                            { Icon: Phone, text: '+63 917 123 4567' },
                            { Icon: Mail, text: 'hello@cocofiber.ph' },
                        ].map(({ Icon, text }, i) => (
                            <div key={i} className="flex items-start gap-3 mb-4">
                                <div style={{ marginTop: '2px', flexShrink: 0 }}>
                                    <Icon size={15} color="#D4A843" />
                                </div>
                                <span style={{ fontSize: '14px', color: '#a8c890' }}>{text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '48px', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <p style={{ fontSize: '13px', color: '#78a060' }}>
                        © 2026 CocoFiber PH. All rights reserved. 🌿 Sustainably sourced.
                    </p>
                    <p style={{ fontSize: '13px', color: '#78a060' }}>
                        Made with ❤️ in the Philippines
                    </p>
                </div>
            </div>
        </footer>
    );
}
