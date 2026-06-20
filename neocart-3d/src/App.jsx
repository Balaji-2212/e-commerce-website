import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Zap, Box, CheckCircle, Heart, Sun, Moon, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Cart from './pages/Cart';
import Dashboard from './pages/Dashboard';
import Wishlist from './pages/Wishlist';
import Login from './pages/Login';
import { useStore } from './store';
import Background3D from './components/Background3D';

function AppContent() {
  const location = useLocation();
  const { cart, wishlist, toast, theme, toggleTheme, fetchInitialData, user, logoutUser } = useStore();
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  React.useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

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
          {user ? (
            <div 
              style={{ position: 'relative' }} 
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <div style={{ padding: '0', borderRadius: '50%', overflow: 'hidden', width: '40px', height: '40px', display: 'flex', border: theme === 'dark' ? '2px solid var(--border-light)' : '2px solid #fff', boxShadow: '0 2px 5px rgba(0,0,0,0.2)', cursor: 'pointer', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                <img src={user.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"} alt="User Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 5, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      position: 'absolute',
                      top: '42px',
                      right: 0,
                      background: theme === 'dark' ? 'rgba(10, 10, 15, 0.95)' : '#ffffff',
                      border: theme === 'dark' ? '1px solid var(--border-light)' : '1px solid #e0e0e0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                      padding: '0.75rem',
                      minWidth: '220px',
                      zIndex: 100,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem',
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    <div style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem', marginBottom: '0.25rem' }}>
                      <div style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--text-main)', fontFamily: 'Orbitron', textTransform: 'uppercase' }}>{user.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textOverflow: 'ellipsis', overflow: 'hidden', fontFamily: 'Space Grotesk' }}>{user.email}</div>
                    </div>
                    <Link to="/dashboard" onClick={() => setDropdownOpen(false)} style={{ textDecoration: 'none', color: 'var(--text-main)', fontSize: '0.85rem', padding: '0.4rem 0.5rem', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'Space Grotesk' }} className="btn-glass-dropdown" onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                      <User size={14} /> My Profile
                    </Link>
                    <div 
                      onClick={() => {
                        logoutUser();
                        setDropdownOpen(false);
                      }}
                      style={{ color: '#ef4444', fontSize: '0.85rem', padding: '0.4rem 0.5rem', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontFamily: 'Space Grotesk' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <LogOut size={14} /> Sign Out
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link to="/login" className="btn btn-glass" style={{ padding: '0.5rem 1rem', borderRadius: '999px', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <User size={16} />
              <span style={{ fontWeight: 'bold' }}>Sign In</span>
            </Link>
          )}
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
             <Route path="/login" element={<Login />} />
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
