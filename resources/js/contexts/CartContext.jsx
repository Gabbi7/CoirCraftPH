import { createContext, useContext, useState, useEffect } from 'react';
import { Cart } from '../lib/db.js';

const CartContext = createContext(null);

export function CartProvider({ children, userEmail }) {
    const [items, setItems] = useState([]);

    useEffect(() => {
        if (userEmail) {
            setItems(Cart.get(userEmail));
        } else {
            setItems([]);
        }
    }, [userEmail]);

    const save = (newItems) => {
        setItems(newItems);
        if (userEmail) Cart.set(userEmail, newItems);
    };

    const addItem = (product, qty = 1) => {
        const existing = items.find(i => i.product_id === product.id);
        let newItems;
        if (existing) {
            newItems = items.map(i =>
                i.product_id === product.id
                    ? { ...i, quantity: Math.min(i.quantity + qty, product.stock) }
                    : i
            );
        } else {
            newItems = [...items, {
                product_id: product.id,
                product_name: product.name,
                product_image: product.image_url,
                product_price: product.price,
                quantity: Math.min(qty, product.stock),
            }];
        }
        save(newItems);
    };

    const removeItem = (productId) => {
        save(items.filter(i => i.product_id !== productId));
    };

    const updateQty = (productId, qty, maxStock) => {
        if (qty < 1) { removeItem(productId); return; }
        save(items.map(i =>
            i.product_id === productId ? { ...i, quantity: Math.min(qty, maxStock) } : i
        ));
    };

    const clearCart = () => {
        save([]);
        if (userEmail) Cart.clear(userEmail);
    };

    const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
    const subtotal = items.reduce((sum, i) => sum + i.product_price * i.quantity, 0);

    return (
        <CartContext.Provider value={{ items, itemCount, subtotal, addItem, removeItem, updateQty, clearCart }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be inside CartProvider');
    return ctx;
}
