import { create } from 'zustand';

interface ComparisonItem {
  productId: string;
  addedAt: number;
}

interface ComparisonStore {
  comparisonItems: Map<string, ComparisonItem>;
  maxItems: number;
  addToComparison: (productId: string) => boolean;
  removeFromComparison: (productId: string) => void;
  isInComparison: (productId: string) => boolean;
  getComparisonCount: () => number;
  getComparison: () => string[];
  clearComparison: () => void;
  canAdd: () => boolean;
}

export const useComparisonStore = create<ComparisonStore>((set, get) => ({
  comparisonItems: new Map(),
  maxItems: 3,

  addToComparison: (productId: string) => {
    const state = get();
    if (state.comparisonItems.size >= state.maxItems && !state.comparisonItems.has(productId)) {
      return false;
    }
    set((prevState) => {
      const newMap = new Map(prevState.comparisonItems);
      newMap.set(productId, { productId, addedAt: Date.now() });
      return { comparisonItems: newMap };
    });
    return true;
  },

  removeFromComparison: (productId: string) => {
    set((state) => {
      const newMap = new Map(state.comparisonItems);
      newMap.delete(productId);
      return { comparisonItems: newMap };
    });
  },

  isInComparison: (productId: string) => {
    return get().comparisonItems.has(productId);
  },

  getComparisonCount: () => {
    return get().comparisonItems.size;
  },

  getComparison: () => {
    return Array.from(get().comparisonItems.keys());
  },

  clearComparison: () => {
    set({ comparisonItems: new Map() });
  },

  canAdd: () => {
    return get().comparisonItems.size < get().maxItems;
  },
}));
