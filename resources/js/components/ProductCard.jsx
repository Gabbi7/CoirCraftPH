import { ShoppingCart, Star, TrendingUp, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useCart } from '../contexts/CartContext.jsx';
import { formatPrice } from '../lib/utils.js';
import { toast } from 'sonner';

const BADGE_COLORS = {
    'New': { bg: '#e8f4f8', color: '#0077aa', icon: <Sparkles size={10} /> },
    'Trending': { bg: '#fff3e0', color: '#e65c00', icon: <TrendingUp size={10} /> },
    'Best Seller': { bg: '#e8f5e9', color: '#2D5016', icon: <Star size={10} /> },
};

const CATEGORY_COLORS = {
    'Coir Rope': '#6b4226',
    'Coir Mat': '#5a7a2e',
    'Coir Net': '#2e6b6b',
    'Coir Pot': '#8b6914',
    'Coir Board': '#4a5568',
    'Coir Fiber': '#7b4f8e',
    'Coir Grow Bag': '#2D5016',
    'Other': '#666',
};

export default function ProductCard({ product }) {
    const { user } = useAuth();
    const { addItem } = useCart();
    const navigate = useNavigate();

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!user) {
            toast.info('Please sign in to add items to your cart');
            navigate('/signin');
            return;
        }
        if (product.stock <= 0) {
            toast.error('This product is out of stock');
            return;
        }
        addItem(product, 1);
        toast.success(`${product.name} added to cart!`);
    };

    const badge = BADGE_COLORS[product.featured_type];
    const catColor = CATEGORY_COLORS[product.category] || '#666';

    return (
        <div onClick={() => navigate(`/products/${product.id}`)}
            className="hover-card"
            style={{
                background: 'white', borderRadius: '16px', overflow: 'hidden',
                border: '1px solid #f0e8d8', cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(45,80,22,0.06)',
            }}>
            {/* Image */}
            <div style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden', background: '#f5ece0' }}>
                <img
                    src={product.image_url || 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80'}
                    alt={product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                    onMouseEnter={e => { e.target.style.transform = 'scale(1.05)'; }}
                    onMouseLeave={e => { e.target.style.transform = 'scale(1)'; }}
                />
                {badge && (
                    <div style={{
                        position: 'absolute', top: '10px', left: '10px',
                        background: badge.bg, color: badge.color,
                        display: 'flex', alignItems: 'center', gap: '4px',
                        padding: '3px 8px', borderRadius: '99px',
                        fontSize: '11px', fontWeight: 700,
                    }}>
                        {badge.icon} {product.featured_type}
                    </div>
                )}
                {product.stock <= 5 && product.stock > 0 && (
                    <div style={{
                        position: 'absolute', top: '10px', right: '10px',
                        background: '#fff3e0', color: '#c0392b',
                        padding: '3px 8px', borderRadius: '99px',
                        fontSize: '11px', fontWeight: 700
                    }}>
                        Only {product.stock} left
                    </div>
                )}
                {product.stock <= 0 && (
                    <div style={{
                        position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <span style={{ background: 'rgba(0,0,0,0.8)', color: 'white', padding: '6px 14px', borderRadius: '99px', fontSize: '13px', fontWeight: 700 }}>
                            Out of Stock
                        </span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div style={{ padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <span style={{
                        background: catColor + '18',
                        color: catColor,
                        padding: '2px 8px', borderRadius: '99px',
                        fontSize: '11px', fontWeight: 700
                    }}>
                        {product.category}
                    </span>
                    {product.sold_count > 0 && (
                        <span style={{ color: '#999', fontSize: '11px' }}>{product.sold_count} sold</span>
                    )}
                </div>
                <h3 style={{ fontWeight: 700, fontSize: '15px', color: '#1a1a1a', marginBottom: '4px', lineHeight: '1.3', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {product.name}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px' }}>
                    <span style={{ fontWeight: 800, fontSize: '18px', color: '#2D5016', fontFamily: 'Playfair Display, serif' }}>
                        {formatPrice(product.price)}
                    </span>
                    <button
                        onClick={handleAddToCart}
                        disabled={product.stock <= 0}
                        style={{
                            background: product.stock <= 0 ? '#e0e0e0' : '#2D5016',
                            color: product.stock <= 0 ? '#999' : 'white',
                            border: 'none', borderRadius: '10px',
                            padding: '8px 12px', cursor: product.stock <= 0 ? 'not-allowed' : 'pointer',
                            display: 'flex', alignItems: 'center', gap: '6px',
                            fontSize: '13px', fontWeight: 600, transition: 'all 0.2s',
                        }}
                        onMouseEnter={e => { if (product.stock > 0) { e.currentTarget.style.background = '#1f3a0f'; e.currentTarget.style.transform = 'scale(1.05)'; } }}
                        onMouseLeave={e => { if (product.stock > 0) { e.currentTarget.style.background = '#2D5016'; e.currentTarget.style.transform = 'scale(1)'; } }}>
                        <ShoppingCart size={14} />
                        Add
                    </button>
                </div>
            </div>
        </div>
    );
}
