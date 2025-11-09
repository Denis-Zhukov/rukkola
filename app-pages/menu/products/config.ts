import {ProductType} from "@/models/product";

const CART_KEY = "localCart";
const CART_TTL = 24 * 60 * 60 * 1000;

export const getCart = () => {
    try {
        const raw = localStorage.getItem(CART_KEY);
        if (!raw) return [];
        const data = JSON.parse(raw);
        const now = Date.now();
        const filtered = data.filter((item: any) => now - item.timestamp < CART_TTL);
        localStorage.setItem(CART_KEY, JSON.stringify(filtered));
        return filtered;
    } catch {
        return [];
    }
};

export const setCart = (items: any[]) => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event("storage"));
};

export const addToCart = (product: Partial<ProductType> & { price?: number; size?: string }) => {
    const cart = getCart();
    cart.push({...product, timestamp: Date.now()});
    setCart(cart);
};