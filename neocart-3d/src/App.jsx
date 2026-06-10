import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Zap, Box, CheckCircle, Heart, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Cart from './pages/Cart';
import Dashboard from './pages/Dashboard';
import Wishlist from './pages/Wishlist';
import { useStore } from './store';
import Background3D from './components/Background3D';

function AppContent() {
  const location = useLocation();
  const { cart, wishlist, toast, theme, toggleTheme } = useStore();

  return (
    <div className="app-container">
      <Background3D />
      <nav className="navbar">
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Box size={28} color="var(--text-main)" />
          <span className="brand-font" style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '2px' }}>
            Venture
          </span>
        </Link>
        
        <div className="nav-links">
          {['/', '/shop'].map((path) => (
            <Link key={path} to={path} style={{ position: 'relative', padding: '0.5rem', textShadow: location.pathname === path ? '0 0 8px rgba(0,240,255,0.6)' : 'none' }}>
              {path === '/' ? 'Home' : 'Shop & Rent'}
              {location.pathname === path && (
                <motion.div 
                  layoutId="navIndicator"
                  className="nav-indicator"
                  style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: 'var(--text-main)' }} 
                />
              )}
            </Link>
          ))}
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div 
            onClick={toggleTheme}
            style={{
              width: '56px',
              height: '28px',
              background: theme === 'dark' ? 'rgba(0, 240, 255, 0.2)' : 'rgba(22, 163, 74, 0.2)',
              border: `1px solid ${theme === 'dark' ? 'var(--border-light)' : 'var(--success)'}`,
              borderRadius: '999px',
              position: 'relative',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '0 4px',
              boxShadow: 'none',
              transition: 'all 0.3s ease'
            }}
            title="Toggle Theme"
          >
            <div 
              style={{
                width: '20px',
                height: '20px',
                background: theme === 'dark' ? 'var(--primary)' : 'var(--success)',
                borderRadius: '50%',
                position: 'absolute',
                left: theme === 'dark' ? '4px' : '30px',
                transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {theme === 'dark' ? <Sun size={12} color="#000" /> : <Moon size={12} color="#fff" />}
            </div>
          </div>
          
          <Link to="/wishlist" className="btn btn-glass" style={{ padding: '0.5rem 1rem', borderRadius: '999px', position: 'relative', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <Heart size={20} fill={wishlist.length > 0 ? '#ef4444' : 'none'} color={wishlist.length > 0 ? '#ef4444' : 'var(--text-main)'} />
            <span style={{ fontWeight: 'bold' }}>{wishlist.length > 0 ? wishlist.length : 'Saved'}</span>
          </Link>
          <Link to="/cart" className="btn btn-glass" style={{ padding: '0.5rem 1rem', borderRadius: '999px', position: 'relative', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <ShoppingCart size={20} />
            <span style={{ fontWeight: 'bold' }}>{cart.length > 0 ? cart.length : 'Cart'}</span>
          </Link>
          <Link to="/dashboard" style={{ padding: '0', borderRadius: '50%', overflow: 'hidden', width: '40px', height: '40px', display: 'flex', border: theme === 'dark' ? '2px solid var(--border-light)' : '2px solid #fff', boxShadow: '0 2px 5px rgba(0,0,0,0.2)', cursor: 'pointer', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
            <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" alt="User Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </Link>
        </div>
      </nav>

      <main className="main-content">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/wishlist" element={<Wishlist />} />
          </Routes>
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            style={{
              position: 'fixed',
              bottom: '2rem',
              right: '2rem',
              background: 'rgba(10, 10, 15, 0.9)',
              border: '1px solid var(--primary)',
              color: 'var(--primary)',
              padding: '1rem 1.5rem',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              boxShadow: '0 0 20px rgba(0, 240, 255, 0.4)',
              zIndex: 1000,
              fontFamily: 'Space Grotesk',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}
          >
            <CheckCircle size={20} color="#00f0ff" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
