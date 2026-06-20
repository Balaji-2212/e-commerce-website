import { create } from 'zustand';
import { io } from 'socket.io-client';

const BACKEND_URL = 'http://localhost:5000';
const socket = io(BACKEND_URL);

// Set default light mode immediately on load
document.body.classList.add('light-mode');

export const useStore = create((set, get) => {
  // Join socket room on initialization
  const sharedCartId = 'cart-x789';
  socket.emit('join-room', sharedCartId);

  // Set up socket listeners to synchronize states
  socket.on('sync-cart', (cart) => {
    set({ cart });
  });

  socket.on('sync-wishlist', (wishlist) => {
    set({ wishlist });
  });

  socket.on('sync-collaborators', (collaborators) => {
    set({ collaborators });
  });

  socket.on('sync-theme', (theme) => {
    if (theme === 'light') {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
    set({ theme });
  });

  socket.on('sync-budget-limit', (budgetLimit) => {
    set({ budgetLimit });
  });

  socket.on('sync-expenses', ({ totalExpenses, expensesHistory }) => {
    set({ totalExpenses, expensesHistory });
  });

  socket.on('simulated-collaborator-action', ({ collaboratorName, product }) => {
    get().setToast(`👥 ${collaboratorName} added ${product.name} to the cart!`);
  });

  return {
    user: localStorage.getItem('venture_user') ? JSON.parse(localStorage.getItem('venture_user')) : null,
    token: localStorage.getItem('venture_token') || null,
    loginUser: async (email, password) => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Login failed');
        }
        set({ user: data.user, token: data.token });
        localStorage.setItem('venture_user', JSON.stringify(data.user));
        localStorage.setItem('venture_token', data.token);
        get().setToast(`Welcome back, ${data.user.name}!`);
        return { success: true };
      } catch (err) {
        get().setToast(err.message || 'Login failed');
        return { success: false, error: err.message };
      }
    },
    registerUser: async (name, email, password, avatar) => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password, avatar })
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Registration failed');
        }
        set({ user: data.user, token: data.token });
        localStorage.setItem('venture_user', JSON.stringify(data.user));
        localStorage.setItem('venture_token', data.token);
        get().setToast(`Account created! Welcome, ${data.user.name}!`);
        return { success: true };
      } catch (err) {
        get().setToast(err.message || 'Registration failed');
        return { success: false, error: err.message };
      }
    },
    logoutUser: () => {
      set({ user: null, token: null });
      localStorage.removeItem('venture_user');
      localStorage.removeItem('venture_token');
      get().setToast('Logged out successfully.');
    },
    theme: 'light',
    toggleTheme: () => set((state) => {
      const newTheme = state.theme === 'dark' ? 'light' : 'dark';
      if (newTheme === 'light') {
        document.body.classList.add('light-mode');
      } else {
        document.body.classList.remove('light-mode');
      }
      // Emit update over socket
      socket.emit('sync-theme', { roomId: sharedCartId, theme: newTheme });
      return { theme: newTheme };
    }),
    products: [],
    cart: [],
    wishlist: [],
    toast: null,
    setToast: (msg) => {
      set({ toast: msg });
      setTimeout(() => set({ toast: null }), 3000);
    },
    
    // Initial fetch actions to load data from MongoDB
    fetchInitialData: async () => {
      try {
        const prodRes = await fetch(`${BACKEND_URL}/api/products`);
        const products = await prodRes.json();
        
        const budgetRes = await fetch(`${BACKEND_URL}/api/budget`);
        const budget = await budgetRes.json();
        
        const expRes = await fetch(`${BACKEND_URL}/api/expenses`);
        const expenses = await expRes.json();
        
        const total = expenses.reduce((acc, curr) => acc + curr.amount, 0);
        
        set({ 
          products, 
          budgetLimit: budget.limit, 
          alertAt80: budget.alertAt80, 
          alertAt100: budget.alertAt100, 
          expensesHistory: expenses,
          totalExpenses: total
        });
      } catch (err) {
        console.error("Failed to load initial MERN data:", err);
      }
    },

    addToCart: (product, isRental, duration) => set((state) => {
      state.setToast(`Added ${product.name} to cart!`);
      const newCart = [...state.cart, { ...product, id: Math.random().toString(), isRental, duration }];
      // Emit update over socket
      socket.emit('sync-cart', { roomId: sharedCartId, cart: newCart });
      return { cart: newCart };
    }),

    removeFromCart: (id) => set((state) => {
      const newCart = state.cart.filter(item => item.id !== id);
      // Emit update over socket
      socket.emit('sync-cart', { roomId: sharedCartId, cart: newCart });
      return { cart: newCart };
    }),

    emptyCart: () => set(() => {
      // Emit update over socket
      socket.emit('sync-cart', { roomId: sharedCartId, cart: [] });
      return { cart: [] };
    }),

    toggleWishlist: (product) => set((state) => {
      const exists = state.wishlist.find(p => p.id === product.id);
      let newWishlist;
      if (exists) {
        state.setToast(`Removed ${product.name} from wishlist`);
        newWishlist = state.wishlist.filter(p => p.id !== product.id);
      } else {
        state.setToast(`Added ${product.name} to wishlist`);
        newWishlist = [...state.wishlist, product];
      }
      // Emit update over socket
      socket.emit('sync-wishlist', { roomId: sharedCartId, wishlist: newWishlist });
      return { wishlist: newWishlist };
    }),

    sharedCartId,
    collaborators: [
      { id: 1, name: 'Alice', avatar: 'A' },
      { id: 2, name: 'Bob', avatar: 'B' }
    ],

    addCollaborator: (name) => set((state) => {
      if (state.collaborators.some(c => c.name.toLowerCase() === name.toLowerCase())) {
        return {};
      }
      const newCollaborator = {
        id: Math.random().toString(),
        name,
        avatar: name[0].toUpperCase()
      };
      const newCollaborators = [...state.collaborators, newCollaborator];
      // Emit update over socket
      socket.emit('sync-collaborators', { roomId: sharedCartId, collaborators: newCollaborators });
      
      // Simulate real-time interaction over WebSockets
      setTimeout(() => {
        const randomProduct = state.products.length > 0 
          ? state.products[Math.floor(Math.random() * state.products.length)]
          : { id: 4, name: 'Samsung Freestyle Projector', price: 55000, rentPrice: 4000, rating: 4.2, category: 'Electronics', color: '#ec4899', image: 'https://images.unsplash.com/photo-1585862705497-b952f4477df5?auto=format&fit=crop&q=80&w=400' };
        
        const isRental = Math.random() > 0.5;
        
        get().addToCart(randomProduct, isRental, isRental ? 3 : undefined);
        
        socket.emit('simulated-collaborator-action', {
          roomId: sharedCartId,
          collaboratorName: name,
          product: randomProduct,
          isRental,
          duration: isRental ? 3 : undefined
        });
        
        get().setToast(`👥 ${name} added ${randomProduct.name} to the cart!`);
      }, 4000);

      return { collaborators: newCollaborators };
    }),

    removeCollaborator: (id) => set((state) => {
      const newCollaborators = state.collaborators.filter(c => c.id !== id);
      // Emit update over socket
      socket.emit('sync-collaborators', { roomId: sharedCartId, collaborators: newCollaborators });
      return { collaborators: newCollaborators };
    }),

    // Smart Budget State
    budgetLimit: 500000,
    totalExpenses: 425000,
    expensesHistory: [],
    alertAt80: true,
    alertAt100: true,

    setBudgetLimit: async (limit) => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/budget`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ limit })
        });
        const updated = await res.json();
        set({ budgetLimit: updated.limit });
        // Emit update over socket
        socket.emit('sync-budget-limit', { roomId: sharedCartId, budgetLimit: updated.limit });
      } catch (err) {
        console.error("Failed to update budget limit:", err);
      }
    },

    setAlertAt80: async (val) => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/budget`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ alertAt80: val })
        });
        const updated = await res.json();
        set({ alertAt80: updated.alertAt80 });
      } catch (err) {
        console.error(err);
      }
    },

    setAlertAt100: async (val) => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/budget`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ alertAt100: val })
        });
        const updated = await res.json();
        set({ alertAt100: updated.alertAt100 });
      } catch (err) {
        console.error(err);
      }
    },

    addExpense: async (name, amount, type) => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/expenses`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, amount, type })
        });
        const newExpense = await res.json();
        
        const state = get();
        const newTotal = state.totalExpenses + amount;
        
        if (state.alertAt100 && newTotal > state.budgetLimit && state.totalExpenses <= state.budgetLimit) {
          setTimeout(() => state.setToast("🚨 BUDGET EXCEEDED! You have crossed 100% of your budget limit."), 100);
        } else if (state.alertAt80 && newTotal >= state.budgetLimit * 0.8 && state.totalExpenses < state.budgetLimit * 0.8) {
          setTimeout(() => state.setToast("⚠️ BUDGET WARNING: You have crossed 80% of your budget limit."), 100);
        }

        const newExpensesHistory = [newExpense, ...state.expensesHistory];
        set({
          expensesHistory: newExpensesHistory,
          totalExpenses: newTotal
        });

        // Emit update over socket
        socket.emit('sync-expenses', { 
          roomId: sharedCartId, 
          totalExpenses: newTotal, 
          expensesHistory: newExpensesHistory 
        });
      } catch (err) {
        console.error("Failed to add expense:", err);
      }
    },

    removeExpense: async (id) => {
      try {
        await fetch(`${BACKEND_URL}/api/expenses/${id}`, {
          method: 'DELETE'
        });
        
        const state = get();
        const removedItem = state.expensesHistory.find(item => item.id === id);
        const updatedHistory = state.expensesHistory.filter(item => item.id !== id);
        const updatedTotal = Math.max(0, state.totalExpenses - (removedItem ? removedItem.amount : 0));
        
        set({
          expensesHistory: updatedHistory,
          totalExpenses: updatedTotal
        });

        // Emit update over socket
        socket.emit('sync-expenses', { 
          roomId: sharedCartId, 
          totalExpenses: updatedTotal, 
          expensesHistory: updatedHistory 
        });
      } catch (err) {
        console.error("Failed to delete expense:", err);
      }
    }
  };
});
