import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, Shield, Truck, ShoppingBag, Star } from 'lucide-react';
import { Products, Storefront } from '../../lib/db.js';
import ProductCard from '../../components/ProductCard.jsx';

const CATEGORIES = [
    { name: 'Coir Rope', emoji: '🪢', desc: 'Natural fiber ropes for garden & craft' },
    { name: 'Coir Mat', emoji: '🏠', desc: 'Handwoven door & floor mats' },
    { name: 'Coir Net', emoji: '🕸️', desc: 'Erosion control & garden netting' },
    { name: 'Coir Pot', emoji: '🪴', desc: 'Biodegradable hanging basket liners' },
    { name: 'Coir Board', emoji: '📋', desc: 'Compressed fiber boards for projects' },
    { name: 'Coir Fiber', emoji: '🌾', desc: 'Loose fiber for potting & composting' },
    { name: 'Coir Grow Bag', emoji: '🌱', desc: 'Hydroponic grow bags, ready to use' },
    { name: 'Other', emoji: '📦', desc: 'More premium coir products' },
];

function Skeleton() {
    return (
        <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', border: '1px solid #f0e8d8' }}>
            <div className="skeleton" style={{ aspectRatio: '4/3' }} />
            <div style={{ padding: '16px' }}>
                <div className="skeleton" style={{ height: '12px', width: '60px', marginBottom: '8px' }} />
                <div className="skeleton" style={{ height: '16px', width: '90%', marginBottom: '6px' }} />
                <div className="skeleton" style={{ height: '16px', width: '70%', marginBottom: '12px' }} />
                <div className="skeleton" style={{ height: '20px', width: '80px' }} />
            </div>
        </div>
    );
}

