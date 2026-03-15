import { Leaf, MapPin, Phone, Mail, Facebook, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer style={{ background: '#1f3a0f', color: '#d4e8c0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-6">
                            <img src="/images/logo-yellow.png" alt="CoirCraft PH Logo" style={{ height: '32px', width: 'auto', borderRadius: '4px' }} />
                            <span style={{ fontFamily: 'Playfair Display, Georgia, serif', fontWeight: 700, color: 'white', fontSize: '20px' }}>
                                CoirCraft <span style={{ color: '#D4A843' }}>PH</span>
                            </span>
                        </div>
                        <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#a8c890', maxWidth: '300px' }}>
                            Premium coconut coir products sustainably sourced from Philippine coconut farms.
                        </p>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 style={{ color: 'white', fontWeight: 700, marginBottom: '24px', fontSize: '14px', letterSpacing: '1px' }}>CONTACT</h3>
                        <div className="space-y-4">
                            {[
                                { Icon: Mail, text: 'devign@coircraft.ph' },
                                { Icon: Phone, text: '0987654321' },
                                { Icon: MapPin, text: 'Manila, Philippines' },
                            ].map(({ Icon, text }, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <Icon size={16} color="#D4A843" strokeWidth={2.5} />
                                    <span style={{ fontSize: '14px', color: '#a8c890' }}>{text}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 style={{ color: 'white', fontWeight: 700, marginBottom: '24px', fontSize: '14px', letterSpacing: '1px' }}>QUICK LINKS</h3>
                        <div className="space-y-3">
                            {[
                                { to: '/products', label: 'All Products' },
                                { to: '/featured', label: 'Featured' },
                                { to: '/cart', label: 'Shopping Cart' },
                                { to: '/transactions', label: 'Order History' },
                            ].map(link => (
                                <Link key={link.to} to={link.to} style={{ textDecoration: 'none', display: 'block', color: '#a8c890', fontSize: '14px', transition: 'all 0.2s' }}
                                    className="hover:text-white transform hover:translate-x-1">
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom section */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '64px', paddingTop: '32px' }} className="text-center">
                    <div className="flex flex-col items-center gap-3">
                        <img 
                            src="/images/devign-logo.png" 
                            alt="Devign Logo" 
                            style={{ height: '24px', width: 'auto', opacity: 0.8 }} 
                        />
                        <p style={{ fontSize: '13px', color: '#78a060' }}>
                            © 2026 CoirCraft PH — Devign
                        </p>
                    </div>
                    <p style={{ fontSize: '12px', color: '#567545', fontStyle: 'italic' }}>
                        For educational purposes only, and no copyright infringement is intended.
                    </p>
                </div>
            </div>
        </footer>
    );
}
