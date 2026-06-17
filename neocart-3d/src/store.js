import { create } from 'zustand';

// Set default light mode immediately on load
document.body.classList.add('light-mode');

export const useStore = create((set) => ({
  theme: 'light',
  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'dark' ? 'light' : 'dark';
    if (newTheme === 'light') {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
    return { theme: newTheme };
  }),
  cart: [],
  wishlist: [],
  toast: null,
  setToast: (msg) => {
    set({ toast: msg });
    setTimeout(() => set({ toast: null }), 3000);
  },
  addToCart: (product, isRental, duration) => set((state) => {
    state.setToast(`Added ${product.name} to cart!`);
    return {
      cart: [...state.cart, { ...product, id: Math.random().toString(), isRental, duration }]
    };
  }),
  removeFromCart: (id) => set((state) => ({
    cart: state.cart.filter(item => item.id !== id)
  })),
  emptyCart: () => set({ cart: [] }),
  toggleWishlist: (product) => set((state) => {
    const exists = state.wishlist.find(p => p.id === product.id);
    if (exists) {
      state.setToast(`Removed ${product.name} from wishlist`);
      return { wishlist: state.wishlist.filter(p => p.id !== product.id) };
    } else {
      state.setToast(`Added ${product.name} to wishlist`);
      return { wishlist: [...state.wishlist, product] };
    }
  }),
  sharedCartId: 'cart-x789',
  collaborators: [
    { id: 1, name: 'Alice', avatar: 'A' },
    { id: 2, name: 'Bob', avatar: 'B' }
  ],
  // Smart Budget State
  budgetLimit: 500000,
  totalExpenses: 425000,
  expensesHistory: [
    { id: 'exp-1', name: 'Apple Vision Pro (Rental)', amount: 180000, type: 'Rental', date: '2026-06-01' },
    { id: 'exp-2', name: 'Custom Drone Alpha (Buy)', amount: 241000, type: 'Purchase', date: '2026-06-05' },
    { id: 'exp-3', name: 'Segway Ninebot S (Rental)', amount: 4000, type: 'Rental', date: '2026-06-10' }
  ],
  alertAt80: true,
  alertAt100: true,
  setBudgetLimit: (limit) => set({ budgetLimit: limit }),
  setAlertAt80: (val) => set({ alertAt80: val }),
  setAlertAt100: (val) => set({ alertAt100: val }),
  addExpense: (name, amount, type) => set((state) => {
    const newExpense = {
      id: 'exp-' + Math.random().toString(36).substr(2, 9),
      name,
      amount,
      type,
      date: new Date().toISOString().split('T')[0]
    };
    const newTotal = state.totalExpenses + amount;
    
    // Check if new total hits thresholds and trigger a toast if enabled
    if (state.alertAt100 && newTotal > state.budgetLimit && state.totalExpenses <= state.budgetLimit) {
      setTimeout(() => state.setToast("🚨 BUDGET EXCEEDED! You have crossed 100% of your budget limit."), 100);
    } else if (state.alertAt80 && newTotal >= state.budgetLimit * 0.8 && state.totalExpenses < state.budgetLimit * 0.8) {
      setTimeout(() => state.setToast("⚠️ BUDGET WARNING: You have crossed 80% of your budget limit."), 100);
    }

    return {
      expensesHistory: [newExpense, ...state.expensesHistory],
      totalExpenses: newTotal
    };
  }),
  removeExpense: (id) => set((state) => {
    const removedItem = state.expensesHistory.find(item => item.id === id);
    const updatedHistory = state.expensesHistory.filter(item => item.id !== id);
    const updatedTotal = state.totalExpenses - (removedItem ? removedItem.amount : 0);
    return {
      expensesHistory: updatedHistory,
      totalExpenses: Math.max(0, updatedTotal)
    };
  })
}));
