import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import AppRouter from './AppRouter.jsx';
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import { CartProvider } from './contexts/CartContext.jsx';
import { seedIfNeeded } from './lib/db.js';
import '../css/app.css';

// Seed localStorage with demo data on first load
seedIfNeeded();

class ErrorBoundary extends React.Component {
    constructor(props) { super(props); this.state = { error: null, info: null }; }
    static getDerivedStateFromError(error) { return { error }; }
    componentDidCatch(error, info) {
        console.error('🔴 ErrorBoundary caught:', error, info);
        this.setState({ info });
    }
    render() {
        if (this.state.error) {
            return (
                <div style={{ padding: '40px', fontFamily: 'monospace', background: '#fff0f0', color: '#c00', border: '2px solid #c00', margin: '20px', borderRadius: '8px' }}>
                    <h2>⚠️ React Error</h2>
                    <pre style={{ whiteSpace: 'pre-wrap' }}>{String(this.state.error)}</pre>
                    <pre style={{ whiteSpace: 'pre-wrap', fontSize: '12px', color: '#888' }}>{this.state.info?.componentStack}</pre>
                </div>
            );
        }
        return this.props.children;
    }
}

function AppWithCart() {
    const { user } = useAuth();
    return (
        <CartProvider userEmail={user?.email}>
            <AppRouter />
            <Toaster position="top-right" richColors closeButton />
        </CartProvider>
    );
}

const appEl = document.getElementById('app');
if (appEl) {
    ReactDOM.createRoot(appEl).render(
        <React.StrictMode>
            <ErrorBoundary>
                <HashRouter>
                    <AuthProvider>
                        <AppWithCart />
                    </AuthProvider>
                </HashRouter>
            </ErrorBoundary>
        </React.StrictMode>
    );
} else {
    document.body.innerHTML = '<h1 style="color:red;padding:40px">ERROR: #app element not found!</h1>';
}
