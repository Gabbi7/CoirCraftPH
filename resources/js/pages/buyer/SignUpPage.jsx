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

    // Get initial role from URL if present
    const queryParams = new URLSearchParams(location.search);
    const initialRole = queryParams.get('role') === 'seller' ? 'seller' : 'buyer';

    const [role, setRole] = useState(initialRole);
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        storeName: '',
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
            const fullName = role === 'buyer' 
                ? `${form.firstName.trim()} ${form.lastName.trim()}`
                : form.storeName.trim();

            await signUp({
                email: form.email,
                password: form.password,
                password_confirmation: form.confirmPassword,
                name: fullName,
                mobile_number: form.mobileNumber,
                address: form.address,
                role: role
            });

            toast.success(role === 'buyer' ? 'Account created successfully! 🌿' : 'Seller account created! Welcome aboard! 🏪');
            navigate(role === 'buyer' ? from : '/seller', { replace: true });
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
                    <p style={{ color: '#888', fontSize: '14px', marginTop: '8px' }}>Create an account to get started</p>
                </div>

                {/* Card */}
                <div style={{ background: 'white', borderRadius: '24px', padding: '40px', boxShadow: '0 4px 32px rgba(45,80,22,0.08)', border: '1px solid #f0e8d8' }}>
                    
                    {/* Role Selection Toggle */}
                    <div style={{ display: 'flex', background: '#f5f5f0', padding: '4px', borderRadius: '14px', marginBottom: '32px' }}>
                        <button 
                            type="button"
                            onClick={() => setRole('buyer')}
                            style={{ 
                                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                padding: '10px', borderRadius: '10px', fontSize: '14px', fontWeight: 600,
                                background: role === 'buyer' ? 'white' : 'transparent',
                                color: role === 'buyer' ? '#2D5016' : '#888',
                                border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                                boxShadow: role === 'buyer' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none'
                            }}>
                            <ShoppingBag size={16} /> I want to Shop
                        </button>
                        <button 
                            type="button"
                            onClick={() => setRole('seller')}
                            style={{ 
                                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                padding: '10px', borderRadius: '10px', fontSize: '14px', fontWeight: 600,
                                background: role === 'seller' ? 'white' : 'transparent',
                                color: role === 'seller' ? '#2D5016' : '#888',
                                border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                                boxShadow: role === 'seller' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none'
                            }}>
                            <Store size={16} /> I want to Sell
                        </button>
                    </div>

                    <h2 style={{ fontWeight: 700, fontSize: '22px', color: '#1a1a1a', marginBottom: '8px' }}>
                        {role === 'buyer' ? 'Sign up as Buyer' : 'Create Seller Account'}
                    </h2>
                    <p style={{ color: '#888', fontSize: '14px', marginBottom: '24px' }}>
                        {role === 'buyer' ? 'Join our community of eco-conscious shoppers' : 'Start your business journey with CoirCraft PH'}
                    </p>

                    <form onSubmit={handleSubmit}>
                        {role === 'buyer' ? (
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
                        ) : (
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontWeight: 600, fontSize: '13px', color: '#5a4030', marginBottom: '8px' }}>Store Name / Business Name</label>
                                <input
                                    type="text"
                                    value={form.storeName}
                                    onChange={e => setForm({ ...form, storeName: e.target.value })}
                                    required
                                    placeholder="e.g. Juan's Coir Products"
                                    className="input-base"
                                />
                            </div>
                        )}

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
                            <label style={{ display: 'block', fontWeight: 600, fontSize: '13px', color: '#5a4030', marginBottom: '8px' }}>{role === 'buyer' ? 'Shipping Address' : 'Store Address'}</label>
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
                            {loading ? 'Creating account...' : (role === 'buyer' ? 'Create Account' : 'Open My Store')}
                        </button>
                    </form>

                    <div style={{ marginTop: '24px', textAlign: 'center' }}>
                        <span style={{ color: '#888', fontSize: '14px' }}>Already have an account? </span>
                        <Link to={role === 'buyer' ? "/signin" : "/seller/signin"} style={{ color: '#2D5016', textDecoration: 'none', fontSize: '14px', fontWeight: 700 }}>
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
