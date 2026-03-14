import { useState } from 'react';
import { User, Phone, MapPin, Save } from 'lucide-react';
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
                            { label: 'Full Name', value: user?.name },
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
                                <MapPin size={13} /> Address
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
            </div>
        </div>
    );
}
