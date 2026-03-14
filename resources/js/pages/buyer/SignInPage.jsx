import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { Leaf, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

export default function SignInPage() {
    const { signIn } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from || '/';
    const [form, setForm] = useState({ email: '', password: '' });
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            signIn(form.email, form.password);
            toast.success('Welcome back! 🌿');
            navigate(from, { replace: true });
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: '#FFF8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div style={{ width: '100%', maxWidth: '420px' }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                            <div style={{ background: '#2D5016', borderRadius: '12px', padding: '10px' }}>
                                <Leaf size={24} color="white" />
                            </div>
                            <span style={{ fontFamily: 'Playfair Display, Georgia, serif', fontWeight: 700, color: '#2D5016', fontSize: '28px' }}>
                                CocoFiber<span style={{ color: '#D4A843' }}> PH</span>
                            </span>
                        </div>
                    </Link>
                    <p style={{ color: '#888', fontSize: '14px', marginTop: '8px' }}>Sign in to continue shopping</p>
                </div>

                {/* Card */}
                <div style={{ background: 'white', borderRadius: '20px', padding: '40px', boxShadow: '0 4px 24px rgba(45,80,22,0.1)', border: '1px solid #f0e8d8' }}>
                    <h2 style={{ fontWeight: 700, fontSize: '22px', color: '#1a1a1a', marginBottom: '24px' }}>Welcome back</h2>

                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontWeight: 600, fontSize: '13px', color: '#5a4030', marginBottom: '8px' }}>Email Address</label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })}
                                required
                                placeholder="you@example.com"
                                className="input-base"
                            />
                        </div>
                        <div style={{ marginBottom: '28px' }}>
                            <label style={{ display: 'block', fontWeight: 600, fontSize: '13px', color: '#5a4030', marginBottom: '8px' }}>Password</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showPw ? 'text' : 'password'}
                                    value={form.password}
                                    onChange={e => setForm({ ...form, password: e.target.value })}
                                    required
                                    placeholder="••••••••"
                                    className="input-base"
                                    style={{ paddingRight: '44px' }}
                                />
                                <button type="button" onClick={() => setShowPw(!showPw)}
                                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}>
                                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-forest"
                            style={{ width: '100%', padding: '14px', borderRadius: '12px', fontSize: '16px', opacity: loading ? 0.7 : 1 }}>
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    {/* Demo credentials */}
                    <div style={{ marginTop: '24px', padding: '16px', background: '#f5f9f0', borderRadius: '12px', border: '1px solid #d4e8c0' }}>
                        <p style={{ fontSize: '12px', fontWeight: 700, color: '#2D5016', marginBottom: '8px' }}>Demo Credentials</p>
                        {[
                            { label: 'Buyer', email: 'buyer@cocofiber.ph', password: 'password' },
                            { label: 'Admin/Seller', email: 'admin@cocofiber.ph', password: 'password' },
                        ].map(cred => (
                            <button key={cred.email} type="button"
                                onClick={() => setForm({ email: cred.email, password: cred.password })}
                                style={{ display: 'block', width: '100%', textAlign: 'left', padding: '8px 10px', background: 'white', border: '1px solid #e0d5c0', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', marginBottom: '6px', transition: 'all 0.2s' }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = '#2D5016'; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e0d5c0'; }}>
                                <strong style={{ color: '#2D5016' }}>{cred.label}:</strong> {cred.email}
                            </button>
                        ))}
                    </div>
                    <div style={{ marginTop: '20px', textAlign: 'center' }}>
                        <Link to="/" style={{ color: '#2D5016', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>
                            ← Continue browsing as guest
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
