import { useState } from 'react';
import { User, Phone, MapPin, Save, Store } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { toast } from 'sonner';

const ROLE_BADGE = {
    admin: { bg: '#e8f4f8', color: '#0077aa', label: 'Admin' },
    seller: { bg: '#fff3e0', color: '#c07800', label: 'Seller' },
    user: { bg: '#e8f5e9', color: '#2D5016', label: 'Buyer' },
};

export default function ProfilePage() {
    const { user, updateMe } = useAuth();
    const [form, setForm] = useState({ mobile_number: user?.mobile_number || '', address: user?.address || '' });
    const [saving, setSaving] = useState(false);

    const role = ROLE_BADGE[user?.role] || ROLE_BADGE.user;

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            updateMe(form);
            toast.success('Profile updated! 🌿');
        } catch {
            toast.error('Failed to save. Try again.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div style={{ background: '#FFF8F0', minHeight: '100vh', paddingBottom: '80px' }}>
            <div style={{ background: 'linear-gradient(135deg, #2D5016, #3d6b1f)', padding: '60px 24px 80px' }}>
                <div className="max-w-3xl mx-auto text-center">
                    <div style={{ width: '80px', height: '80px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                        <User size={36} color="white" />
                    </div>
                    <h1 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '30px', color: 'white', marginBottom: '8px' }}>
                        {user?.name}
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', marginBottom: '12px' }}>{user?.email}</p>
                    <span style={{ background: role.bg, color: role.color, padding: '4px 16px', borderRadius: '99px', fontSize: '12px', fontWeight: 700 }}>
                        {role.label}
                    </span>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 sm:px-6" style={{ marginTop: '-40px' }}>
                <div style={{ background: 'white', border: '1px solid #f0e8d8', borderRadius: '20px', padding: '36px', boxShadow: '0 4px 24px rgba(45,80,22,0.08)' }}>
                    <h2 style={{ fontWeight: 700, fontSize: '20px', color: '#1a1a1a', marginBottom: '24px' }}>Edit Profile</h2>

                    {/* Read-only fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
                        {[
                            { label: (user?.role === 'seller' || user?.role === 'admin') ? 'Store Name' : 'Full Name', value: user?.name },
                            { label: 'Email Address', value: user?.email },
                        ].map(field => (
                            <div key={field.label}>
                                <label style={{ display: 'block', fontWeight: 600, fontSize: '13px', color: '#5a4030', marginBottom: '8px' }}>{field.label}</label>
                                <div style={{ padding: '11px 14px', border: '1.5px solid #e5d5c0', borderRadius: '8px', background: '#f5f5f0', color: '#888', fontSize: '14px' }}>
                                    {field.value}
                                </div>
                            </div>
                        ))}
                    </div>

                    <form onSubmit={handleSave}>
                        {/* Mobile */}
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, fontSize: '13px', color: '#5a4030', marginBottom: '8px' }}>
                                <Phone size={13} /> Mobile Number
                            </label>
                            <input
                                type="tel"
                                value={form.mobile_number}
                                onChange={e => setForm({ ...form, mobile_number: e.target.value })}
                                placeholder="e.g. 09171234567"
                                className="input-base"
                            />
                        </div>

                        {/* Address */}
                        <div style={{ marginBottom: '28px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, fontSize: '13px', color: '#5a4030', marginBottom: '8px' }}>
                                <MapPin size={13} /> {(user?.role === 'seller' || user?.role === 'admin') ? 'Store Address' : 'Address'}
                            </label>
                            <textarea
                                value={form.address}
                                onChange={e => setForm({ ...form, address: e.target.value })}
                                rows={3}
                                placeholder="Your complete address..."
                                className="input-base"
                                style={{ resize: 'vertical' }}
                            />
                        </div>

                        <button type="submit" disabled={saving}
                            className="btn-forest"
                            style={{ padding: '14px 36px', borderRadius: '12px', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px', opacity: saving ? 0.7 : 1 }}>
                            <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </form>
                </div>

                {/* Become a Seller Promotion */}
                {user?.role !== 'seller' && user?.role !== 'admin' && (
                    <div style={{ marginTop: '32px', padding: '32px', background: 'white', borderRadius: '20px', border: '1px solid #e5d5c0', boxShadow: '0 8px 32px rgba(45,80,22,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                        <div style={{ width: '56px', height: '56px', background: '#e8f0e0', color: '#2D5016', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                            <Store size={28} />
                        </div>
                        <h3 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '20px', color: '#2D5016', marginBottom: '8px' }}>
                            Start Selling on CoirCraft PH
                        </h3>
                        <p style={{ color: '#666', fontSize: '14px', maxWidth: '400px', marginBottom: '24px', lineHeight: '1.6' }}>
                            Have quality coconut coir products? Join our growing community of sellers and reach customers nationwide.
                        </p>
                        <Link to="/signup?role=seller" style={{ textDecoration: 'none' }}>
                            <button className="btn-forest" style={{ padding: '12px 32px', borderRadius: '12px', fontSize: '15px', fontWeight: 600 }}>
                                Open Your Store
                            </button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
