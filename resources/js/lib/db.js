// lib/db.js — localStorage-based data layer

const KEYS = {
    PRODUCTS: 'coco_products',
    ORDERS: 'coco_orders',
    CART: 'coco_cart',
    USERS: 'coco_users',
    STOREFRONT: 'coco_storefront',
    SEEDED: 'coco_seeded',
};

// ── Generic helpers ─────────────────────────────────────────────
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

// ── Products ────────────────────────────────────────────────────
export const Products = {
    getAll: () => read(KEYS.PRODUCTS),
    getActive: () => read(KEYS.PRODUCTS).filter(p => p.is_active),
    getById: (id) => read(KEYS.PRODUCTS).find(p => p.id === id),
    create: (data) => {
        const items = read(KEYS.PRODUCTS);
        const item = { ...data, id: Date.now().toString(36) + Math.random().toString(36).substr(2), created_at: new Date().toISOString() };
        items.push(item);
        write(KEYS.PRODUCTS, items);
        return item;
    },
    update: (id, data) => {
        const items = read(KEYS.PRODUCTS).map(p => p.id === id ? { ...p, ...data } : p);
        write(KEYS.PRODUCTS, items);
        return items.find(p => p.id === id);
    },
    remove: (id) => {
        write(KEYS.PRODUCTS, read(KEYS.PRODUCTS).filter(p => p.id !== id));
    },
    delete: (id) => {
        write(KEYS.PRODUCTS, read(KEYS.PRODUCTS).filter(p => p.id !== id));
    },
    decrementStock: (id, qty) => {
        const items = read(KEYS.PRODUCTS).map(p =>
            p.id === id ? { ...p, stock: Math.max(0, p.stock - qty), sold_count: (p.sold_count || 0) + qty } : p
        );
        write(KEYS.PRODUCTS, items);
    },
};

// ── Orders ──────────────────────────────────────────────────────
export const Orders = {
    getAll: () => read(KEYS.ORDERS),
    getByEmail: (email) => read(KEYS.ORDERS).filter(o => o.user_email === email),
    getById: (id) => read(KEYS.ORDERS).find(o => o.id === id),
    create: (data) => {
        const items = read(KEYS.ORDERS);
        const item = { ...data, id: Date.now().toString(36) + Math.random().toString(36).substr(2), created_at: new Date().toISOString() };
        items.push(item);
        write(KEYS.ORDERS, items);
        return item;
    },
    update: (id, data) => {
        const items = read(KEYS.ORDERS).map(o => o.id === id ? { ...o, ...data } : o);
        write(KEYS.ORDERS, items);
        return items.find(o => o.id === id);
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
        hero_title: 'From Husk to Home',
        hero_subtitle: 'Premium coconut coir products sustainably harvested from Philippine farms.',
        hero_image: '',
        banner_text: '🌿 Sustainably sourced — Free shipping over ₱2,000',
        promo_text: 'NEW ARRIVALS',
    },
    save: (data) => write(KEYS.STOREFRONT, data),
    update: (data) => write(KEYS.STOREFRONT, data),
};

