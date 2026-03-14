import { useState, useEffect } from 'react';
import { Clock, Package, Truck, CheckCircle, XCircle, ChevronDown, ChevronUp, Wallet, Building2, CreditCard, Banknote, MapPin } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { Orders } from '../../lib/db.js';
import { formatPrice } from '../../lib/utils.js';
import moment from 'moment';

const STATUS_CONFIG = {
    Pending: { icon: <Clock size={16} />, bg: '#fff8e0', color: '#c0800b', label: 'Pending' },
    Processing: { icon: <Package size={16} />, bg: '#e8f4f8', color: '#0077aa', label: 'Processing' },
    Shipped: { icon: <Truck size={16} />, bg: '#fff3e0', color: '#e65c00', label: 'Shipped' },
    Delivered: { icon: <CheckCircle size={16} />, bg: '#e8f5e9', color: '#2D5016', label: 'Delivered' },
    Cancelled: { icon: <XCircle size={16} />, bg: '#fff5f5', color: '#c0392b', label: 'Cancelled' },
};

const PAYMENT_ICONS = {
    'Cash on Delivery': <Banknote size={14} />,
    'GCash': <Wallet size={14} />,
    'Bank Transfer': <Building2 size={14} />,
    'Credit Card': <CreditCard size={14} />,
};

export default function TransactionsPage() {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [expanded, setExpanded] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            const myOrders = Orders.getByEmail(user.email).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            setOrders(myOrders);
            setLoading(false);
        }, 400);
    }, []);

    const toggle = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

    if (loading) {
        return (
            <div style={{ background: '#FFF8F0', minHeight: '100vh', padding: '40px 24px' }}>
                <div className="max-w-4xl mx-auto">
                    {Array(3).fill(0).map((_, i) => (
                        <div key={i} className="skeleton" style={{ height: '80px', borderRadius: '16px', marginBottom: '12px' }} />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div style={{ background: '#FFF8F0', minHeight: '100vh', paddingBottom: '80px' }}>
            <div style={{ background: 'linear-gradient(135deg, #2D5016 0%, #3d6b1f 100%)', padding: '40px 24px' }}>
                <div className="max-w-4xl mx-auto">
                    <h1 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '36px', color: 'white' }}>My Orders</h1>
                    <p style={{ color: 'rgba(255,255,255,0.75)', marginTop: '6px' }}>{orders.length} order{orders.length !== 1 ? 's' : ''} total</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8">
                {orders.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '80px 0' }}>
                        <div style={{ fontSize: '56px', marginBottom: '16px' }}>📦</div>
                        <h3 style={{ fontWeight: 700, color: '#1a1a1a', marginBottom: '8px' }}>No orders yet</h3>
                        <p style={{ color: '#888' }}>Start shopping to see your orders here!</p>
                    </div>
                ) : (
                    orders.map(order => {
                        const sc = STATUS_CONFIG[order.status] || STATUS_CONFIG.Pending;
                        const isOpen = expanded[order.id];
                        return (
                            <div key={order.id} style={{ background: 'white', border: '1px solid #f0e8d8', borderRadius: '16px', marginBottom: '12px', overflow: 'hidden' }}>
                                {/* Header row */}
                                <div onClick={() => toggle(order.id)}
                                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', cursor: 'pointer', transition: 'background 0.2s' }}
                                    onMouseEnter={e => { e.currentTarget.style.background = '#fdf9f3'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                                        <div>
                                            <div style={{ fontWeight: 800, fontSize: '15px', color: '#1a1a1a' }}>
                                                #{order.id.slice(-6).toUpperCase()}
                                            </div>
                                            <div style={{ color: '#888', fontSize: '12px', marginTop: '2px' }}>
                                                {moment(order.created_at).format('MMM D, YYYY h:mm A')}
                                            </div>
                                        </div>
                                        <span style={{ background: sc.bg, color: sc.color, padding: '4px 12px', borderRadius: '99px', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>
                                            {sc.icon} {sc.label}
                                        </span>
                                        <span style={{ color: '#888', fontSize: '13px' }}>{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <span style={{ fontWeight: 800, fontSize: '17px', color: '#2D5016' }}>{formatPrice(order.total_amount)}</span>
                                        <div style={{ color: '#888' }}>{isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}</div>
                                    </div>
                                </div>

                                {/* Expanded detail */}
                                {isOpen && (
                                    <div style={{ borderTop: '1px solid #f0e8d8', padding: '20px 24px' }}>
                                        {/* Meta */}
                                        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '20px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#5a4030', background: '#f5ece0', padding: '6px 12px', borderRadius: '8px' }}>
                                                {PAYMENT_ICONS[order.payment_method]} {order.payment_method}
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#5a4030', background: '#f5ece0', padding: '6px 12px', borderRadius: '8px' }}>
                                                <Truck size={14} /> {order.delivery_method}
                                            </div>
                                            {order.delivery_address && (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#5a4030', background: '#f5ece0', padding: '6px 12px', borderRadius: '8px' }}>
                                                    <MapPin size={14} /> {order.delivery_address}
                                                </div>
                                            )}
                                        </div>
                                        {/* Items */}
                                        <div>
                                            {order.items.map(item => (
                                                <div key={item.product_id} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', padding: '12px', background: '#FFF8F0', borderRadius: '10px' }}>
                                                    <img src={item.product_image || 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=80&q=60'} alt={item.product_name}
                                                        style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px', background: '#f5ece0' }} />
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{ fontWeight: 600, fontSize: '14px', color: '#1a1a1a' }}>{item.product_name}</div>
                                                        <div style={{ color: '#888', fontSize: '12px' }}>×{item.quantity} · {formatPrice(item.product_price)} each</div>
                                                    </div>
                                                    <div style={{ fontWeight: 700, color: '#2D5016', fontSize: '14px' }}>{formatPrice(item.product_price * item.quantity)}</div>
                                                </div>
                                            ))}
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '12px', borderTop: '1px solid #f0e8d8' }}>
                                            <div style={{ fontWeight: 800, fontSize: '16px', color: '#1a1a1a' }}>
                                                Total: <span style={{ color: '#2D5016' }}>{formatPrice(order.total_amount)}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
