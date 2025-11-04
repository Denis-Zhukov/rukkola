export const CART_KEY = "localCart";
export const CART_TTL = 12 * 60 * 60 * 1000; // 12 hours

export type CartItem = {
    id: string;
    name: string;
    price: number;
    size: string;
    image?: string;
    timestamp: number;
}

export const getCart = () => {
    try {
        const raw = localStorage.getItem(CART_KEY);
        if (!raw) return [];

        const data = JSON.parse(raw);
        const now = Date.now();

        const filtered = data.filter((item: CartItem) => now - item.timestamp < CART_TTL);
        localStorage.setItem(CART_KEY, JSON.stringify(filtered));

        return filtered;
    } catch {
        return [];
    }
};

export const setCart = (items: CartItem[]) => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event("storage"));
};