import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Leaf, Star, TrendingUp, Sparkles, Minus, Plus, CheckCircle } from 'lucide-react';
import { Products } from '../../lib/db.js';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useCart } from '../../contexts/CartContext.jsx';
import { formatPrice } from '../../lib/utils.js';
import ProductCard from '../../components/ProductCard.jsx';
import { toast } from 'sonner';

const BADGE_COLORS = {
    'New': { bg: '#e8f4f8', color: '#0077aa', icon: <Sparkles size={12} /> },
    'Trending': { bg: '#fff3e0', color: '#e65c00', icon: <TrendingUp size={12} /> },
    'Best Seller': { bg: '#e8f5e9', color: '#2D5016', icon: <Star size={12} /> },
};

export default function ProductDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { addItem } = useCart();
    const [product, setProduct] = useState(null);
    const [related, setRelated] = useState([]);
    const [qty, setQty] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const p = await Products.getById(id);
                if (!p) { 
                    navigate('/products'); 
                    return; 
                }
                setProduct(p);
                
                const all = await Products.getActive();
                setRelated(all.filter(x => x.category === p.category && x.id !== p.id).slice(0, 4));
            } catch (error) {
                console.error('Failed to fetch product details:', error);
                navigate('/products');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, navigate]);

    const handleAddToCart = () => {
        if (!user) {
            toast.info('Please sign in to add items to cart');
            navigate('/signin');
            return;
        }
        if (product.stock <= 0) { toast.error('Out of stock'); return; }
        addItem(product, qty);
        toast.success(`${product.name} × ${qty} added to cart! 🌿`);
    };

    if (loading || !product) {
        return (
            <div style={{ background: '#FFF8F0', minHeight: '100vh', padding: '40px 24px' }}>
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="skeleton" style={{ aspectRatio: '1', borderRadius: '24px' }} />
                    <div>
                        <div className="skeleton" style={{ height: '16px', width: '100px', marginBottom: '16px' }} />
                        <div className="skeleton" style={{ height: '36px', width: '80%', marginBottom: '12px' }} />
                        <div className="skeleton" style={{ height: '24px', width: '120px', marginBottom: '24px' }} />
                        <div className="skeleton" style={{ height: '80px', marginBottom: '24px' }} />
                    </div>
                </div>
            </div>
        );
    }

    const badge = BADGE_COLORS[product.featured_type];
    const isOutOfStock = product.stock <= 0;

    return (
        <div style={{ background: '#FFF8F0', minHeight: '100vh', paddingBottom: '80px' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                {/* Back */}
                <button onClick={() => navigate(-1)}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: '1.5px solid #e5d5c0', borderRadius: '10px', padding: '8px 16px', cursor: 'pointer', color: '#5a4030', fontSize: '14px', fontWeight: 600, marginBottom: '32px', transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#2D5016'; e.currentTarget.style.color = '#2D5016'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5d5c0'; e.currentTarget.style.color = '#5a4030'; }}>
                    <ArrowLeft size={16} /> Back to Products
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Image */}
                    <div style={{ position: 'sticky', top: '100px', alignSelf: 'flex-start' }}>
                        <div style={{ borderRadius: '24px', overflow: 'hidden', background: 'white', border: '1px solid #f0e8d8', boxShadow: '0 8px 32px rgba(45,80,22,0.08)' }}>
                            <img
                                src={product.image_url || 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80'}
                                alt={product.name}
                                style={{ width: '100%', aspectRatio: '1', objectFit: 'cover' }}
                            />
                        </div>
                    </div>

                    {/* Info */}
                    <div>
                        {/* Badges */}
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                            <span style={{ background: '#e8f0e0', color: '#2D5016', padding: '4px 12px', borderRadius: '99px', fontSize: '12px', fontWeight: 700 }}>
                                {product.category}
                            </span>
                            {badge && (
                                <span style={{ background: badge.bg, color: badge.color, padding: '4px 12px', borderRadius: '99px', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    {badge.icon} {product.featured_type}
                                </span>
                            )}
                        </div>

                        <h1 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '36px', color: '#1a1a1a', marginBottom: '12px', lineHeight: 1.2 }}>
                            {product.name}
                        </h1>

                        <div style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '32px', color: '#2D5016', marginBottom: '20px' }}>
                            {formatPrice(product.price)}
                        </div>

                        {/* Stock indicator */}
                        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: '6px',
                                padding: '6px 14px', borderRadius: '99px',
                                background: isOutOfStock ? '#fff5f5' : product.stock <= 5 ? '#fff8e0' : '#e8f5e9',
                                color: isOutOfStock ? '#c0392b' : product.stock <= 5 ? '#c0800b' : '#2D5016',
                                fontSize: '13px', fontWeight: 700
                            }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'currentColor' }} />
                                {isOutOfStock ? 'Out of Stock' : `${product.stock} in stock`}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '99px', background: '#e8f4f8', color: '#0077aa', fontSize: '13px', fontWeight: 700 }}>
                                <Leaf size={14} /> Eco-Friendly
                            </div>
                            {product.sold_count > 0 && (
                                <div style={{ padding: '6px 14px', borderRadius: '99px', background: '#f5ece0', color: '#5a4030', fontSize: '13px', fontWeight: 700 }}>
                                    {product.sold_count} sold
                                </div>
                            )}
                        </div>

                        <p style={{ color: '#5a4030', lineHeight: 1.8, fontSize: '15px', marginBottom: '28px' }}>
                            {product.description}
                        </p>

                        {/* Quantity selector */}
                        {!isOutOfStock && (
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', fontWeight: 700, fontSize: '13px', color: '#5a4030', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    Quantity
                                </label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0', border: '1.5px solid #e5d5c0', borderRadius: '12px', overflow: 'hidden', width: 'fit-content', background: 'white' }}>
                                    <button onClick={() => setQty(q => Math.max(1, q - 1))}
                                        style={{ background: 'none', border: 'none', padding: '12px 16px', cursor: 'pointer', color: '#2D5016', fontSize: '18px', fontWeight: 700, transition: 'background 0.2s' }}
                                        onMouseEnter={e => { e.currentTarget.style.background = '#f5ece0'; }}
                                        onMouseLeave={e => { e.currentTarget.style.background = 'none'; }}>
                                        <Minus size={16} />
                                    </button>
                                    <span style={{ padding: '12px 20px', fontWeight: 700, fontSize: '16px', minWidth: '56px', textAlign: 'center' }}>{qty}</span>
                                    <button onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                                        style={{ background: 'none', border: 'none', padding: '12px 16px', cursor: 'pointer', color: '#2D5016', fontSize: '18px', fontWeight: 700, transition: 'background 0.2s' }}
                                        onMouseEnter={e => { e.currentTarget.style.background = '#f5ece0'; }}
                                        onMouseLeave={e => { e.currentTarget.style.background = 'none'; }}>
                                        <Plus size={16} />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Add to cart */}
                        <button onClick={handleAddToCart} disabled={isOutOfStock}
                            className={isOutOfStock ? '' : 'btn-forest'}
                            style={{
                                width: '100%', padding: '18px', borderRadius: '14px', fontSize: '17px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                                background: isOutOfStock ? '#e0e0e0' : '#2D5016',
                                color: isOutOfStock ? '#999' : 'white',
                                border: 'none', cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                                fontWeight: 700, marginBottom: '20px',
                            }}>
                            <ShoppingCart size={20} />
                            {isOutOfStock ? 'Out of Stock' : `Add ${qty} to Cart — ${formatPrice(product.price * qty)}`}
                        </button>

                        {/* Features checklist */}
                        <div style={{ background: 'white', border: '1px solid #f0e8d8', borderRadius: '16px', padding: '20px' }}>
                            <h4 style={{ fontWeight: 700, fontSize: '14px', color: '#1a1a1a', marginBottom: '12px' }}>Why CoirCraft?</h4>
                            {[
                                'Made from 100% natural coconut fiber',
                                'Sourced from Philippine farms',
                                'Fully biodegradable and eco-friendly',
                                'Quality checked before shipping',
                            ].map((f, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                    <CheckCircle size={16} color="#2D5016" />
                                    <span style={{ fontSize: '14px', color: '#5a4030' }}>{f}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {related.length > 0 && (
                    <div style={{ marginTop: '80px' }}>
                        <h2 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '28px', color: '#1a1a1a', marginBottom: '28px' }}>
                            More in {product.category}
                        </h2>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                            {related.map(p => <ProductCard key={p.id} product={p} />)}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