// ── Seeder ──────────────────────────────────────────────────────
export function seedIfNeeded() {
    if (localStorage.getItem(KEYS.SEEDED)) return;

    const sampleProducts = [
        { name: 'Premium Coir Rope 3mm', description: 'Durable twisted coconut coir rope ideal for garden trellising, craft projects, and plant support. 100% natural fiber.', price: 185, image_url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80', category: 'Coir Rope', stock: 120, featured_type: 'Best Seller', is_active: true, sold_count: 245 },
        { name: 'Coir Door Mat 60x40cm', description: 'Classic handwoven coir door mat with natural anti-slip backing. Perfect for entryways and patios.', price: 320, image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80', category: 'Coir Mat', stock: 65, featured_type: 'Trending', is_active: true, sold_count: 189 },
        { name: 'Erosion Control Coir Net', description: 'Biodegradable coir netting for slope erosion control and garden bed protection. UV resistant.', price: 780, image_url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&q=80', category: 'Coir Net', stock: 40, featured_type: 'New', is_active: true, sold_count: 67 },
        { name: 'Coir Hanging Basket Pot', description: 'Natural coconut coir liner pot for hanging baskets. Excellent water retention for lush plant growth.', price: 95, image_url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80', category: 'Coir Pot', stock: 200, featured_type: 'Best Seller', is_active: true, sold_count: 412 },
        { name: 'Coir Board 100x50cm', description: 'Compressed coir fiber board for crafts, insulation, and garden projects. Eco-friendly alternative.', price: 550, image_url: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=400&q=80', category: 'Coir Board', stock: 30, featured_type: 'None', is_active: true, sold_count: 28 },
        { name: 'Loose Coir Fiber 5kg', description: 'Premium grade loose coir fiber for potting mix, composting, and mulching. pH balanced and weed-free.', price: 240, image_url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80', category: 'Coir Fiber', stock: 88, featured_type: 'None', is_active: true, sold_count: 134 },
        { name: 'Coir Grow Bag 10L', description: 'Ready-to-use coconut coir grow bag perfect for hydroponic tomatoes, peppers, and cucumbers. Pre-buffered.', price: 180, image_url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80', category: 'Coir Grow Bag', stock: 75, featured_type: 'Trending', is_active: true, sold_count: 156 },
        { name: 'Coir Rope 10mm Thick', description: 'Heavy duty 10mm coconut coir rope. Perfect for rustic decor, marine use, and rope bridges.', price: 450, image_url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80', category: 'Coir Rope', stock: 55, featured_type: 'None', is_active: true, sold_count: 92 },
        { name: 'Decorative Coir Mat 90x60cm', description: 'Beautiful hand-carved coir door mat with tropical leaf design. Weather resistant and durable.', price: 680, image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80', category: 'Coir Mat', stock: 5, featured_type: 'New', is_active: true, sold_count: 23 },
        { name: 'Mini Coir Pots Set (12pcs)', description: 'Biodegradable mini coir seed starter pots. Transplant directly into soil — roots grow through naturally.', price: 140, image_url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80', category: 'Coir Pot', stock: 150, featured_type: 'Best Seller', is_active: true, sold_count: 328 },
        { name: 'Coir Grow Bag 20L', description: 'Large format coconut coir grow bag for professional hydroponic cultivation. Pre-wetted and ready to use.', price: 320, image_url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80', category: 'Coir Grow Bag', stock: 3, featured_type: 'None', is_active: true, sold_count: 78 },
        { name: 'Natural Coir Fiber Block 650g', description: 'Compressed coir peat block expands to 9L of rich growing medium. Just add water. 100% organic.', price: 85, image_url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80', category: 'Coir Fiber', stock: 200, featured_type: 'Trending', is_active: true, sold_count: 267 },
    ];

    sampleProducts.forEach(p => {
        const items = read(KEYS.PRODUCTS);
        const item = { ...p, id: Date.now().toString(36) + Math.random().toString(36).substr(2) + items.length, created_at: new Date(Date.now() - Math.random() * 30 * 86400000).toISOString() };
        items.push(item);
        write(KEYS.PRODUCTS, items);
    });

    // Demo users
    const users = [
        { email: 'buyer@cocofiber.ph', password: 'password', name: 'Juan dela Cruz', role: 'user', mobile_number: '09171234567', address: '123 Aguinaldo St, Quezon City', profile_image: '' },
        { email: 'admin@cocofiber.ph', password: 'password', name: 'Maria Santos', role: 'admin', mobile_number: '09281234567', address: '456 Rizal Ave, Manila', profile_image: '' },
    ];
    users.forEach(u => {
        const items = read(KEYS.USERS);
        items.push({ ...u, id: Date.now().toString(36) + Math.random().toString(36).substr(2), created_at: new Date().toISOString() });
        write(KEYS.USERS, items);
    });

    // Sample orders
    const productIds = read(KEYS.PRODUCTS);
    if (productIds.length >= 2) {
        const sampleOrders = [
            {
                user_email: 'buyer@cocofiber.ph',
                user_name: 'Juan dela Cruz',
                items: [
                    { product_id: productIds[0].id, product_name: productIds[0].name, product_image: productIds[0].image_url, product_price: productIds[0].price, quantity: 2 },
                    { product_id: productIds[1].id, product_name: productIds[1].name, product_image: productIds[1].image_url, product_price: productIds[1].price, quantity: 1 },
                ],
                total_amount: productIds[0].price * 2 + productIds[1].price,
                payment_method: 'GCash',
                delivery_method: 'Delivery',
                delivery_address: '123 Aguinaldo St, Quezon City',
                status: 'Delivered',
                id: 'ord001abc',
                created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
            },
            {
                user_email: 'buyer@cocofiber.ph',
                user_name: 'Juan dela Cruz',
                items: [{ product_id: productIds[2].id, product_name: productIds[2].name, product_image: productIds[2].image_url, product_price: productIds[2].price, quantity: 1 }],
                total_amount: productIds[2].price,
                payment_method: 'Cash on Delivery',
                delivery_method: 'Pickup',
                delivery_address: '',
                status: 'Processing',
                id: 'ord002def',
                created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
            },
        ];
        const orders = read(KEYS.ORDERS);
        sampleOrders.forEach(o => orders.push(o));
        write(KEYS.ORDERS, orders);
    }

    localStorage.setItem(KEYS.SEEDED, '1');
}
