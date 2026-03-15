import { useState, useEffect, useRef } from 'react';
import { Plus, Pencil, Trash2, Search, X, Package } from 'lucide-react';
import { Products, CATEGORIES } from '../../lib/db.js';
import { formatPrice, generateId } from '../../lib/utils.js';
import { toast } from 'sonner';

const FEATURED_TYPES = ['None', 'New', 'Trending', 'Best Seller'];

const EMPTY_FORM = { name: '', description: '', price: '', stock: '', category: '', image_url: '', featured_type: 'None', is_active: true };

export default function SellerInventory() {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState('');
    const [dialog, setDialog] = useState(null); // null | 'add' | 'edit' | 'delete'
    const [selected, setSelected] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);

    const refresh = async () => {
        try {
            const data = await Products.getAll();
            setProducts(data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
        } catch (error) {
            console.error('Refresh failed:', error);
        }
    };

    useEffect(() => { refresh(); }, []);

    const openAdd = () => { setForm({ ...EMPTY_FORM, category: CATEGORIES[0] || '' }); setSelected(null); setDialog('add'); };
    const openEdit = (p) => { setSelected(p); setForm({ name: p.name, description: p.description, price: p.price, stock: p.stock, category: p.category, image_url: p.image_url || '', featured_type: p.featured_type || 'None', is_active: p.is_active }); setDialog('edit'); };
    const openDelete = (p) => { setSelected(p); setDialog('delete'); };
    const closeDialog = () => { setDialog(null); setSelected(null); };

    const handleSave = async () => {
        if (!form.name.trim() || !form.price || !form.stock) { toast.error('Name, price, and stock are required'); return; }
        const price = parseFloat(form.price);
        const stock = parseInt(form.stock);
        if (isNaN(price) || price <= 0) { toast.error('Enter a valid price'); return; }
        if (isNaN(stock) || stock < 0) { toast.error('Enter a valid stock count'); return; }

        try {
            if (dialog === 'add') {
                await Products.create({ ...form, price, stock });
                toast.success('Product added!');
            } else {
                await Products.update(selected.id, { ...form, price, stock });
                toast.success('Product updated!');
            }
            await refresh();
            closeDialog();
        } catch (error) {
            toast.error('Failed to save product');
        }
    };

    const handleDelete = async () => {
        try {
            await Products.delete(selected.id);
            toast.success('Product deleted');
            await refresh();
            closeDialog();
        } catch (error) {
            toast.error('Failed to delete product');
        }
    };

    const filtered = products.filter(p =>
        !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div style={{ padding: '32px' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                    <h1 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '32px', color: '#1a1a1a', marginBottom: '4px' }}>Inventory</h1>
                    <p style={{ color: '#888', fontSize: '14px' }}>{products.length} product{products.length !== 1 ? 's' : ''} total</p>
                </div>
                <button onClick={openAdd}
                    className="btn-forest"
                    style={{ padding: '12px 24px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                    <Plus size={18} /> Add Product
                </button>
            </div>

            {/* Search */}
            <div style={{ position: 'relative', marginBottom: '20px', maxWidth: '360px' }}>
                <Search size={15} color="#aaa" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input className="input-base" style={{ paddingLeft: '38px', borderRadius: '99px' }}
                    placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>

            {/* Table */}
            <div style={{ background: 'white', border: '1px solid #f0e8d8', borderRadius: '16px', overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f5ece0', borderBottom: '1px solid #e8d8c0' }}>
                                {['Product', 'Category', 'Price', 'Stock', 'Status', 'Featured', 'Actions'].map(h => (
                                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: '#5a4030', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={7} style={{ textAlign: 'center', padding: '60px', color: '#888' }}>
                                        <Package size={40} style={{ opacity: 0.3, display: 'block', margin: '0 auto 12px' }} />
                                        No products found
                                    </td>
                                </tr>
                            ) : filtered.map((p, i) => (
                                <tr key={p.id} style={{ borderBottom: '1px solid #f5ece0', transition: 'background 0.15s' }}
                                    onMouseEnter={e => { e.currentTarget.style.background = '#fdf9f3'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                                    <td style={{ padding: '14px 16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <img src={p.image_url || 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=80&q=60'} alt={p.name}
                                                style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '8px', background: '#f5ece0', flexShrink: 0 }} />
                                            <span style={{ fontWeight: 700, color: '#1a1a1a', fontSize: '14px', maxWidth: '180px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.name}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '14px 16px' }}>
                                        <span style={{ background: '#e8f0e0', color: '#2D5016', fontSize: '12px', fontWeight: 700, padding: '3px 10px', borderRadius: '99px' }}>{p.category}</span>
                                    </td>
                                    <td style={{ padding: '14px 16px', fontWeight: 700, color: '#2D5016' }}>{formatPrice(p.price)}</td>
                                    <td style={{ padding: '14px 16px' }}>
                                        <span style={{ color: p.stock <= 0 ? '#c0392b' : p.stock <= 5 ? '#c0800b' : '#2D5016', fontWeight: 700 }}>{p.stock}</span>
                                    </td>
                                    <td style={{ padding: '14px 16px' }}>
                                        <span style={{ background: p.is_active ? '#e8f5e9' : '#f5f5f5', color: p.is_active ? '#2D5016' : '#888', fontSize: '12px', fontWeight: 700, padding: '3px 10px', borderRadius: '99px' }}>
                                            {p.is_active ? 'Active' : 'Hidden'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '14px 16px' }}>
                                        <span style={{ fontSize: '12px', color: '#888' }}>{p.featured_type === 'None' ? '—' : p.featured_type}</span>
                                    </td>
                                    <td style={{ padding: '14px 16px' }}>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button onClick={() => openEdit(p)}
                                                style={{ background: '#e8f4f8', border: 'none', borderRadius: '8px', padding: '6px 10px', cursor: 'pointer', color: '#0077aa', transition: 'all 0.2s' }}
                                                onMouseEnter={e => { e.currentTarget.style.background = '#d0e8f0'; }}
                                                onMouseLeave={e => { e.currentTarget.style.background = '#e8f4f8'; }}>
                                                <Pencil size={14} />
                                            </button>
                                            <button onClick={() => openDelete(p)}
                                                style={{ background: '#fff5f5', border: 'none', borderRadius: '8px', padding: '6px 10px', cursor: 'pointer', color: '#c0392b', transition: 'all 0.2s' }}
                                                onMouseEnter={e => { e.currentTarget.style.background = '#ffe0e0'; }}
                                                onMouseLeave={e => { e.currentTarget.style.background = '#fff5f5'; }}>
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Dialog */}
            {(dialog === 'add' || dialog === 'edit') && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div style={{ background: 'white', borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h2 style={{ fontWeight: 700, fontSize: '20px', color: '#1a1a1a' }}>{dialog === 'add' ? 'Add Product' : 'Edit Product'}</h2>
                            <button onClick={closeDialog} style={{ background: '#f5f5f5', border: 'none', borderRadius: '8px', padding: '6px', cursor: 'pointer' }}><X size={18} /></button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                { label: 'Product Name *', key: 'name', type: 'text', colSpan: 2 },
                                { label: 'Price (₱) *', key: 'price', type: 'number' },
                                { label: 'Stock *', key: 'stock', type: 'number' },
                                { label: 'Image URL', key: 'image_url', type: 'text', colSpan: 2 },
                            ].map(field => (
                                <div key={field.key} style={{ gridColumn: field.colSpan === 2 ? 'span 2' : 'span 1' }}>
                                    <label style={{ display: 'block', fontWeight: 600, fontSize: '13px', color: '#5a4030', marginBottom: '6px' }}>{field.label}</label>
                                    <input type={field.type} value={form[field.key]} onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                                        className="input-base" placeholder={field.label.replace(' *', '')} />
                                </div>
                            ))}
                            <div>
                                <label style={{ display: 'block', fontWeight: 600, fontSize: '13px', color: '#5a4030', marginBottom: '6px' }}>Category</label>
                                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="input-base">
                                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontWeight: 600, fontSize: '13px', color: '#5a4030', marginBottom: '6px' }}>Featured Badge</label>
                                <select value={form.featured_type} onChange={e => setForm({ ...form, featured_type: e.target.value })} className="input-base">
                                    {FEATURED_TYPES.map(f => <option key={f} value={f}>{f}</option>)}
                                </select>
                            </div>
                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={{ display: 'block', fontWeight: 600, fontSize: '13px', color: '#5a4030', marginBottom: '6px' }}>Description</label>
                                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="input-base" style={{ resize: 'vertical' }} />
                            </div>
                            <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <input type="checkbox" id="active-toggle" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} style={{ accentColor: '#2D5016', width: '16px', height: '16px' }} />
                                <label htmlFor="active-toggle" style={{ fontWeight: 600, fontSize: '14px', color: '#5a4030', cursor: 'pointer' }}>Active (visible in store)</label>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                            <button onClick={handleSave} className="btn-forest" style={{ flex: 1, padding: '13px', borderRadius: '12px', fontSize: '15px' }}>
                                {dialog === 'add' ? 'Add Product' : 'Save Changes'}
                            </button>
                            <button onClick={closeDialog} style={{ padding: '13px 24px', borderRadius: '12px', fontSize: '15px', fontWeight: 600, background: '#f5f5f5', border: 'none', cursor: 'pointer' }}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Dialog */}
            {dialog === 'delete' && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div style={{ background: 'white', borderRadius: '20px', padding: '32px', maxWidth: '400px', width: '100%' }}>
                        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🗑️</div>
                            <h2 style={{ fontWeight: 700, fontSize: '20px', color: '#1a1a1a', marginBottom: '8px' }}>Delete Product?</h2>
                            <p style={{ color: '#888', fontSize: '14px' }}>
                                "<strong>{selected?.name}</strong>" will be permanently removed.
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button onClick={handleDelete} style={{ flex: 1, padding: '13px', borderRadius: '12px', fontSize: '15px', fontWeight: 700, background: '#c0392b', color: 'white', border: 'none', cursor: 'pointer' }}>
                                Delete
                            </button>
                            <button onClick={closeDialog} style={{ flex: 1, padding: '13px', borderRadius: '12px', fontSize: '15px', fontWeight: 700, background: '#f5f5f5', border: 'none', cursor: 'pointer' }}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
