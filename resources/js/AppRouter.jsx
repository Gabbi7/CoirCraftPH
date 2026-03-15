import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext.jsx';

// Layouts
import BuyerLayout from './components/layout/BuyerLayout.jsx';
import SellerLayout from './components/layout/SellerLayout.jsx';

// Buyer pages
import HomePage from './pages/buyer/HomePage.jsx';
import ProductsPage from './pages/buyer/ProductsPage.jsx';
import ProductDetailPage from './pages/buyer/ProductDetailPage.jsx';
import FeaturedPage from './pages/buyer/FeaturedPage.jsx';
import CartPage from './pages/buyer/CartPage.jsx';
import CheckoutPage from './pages/buyer/CheckoutPage.jsx';
import ProfilePage from './pages/buyer/ProfilePage.jsx';
import SignInPage from './pages/buyer/SignInPage.jsx';
import SignUpPage from './pages/buyer/SignUpPage.jsx';
import TransactionsPage from './pages/buyer/TransactionsPage.jsx';

// Seller pages
import SellerDashboard from './pages/seller/SellerDashboard.jsx';
import SellerInventory from './pages/seller/SellerInventory.jsx';
import SellerCategories from './pages/seller/SellerCategories.jsx';
import SellerStorefront from './pages/seller/SellerStorefront.jsx';
import SellerReports from './pages/seller/SellerReports.jsx';
import SellerSignInPage from './pages/seller/SellerSignInPage.jsx';

// Route Guards
const ProtectedRoute = ({ children, role }) => {
    const { user, loading } = useAuth();
    if (loading) return null;
    if (!user) {
        return <Navigate to={role === 'seller' ? "/seller/signin" : "/signin"} replace />;
    }
    if (role && user.role !== role && user.role !== 'admin') {
        return <Navigate to="/" replace />;
    }
    return children;
};

export default function AppRouter() {
    return (
        <Routes>
            {/* Buyer routes */}
            <Route element={<BuyerLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/featured" element={<FeaturedPage />} />
                <Route path="/products/:id" element={<ProductDetailPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<ProtectedRoute role="buyer"><CheckoutPage /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                <Route path="/signin" element={<SignInPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/transactions" element={<ProtectedRoute><TransactionsPage /></ProtectedRoute>} />
            </Route>

            {/* Seller routes */}
            <Route path="/seller/signin" element={<SellerSignInPage />} />
            <Route path="/seller/signup" element={<SignUpPage />} />
            
            <Route element={<ProtectedRoute role="seller"><SellerLayout /></ProtectedRoute>}>
                <Route path="/seller" element={<SellerDashboard />} />
                <Route path="/seller/inventory" element={<SellerInventory />} />
                <Route path="/seller/categories" element={<SellerCategories />} />
                <Route path="/seller/storefront" element={<SellerStorefront />} />
                <Route path="/seller/reports" element={<SellerReports />} />
            </Route>
        </Routes>
    );
}
