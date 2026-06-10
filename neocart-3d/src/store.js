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
  ]
}));
