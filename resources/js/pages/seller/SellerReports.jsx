import { useState, useEffect } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, ShoppingBag, Package, AlertTriangle } from 'lucide-react';
import { Orders, Products } from '../../lib/db.js';
import { formatPrice } from '../../lib/utils.js';
import moment from 'moment';

const PIE_COLORS = ['#2D5016', '#D4A843', '#5a9e3a', '#c07800', '#0077aa', '#e65c00', '#9b6b2e', '#888'];

const TABS = ['Sales Overview', 'Category Breakdown'];

export default function SellerReports() {
    const [tab, setTab] = useState(0);
    const [salesData, setSalesData] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [lowStock, setLowStock] = useState([]);
    const [stats, setStats] = useState({ revenue: 0, orders: 0, avgOrder: 0, sold: 0 });

    useEffect(() => {
        const allOrders = Orders.getAll().filter(o => o.status !== 'Cancelled');
        const allProducts = Products.getAll();

        // Daily sales for last 7 days
        const days = Array.from({ length: 7 }, (_, i) => {
            const d = moment().subtract(6 - i, 'days');
            return {
                day: d.format('ddd'),
                date: d.format('YYYY-MM-DD'),
                sales: 0,
                orders: 0,
            };
        });
        allOrders.forEach(o => {
            const d = moment(o.created_at).format('YYYY-MM-DD');
            const entry = days.find(day => day.date === d);
            if (entry) { entry.sales += o.total_amount; entry.orders += 1; }
        });
        setSalesData(days.map(d => ({ ...d, sales: Math.round(d.sales) })));

        // Category sales
        const catMap = {};
        allOrders.forEach(o => {
            (o.items || []).forEach(item => {
                const product = allProducts.find(p => p.id === item.product_id);
                const cat = product?.category || item.category || 'Other';
                catMap[cat] = (catMap[cat] || 0) + (item.product_price * item.quantity);
            });
        });
        setCategoryData(Object.entries(catMap).map(([name, value]) => ({ name, value: Math.round(value) })).sort((a, b) => b.value - a.value));

        // Stats
        const totalRevenue = allOrders.reduce((s, o) => s + o.total_amount, 0);
        const totalSold = allOrders.reduce((s, o) => s + o.items.reduce((ss, i) => ss + i.quantity, 0), 0);
        setStats({ revenue: totalRevenue, orders: allOrders.length, avgOrder: allOrders.length ? totalRevenue / allOrders.length : 0, sold: totalSold });

        // Low stock
        setLowStock(allProducts.filter(p => p.stock <= 5).sort((a, b) => a.stock - b.stock));
    }, []);

    const STAT_CARDS = [
        { label: 'Total Revenue', value: formatPrice(stats.revenue), icon: <TrendingUp size={20} />, color: '#2D5016', bg: '#e8f5e9' },
        { label: 'Total Orders', value: stats.orders, icon: <ShoppingBag size={20} />, color: '#0077aa', bg: '#e8f4f8' },
        { label: 'Avg. Order Value', value: formatPrice(stats.avgOrder), icon: <Package size={20} />, color: '#D4A843', bg: '#fff8e0' },
        { label: 'Units Sold', value: stats.sold, icon: <Package size={20} />, color: '#e65c00', bg: '#fff3e0' },
    ];

    return (
        <div style={{ padding: '32px' }}>
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '32px', color: '#1a1a1a', marginBottom: '6px' }}>Reports</h1>
                <p style={{ color: '#888', fontSize: '14px' }}>Sales analytics and inventory status</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
                {STAT_CARDS.map((card, i) => (
                    <div key={i} style={{ background: 'white', border: '1px solid #f0e8d8', borderRadius: '16px', padding: '22px' }}>
                        <div style={{ background: card.bg, borderRadius: '12px', padding: '10px', color: card.color, display: 'inline-flex', marginBottom: '14px' }}>
                            {card.icon}
                        </div>
                        <div style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '22px', color: '#1a1a1a', marginBottom: '4px' }}>{card.value}</div>
                        <div style={{ color: '#888', fontSize: '13px' }}>{card.label}</div>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '0', background: '#f5ece0', borderRadius: '12px', padding: '4px', width: 'fit-content', marginBottom: '28px' }}>
                {TABS.map((t, i) => (
                    <button key={i} onClick={() => setTab(i)}
                        style={{
                            padding: '10px 22px', borderRadius: '9px', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '14px', transition: 'all 0.2s',
                            background: tab === i ? '#2D5016' : 'transparent',
                            color: tab === i ? 'white' : '#5a4030',
                        }}>
                        {t}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Chart */}
                <div style={{ gridColumn: 'span 2' }}>
                    <div style={{ background: 'white', border: '1px solid #f0e8d8', borderRadius: '16px', padding: '28px' }}>
                        <h2 style={{ fontWeight: 700, fontSize: '17px', color: '#1a1a1a', marginBottom: '24px' }}>
                            {tab === 0 ? 'Daily Sales — Last 7 Days' : 'Revenue by Category'}
                        </h2>
                        <ResponsiveContainer width="100%" height={280}>
                            {tab === 0 ? (
                                <BarChart data={salesData} margin={{ bottom: 5 }}>
                                    <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#888' }} />
                                    <YAxis tick={{ fontSize: 12, fill: '#888' }} tickFormatter={v => '₱' + (v >= 1000 ? (v / 1000).toFixed(1) + 'k' : v)} />
                                    <Tooltip
                                        formatter={(v) => [formatPrice(v), 'Sales']}
                                        contentStyle={{ borderRadius: '12px', border: '1px solid #f0e8d8', fontSize: '13px' }}
                                    />
                                    <Bar dataKey="sales" fill="#2D5016" radius={[6, 6, 0, 0]} />
                                </BarChart>
                            ) : (
                                <PieChart>
                                    <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`} labelLine={false}>
                                        {categoryData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                                    </Pie>
                                    <Tooltip formatter={(v) => formatPrice(v)} contentStyle={{ borderRadius: '12px', border: '1px solid #f0e8d8', fontSize: '13px' }} />
                                    <Legend formatter={(v) => <span style={{ fontSize: '12px', color: '#5a4030' }}>{v}</span>} />
                                </PieChart>
                            )}
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Low Stock */}
                <div>
                    <div style={{ background: 'white', border: '1px solid #f0e8d8', borderRadius: '16px', padding: '24px' }}>
                        <h2 style={{ fontWeight: 700, fontSize: '17px', color: '#1a1a1a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <AlertTriangle size={18} color="#c0800b" /> Low Stock Alert
                        </h2>
                        {lowStock.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '32px 0', color: '#888' }}>
                                <div style={{ fontSize: '32px', marginBottom: '8px' }}>✅</div>
                                All products sufficiently stocked
                            </div>
                        ) : lowStock.map(p => (
                            <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f5ece0' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <img src={p.image_url || 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=80&q=60'} alt={p.name}
                                        style={{ width: '36px', height: '36px', objectFit: 'cover', borderRadius: '6px', background: '#f5ece0', flexShrink: 0 }} />
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: '13px', color: '#1a1a1a', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                                        <div style={{ color: '#888', fontSize: '11px' }}>{p.category}</div>
                                    </div>
                                </div>
                                <span style={{
                                    background: p.stock === 0 ? '#fff5f5' : '#fff8e0',
                                    color: p.stock === 0 ? '#c0392b' : '#c0800b',
                                    padding: '3px 10px', borderRadius: '99px', fontSize: '12px', fontWeight: 700, flexShrink: 0
                                }}>
                                    {p.stock === 0 ? 'Out' : `${p.stock} left`}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
