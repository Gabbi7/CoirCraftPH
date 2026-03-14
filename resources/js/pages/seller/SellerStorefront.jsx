import { useState, useEffect } from 'react';
import { Save, ExternalLink, Sparkles } from 'lucide-react';
import { Storefront } from '../../lib/db.js';
import { toast } from 'sonner';

export default function SellerStorefront() {
    const [form, setForm] = useState({
        hero_title: '',
        hero_subtitle: '',
        hero_image: '',
        banner_text: '',
        promo_text: '',
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const config = Storefront.get();
        setForm({
            hero_title: config.hero_title || '',
            hero_subtitle: config.hero_subtitle || '',
            hero_image: config.hero_image || '',
            banner_text: config.banner_text || '',
            promo_text: config.promo_text || '',
        });
    }, []);

    const handleSave = (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            Storefront.update(form);
            toast.success('Storefront updated! Changes will show on the homepage.');
        } catch {
            toast.error('Save failed. Try again.');
        } finally {
            setSaving(false);
        }
    };

    const FIELDS = [
        { key: 'hero_title', label: 'Hero Headline', placeholder: 'e.g. From Husk to Home', type: 'text', hint: 'Large title displayed over the hero image' },
        { key: 'hero_subtitle', label: 'Hero Subtitle', placeholder: 'Your tagline here...', type: 'textarea', hint: 'Description text below the headline' },
        { key: 'hero_image', label: 'Hero Background Image URL', placeholder: 'https://...', type: 'text', hint: 'Full URL to a high-resolution background image' },
        { key: 'banner_text', label: 'Top Announcement Banner', placeholder: 'e.g. 🌿 Sustainably sourced — Free shipping over ₱2,000', type: 'text', hint: 'Shown in the green bar above the header' },
        { key: 'promo_text', label: 'Promo Badge Text', placeholder: 'e.g. SUMMER SALE', type: 'text', hint: 'Shown as a gold badge on the hero section' },
    ];

    return (
        <div style={{ padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                    <h1 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '32px', color: '#1a1a1a', marginBottom: '6px' }}>Storefront Editor</h1>
                    <p style={{ color: '#888', fontSize: '14px' }}>Customize how your storefront looks to buyers</p>
                </div>
                <a href="/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                    <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '10px', border: '1.5px solid #e5d5c0', background: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: 600, color: '#5a4030', transition: 'all 0.2s' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#2D5016'; e.currentTarget.style.color = '#2D5016'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5d5c0'; e.currentTarget.style.color = '#5a4030'; }}>
                        <ExternalLink size={16} /> Preview Storefront
                    </button>
                </a>
            </div>

            <form onSubmit={handleSave}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Hero Section card */}
                    <div style={{ background: 'white', border: '1px solid #f0e8d8', borderRadius: '20px', padding: '28px' }}>
                        <h2 style={{ fontWeight: 700, fontSize: '17px', color: '#1a1a1a', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Sparkles size={18} color="#D4A843" /> Hero Section
                        </h2>
                        {FIELDS.filter(f => ['hero_title', 'hero_subtitle', 'hero_image'].includes(f.key)).map(field => (
                            <div key={field.key} style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontWeight: 600, fontSize: '13px', color: '#5a4030', marginBottom: '6px' }}>{field.label}</label>
                                {field.type === 'textarea' ? (
                                    <textarea value={form[field.key]} onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                                        rows={3} placeholder={field.placeholder} className="input-base" style={{ resize: 'vertical' }} />
                                ) : (
                                    <input type="text" value={form[field.key]} onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                                        placeholder={field.placeholder} className="input-base" />
                                )}
                                <p style={{ fontSize: '12px', color: '#aaa', marginTop: '5px' }}>{field.hint}</p>
                            </div>
                        ))}
                    </div>

                    {/* Banner & Promos card */}
                    <div style={{ background: 'white', border: '1px solid #f0e8d8', borderRadius: '20px', padding: '28px' }}>
                        <h2 style={{ fontWeight: 700, fontSize: '17px', color: '#1a1a1a', marginBottom: '20px' }}>🎯 Announcements & Promos</h2>
                        {FIELDS.filter(f => ['banner_text', 'promo_text'].includes(f.key)).map(field => (
                            <div key={field.key} style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontWeight: 600, fontSize: '13px', color: '#5a4030', marginBottom: '6px' }}>{field.label}</label>
                                <input type="text" value={form[field.key]} onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                                    placeholder={field.placeholder} className="input-base" />
                                <p style={{ fontSize: '12px', color: '#aaa', marginTop: '5px' }}>{field.hint}</p>
                            </div>
                        ))}

                        {/* Live preview snippets */}
                        <div style={{ marginTop: '24px', padding: '20px', background: '#1f3a0f', borderRadius: '12px' }}>
                            <p style={{ fontSize: '11px', fontWeight: 700, color: '#D4A843', marginBottom: '8px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Banner Preview</p>
                            <p style={{ color: 'white', fontSize: '13px' }}>{form.banner_text || '(empty)'}</p>
                        </div>
                        {form.promo_text && (
                            <div style={{ marginTop: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(212,168,67,0.3)', border: '1px solid rgba(212,168,67,0.5)', color: '#c08000', padding: '6px 14px', borderRadius: '99px', fontSize: '12px', fontWeight: 700 }}>
                                ✨ {form.promo_text}
                            </div>
                        )}
                    </div>
                </div>

                <div style={{ marginTop: '28px' }}>
                    <button type="submit" disabled={saving}
                        className="btn-forest"
                        style={{ padding: '14px 36px', borderRadius: '12px', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px', opacity: saving ? 0.7 : 1 }}>
                        <Save size={18} /> {saving ? 'Saving...' : 'Save All Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
}
