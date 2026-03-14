import { createContext, useContext, useState, useEffect } from 'react';
import { Users } from '../lib/db.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem('coco_auth_user');
        if (stored) {
            try { setUser(JSON.parse(stored)); } catch { }
        }
        setLoading(false);
    }, []);

    const signIn = (email, password) => {
        const found = Users.getByEmail(email);
        if (!found || found.password !== password) {
            throw new Error('Invalid email or password');
        }
        const { password: _, ...safeUser } = found;
        setUser(safeUser);
        localStorage.setItem('coco_auth_user', JSON.stringify(safeUser));
        return safeUser;
    };

    const signOut = () => {
        setUser(null);
        localStorage.removeItem('coco_auth_user');
    };

    const updateMe = (data) => {
        if (!user) return;
        Users.update(user.email, data);
        const updated = { ...user, ...data };
        setUser(updated);
        localStorage.setItem('coco_auth_user', JSON.stringify(updated));
        return updated;
    };

    const isAdmin = user?.role === 'admin';
    const isSeller = user?.role === 'seller' || user?.role === 'admin';

    return (
        <AuthContext.Provider value={{ user, loading, signIn, signOut, updateMe, isAdmin, isSeller }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be inside AuthProvider');
    return ctx;
}