export default function HomePage() {
    const [featured, setFeatured] = useState([]);
    const [loading, setLoading] = useState(true);
    const config = Storefront.get();

    useEffect(() => {
        setTimeout(() => {
            const products = Products.getActive();
            const f = products
                .filter(p => p.featured_type !== 'None')
                .sort((a, b) => b.sold_count - a.sold_count)
                .slice(0, 8);
            setFeatured(f);
            setLoading(false);
        }, 500);
    }, []);

    return (
        <div>
            {/* Hero */}
            <section style={{ position: 'relative', minHeight: '90vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: config.hero_image ? `url(${config.hero_image})` : 'url(https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1600&q=80)',
                    backgroundSize: 'cover', backgroundPosition: 'center',
                }} />
                <div className="hero-overlay" style={{ position: 'absolute', inset: 0 }} />
                <div style={{ position: 'relative', zIndex: 1, maxWidth: '1280px', margin: '0 auto', padding: '0 24px', width: '100%' }}>
                    <div style={{ maxWidth: '680px' }} className="animate-fade-in-up">
                        {config.promo_text && (
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(212,168,67,0.3)', border: '1px solid rgba(212,168,67,0.5)', color: '#D4A843', padding: '6px 14px', borderRadius: '99px', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', marginBottom: '20px', textTransform: 'uppercase' }}>
                                <Star size={12} /> {config.promo_text}
                            </div>
                        )}
                        <h1 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(42px, 6vw, 72px)', fontWeight: 700, color: 'white', lineHeight: 1.1, marginBottom: '20px' }}>
                            {config.hero_title || 'From Husk to Home'}
                        </h1>
                        <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, marginBottom: '36px', maxWidth: '520px' }}>
                            {config.hero_subtitle || 'Premium coconut coir products sustainably harvested from Philippine farms.'}
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px' }}>
                            <Link to="/products" style={{ textDecoration: 'none' }}>
                                <button className="btn-amber" style={{ padding: '16px 36px', borderRadius: '14px', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    Shop Now <ArrowRight size={18} />
                                </button>
                            </Link>
                            <Link to="/products" style={{ textDecoration: 'none' }}>
                                <button style={{ padding: '16px 36px', borderRadius: '14px', fontSize: '16px', fontWeight: 600, background: 'rgba(255,255,255,0.15)', color: 'white', border: '1.5px solid rgba(255,255,255,0.4)', cursor: 'pointer', transition: 'all 0.2s', backdropFilter: 'blur(8px)' }}
                                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.25)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; }}>
                                    View All Products
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features strip */}
            <section style={{ background: '#2D5016' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { icon: <Leaf size={18} />, title: '100% Natural', desc: 'Pure coconut coir, no synthetics' },
                            { icon: <Shield size={18} />, title: 'Quality Assured', desc: 'Farm-to-door quality checks' },
                            { icon: <Truck size={18} />, title: 'Nationwide Delivery', desc: 'Free shipping over ₱2,000' },
                        ].map((feat, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px', color: 'white' }}>
                                <div style={{ background: 'rgba(212,168,67,0.3)', borderRadius: '12px', padding: '12px', flexShrink: 0 }}>
                                    {feat.icon}
                                </div>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: '15px' }}>{feat.title}</div>
                                    <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>{feat.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section style={{ padding: '80px 0', background: '#FFF8F0' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
                        <div>
                            <div style={{ color: '#D4A843', fontWeight: 700, fontSize: '13px', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>✨ Handpicked</div>
                            <h2 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '36px', color: '#1a1a1a', margin: 0 }}>Featured Products</h2>
                        </div>
                        <Link to="/products" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', color: '#2D5016', fontWeight: 600, fontSize: '14px' }}>
                            View all <ArrowRight size={14} />
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                        {loading
                            ? Array(8).fill(0).map((_, i) => <Skeleton key={i} />)
                            : featured.map(p => <ProductCard key={p.id} product={p} />)
                        }
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section style={{ padding: '80px 0', background: 'white' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div style={{ marginBottom: '40px', textAlign: 'center' }}>
                        <div style={{ color: '#D4A843', fontWeight: 700, fontSize: '13px', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>Browse by</div>
                        <h2 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '36px', color: '#1a1a1a', margin: 0 }}>Product Categories</h2>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {CATEGORIES.map(cat => (
                            <Link key={cat.name} to={`/products?cat=${encodeURIComponent(cat.name)}`} style={{ textDecoration: 'none' }}>
                                <div className="hover-card"
                                    style={{ background: '#FFF8F0', border: '1.5px solid #f0e8d8', borderRadius: '16px', padding: '24px 16px', textAlign: 'center', cursor: 'pointer' }}>
                                    <div style={{ fontSize: '36px', marginBottom: '12px' }}>{cat.emoji}</div>
                                    <div style={{ fontWeight: 700, color: '#2D5016', fontSize: '14px', marginBottom: '4px' }}>{cat.name}</div>
                                    <div style={{ color: '#888', fontSize: '12px' }}>{cat.desc}</div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* About section */}
            <section style={{ padding: '80px 0', background: '#FFF8F0' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <div style={{ color: '#D4A843', fontWeight: 700, fontSize: '13px', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>Our Story</div>
                            <h2 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '40px', color: '#1a1a1a', marginBottom: '20px', lineHeight: 1.2 }}>
                                From Husk to Home
                            </h2>
                            <p style={{ color: '#5a4030', lineHeight: 1.8, fontSize: '16px', marginBottom: '16px' }}>
                                CocoFiber PH was born from a simple idea: transform coconut husks — a waste product of the Philippine coconut industry — into premium, eco-friendly materials for homes and gardens.
                            </p>
                            <p style={{ color: '#5a4030', lineHeight: 1.8, fontSize: '16px', marginBottom: '32px' }}>
                                We work directly with 50+ farm partners across the Philippines, ensuring fair wages and sustainable practices at every step of the supply chain.
                            </p>
                            <div className="grid grid-cols-3 gap-6">
                                {[
                                    { num: '500+', label: 'Orders fulfilled' },
                                    { num: '100%', label: 'Eco-friendly' },
                                    { num: '50+', label: 'Farm partners' },
                                ].map((stat, i) => (
                                    <div key={i} style={{ textAlign: 'center', padding: '20px', background: 'white', borderRadius: '16px', border: '1px solid #f0e8d8' }}>
                                        <div style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '28px', color: '#2D5016' }}>{stat.num}</div>
                                        <div style={{ color: '#888', fontSize: '13px', marginTop: '4px' }}>{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <img src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80" alt="Coconut farm" style={{ width: '100%', borderRadius: '24px', objectFit: 'cover', aspectRatio: '4/3' }} />
                            <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', background: '#2D5016', color: 'white', borderRadius: '20px', padding: '20px 24px', boxShadow: '0 8px 24px rgba(45,80,22,0.3)' }}>
                                <div style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '24px' }}>🌿</div>
                                <div style={{ fontWeight: 700, fontSize: '14px', marginTop: '4px' }}>Sustainably Sourced</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Banner */}
            <section style={{ padding: '80px 0', background: '#2D5016' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '40px', color: 'white', marginBottom: '16px' }}>
                        Ready to Go Green?
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '18px', marginBottom: '36px' }}>
                        Shop our full range of premium coconut coir products. Free shipping over ₱2,000.
                    </p>
                    <Link to="/products" style={{ textDecoration: 'none' }}>
                        <button className="btn-amber" style={{ padding: '18px 48px', borderRadius: '14px', fontSize: '17px', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                            <ShoppingBag size={20} /> Shop Now
                        </button>
                    </Link>
                </div>
            </section>
        </div>
    );
}
