import React from 'react';
import { ShoppingCart, Heart, Clock } from 'lucide-react';
import { useStore } from '../store';
import { motion, AnimatePresence } from 'framer-motion';

export default function Wishlist() {
  const { wishlist, toggleWishlist, addToCart } = useStore();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Your Wishlist</h1>
        <p style={{ color: 'var(--text-muted)' }}>Products you've saved for later.</p>
      </div>

      {wishlist.length === 0 ? (
        <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center', borderRadius: '4px' }}>
          <Heart size={64} color="var(--primary)" style={{ marginBottom: '1rem', display: 'inline-block', filter: 'drop-shadow(0 0 10px rgba(0, 240, 255, 0.5))' }} />
          <h2 style={{ marginBottom: '1rem', fontFamily: 'Orbitron', color: '#fff' }}>DATABASE EMPTY</h2>
          <p style={{ color: 'var(--text-muted)' }}>No saved parameters found. Begin exploring the catalog.</p>
        </div>
      ) : (
        <motion.div layout className="product-grid">
          <AnimatePresence mode="popLayout">
            {wishlist.map(product => (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3, type: "spring", bounce: 0.3 }}
                key={product.id} 
                className="product-card glass-panel"
                whileHover={{ y: -5, boxShadow: '0 15px 30px rgba(0,0,0,0.1)' }}
              >
                <div className="product-image-container" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `radial-gradient(circle, ${product.color}22 0%, transparent 70%)` }}>
                  <button 
                    onClick={() => toggleWishlist(product)}
                    style={{
                      position: 'absolute',
                      top: '1rem',
                      right: '1rem',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-light)',
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      zIndex: 10,
                      boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                    }}
                  >
                    <Heart size={16} fill="#ef4444" color="#ef4444" />
                  </button>
                  <img 
                    src={product.image}
                    alt={product.name}
                    style={{
                      width: '180px', 
                      height: '180px', 
                      objectFit: 'contain',
                      filter: `drop-shadow(0 10px 20px ${product.color}44)`
                    }}
                  />
                </div>
                
                <div className="product-info">
                  <span className="badge">{product.category}</span>
                  <h3 style={{ fontSize: '1.25rem' }}>{product.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginTop: '0.5rem' }}>
                    <span className="product-price">₹{product.price.toLocaleString('en-IN')}</span>
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
      )}
    </motion.div>
  );
}
