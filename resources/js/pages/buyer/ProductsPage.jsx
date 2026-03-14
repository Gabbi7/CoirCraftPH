import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Products } from '../../lib/db.js';
import ProductCard from '../../components/ProductCard.jsx';

const CATEGORIES = ['Coir Rope', 'Coir Mat', 'Coir Net', 'Coir Pot', 'Coir Board', 'Coir Fiber', 'Coir Grow Bag', 'Other'];
const SORTS = [
    { value: 'newest', label: 'Newest' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'popular', label: 'Most Popular' },
];

function Skeleton() {
    return (
        <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', border: '1px solid #f0e8d8' }}>
            <div className="skeleton" style={{ aspectRatio: '4/3' }} />
            <div style={{ padding: '16px' }}>
                <div className="skeleton" style={{ height: '12px', width: '60px', marginBottom: '8px' }} />
                <div className="skeleton" style={{ height: '16px', width: '90%', marginBottom: '6px' }} />
                <div className="skeleton" style={{ height: '20px', width: '80px', marginTop: '12px' }} />
            </div>
        </div>
    );
}

export default function ProductsPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('newest');
    const [activeCats, setActiveCats] = useState(() => {
        const cat = searchParams.get('cat');
        return cat ? [cat] : [];
    });

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setProducts(Products.getActive());
            setLoading(false);
        }, 400);
    }, []);

    const toggleCat = (cat) => {
        setActiveCats(prev =>
            prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
        );
    };

    const filtered = products
        .filter(p => {
            const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
            const matchCat = activeCats.length === 0 || activeCats.includes(p.category);
            return matchSearch && matchCat;
        })
        .sort((a, b) => {
            if (sort === 'price_asc') return a.price - b.price;
            if (sort === 'price_desc') return b.price - a.price;
            if (sort === 'popular') return b.sold_count - a.sold_count;
            return new Date(b.created_at) - new Date(a.created_at);
        });

    return (
        <div style={{ background: '#FFF8F0', minHeight: '100vh', paddingBottom: '80px' }}>
            {/* Page header */}
            <div style={{ background: 'linear-gradient(135deg, #2D5016 0%, #3d6b1f 100%)', padding: '60px 24px 40px' }}>
                <div className="max-w-7xl mx-auto">
                    <h1 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '42px', color: 'white', marginBottom: '8px' }}>
                        Our Products
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '16px' }}>
                        Premium coconut coir products, sustainably sourced from Philippine farms
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                {/* Search + Sort */}
                <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
                        <Search size={16} color="#aaa" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input
                            className="input-base"
                            style={{ paddingLeft: '40px', borderRadius: '99px' }}
                            placeholder="Search products..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <SlidersHorizontal size={16} color="#5a4030" />
                        <select
                            value={sort}
                            onChange={e => setSort(e.target.value)}
                            className="input-base"
                            style={{ width: 'auto', borderRadius: '99px', cursor: 'pointer' }}>
                            {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                        </select>
                    </div>
                </div>

                {/* Category chips */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
                    {CATEGORIES.map(cat => (
                        <button key={cat} onClick={() => toggleCat(cat)}
                            style={{
                                padding: '6px 16px', borderRadius: '99px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', border: '1.5px solid',
                                background: activeCats.includes(cat) ? '#2D5016' : 'white',
                                color: activeCats.includes(cat) ? 'white' : '#5a4030',
                                borderColor: activeCats.includes(cat) ? '#2D5016' : '#e5d5c0',
                                transition: 'all 0.2s',
                            }}>
                            {cat}
                            {activeCats.includes(cat) && <X size={12} style={{ display: 'inline', marginLeft: '4px' }} />}
                        </button>
                    ))}
                    {activeCats.length > 0 && (
                        <button onClick={() => setActiveCats([])}
                            style={{ padding: '6px 14px', borderRadius: '99px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', border: '1.5px solid #e5d5c0', background: '#fff5f5', color: '#c0392b', transition: 'all 0.2s' }}>
                            Clear all
                        </button>
                    )}
                </div>

                {/* Count */}
                <p style={{ color: '#888', fontSize: '14px', marginBottom: '20px' }}>
                    {!loading && `Showing ${filtered.length} product${filtered.length !== 1 ? 's' : ''}`}
                </p>

                {/* Grid */}
                {filtered.length === 0 && !loading ? (
                    <div style={{ textAlign: 'center', padding: '80px 20px' }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
                        <h3 style={{ fontWeight: 700, color: '#1a1a1a', marginBottom: '8px' }}>No products found</h3>
                        <p style={{ color: '#888' }}>Try adjusting your search or filters.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                        {loading
                            ? Array(8).fill(0).map((_, i) => <Skeleton key={i} />)
                            : filtered.map(p => <ProductCard key={p.id} product={p} />)
                        }
                    </div>
                )}
            </div>
        </div>
    );
}
