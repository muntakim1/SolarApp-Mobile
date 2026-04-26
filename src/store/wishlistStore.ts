import { create } from 'zustand';

interface WishlistItem {
  productId: string;
  addedAt: number;
}

interface WishlistStore {
  wishlistItems: Map<string, WishlistItem>;
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  getWishlistCount: () => number;
  getWishlist: () => string[];
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  wishlistItems: new Map(),

  addToWishlist: (productId: string) => {
    set((state) => {
      const newMap = new Map(state.wishlistItems);
      newMap.set(productId, { productId, addedAt: Date.now() });
      return { wishlistItems: newMap };
    });
  },

  removeFromWishlist: (productId: string) => {
    set((state) => {
      const newMap = new Map(state.wishlistItems);
      newMap.delete(productId);
      return { wishlistItems: newMap };
    });
  },

  isInWishlist: (productId: string) => {
    return get().wishlistItems.has(productId);
  },

  getWishlistCount: () => {
    return get().wishlistItems.size;
  },

  getWishlist: () => {
    return Array.from(get().wishlistItems.keys());
  },

  clearWishlist: () => {
    set({ wishlistItems: new Map() });
  },
}));
