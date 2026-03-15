import { useState, useEffect } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Orders, Products } from '../../lib/db.js';
import { formatPrice } from '../../lib/utils.js';
import moment from 'moment';

const PIE_COLORS = ['#2D5016', '#D4A843', '#5a9e3a', '#c07800', '#0077aa', '#e65c00', '#9b6b2e', '#888'];

export default function SellerReports() {
    const [salesData, setSalesData] = useState([]);
    const [monthlyData, setMonthlyData] = useState([]);
    const [stats, setStats] = useState({
        todaySales: 0, todayOrders: 0,
        monthlySales: 0, monthlyOrders: 0,
        totalRevenue: 0, totalOrders: 0,
        avgOrder: 0
    });
    const [inventory, setInventory] = useState({
        totalProducts: 0,
        totalStock: 0,
        outOfStock: 0
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await Orders.getAll();
                const allOrders = data.filter(o => o.status !== 'Cancelled');
                const allProducts = await Products.getAll();
                
                const today = moment().format('YYYY-MM-DD');
                const thisMonth = moment().format('YYYY-MM');

                let tSales = 0, tOrders = 0;
                let mSales = 0, mOrders = 0;
                let totRev = 0;

                // Daily sales for last 7 days chart
                const days = Array.from({ length: 7 }, (_, i) => {
                    const d = moment().subtract(6 - i, 'days');
                    return {
                        day: d.format('ddd'),
                        date: d.format('YYYY-MM-DD'),
                        sales: 0,
                        orders: 0,
                    };
                });

                // Monthly sales for last 6 months chart
                const months = Array.from({ length: 6 }, (_, i) => {
                    const m = moment().subtract(5 - i, 'months');
                    return {
                        month: m.format('MMM'),
                        monthKey: m.format('YYYY-MM'),
                        sales: 0,
                    };
                });

                allOrders.forEach(o => {
                    const oDate = moment(o.created_at).format('YYYY-MM-DD');
                    const oMonth = moment(o.created_at).format('YYYY-MM');

                    totRev += o.total_amount;

                    if (oDate === today) {
                        tSales += o.total_amount;
                        tOrders += 1;
                    }
                    if (oMonth === thisMonth) {
                        mSales += o.total_amount;
                        mOrders += 1;
                    }

                    const dayEntry = days.find(day => day.date === oDate);
                    if (dayEntry) { dayEntry.sales += o.total_amount; dayEntry.orders += 1; }

                    const monthEntry = months.find(m => m.monthKey === oMonth);
                    if (monthEntry) { monthEntry.sales += o.total_amount; }
                });

                setStats({
                    todaySales: tSales, todayOrders: tOrders,
                    monthlySales: mSales, monthlyOrders: mOrders,
                    totalRevenue: totRev, totalOrders: allOrders.length,
                    avgOrder: allOrders.length ? totRev / allOrders.length : 0
                });

                setSalesData(days.map(d => ({ ...d, sales: Math.round(d.sales) })));
                setMonthlyData(months.map(m => ({ ...m, sales: Math.round(m.sales) })));

                // Inventory mapping
                let totStock = 0;
                let outStockCount = 0;
                allProducts.forEach(p => {
                    totStock += (p.stock || 0);
                    if (p.stock === 0) outStockCount++;
                });

                setInventory({
                    totalProducts: allProducts.length,
                    totalStock: totStock,
                    outOfStock: outStockCount
                });
            } catch (error) {
                console.error('Failed to fetch report data:', error);
            }
        };
        fetchData();
    }, []);

    const statCardStyle = {
        background: 'white', 
        border: '1px solid #eae5db', 
        borderRadius: '8px', 
        padding: '24px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
    };

    const blockLabelStyle = { color: '#666', fontSize: '12px', fontWeight: 600, marginBottom: '8px' };
    const subtextStyle = { color: '#888', fontSize: '11px', marginTop: '6px' };

    return (
        <div style={{ padding: '32px', background: '#fcfbfa', minHeight: '100%', fontFamily: 'Inter, sans-serif' }}>
            
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '28px', color: '#1a1a1a' }}>Reports</h1>
            </div>

            {/* Top Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                
                {/* Today's Sales */}
                <div style={statCardStyle}>
                    <div style={blockLabelStyle}>Today's Sales</div>
                    <div style={{ fontWeight: 700, fontSize: '24px', color: '#2D5016', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ fontSize: '18px' }}>₱</span>{stats.todaySales.toLocaleString()}
                    </div>
                    <div style={subtextStyle}>{stats.todayOrders} orders</div>
                </div>

                {/* Monthly Sales */}
                <div style={statCardStyle}>
                    <div style={blockLabelStyle}>Monthly Sales</div>
                    <div style={{ fontWeight: 700, fontSize: '24px', color: '#c58a22', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ fontSize: '18px' }}>₱</span>{stats.monthlySales.toLocaleString()}
                    </div>
                    <div style={subtextStyle}>{stats.monthlyOrders} orders</div>
                </div>

                {/* Total Revenue */}
                <div style={statCardStyle}>
                    <div style={blockLabelStyle}>Total Revenue</div>
                    <div style={{ fontWeight: 700, fontSize: '24px', color: '#333', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ fontSize: '18px' }}>₱</span>{stats.totalRevenue.toLocaleString()}
                    </div>
                    <div style={subtextStyle}>{stats.totalOrders} orders total</div>
                </div>

                {/* Avg Order Value */}
                <div style={statCardStyle}>
                    <div style={blockLabelStyle}>Avg Order Value</div>
                    <div style={{ fontWeight: 700, fontSize: '24px', color: '#333', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ fontSize: '18px' }}>₱</span>{Math.round(stats.avgOrder).toLocaleString()}
                    </div>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                
                {/* Last 7 Days Sales */}
                <div style={{ background: 'white', border: '1px solid #eae5db', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#333', marginBottom: '24px' }}>
                        Last 7 Days Sales
                    </div>
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#888' }} axisLine={{ stroke: '#e0dcd2' }} tickLine={false} />
                            <YAxis tick={{ fontSize: 11, fill: '#888' }} axisLine={false} tickLine={false} tickFormatter={v => (v >= 1000 ? (v / 1000).toFixed(1) + 'k' : v)} />
                            <Tooltip
                                formatter={(v) => [formatPrice(v), 'Sales']}
                                contentStyle={{ borderRadius: '8px', border: '1px solid #eae5db', fontSize: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                            />
                            <Bar dataKey="sales" fill="#4B77BE" radius={[2, 2, 0, 0]} maxBarSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Monthly Sales Performance */}
                <div style={{ background: 'white', border: '1px solid #eae5db', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#333', marginBottom: '24px' }}>
                        Monthly Sales Performance
                    </div>
                    {monthlyData.length === 0 ? (
                        <div style={{ height: '260px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', fontSize: '13px' }}>
                            No sales data yet
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height={260}>
                            <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#888' }} axisLine={{ stroke: '#e0dcd2' }} tickLine={false} />
                                <YAxis tick={{ fontSize: 11, fill: '#888' }} axisLine={false} tickLine={false} tickFormatter={v => (v >= 1000 ? (v / 1000).toFixed(1) + 'k' : v)} />
                                <Tooltip
                                    formatter={(v) => [formatPrice(v), 'Monthly Sales']}
                                    contentStyle={{ borderRadius: '8px', border: '1px solid #eae5db', fontSize: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                                />
                                <Bar dataKey="sales" fill="#D4A843" radius={[2, 2, 0, 0]} maxBarSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>

            {/* Inventory Report Block */}
            <div style={{ background: 'white', border: '1px solid #eae5db', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#333', marginBottom: '20px' }}>
                    Inventory Report
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Total Products */}
                    <div style={{ background: '#f5f3ef', borderRadius: '8px', padding: '24px', textAlign: 'center' }}>
                        <div style={{ fontSize: '22px', fontWeight: 700, color: '#1a1a1a', marginBottom: '6px' }}>{inventory.totalProducts}</div>
                        <div style={{ fontSize: '12px', color: '#777' }}>Total Products</div>
                    </div>

                    {/* Total Stock Units */}
                    <div style={{ background: '#f5f3ef', borderRadius: '8px', padding: '24px', textAlign: 'center' }}>
                        <div style={{ fontSize: '22px', fontWeight: 700, color: '#1a1a1a', marginBottom: '6px' }}>{inventory.totalStock}</div>
                        <div style={{ fontSize: '12px', color: '#777' }}>Total Stock Units</div>
                    </div>

                    {/* Out of Stock */}
                    <div style={{ background: '#fcf2f2', borderRadius: '8px', padding: '24px', textAlign: 'center' }}>
                        <div style={{ fontSize: '22px', fontWeight: 700, color: '#db4437', marginBottom: '6px' }}>{inventory.outOfStock}</div>
                        <div style={{ fontSize: '12px', color: '#999' }}>Out of Stock</div>
                    </div>
                </div>
            </div>

        </div>
    );
}
