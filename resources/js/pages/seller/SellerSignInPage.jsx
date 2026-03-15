import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { LayoutDashboard, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

export default function SellerSignInPage() {
    const { signIn } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from || '/seller';
    const [form, setForm] = useState({ email: '', password: '' });
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const user = await signIn(form.email, form.password);
            if (user.role !== 'seller' && user.role !== 'admin') {
                throw new Error('This account does not have seller access.');
            }
            toast.success('Welcome to Seller Center!');
            navigate(from, { replace: true });
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: '#fcfaf7', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div style={{ width: '100%', maxWidth: '440px' }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <div style={{ display: 'inline-flex', padding: '12px', background: '#2D5016', borderRadius: '16px', color: 'white', marginBottom: '16px' }}>
                        <ShieldCheck size={32} />
                    </div>
                    <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '32px', fontWeight: 700, color: '#2D5016', marginBottom: '8px' }}>
                        Seller Center
                    </h1>
                    <p style={{ color: '#666', fontSize: '15px' }}>Manage your shop and orders with ease</p>
                </div>

                {/* Card */}
                <div style={{ background: 'white', borderRadius: '24px', padding: '48px', boxShadow: '0 10px 40px rgba(45,80,22,0.08)', border: '1px solid #eee' }}>
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', fontWeight: 600, fontSize: '14px', color: '#1a1a1a', marginBottom: '8px' }}>Email Address</label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })}
                                required
                                placeholder="seller@coircraft.ph"
                                style={{
                                    width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1.5px solid #e2e8f0',
                                    fontSize: '15px', transition: 'all 0.2s'
                                }}
                            />
                        </div>
                        <div style={{ marginBottom: '32px' }}>
                            <label style={{ display: 'block', fontWeight: 600, fontSize: '14px', color: '#1a1a1a', marginBottom: '8px' }}>Password</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showPw ? 'text' : 'password'}
                                    value={form.password}
                                    onChange={e => setForm({ ...form, password: e.target.value })}
                                    required
                                    placeholder="••••••••"
                                    style={{
                                        width: '100%', padding: '12px 48px 12px 16px', borderRadius: '12px', border: '1.5px solid #e2e8f0',
                                        fontSize: '15px', transition: 'all 0.2s'
                                    }}
                                />
                                <button type="button" onClick={() => setShowPw(!showPw)}
                                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: '100%', padding: '14px', borderRadius: '12px', background: '#2D5016', color: 'white',
                                fontWeight: 600, fontSize: '16px', border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                                opacity: loading ? 0.7 : 1, boxShadow: '0 4px 12px rgba(45,80,22,0.2)'
                            }}>
                            {loading ? 'Signing in...' : 'Sign In as Seller'}
                        </button>
                    </form>

                    <div style={{ marginTop: '32px', textAlign: 'center', borderTop: '1.5px solid #f1f5f9', paddingTop: '24px' }}>
                        <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '16px' }}>
                            Want to start selling on CoirCraft?
                        </p>
                        <Link to="/seller/signup" style={{ 
                            display: 'inline-block', color: '#2D5016', textDecoration: 'none', fontWeight: 700, 
                            fontSize: '14px', padding: '8px 20px', borderRadius: '10px', border: '1.5px solid #2D5016'
                        }}>
                            Become a Seller
                        </Link>
                    </div>
                </div>

                <div style={{ marginTop: '24px', textAlign: 'center' }}>
                    <Link to="/" style={{ color: '#64748b', textDecoration: 'none', fontSize: '14px' }}>
                        ← Back to Main Shop
                    </Link>
                </div>
            </div>
        </div>
    );
}
