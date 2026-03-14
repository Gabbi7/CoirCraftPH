import { Routes, Route } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext.jsx';

// Layouts
import BuyerLayout from './components/layout/BuyerLayout.jsx';
import SellerLayout from './components/layout/SellerLayout.jsx';

// Buyer pages
import HomePage from './pages/buyer/HomePage.jsx';
import ProductsPage from './pages/buyer/ProductsPage.jsx';
import ProductDetailPage from './pages/buyer/ProductDetailPage.jsx';
import CartPage from './pages/buyer/CartPage.jsx';
import CheckoutPage from './pages/buyer/CheckoutPage.jsx';
import ProfilePage from './pages/buyer/ProfilePage.jsx';
import SignInPage from './pages/buyer/SignInPage.jsx';
import TransactionsPage from './pages/buyer/TransactionsPage.jsx';

// Seller pages
import SellerDashboard from './pages/seller/SellerDashboard.jsx';
import SellerInventory from './pages/seller/SellerInventory.jsx';
import SellerStorefront from './pages/seller/SellerStorefront.jsx';
import SellerReports from './pages/seller/SellerReports.jsx';

export default function AppRouter() {
    return (
        <Routes>
            {/* Buyer routes */}
            <Route element={<BuyerLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/products/:id" element={<ProductDetailPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/signin" element={<SignInPage />} />
                <Route path="/transactions" element={<TransactionsPage />} />
            </Route>

            {/* Seller routes */}
            <Route element={<SellerLayout />}>
                <Route path="/seller" element={<SellerDashboard />} />
                <Route path="/seller/inventory" element={<SellerInventory />} />
                <Route path="/seller/storefront" element={<SellerStorefront />} />
                <Route path="/seller/reports" element={<SellerReports />} />
            </Route>
        </Routes>
    );
}
