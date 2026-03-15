import { useState, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SellerStoreView() {
    const [iframeHeight, setIframeHeight] = useState('calc(100vh - 120px)');

    useEffect(() => {
        // Optional: Add logic here if we need to dynamically adjust iframe height based on window size
        const handleResize = () => {
            setIframeHeight('calc(100vh - 120px)');
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto', height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '28px', fontWeight: 700, color: '#1a1a1a', marginBottom: '4px' }}>
                        Store Preview
                    </h1>
                    <p style={{ color: '#666', fontSize: '14px' }}>This is how buyers see your storefront</p>
                </div>
                <Link to="/" target="_blank" style={{ textDecoration: 'none' }}>
                    <button style={{ 
                        display: 'flex', alignItems: 'center', gap: '8px', 
                        padding: '10px 16px', borderRadius: '8px', 
                        background: 'white', color: '#2D5016', 
                        border: '1px solid #e5d5c0', fontWeight: 600, fontSize: '14px',
                        cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                    }}>
                        <ExternalLink size={16} /> Open in New Tab
                    </button>
                </Link>
            </div>

            <div style={{ 
                background: 'white', 
                borderRadius: '16px', 
                border: '1px solid #e5d5c0', 
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(45,80,22,0.08)',
                height: iframeHeight
            }}>
                <iframe 
                    src="/?preview_mode=true" 
                    title="Store Preview"
                    style={{ width: '100%', height: '100%', border: 'none' }}
                />
            </div>
        </div>
    );
}
