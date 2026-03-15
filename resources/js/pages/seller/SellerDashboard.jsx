import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, ShoppingBag, Package, BarChart2, Clock, ArrowRight } from 'lucide-react';
import { Orders, Products } from '../../lib/db.js';
import { formatPrice, timeAgo } from '../../lib/utils.js';

const STATUS_COLORS = {
    Pending: { bg: '#fff8e0', color: '#c0800b' },
    Processing: { bg: '#e8f4f8', color: '#0077aa' },
    Shipped: { bg: '#fff3e0', color: '#e65c00' },
    Delivered: { bg: '#e8f5e9', color: '#2D5016' },
    Cancelled: { bg: '#fff5f5', color: '#c0392b' },
};

export default function SellerDashboard() {
    const [stats, setStats] = useState({ todaySales: 0, monthlySales: 0, totalOrders: 0, totalProducts: 0 });
    const [recentOrders, setRecentOrders] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            try {
                const [allOrders, allProducts] = await Promise.all([
                    Orders.getAll(),
                    Products.getAll()
                ]);

                const now = new Date();
                const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

                const todaySales = allOrders
                    .filter(o => new Date(o.created_at) >= startOfDay && o.status !== 'Cancelled')
                    .reduce((s, o) => s + o.total_amount, 0);
                const monthlySales = allOrders
                    .filter(o => new Date(o.created_at) >= startOfMonth && o.status !== 'Cancelled')
                    .reduce((s, o) => s + o.total_amount, 0);

                setStats({ 
                    todaySales, 
                    monthlySales, 
                    totalOrders: allOrders.length, 
                    totalProducts: allProducts.length 
                });
                setRecentOrders(allOrders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5));
            } catch (error) {
                console.error('Failed to fetch dashboard stats:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const STAT_CARDS = [
        { label: "Today's Sales", value: formatPrice(stats.todaySales), icon: <TrendingUp size={22} />, color: '#2D5016', bg: '#e8f5e9' },
        { label: 'Monthly Sales', value: formatPrice(stats.monthlySales), icon: <BarChart2 size={22} />, color: '#D4A843', bg: '#fff8e0' },
        { label: 'Total Orders', value: stats.totalOrders, icon: <ShoppingBag size={22} />, color: '#0077aa', bg: '#e8f4f8' },
        { label: 'Total Products', value: stats.totalProducts, icon: <Package size={22} />, color: '#e65c00', bg: '#fff3e0' },
    ];

    const QUICK_ACTIONS = [
        { to: '/seller/inventory', icon: '📦', label: 'Add Product', desc: 'Manage your inventory' },
        { to: '/seller/storefront', icon: '🏪', label: 'Edit Storefront', desc: 'Update hero & banners' },
        { to: '/seller/reports', icon: '📊', label: 'View Reports', desc: 'Sales & inventory analytics' },
    ];

    return (
        <div style={{ padding: '32px' }}>
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '32px', color: '#1a1a1a', marginBottom: '6px' }}>
                    Dashboard
                </h1>
                <p style={{ color: '#888', fontSize: '15px' }}>Welcome back! Here's what's happening today.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
                {STAT_CARDS.map((card, i) => (
                    <div key={i} style={{ background: 'white', border: '1px solid #f0e8d8', borderRadius: '16px', padding: '22px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <div style={{ background: card.bg, borderRadius: '12px', padding: '10px', color: card.color }}>
                                {card.icon}
                            </div>
                        </div>
                        <div style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '24px', color: '#1a1a1a', marginBottom: '4px' }}>
                            {card.value}
                        </div>
                        <div style={{ color: '#888', fontSize: '13px' }}>{card.label}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Orders */}
                <div style={{ gridColumn: 'span 2' }}>
                    <div style={{ background: 'white', border: '1px solid #f0e8d8', borderRadius: '16px', padding: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ fontWeight: 700, fontSize: '17px', color: '#1a1a1a' }}>Recent Orders</h2>
                            <Clock size={16} color="#888" />
                        </div>
                        {recentOrders.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>No orders yet</div>
                        ) : (
                            recentOrders.map(order => {
                                const sc = STATUS_COLORS[order.status] || STATUS_COLORS.Pending;
                                return (
                                    <div key={order.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid #f5ece0', flexWrap: 'wrap', gap: '8px' }}>
                                        <div>
                                            <div style={{ fontWeight: 700, color: '#1a1a1a', fontSize: '14px' }}>#{String(order.id).slice(-6).toUpperCase()}</div>
                                            <div style={{ color: '#888', fontSize: '12px', marginTop: '2px' }}>{order.user_name} · {timeAgo(order.created_at)}</div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <span style={{ background: sc.bg, color: sc.color, padding: '3px 10px', borderRadius: '99px', fontSize: '12px', fontWeight: 700 }}>
                                                {order.status}
                                            </span>
                                            <span style={{ fontWeight: 800, color: '#2D5016', fontSize: '14px' }}>{formatPrice(order.total_amount)}</span>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div>
                    <div style={{ background: 'white', border: '1px solid #f0e8d8', borderRadius: '16px', padding: '24px' }}>
                        <h2 style={{ fontWeight: 700, fontSize: '17px', color: '#1a1a1a', marginBottom: '20px' }}>Quick Actions</h2>
                        {QUICK_ACTIONS.map(action => (
                            <Link key={action.to} to={action.to} style={{ textDecoration: 'none', display: 'block', marginBottom: '12px' }}>
                                <div className="hover-card"
                                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: '#FFF8F0', border: '1px solid #f0e8d8', borderRadius: '12px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <span style={{ fontSize: '24px' }}>{action.icon}</span>
                                        <div>
                                            <div style={{ fontWeight: 700, color: '#1a1a1a', fontSize: '14px' }}>{action.label}</div>
                                            <div style={{ color: '#888', fontSize: '12px' }}>{action.desc}</div>
                                        </div>
                                    </div>
                                    <ArrowRight size={16} color="#2D5016" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
