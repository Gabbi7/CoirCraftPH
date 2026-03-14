import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Truck, Package, CreditCard, Wallet, Building2, Banknote, MapPin } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useCart } from '../../contexts/CartContext.jsx';
import { Orders, Products } from '../../lib/db.js';
import { formatPrice } from '../../lib/utils.js';
import { toast } from 'sonner';

const PAYMENT_METHODS = [
    { value: 'Cash on Delivery', label: 'Cash on Delivery', icon: <Banknote size={20} />, desc: 'Pay when delivered' },
    { value: 'GCash', label: 'GCash', icon: <Wallet size={20} />, desc: 'Pay via GCash e-wallet' },
    { value: 'Bank Transfer', label: 'Bank Transfer', icon: <Building2 size={20} />, desc: 'Direct bank transfer' },
    { value: 'Credit Card', label: 'Credit Card', icon: <CreditCard size={20} />, desc: 'Visa / Mastercard' },
];

const SHIPPING_THRESHOLD = 2000;

export default function CheckoutPage() {
    const { user } = useAuth();
    const { items, subtotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [deliveryMethod, setDeliveryMethod] = useState('Delivery');
    const [address, setAddress] = useState(user?.address || '');
    const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
    const [placing, setPlacing] = useState(false);
    const [success, setSuccess] = useState(null);

    const shippingFee = deliveryMethod === 'Pickup' ? 0 : (subtotal >= SHIPPING_THRESHOLD ? 0 : 150);
    const total = subtotal + shippingFee;

    if (items.length === 0 && !success) {
        navigate('/cart');
        return null;
    }

    const handlePlaceOrder = async () => {
        if (deliveryMethod === 'Delivery' && !address.trim()) {
            toast.error('Please enter your delivery address');
            return;
        }
        setPlacing(true);
        try {
            const order = Orders.create({
                user_email: user.email,
                user_name: user.name,
                items: items.map(i => ({ ...i })),
                total_amount: total,
                payment_method: paymentMethod,
                delivery_method: deliveryMethod,
                delivery_address: deliveryMethod === 'Delivery' ? address : '',
                status: 'Pending',
            });
            // Deduct stock
            items.forEach(item => Products.decrementStock(item.product_id, item.quantity));
            clearCart();
            setSuccess(order);
            toast.success('Order placed successfully! 🎉');
        } catch (err) {
            toast.error('Something went wrong. Please try again.');
        } finally {
            setPlacing(false);
        }
    };

    if (success) {
        return (
            <div style={{ background: '#FFF8F0', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
                <div style={{ maxWidth: '480px', width: '100%', textAlign: 'center' }}>
                    <div style={{ width: '80px', height: '80px', background: '#e8f5e9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                        <CheckCircle size={40} color="#2D5016" />
                    </div>
                    <h1 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '32px', color: '#1a1a1a', marginBottom: '12px' }}>Order Placed! 🎉</h1>
                    <p style={{ color: '#888', fontSize: '16px', marginBottom: '8px' }}>Thank you, {user.name}!</p>
                    <p style={{ color: '#888', fontSize: '14px', marginBottom: '8px' }}>Order ID: <strong style={{ color: '#2D5016' }}>#{success.id.slice(-6).toUpperCase()}</strong></p>
                    <p style={{ color: '#888', fontSize: '14px', marginBottom: '32px' }}>Total: <strong style={{ color: '#2D5016' }}>{formatPrice(success.total_amount)}</strong></p>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button onClick={() => navigate('/transactions')}
                            className="btn-forest" style={{ padding: '12px 28px', borderRadius: '12px', fontSize: '15px' }}>
                            View My Orders
                        </button>
                        <button onClick={() => navigate('/products')}
                            style={{ padding: '12px 28px', borderRadius: '12px', fontSize: '15px', fontWeight: 600, background: 'white', border: '1.5px solid #e5d5c0', color: '#5a4030', cursor: 'pointer' }}>
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ background: '#FFF8F0', minHeight: '100vh', paddingBottom: '80px' }}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
                <h1 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '36px', color: '#1a1a1a', marginBottom: '32px' }}>Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left form */}
                    <div style={{ gridColumn: 'span 2' }}>
                        {/* Delivery method */}
                        <div style={{ background: 'white', border: '1px solid #f0e8d8', borderRadius: '20px', padding: '28px', marginBottom: '20px' }}>
                            <h2 style={{ fontWeight: 700, fontSize: '18px', marginBottom: '20px', color: '#1a1a1a' }}>Delivery Method</h2>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { value: 'Delivery', label: 'Home Delivery', icon: <Truck size={22} />, desc: 'Deliver to your address' },
                                    { value: 'Pickup', label: 'Store Pickup', icon: <Package size={22} />, desc: 'Pick up at our warehouse (Free)' },
                                ].map(opt => (
                                    <div key={opt.value} onClick={() => setDeliveryMethod(opt.value)}
                                        style={{
                                            border: `2px solid ${deliveryMethod === opt.value ? '#2D5016' : '#e5d5c0'}`,
                                            borderRadius: '14px', padding: '18px', cursor: 'pointer', transition: 'all 0.2s',
                                            background: deliveryMethod === opt.value ? '#f0faf0' : 'white',
                                        }}>
                                        <div style={{ color: deliveryMethod === opt.value ? '#2D5016' : '#888', marginBottom: '8px' }}>{opt.icon}</div>
                                        <div style={{ fontWeight: 700, color: '#1a1a1a', fontSize: '15px' }}>{opt.label}</div>
                                        <div style={{ color: '#888', fontSize: '12px', marginTop: '4px' }}>{opt.desc}</div>
                                    </div>
                                ))}
                            </div>
                            {deliveryMethod === 'Delivery' && (
                                <div style={{ marginTop: '20px' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, fontSize: '13px', color: '#5a4030', marginBottom: '8px' }}>
                                        <MapPin size={14} /> Delivery Address
                                    </label>
                                    <textarea
                                        value={address}
                                        onChange={e => setAddress(e.target.value)}
                                        rows={3}
                                        placeholder="Enter your complete delivery address..."
                                        className="input-base"
                                        style={{ resize: 'vertical' }}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Payment method */}
                        <div style={{ background: 'white', border: '1px solid #f0e8d8', borderRadius: '20px', padding: '28px' }}>
                            <h2 style={{ fontWeight: 700, fontSize: '18px', marginBottom: '20px', color: '#1a1a1a' }}>Payment Method</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {PAYMENT_METHODS.map(pm => (
                                    <div key={pm.value} onClick={() => setPaymentMethod(pm.value)}
                                        style={{
                                            border: `2px solid ${paymentMethod === pm.value ? '#2D5016' : '#e5d5c0'}`,
                                            borderRadius: '14px', padding: '16px', cursor: 'pointer', transition: 'all 0.2s',
                                            background: paymentMethod === pm.value ? '#f0faf0' : 'white',
                                            display: 'flex', alignItems: 'flex-start', gap: '12px',
                                        }}>
                                        <div style={{ color: paymentMethod === pm.value ? '#2D5016' : '#aaa', marginTop: '2px' }}>{pm.icon}</div>
                                        <div>
                                            <div style={{ fontWeight: 700, color: '#1a1a1a', fontSize: '14px' }}>{pm.label}</div>
                                            <div style={{ color: '#888', fontSize: '12px', marginTop: '2px' }}>{pm.desc}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Order summary */}
                    <div>
                        <div style={{ background: 'white', border: '1px solid #f0e8d8', borderRadius: '20px', padding: '28px', position: 'sticky', top: '100px' }}>
                            <h2 style={{ fontWeight: 700, fontSize: '18px', marginBottom: '20px', color: '#1a1a1a' }}>Order Summary</h2>
                            <div style={{ maxHeight: '240px', overflowY: 'auto', marginBottom: '16px' }}>
                                {items.map(item => (
                                    <div key={item.product_id} style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '12px' }}>
                                        <img src={item.product_image || 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=80&q=60'} alt={item.product_name}
                                            style={{ width: '44px', height: '44px', objectFit: 'cover', borderRadius: '8px', background: '#f5ece0' }} />
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 600, fontSize: '13px', color: '#1a1a1a', lineHeight: '1.3' }}>{item.product_name}</div>
                                            <div style={{ color: '#888', fontSize: '12px' }}>×{item.quantity}</div>
                                        </div>
                                        <div style={{ fontWeight: 700, fontSize: '14px', color: '#2D5016' }}>{formatPrice(item.product_price * item.quantity)}</div>
                                    </div>
                                ))}
                            </div>
                            <div style={{ borderTop: '1px solid #f0e8d8', paddingTop: '16px', marginBottom: '16px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', color: '#5a4030' }}>
                                    <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: shippingFee === 0 ? '#2D5016' : '#5a4030' }}>
                                    <span>Shipping</span><span>{shippingFee === 0 ? 'FREE' : formatPrice(shippingFee)}</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '19px', color: '#1a1a1a', marginBottom: '24px' }}>
                                <span>Total</span><span style={{ color: '#2D5016' }}>{formatPrice(total)}</span>
                            </div>
                            <button onClick={handlePlaceOrder} disabled={placing}
                                className="btn-forest"
                                style={{ width: '100%', padding: '16px', borderRadius: '12px', fontSize: '16px', opacity: placing ? 0.7 : 1 }}>
                                {placing ? 'Placing Order...' : 'Place Order 🌿'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
