import axios from 'axios';

const KEYS = {
    ORDERS: 'coco_orders',
    CART: 'coco_cart',
    USERS: 'coco_users',
    STOREFRONT: 'coco_storefront',
};

export const CATEGORIES = [
    "Gardening",
    "Home Products",
    "Agriculture",
    "Raw Materials"
];

// ── Generic helpers (Still used for non-MariaDB parts) ───────────
function read(key) {
    try { return JSON.parse(localStorage.getItem(key)) || []; }
    catch { return []; }
}
function readOne(key) {
    try { return JSON.parse(localStorage.getItem(key)); }
    catch { return null; }
}
function write(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// ── Products (MariaDB via API) ──────────────────────────────────
export const Products = {
    getAll: async () => {
        const res = await axios.get('/api/products');
        return res.data;
    },
    getActive: async () => {
        const res = await axios.get('/api/products');
        return res.data.filter(p => p.is_active);
    },
    getById: async (id) => {
        const res = await axios.get(`/api/products/${id}`);
        return res.data;
    },
    create: async (data) => {
        const res = await axios.post('/api/products', data);
        return res.data;
    },
    update: async (id, data) => {
        const res = await axios.put(`/api/products/${id}`, data);
        return res.data;
    },
    remove: async (id) => {
        await axios.delete(`/api/products/${id}`);
    },
    delete: async (id) => {
        await axios.delete(`/api/products/${id}`);
    },
    decrementStock: async (id, qty) => {
        // Simple implementation: fetch, calc, update
        const p = await Products.getById(id);
        await Products.update(id, { 
            stock: Math.max(0, p.stock - qty), 
            sold_count: (p.sold_count || 0) + qty 
        });
    },
};

// ── Orders (MariaDB via API) ──────────────────────────────────
export const Orders = {
    getAll: async () => {
        const res = await axios.get('/api/orders');
        return res.data;
    },
    getByEmail: async (email) => {
        const res = await axios.get('/api/orders');
        return res.data.filter(o => o.user_email === email);
    },
    getById: async (id) => {
        const res = await axios.get(`/api/orders/${id}`);
        return res.data;
    },
    create: async (data) => {
        const res = await axios.post('/api/orders', data);
        return res.data;
    },
    update: async (id, data) => {
        const res = await axios.put(`/api/orders/${id}`, data);
        return res.data;
    },
};

// ── Cart ────────────────────────────────────────────────────────
export const Cart = {
    get: (email) => {
        const all = readOne(KEYS.CART) || {};
        return all[email] || [];
    },
    set: (email, items) => {
        const all = readOne(KEYS.CART) || {};
        all[email] = items;
        write(KEYS.CART, all);
    },
    clear: (email) => {
        const all = readOne(KEYS.CART) || {};
        all[email] = [];
        write(KEYS.CART, all);
    },
};

// ── Users ───────────────────────────────────────────────────────
export const Users = {
    getAll: () => read(KEYS.USERS),
    getByEmail: (email) => read(KEYS.USERS).find(u => u.email === email),
    create: (data) => {
        const items = read(KEYS.USERS);
        const item = { ...data, id: Date.now().toString(36), created_at: new Date().toISOString() };
        items.push(item);
        write(KEYS.USERS, items);
        return item;
    },
    update: (email, data) => {
        const items = read(KEYS.USERS).map(u => u.email === email ? { ...u, ...data } : u);
        write(KEYS.USERS, items);
        return items.find(u => u.email === email);
    },
};

// ── Storefront ──────────────────────────────────────────────────
export const Storefront = {
    get: () => readOne(KEYS.STOREFRONT) || {
        hero_title: 'Natural Coconut Coir Products',
        hero_subtitle: 'Discover premium, eco-friendly products made from Philippine coconut fiber. Sustainable solutions for construction, gardening, and everyday living.',
        hero_image: '',
        banner_text: '🌿 Sustainably sourced — Free shipping over ₱2,000',
        promo_text: '100% Natural & Eco-Friendly',
    },
    save: (data) => write(KEYS.STOREFRONT, data),
    update: (data) => write(KEYS.STOREFRONT, data),
};

// Seeding is now handled by Laravel migrations/seeders in MariaDB.
export function seedIfNeeded() { }
