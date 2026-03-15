import { create } from 'zustand';

export interface CartItem {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
  notes: string;
  image: string;
}

interface CartStore {
  items: CartItem[];
  tableNumber: string;
  tableLabel: string;
  tableId: string;
  addItem: (item: Omit<CartItem, 'quantity' | 'notes'> & { quantity?: number; notes?: string }) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  updateNotes: (itemId: string, notes: string) => void;
  clearCart: () => void;
  setTable: (tableNumber: string, tableLabel: string, tableId: string) => void;
  getSubtotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  tableNumber: '',
  tableLabel: '',
  tableId: '',

  addItem: (item) => {
    set((state) => {
      const existing = state.items.find((i) => i.itemId === item.itemId);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.itemId === item.itemId
              ? { ...i, quantity: i.quantity + (item.quantity || 1) }
              : i
          ),
        };
      }
      return {
        items: [
          ...state.items,
          {
            itemId: item.itemId,
            name: item.name,
            price: item.price,
            image: item.image,
            quantity: item.quantity || 1,
            notes: item.notes || '',
          },
        ],
      };
    });
  },

  removeItem: (itemId) => {
    set((state) => ({
      items: state.items.filter((i) => i.itemId !== itemId),
    }));
  },

  updateQuantity: (itemId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(itemId);
      return;
    }
    set((state) => ({
      items: state.items.map((i) =>
        i.itemId === itemId ? { ...i, quantity } : i
      ),
    }));
  },

  updateNotes: (itemId, notes) => {
    set((state) => ({
      items: state.items.map((i) =>
        i.itemId === itemId ? { ...i, notes } : i
      ),
    }));
  },

  clearCart: () => set({ items: [] }),

  setTable: (tableNumber, tableLabel, tableId) =>
    set({ tableNumber, tableLabel, tableId }),

  getSubtotal: () => {
    return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  },

  getItemCount: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },
}));
