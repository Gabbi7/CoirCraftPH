import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Leaf } from 'lucide-react';
import { useCart } from '../../contexts/CartContext.jsx';
import { Products } from '../../lib/db.js';
import { formatPrice } from '../../lib/utils.js';
import { toast } from 'sonner';

const SHIPPING_THRESHOLD = 2000;

export default function CartPage() {
    const { items, updateQty, removeItem, subtotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const data = await Products.getAll();
                setAllProducts(data);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    const shippingFee = subtotal >= SHIPPING_THRESHOLD ? 0 : 150;
    const total = subtotal + shippingFee;

    if (items.length === 0) {
        return (
            <div style={{ background: '#FFF8F0', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '40px' }}>
                <div style={{ fontSize: '64px', marginBottom: '20px' }}>🛒</div>
                <h2 style={{ fontWeight: 700, fontSize: '24px', color: '#1a1a1a', marginBottom: '10px' }}>Your cart is empty</h2>
                <p style={{ color: '#888', marginBottom: '28px' }}>Discover our premium coir products and fill it up!</p>
                <Link to="/products" style={{ textDecoration: 'none' }}>
                    <button className="btn-forest" style={{ padding: '14px 36px', borderRadius: '12px', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <ShoppingBag size={18} /> Shop Now
                    </button>
                </Link>
            </div>
        );
    }

    return (
        <div style={{ background: '#FFF8F0', minHeight: '100vh', paddingBottom: '80px' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
                <h1 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '36px', color: '#1a1a1a', marginBottom: '32px' }}>
                    My Cart <span style={{ color: '#D4A843', fontSize: '20px' }}>({items.length} item{items.length !== 1 ? 's' : ''})</span>
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart items */}
                    <div style={{ gridColumn: 'span 2' }}>
                        {items.map(item => {
                            const p = allProducts.find(x => x.id === item.product_id);
                            const maxStock = p?.stock ?? 99;
                            return (
                                <div key={item.product_id} className="hover-card"
                                    style={{ background: 'white', border: '1px solid #f0e8d8', borderRadius: '16px', padding: '20px', marginBottom: '12px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                                    {/* Image */}
                                    <Link to={`/products/${item.product_id}`} style={{ textDecoration: 'none', flexShrink: 0 }}>
                                        <img
                                            src={item.product_image || 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200&q=80'}
                                            alt={item.product_name}
                                            style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '10px', background: '#f5ece0' }}
                                        />
                                    </Link>
                                    {/* Info */}
                                    <div style={{ flex: 1 }}>
                                        <Link to={`/products/${item.product_id}`} style={{ textDecoration: 'none' }}>
                                            <h3 style={{ fontWeight: 700, fontSize: '15px', color: '#1a1a1a', marginBottom: '4px' }}>{item.product_name}</h3>
                                        </Link>
                                        <div style={{ fontWeight: 700, color: '#2D5016', fontSize: '16px', marginBottom: '12px' }}>{formatPrice(item.product_price)}</div>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                                            {/* Qty */}
                                            <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #e5d5c0', borderRadius: '8px', overflow: 'hidden' }}>
                                                <button onClick={() => updateQty(item.product_id, item.quantity - 1, maxStock)}
                                                    style={{ background: 'none', border: 'none', padding: '6px 12px', cursor: 'pointer', color: '#2D5016' }}>
                                                    <Minus size={14} />
                                                </button>
                                                <span style={{ padding: '6px 14px', fontWeight: 700, fontSize: '15px' }}>{item.quantity}</span>
                                                <button onClick={() => updateQty(item.product_id, item.quantity + 1, maxStock)}
                                                    style={{ background: 'none', border: 'none', padding: '6px 12px', cursor: 'pointer', color: '#2D5016' }}>
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{ fontWeight: 800, color: '#1a1a1a', fontSize: '16px' }}>{formatPrice(item.product_price * item.quantity)}</div>
                                                <button onClick={() => { removeItem(item.product_id); toast.success('Item removed'); }}
                                                    style={{ background: '#fff5f5', border: '1px solid #ffd5d5', borderRadius: '8px', padding: '6px', cursor: 'pointer', color: '#c0392b', transition: 'all 0.2s' }}
                                                    onMouseEnter={e => { e.currentTarget.style.background = '#ffe0e0'; }}
                                                    onMouseLeave={e => { e.currentTarget.style.background = '#fff5f5'; }}>
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Order summary */}
                    <div>
                        <div style={{ background: 'white', border: '1px solid #f0e8d8', borderRadius: '20px', padding: '28px', position: 'sticky', top: '100px' }}>
                            <h2 style={{ fontWeight: 700, fontSize: '18px', color: '#1a1a1a', marginBottom: '20px' }}>Order Summary</h2>
                            <div style={{ borderBottom: '1px solid #f0e8d8', paddingBottom: '16px', marginBottom: '16px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '15px', color: '#5a4030' }}>
                                    <span>Subtotal ({items.length} item{items.length !== 1 ? 's' : ''})</span>
                                    <span>{formatPrice(subtotal)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', color: shippingFee === 0 ? '#2D5016' : '#5a4030' }}>
                                    <span>Shipping</span>
                                    <span>{shippingFee === 0 ? 'FREE 🎉' : formatPrice(shippingFee)}</span>
                                </div>
                                {subtotal < SHIPPING_THRESHOLD && (
                                    <div style={{ marginTop: '10px', padding: '8px 12px', background: '#f0faf0', borderRadius: '8px', fontSize: '12px', color: '#2D5016' }}>
                                        <Leaf size={12} style={{ display: 'inline', marginRight: '4px' }} />
                                        Add {formatPrice(SHIPPING_THRESHOLD - subtotal)} more for free shipping!
                                    </div>
                                )}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '20px', color: '#1a1a1a', marginBottom: '24px' }}>
                                <span>Total</span>
                                <span style={{ color: '#2D5016' }}>{formatPrice(total)}</span>
                            </div>
                            <button onClick={() => navigate('/checkout')}
                                className="btn-forest"
                                style={{ width: '100%', padding: '16px', borderRadius: '12px', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                Checkout <ArrowRight size={18} />
                            </button>
                            <Link to="/products" style={{ textDecoration: 'none', display: 'block', textAlign: 'center', marginTop: '14px', color: '#888', fontSize: '14px' }}>
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
