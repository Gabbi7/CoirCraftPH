import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Storefront, Products } from '../../lib/db.js';
import ProductCard from '../../components/ProductCard.jsx';
import { Star, Truck, Shield, Leaf } from 'lucide-react';

function ProductRow({ title, emoji, products, emptyMessage }) {
    if (products.length === 0) return null;

    return (
        <div style={{ marginBottom: '64px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
                <div>
                    <h2 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '32px', color: '#1a1a1a', margin: 0 }}>
                        {emoji} {title}
                    </h2>
                </div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                {products.length > 0 ? (
                    products.map(p => <ProductCard key={p.id} product={p} />)
                ) : (
                    <div style={{ padding: '40px', textAlign: 'center', background: 'white', borderRadius: '16px', gridColumn: '1 / -1', border: '1px solid #f0e8d8' }}>
                        <p style={{ color: '#888' }}>{emptyMessage}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function SkeletonRow() {
    return (
        <div style={{ marginBottom: '64px' }}>
            <div style={{ width: '250px', height: '36px', background: '#e0d8c8', borderRadius: '8px', marginBottom: '32px' }} className="skeleton" />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                {Array(4).fill(0).map((_, i) => (
                    <div key={i} style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', border: '1px solid #f0e8d8' }}>
                        <div className="skeleton" style={{ aspectRatio: '4/3' }} />
                        <div style={{ padding: '16px' }}>
                            <div className="skeleton" style={{ height: '12px', width: '60px', marginBottom: '8px' }} />
                            <div className="skeleton" style={{ height: '16px', width: '90%', marginBottom: '6px' }} />
                            <div className="skeleton" style={{ height: '16px', width: '70%', marginBottom: '12px' }} />
                            <div className="skeleton" style={{ height: '20px', width: '80px' }} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function FeaturedPage() {
    const config = Storefront.get();
    const [loading, setLoading] = useState(true);
    const [collections, setCollections] = useState({
        new: [],
        trending: [],
        bestSellers: [],
    });

    useEffect(() => {
        const fetchCollections = async () => {
            setLoading(true);
            try {
                const allProducts = await Products.getActive();
                
                // Sort by sold_count to roughly order the categories
                const sortedProducts = [...allProducts].sort((a, b) => (b.sold_count || 0) - (a.sold_count || 0));

                setCollections({
                    new: sortedProducts.filter(p => p.featured_type === 'New').slice(0, 8),
                    trending: sortedProducts.filter(p => p.featured_type === 'Trending').slice(0, 8),
                    bestSellers: sortedProducts.filter(p => p.featured_type === 'Best Seller').slice(0, 8),
                });
            } catch (error) {
                console.error('Failed to fetch featured collections:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCollections();
    }, []);

    return (
        <div style={{ minHeight: '100vh', background: '#FFF8F0' }}>
            {/* Storefront Hero Banner */}
            <section style={{ position: 'relative', height: '400px', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: config.hero_image ? `url(${config.hero_image})` : 'url(https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1600&q=80)',
                    backgroundSize: 'cover', backgroundPosition: 'center',
                }} />
                <div className="hero-overlay" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(26,26,26,0.85) 0%, rgba(26,26,26,0.4) 100%)' }} />
                
                <div style={{ position: 'relative', zIndex: 1, maxWidth: '1280px', margin: '0 auto', padding: '0 24px', width: '100%' }}>
                    <div style={{ maxWidth: '600px' }} className="animate-fade-in-up">
                        {config.promo_text && (
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(212,168,67,0.3)', border: '1px solid rgba(212,168,67,0.5)', color: '#D4A843', padding: '6px 14px', borderRadius: '99px', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', marginBottom: '20px', textTransform: 'uppercase' }}>
                                ✨ {config.promo_text}
                            </div>
                        )}
                        <h1 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '48px', fontWeight: 700, color: 'white', lineHeight: 1.1, marginBottom: '16px' }}>
                            {config.hero_title || 'Featured Collections'}
                        </h1>
                        <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.6 }}>
                            {config.hero_subtitle || 'Discover our handpicked selections, from new arrivals to our all-time best sellers.'}
                        </p>
                    </div>
                </div>
            </section>

            {/* Quick Benefits Strip */}
            <div style={{ background: 'white', borderBottom: '1px solid #f0e8d8' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#5a4030', fontSize: '14px', fontWeight: 600 }}>
                            <Truck size={16} color="#2D5016" /> Nationwide Delivery
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#5a4030', fontSize: '14px', fontWeight: 600 }}>
                            <Shield size={16} color="#2D5016" /> Farm-to-Door Quality
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#5a4030', fontSize: '14px', fontWeight: 600 }}>
                            <Leaf size={16} color="#2D5016" /> 100% Natural Material
                        </div>
                    </div>
                </div>
            </div>

            {/* Collections Content */}
            <section style={{ padding: '60px 0 100px 0' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {loading ? (
                        <>
                            <SkeletonRow />
                            <SkeletonRow />
                            <SkeletonRow />
                        </>
                    ) : (
                        <>
                            {/* Category: Best Sellers */}
                            <ProductRow 
                                title="Best Sellers" 
                                emoji="⭐" 
                                products={collections.bestSellers} 
                                emptyMessage="No best selling products available right now."
                            />

                            {/* Category: Trending */}
                            <ProductRow 
                                title="Trending Now" 
                                emoji="🔥" 
                                products={collections.trending} 
                                emptyMessage="No trending products available right now."
                            />

                            {/* Category: New Arrivals */}
                            <ProductRow 
                                title="New Arrivals" 
                                emoji="🌱" 
                                products={collections.new} 
                                emptyMessage="No new arrivals available right now."
                            />

                            {/* Fallback if absolutely nothing is featured */}
                            {collections.bestSellers.length === 0 && collections.trending.length === 0 && collections.new.length === 0 && (
                                <div style={{ textAlign: 'center', padding: '80px 20px', background: 'white', borderRadius: '24px', border: '1px dashed #d0c8b8' }}>
                                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>🍃</div>
                                    <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '24px', color: '#1a1a1a', marginBottom: '8px', fontWeight: 700 }}>No Featured Items</h3>
                                    <p style={{ color: '#888', marginBottom: '24px' }}>It looks like we don't have any featured products right now. Check back soon!</p>
                                    <Link to="/products" style={{ textDecoration: 'none' }}>
                                        <button className="btn-forest" style={{ padding: '12px 28px', borderRadius: '10px', fontSize: '15px' }}>
                                            Browse All Products
                                        </button>
                                    </Link>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>
        </div>
    );
}
