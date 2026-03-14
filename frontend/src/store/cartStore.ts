import { create } from 'zustand';
import type { CartItem, Product } from '../types';

interface CartState {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartState>((set, get) => {
  const stored = localStorage.getItem('cart');
  const initial: CartItem[] = stored ? JSON.parse(stored) : [];

  const persist = (items: CartItem[]) => {
    localStorage.setItem('cart', JSON.stringify(items));
  };

  return {
    items: initial,

    addItem: (product: Product) => {
      set((state) => {
        const existing = state.items.find((i) => i.product.id === product.id);
        let updated: CartItem[];
        if (existing) {
          updated = state.items.map((i) =>
            i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
          );
        } else {
          updated = [...state.items, { product, quantity: 1 }];
        }
        persist(updated);
        return { items: updated };
      });
    },

    removeItem: (productId: number) => {
      set((state) => {
        const updated = state.items.filter((i) => i.product.id !== productId);
        persist(updated);
        return { items: updated };
      });
    },

    updateQuantity: (productId: number, quantity: number) => {
      if (quantity <= 0) {
        get().removeItem(productId);
        return;
      }
      set((state) => {
        const updated = state.items.map((i) =>
          i.product.id === productId ? { ...i, quantity } : i
        );
        persist(updated);
        return { items: updated };
      });
    },

    clearCart: () => {
      localStorage.removeItem('cart');
      set({ items: [] });
    },

    totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

    totalPrice: () =>
      get().items.reduce(
        (sum, i) => sum + (i.product.discountPrice || i.product.price) * i.quantity,
        0
      ),
  };
});
