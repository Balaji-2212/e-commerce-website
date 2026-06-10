import React, { useState } from 'react';
import { ShoppingCart, Clock, Star, Heart, LayoutGrid, Cpu, Bike, Headphones, Gamepad2, Camera, Home, Watch, ShoppingBasket, Plug, Box } from 'lucide-react';
import { useStore } from '../store';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_PRODUCTS = [
  { id: 1, name: 'Apple Vision Pro', price: 349900, rentPrice: 15000, rating: 4.8, category: 'Electronics', color: '#6366f1', image: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?auto=format&fit=crop&q=80&w=400' },
  { id: 2, name: 'Segway Ninebot S', price: 45000, rentPrice: 4500, rating: 4.5, category: 'Mobility', color: '#10b981', image: 'https://images.unsplash.com/photo-1593006509935-77a8342416b7?auto=format&fit=crop&q=80&w=400' },
  { id: 3, name: 'Apple AirPods Max', price: 59900, rentPrice: 5000, rating: 4.9, category: 'Audio', color: '#f59e0b', image: 'https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?auto=format&fit=crop&q=80&w=400' },
  { id: 4, name: 'Samsung Freestyle Projector', price: 55000, rentPrice: 4000, rating: 4.2, category: 'Electronics', color: '#ec4899', image: 'https://images.unsplash.com/photo-1585862705497-b952f4477df5?auto=format&fit=crop&q=80&w=400' },
  { id: 5, name: 'bHaptics TactSuit X40', price: 49999, rentPrice: 4000, rating: 4.7, category: 'Gaming', color: '#3b82f6', image: 'https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?auto=format&fit=crop&q=80&w=400' },
  { id: 6, name: 'DJI Mini 4 Pro', price: 79999, rentPrice: 7000, rating: 4.6, category: 'Cameras', color: '#8b5cf6', image: 'https://images.unsplash.com/photo-1579829366248-204fe8413f31?auto=format&fit=crop&q=80&w=400' },
  { id: 7, name: 'Sony PlayStation 5', price: 54990, rentPrice: 3500, rating: 4.9, category: 'Gaming', color: '#0ea5e9', image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&q=80&w=400' },
  { id: 8, name: 'Apple iPhone 15 Pro Max', price: 159900, rentPrice: 8000, rating: 4.8, category: 'Electronics', color: '#8b5cf6', image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=400' },
  { id: 9, name: 'Dyson V15 Detect', price: 65900, rentPrice: 4500, rating: 4.7, category: 'Smart Home', color: '#f43f5e', image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&q=80&w=400' },
  { id: 10, name: 'LG C3 65" OLED TV', price: 169990, rentPrice: 12000, rating: 4.9, category: 'Electronics', color: '#64748b', image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&q=80&w=400' },
  { id: 11, name: 'Apple Watch Ultra 2', price: 89900, rentPrice: 5000, rating: 4.8, category: 'Wearables', color: '#fb923c', image: 'https://images.unsplash.com/photo-1617043786394-f977fa12eddf?auto=format&fit=crop&q=80&w=400' },
  { id: 12, name: 'Nintendo Switch OLED', price: 34990, rentPrice: 2000, rating: 4.8, category: 'Gaming', color: '#ef4444', image: 'https://images.unsplash.com/photo-1612036782180-6f0b6ce846ce?auto=format&fit=crop&q=80&w=400' },
  { id: 13, name: 'Organic Almond Milk 1L', price: 350, rentPrice: 350, rating: 4.6, category: 'Grocery', color: '#fcd34d', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=400' },
  { id: 14, name: 'Premium Avocado Pack', price: 450, rentPrice: 450, rating: 4.8, category: 'Grocery', color: '#4ade80', image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&q=80&w=400' },
  { id: 15, name: 'Samsung 800L Refrigerator', price: 215000, rentPrice: 8500, rating: 4.9, category: 'Appliances', color: '#94a3b8', image: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?auto=format&fit=crop&q=80&w=400' },
  { id: 16, name: 'Bosch 8kg Washing Machine', price: 42000, rentPrice: 2500, rating: 4.7, category: 'Appliances', color: '#cbd5e1', image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&q=80&w=400' },
  { id: 17, name: 'Fresh Organic Bananas (1kg)', price: 120, rentPrice: 120, rating: 4.5, category: 'Grocery', color: '#fde047', image: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&q=80&w=400' },
  { id: 18, name: 'Whole Wheat Bread', price: 65, rentPrice: 65, rating: 4.3, category: 'Grocery', color: '#d4a373', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=400' },
  { id: 19, name: 'Farm Fresh Eggs (12 Pack)', price: 110, rentPrice: 110, rating: 4.8, category: 'Grocery', color: '#fef3c7', image: 'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?auto=format&fit=crop&q=80&w=400' },
  { id: 20, name: 'Grass-Fed Beef Steak', price: 950, rentPrice: 950, rating: 4.9, category: 'Grocery', color: '#ef4444', image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&q=80&w=400' },
  { id: 21, name: 'Premium Olive Oil (500ml)', price: 1200, rentPrice: 1200, rating: 4.7, category: 'Grocery', color: '#84cc16', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=400' },
  { id: 22, name: 'Arabica Coffee Beans (250g)', price: 450, rentPrice: 450, rating: 4.9, category: 'Grocery', color: '#78350f', image: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&q=80&w=400' },
  { id: 23, name: 'Mixed Nuts & Dried Fruits', price: 650, rentPrice: 650, rating: 4.6, category: 'Grocery', color: '#b45309', image: 'https://images.unsplash.com/photo-1599598425947-3300262108bf?auto=format&fit=crop&q=80&w=400' },
  { id: 24, name: 'Frozen Mixed Berries (500g)', price: 380, rentPrice: 380, rating: 4.5, category: 'Grocery', color: '#9333ea', image: 'https://images.unsplash.com/photo-1596647271960-e7f0980c6553?auto=format&fit=crop&q=80&w=400' }
];

export default function Shop() {
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredId, setHoveredId] = useState(null);
  const addToCart = useStore((state) => state.addToCart);
  const toggleWishlist = useStore((state) => state.toggleWishlist);
  const wishlist = useStore((state) => state.wishlist);

  const categories = ['All', ...new Set(MOCK_PRODUCTS.map(p => p.category))];
  const filteredProducts = MOCK_PRODUCTS.filter(p => {
    const matchesCategory = filter === 'All' || p.category === filter;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (cat, isActive) => {
    const color = isActive ? '#000' : 'var(--text-muted)';
    switch(cat) {
      case 'All': return <LayoutGrid size={18} color={color} />;
      case 'Electronics': return <Cpu size={18} color={color} />;
      case 'Mobility': return <Bike size={18} color={color} />;
      case 'Audio': return <Headphones size={18} color={color} />;
      case 'Gaming': return <Gamepad2 size={18} color={color} />;
      case 'Cameras': return <Camera size={18} color={color} />;
      case 'Smart Home': return <Home size={18} color={color} />;
      case 'Wearables': return <Watch size={18} color={color} />;
      case 'Grocery': return <ShoppingBasket size={18} color={color} />;
      case 'Appliances': return <Plug size={18} color={color} />;
      default: return <Box size={18} color={color} />;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem', background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border-light)', boxShadow: 'var(--glow-primary)' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', marginBottom: '0.25rem', fontFamily: 'Orbitron', textTransform: 'uppercase' }}>Shop & Rent</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Explore our catalog with AI recommendations.</p>
          </div>
          
          <div style={{ flex: 1, minWidth: '250px', maxWidth: '400px', position: 'relative' }}>
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 2.5rem',
                borderRadius: '4px',
                border: '1px solid var(--border-light)',
                background: 'rgba(255,255,255,0.05)',
                color: 'var(--text-main)',
                outline: 'none',
                fontFamily: 'Space Grotesk'
              }}
            />
            <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </span>
          </div>
        </div>
        
        <div style={{ 
          display: 'flex', 
          gap: '0.75rem', 
          marginTop: '1.5rem',
          paddingBottom: '0.5rem', 
          overflowX: 'auto',
          whiteSpace: 'nowrap',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}>
          <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>
          <div className="hide-scrollbar" style={{ display: 'flex', gap: '0.75rem' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem', 
                  fontSize: '0.875rem',
                  border: '1px solid',
                  borderColor: filter === cat ? 'var(--primary)' : 'var(--border-light)',
                  background: filter === cat ? 'var(--primary)' : 'var(--bg-card)',
                  color: filter === cat ? (document.body.classList.contains('light-mode') ? '#fff' : '#000') : 'var(--text-main)',
                  fontWeight: '500',
                  fontFamily: 'Space Grotesk',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: filter === cat ? 'var(--glow-primary)' : 'none'
                }}
              >
                {getCategoryIcon(cat, filter === cat)}
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <motion.div layout className="product-grid">
        <AnimatePresence mode="popLayout">
          {filteredProducts.map(product => (
            <motion.div 
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3, type: "spring", bounce: 0.3 }}
              key={product.id} 
              className="product-card glass-panel"
              onMouseEnter={() => setHoveredId(product.id)}
              onMouseLeave={() => setHoveredId(null)}
              whileHover={{ y: -5, boxShadow: '0 15px 30px rgba(0,0,0,0.1)' }}
            >
              <div className="product-image-container" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `radial-gradient(circle, ${product.color}22 0%, transparent 70%)`, perspective: '1000px' }}>
                <button 
                  onClick={() => toggleWishlist(product)}
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    background: 'rgba(0,0,0,0.5)',
                    border: '1px solid var(--border-light)',
                    borderRadius: '4px',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    zIndex: 10,
                    boxShadow: '0 0 10px rgba(0,0,0,0.5)'
                  }}
                >
                  <Heart 
                    size={16} 
                    fill={wishlist.find(w => w.id === product.id) ? 'var(--secondary)' : 'none'} 
                    color={wishlist.find(w => w.id === product.id) ? 'var(--secondary)' : 'var(--primary)'} 
                  />
                </button>
                <img 
                  src={product.image}
                  alt={product.name}
                  style={{
                    width: '180px', 
                    height: '180px', 
                    objectFit: 'contain',
                    filter: `drop-shadow(0 10px 20px ${product.color}44)`,
                    transform: hoveredId === product.id ? 'scale(1.15) rotateY(15deg) rotateX(5deg)' : 'scale(1) rotateY(0deg) rotateX(0deg)',
                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                  }}
                />
              </div>
              
              <div className="product-info">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="badge">{product.category}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#ffeb3b', fontSize: '0.875rem', fontFamily: 'Orbitron' }}>
                    <Star size={14} fill="#ffeb3b" color="#ffeb3b" /> {product.rating}
                  </div>
                </div>
                <h3 style={{ fontSize: '1.25rem' }}>{product.name}</h3>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginTop: '0.5rem' }}>
                  <span className="product-price">₹{product.price.toLocaleString('en-IN')}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontFamily: 'Space Grotesk' }}>or rent ₹{product.rentPrice.toLocaleString('en-IN')}/mo</span>
                </div>
                
                <div style={{ marginTop: '0.5rem', padding: '0.75rem', background: 'rgba(57, 255, 20, 0.1)', borderLeft: '2px solid var(--success)', borderRadius: '0', fontSize: '0.85rem', color: 'var(--success)', display: 'flex', gap: '0.5rem', fontFamily: 'Space Grotesk' }}>
                  <span role="img" aria-label="sparkles" style={{ filter: 'drop-shadow(0 0 5px var(--success))' }}>⚡</span>
                  {product.price > 1000 ? "AI Analysis: Optimal for short-term rental." : "AI Analysis: Purchase recommended."}
                </div>
              </div>
              
              <div className="card-actions">
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-primary" 
                  style={{ flex: 1, padding: '0.75rem', fontSize: '0.875rem' }}
                  onClick={() => addToCart(product, false)}
                >
                  <ShoppingCart size={16} style={{ marginRight: '0.5rem' }} /> Buy
                </motion.button>
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-glass" 
                  style={{ flex: 1, padding: '0.75rem', fontSize: '0.875rem' }}
                  onClick={() => addToCart(product, true, 1)}
                >
                  <Clock size={16} style={{ marginRight: '0.5rem' }} /> Rent
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
