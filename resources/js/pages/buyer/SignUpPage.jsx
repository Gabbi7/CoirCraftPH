import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { Leaf, Eye, EyeOff, ShoppingBag, Store } from 'lucide-react';
import { toast } from 'sonner';

export default function SignUpPage() {
    const { signUp } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from || '/';

    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        mobileNumber: '',
        address: '',
        password: '',
        confirmPassword: ''
    });

    const [showPw, setShowPw] = useState(false);
    const [showConfirmPw, setShowConfirmPw] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.password !== form.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setLoading(true);
        try {
            const fullName = `${form.firstName.trim()} ${form.lastName.trim()}`;

            await signUp({
                email: form.email,
                password: form.password,
                password_confirmation: form.confirmPassword,
                name: fullName,
                mobile_number: form.mobileNumber,
                address: form.address,
                role: 'buyer'
            });

            toast.success('Account created successfully! 🌿');
            navigate(from, { replace: true });
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: '#FFF8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
            <div style={{ width: '100%', maxWidth: '500px' }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <Link to="/" style={{ textDecoration: 'none' }}>
                    <div className="flex items-center justify-center gap-2 mb-8 group">
                        <img src="/images/logo-green.png" alt="CoirCraft PH Logo" style={{ height: '48px', width: 'auto', borderRadius: '8px' }} className="group-hover:scale-105 transition-transform duration-300" />
                        <span style={{ fontFamily: 'Playfair Display, Georgia, serif', fontWeight: 700, color: '#2D5016', fontSize: '28px' }}>
                                CoirCraft<span style={{ color: '#D4A843' }}> PH</span>
                            </span>
                        </div>
                    </Link>
                </div>

                {/* Card */}
                <div style={{ background: 'white', borderRadius: '24px', padding: '40px', boxShadow: '0 4px 32px rgba(45,80,22,0.08)', border: '1px solid #f0e8d8' }}>
                    
                    <h2 style={{ fontWeight: 700, fontSize: '22px', color: '#1a1a1a', marginBottom: '24px' }}>
                        Get Started
                    </h2>

                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', fontWeight: 600, fontSize: '13px', color: '#5a4030', marginBottom: '8px' }}>First Name</label>
                                <input
                                    type="text"
                                    value={form.firstName}
                                    onChange={e => setForm({ ...form, firstName: e.target.value })}
                                    required
                                    placeholder="Juan"
                                    className="input-base"
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', fontWeight: 600, fontSize: '13px', color: '#5a4030', marginBottom: '8px' }}>Last Name</label>
                                <input
                                    type="text"
                                    value={form.lastName}
                                    onChange={e => setForm({ ...form, lastName: e.target.value })}
                                    required
                                    placeholder="Dela Cruz"
                                    className="input-base"
                                />
                            </div>
                        </div>

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

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontWeight: 600, fontSize: '13px', color: '#5a4030', marginBottom: '8px' }}>Mobile Number</label>
                            <input
                                type="tel"
                                value={form.mobileNumber}
                                onChange={e => setForm({ ...form, mobileNumber: e.target.value })}
                                required
                                placeholder="09XX XXX XXXX"
                                className="input-base"
                            />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontWeight: 600, fontSize: '13px', color: '#5a4030', marginBottom: '8px' }}>Shipping Address</label>
                            <input
                                type="text"
                                value={form.address}
                                onChange={e => setForm({ ...form, address: e.target.value })}
                                required
                                placeholder="123 Main St, City, Province"
                                className="input-base"
                            />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
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

                        <div style={{ marginBottom: '28px' }}>
                            <label style={{ display: 'block', fontWeight: 600, fontSize: '13px', color: '#5a4030', marginBottom: '8px' }}>Confirm Password</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showConfirmPw ? 'text' : 'password'}
                                    value={form.confirmPassword}
                                    onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                                    required
                                    placeholder="••••••••"
                                    className="input-base"
                                    style={{ paddingRight: '44px' }}
                                />
                                <button type="button" onClick={() => setShowConfirmPw(!showConfirmPw)}
                                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}>
                                    {showConfirmPw ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-forest"
                            style={{ width: '100%', padding: '14px', borderRadius: '12px', fontSize: '16px', opacity: loading ? 0.7 : 1 }}>
                            {loading ? 'Creating account...' : 'Create Account'}
                        </button>
                    </form>

                    <div style={{ marginTop: '24px', textAlign: 'center' }}>
                        <span style={{ color: '#888', fontSize: '14px' }}>Already have an account? </span>
                        <Link to="/signin" style={{ color: '#2D5016', textDecoration: 'none', fontSize: '14px', fontWeight: 700 }}>
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
