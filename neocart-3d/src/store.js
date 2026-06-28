import { create } from 'zustand';
import { io } from 'socket.io-client';

const BACKEND_URL = 'http://localhost:5000';
const socket = io(BACKEND_URL);

// Set default light mode immediately on load
document.body.classList.add('light-mode');

const INITIAL_PRODUCTS = [
  // Electronics & Computers
  { id: 1, name: 'Apple iPhone 15 (128 GB)', price: 79900, rentPrice: 4000, rating: 4.8, category: 'Electronics', color: '#000000', image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=400' },
  { id: 2, name: 'Samsung Galaxy S24 Ultra', price: 129999, rentPrice: 6500, rating: 4.9, category: 'Electronics', color: '#6366f1', image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&q=80&w=400' },
  { id: 3, name: 'MacBook Air M2', price: 114900, rentPrice: 5500, rating: 4.9, category: 'Computers', color: '#9ca3af', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=400' },
  { id: 4, name: 'Dell XPS 13 Laptop', price: 135000, rentPrice: 6000, rating: 4.7, category: 'Computers', color: '#6b7280', image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=400' },
  { id: 5, name: 'iPad Pro 11-inch', price: 89900, rentPrice: 4500, rating: 4.8, category: 'Computers', color: '#d1d5db', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=400' },
  { id: 6, name: 'Logitech MX Master 3S', price: 10999, rentPrice: 500, rating: 4.9, category: 'Accessories', color: '#374151', image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=400' },
  { id: 7, name: 'Keychron K2 Mechanical Keyboard', price: 8500, rentPrice: 400, rating: 4.6, category: 'Accessories', color: '#1f2937', image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=400' },
  { id: 8, name: 'SanDisk 1TB Portable SSD', price: 9500, rentPrice: 450, rating: 4.8, category: 'Electronics', color: '#4b5563', image: 'https://images.unsplash.com/photo-1559825389-08a6e97576f3?auto=format&fit=crop&q=80&w=400' },

  // Audio & Wearables
  { id: 9, name: 'Sony WH-1000XM5 Headphones', price: 29990, rentPrice: 1500, rating: 4.8, category: 'Audio', color: '#1f2937', image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=400' },
  { id: 10, name: 'Apple AirPods Pro (2nd Gen)', price: 24900, rentPrice: 1200, rating: 4.9, category: 'Audio', color: '#f3f4f6', image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&q=80&w=400' },
  { id: 11, name: 'JBL Flip 6 Bluetooth Speaker', price: 9999, rentPrice: 500, rating: 4.6, category: 'Audio', color: '#ef4444', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&q=80&w=400' },
  { id: 12, name: 'Apple Watch Series 9', price: 41900, rentPrice: 2000, rating: 4.8, category: 'Wearables', color: '#fb923c', image: 'https://images.unsplash.com/photo-1617043786394-f977fa12eddf?auto=format&fit=crop&q=80&w=400' },
  { id: 13, name: 'Samsung Galaxy Watch 6', price: 29999, rentPrice: 1500, rating: 4.6, category: 'Wearables', color: '#111827', image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=80&w=400' },

  // Appliances & Smart Home
  { id: 14, name: 'LG 55 inch 4K Smart TV', price: 45990, rentPrice: 3000, rating: 4.6, category: 'Appliances', color: '#4b5563', image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&q=80&w=400' },
  { id: 15, name: 'Dyson V11 Absolute Vacuum', price: 49900, rentPrice: 2500, rating: 4.7, category: 'Appliances', color: '#f43f5e', image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&q=80&w=400' },
  { id: 16, name: 'Philips Air Fryer', price: 7999, rentPrice: 800, rating: 4.6, category: 'Appliances', color: '#9ca3af', image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=400' },
  { id: 17, name: 'Amazon Echo Dot (5th Gen)', price: 5499, rentPrice: 500, rating: 4.5, category: 'Smart Home', color: '#3b82f6', image: 'https://images.unsplash.com/photo-1543512214-318c7553f230?auto=format&fit=crop&q=80&w=400' },
  { id: 18, name: 'Philips Hue Starter Kit', price: 12999, rentPrice: 800, rating: 4.7, category: 'Smart Home', color: '#a855f7', image: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&q=80&w=400' },
  { id: 19, name: 'Nespresso Coffee Machine', price: 15500, rentPrice: 900, rating: 4.8, category: 'Appliances', color: '#000000', image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&q=80&w=400' },

  // Gaming
  { id: 20, name: 'Sony PlayStation 5 Console', price: 54990, rentPrice: 3500, rating: 4.9, category: 'Gaming', color: '#0ea5e9', image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&q=80&w=400' },
  { id: 21, name: 'Xbox Series X', price: 52990, rentPrice: 3300, rating: 4.8, category: 'Gaming', color: '#10b981', image: 'https://images.unsplash.com/photo-1605901309584-818e25960b8f?auto=format&fit=crop&q=80&w=400' },
  { id: 22, name: 'Nintendo Switch OLED', price: 34990, rentPrice: 2000, rating: 4.7, category: 'Gaming', color: '#ef4444', image: 'https://images.unsplash.com/photo-1612036782180-6f0b6ce846ce?auto=format&fit=crop&q=80&w=400' },
  { id: 23, name: 'Razer DeathAdder V3 Pro', price: 12999, rentPrice: 600, rating: 4.6, category: 'Gaming', color: '#000000', image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c3c9c?auto=format&fit=crop&q=80&w=400' },

  // Fashion & Apparel
  { id: 24, name: 'Puma Men\'s Running Shoes', price: 2999, rentPrice: 300, rating: 4.3, category: 'Fashion', color: '#fcd34d', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400' },
  { id: 25, name: 'Nike Air Max 270', price: 11995, rentPrice: 800, rating: 4.7, category: 'Fashion', color: '#0ea5e9', image: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&q=80&w=400' },
  { id: 26, name: 'Levi\'s Men\'s 511 Slim Jeans', price: 2599, rentPrice: 250, rating: 4.5, category: 'Fashion', color: '#3b82f6', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=400' },
  { id: 27, name: 'Casio G-Shock Analog-Digital Watch', price: 8995, rentPrice: 400, rating: 4.8, category: 'Accessories', color: '#111827', image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=400' },
  { id: 28, name: 'Ray-Ban Aviator Classic Sunglasses', price: 9500, rentPrice: 500, rating: 4.6, category: 'Accessories', color: '#f59e0b', image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=400' },

  // Books & Office
  { id: 29, name: 'Atomic Habits by James Clear', price: 499, rentPrice: 100, rating: 4.9, category: 'Books', color: '#fcd34d', image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=400' },
  { id: 30, name: 'Moleskine Classic Notebook', price: 1450, rentPrice: 150, rating: 4.6, category: 'Office', color: '#1f2937', image: 'https://images.unsplash.com/photo-1531346878377-a541fa4cb5f5?auto=format&fit=crop&q=80&w=400' },
  { id: 31, name: 'Herman Miller Aeron Chair', price: 125000, rentPrice: 4500, rating: 4.8, category: 'Furniture', color: '#6b7280', image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&q=80&w=400' },
  { id: 32, name: 'Lamy Safari Fountain Pen', price: 2999, rentPrice: 200, rating: 4.7, category: 'Office', color: '#f87171', image: 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?auto=format&fit=crop&q=80&w=400' },

  // Photography
  { id: 33, name: 'Sony Alpha a7 IV Camera', price: 215000, rentPrice: 8500, rating: 4.9, category: 'Cameras', color: '#000000', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=400' },
  { id: 34, name: 'DJI Mini 3 Pro Drone', price: 85000, rentPrice: 4500, rating: 4.7, category: 'Cameras', color: '#d1d5db', image: 'https://images.unsplash.com/photo-1579829366248-204fe8413f31?auto=format&fit=crop&q=80&w=400' },
  { id: 35, name: 'GoPro HERO12 Black', price: 39990, rentPrice: 2000, rating: 4.6, category: 'Cameras', color: '#374151', image: 'https://images.unsplash.com/photo-1502920514313-52581002a659?auto=format&fit=crop&q=80&w=400' },

  // Beauty & Personal Care
  { id: 36, name: 'Dyson Airwrap Styler', price: 45900, rentPrice: 2500, rating: 4.8, category: 'Beauty', color: '#ec4899', image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80&w=400' },
  { id: 37, name: 'Philips Norelco Shaver 9000', price: 18500, rentPrice: 900, rating: 4.6, category: 'Personal Care', color: '#4b5563', image: 'https://images.unsplash.com/photo-1621607512214-68297480165e?auto=format&fit=crop&q=80&w=400' },
  { id: 38, name: 'Estée Lauder Advanced Night Repair', price: 8500, rentPrice: 850, rating: 4.7, category: 'Beauty', color: '#d97706', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=400' },

  // Health & Fitness
  { id: 39, name: 'Optimum Nutrition Whey Protein', price: 6500, rentPrice: 650, rating: 4.8, category: 'Health', color: '#ef4444', image: 'https://images.unsplash.com/photo-1579722820308-d74e571900a9?auto=format&fit=crop&q=80&w=400' },
  { id: 40, name: 'Theragun Pro Massager', price: 54900, rentPrice: 3000, rating: 4.9, category: 'Health', color: '#000000', image: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&q=80&w=400' },
  { id: 41, name: 'Manduka PRO Yoga Mat', price: 10500, rentPrice: 500, rating: 4.7, category: 'Fitness', color: '#8b5cf6', image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&q=80&w=400' },

  // Travel & Outdoors
  { id: 42, name: 'Samsonite Omni PC Hardside Luggage', price: 12999, rentPrice: 1000, rating: 4.6, category: 'Travel', color: '#1f2937', image: 'https://images.unsplash.com/photo-1553531384-cc64ac80f931?auto=format&fit=crop&q=80&w=400' },
  { id: 43, name: 'YETI Tundra 45 Cooler', price: 29999, rentPrice: 1500, rating: 4.8, category: 'Outdoors', color: '#f3f4f6', image: 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?auto=format&fit=crop&q=80&w=400' },
  { id: 44, name: 'Coleman Sundome Tent', price: 5999, rentPrice: 450, rating: 4.5, category: 'Outdoors', color: '#10b981', image: 'https://images.unsplash.com/photo-1504280390224-dd9e24a9196b?auto=format&fit=crop&q=80&w=400' }
];

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
        // Fallback: Mock Auth when Backend is offline
        const mockUser = {
          id: Math.random().toString(),
          name: email.split('@')[0],
          email,
          avatar: email[0].toUpperCase()
        };
        const mockToken = 'mock_token_12345';
        set({ user: mockUser, token: mockToken });
        localStorage.setItem('venture_user', JSON.stringify(mockUser));
        localStorage.setItem('venture_token', mockToken);
        get().setToast(`Welcome back, ${mockUser.name}!`);
        return { success: true };
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
        // Fallback: Mock Auth when Backend is offline
        const mockUser = {
          id: Math.random().toString(),
          name,
          email,
          avatar: avatar || name[0].toUpperCase()
        };
        const mockToken = 'mock_token_12345';
        set({ user: mockUser, token: mockToken });
        localStorage.setItem('venture_user', JSON.stringify(mockUser));
        localStorage.setItem('venture_token', mockToken);
        get().setToast(`Account created! Welcome, ${mockUser.name}!`);
        return { success: true };
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
    products: INITIAL_PRODUCTS,
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
        const fetchedProducts = await prodRes.json();
        const finalProducts = fetchedProducts.length > 0 ? fetchedProducts : INITIAL_PRODUCTS;
        
        const budgetRes = await fetch(`${BACKEND_URL}/api/budget`);
        const budget = await budgetRes.json();
        
        const expRes = await fetch(`${BACKEND_URL}/api/expenses`);
        const expenses = await expRes.json();
        
        const total = expenses.reduce((acc, curr) => acc + curr.amount, 0);
        
        set({ 
          products: finalProducts, 
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
