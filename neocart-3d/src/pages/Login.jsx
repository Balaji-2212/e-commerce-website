import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, Cpu, ShieldCheck, Sparkles, AlertCircle, Check, ShieldAlert } from 'lucide-react';
import { useStore } from '../store';

const AVATARS = [
  { id: 1, url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80', name: 'Alex' },
  { id: 2, url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80', name: 'Sarah' },
  { id: 3, url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80', name: 'Marcus' },
  { id: 4, url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80', name: 'Elena' },
  { id: 5, url: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80', name: 'Zane' },
  { id: 6, url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80', name: 'Li' }
];

export default function Login() {
  const navigate = useNavigate();
  const { loginUser, registerUser, user, theme } = useStore();

  const [isFlipped, setIsFlipped] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Login Form States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register Form States
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0].url);

  // Status states
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [decryptSteps, setDecryptSteps] = useState([]);

  // Password validation checks
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: 'None', color: '#6b7280' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score, label: 'Weak', color: '#ef4444' };
    if (score <= 3) return { score, label: 'Medium', color: '#f59e0b' };
    return { score, label: 'Strong', color: '#10b981' };
  };

  const strength = getPasswordStrength(registerPassword);

  // Email validator
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setErrorMsg('Please enter email and password');
      return;
    }
    setErrorMsg('');
    setIsSubmitting(true);

    const res = await loginUser(loginEmail, loginPassword);
    if (res.success) {
      triggerSuccessSequence();
    } else {
      setErrorMsg(res.error || 'Invalid credentials');
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!registerName || !registerEmail || !registerPassword) {
      setErrorMsg('Please fill in all fields');
      return;
    }
    if (!isValidEmail(registerEmail)) {
      setErrorMsg('Invalid email format');
      return;
    }
    if (registerPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters');
      return;
    }
    if (registerPassword !== registerConfirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }
    setErrorMsg('');
    setIsSubmitting(true);

    const res = await registerUser(registerName, registerEmail, registerPassword, selectedAvatar);
    if (res.success) {
      triggerSuccessSequence();
    } else {
      setErrorMsg(res.error || 'Registration failed');
      setIsSubmitting(false);
    }
  };

  const triggerSuccessSequence = () => {
    setIsDecrypting(true);
    setErrorMsg('');
    
    const steps = [
      'Establishing digital uplink...',
      'Deciphering system protocols...',
      'Verifying security signature...',
      'Bypassing server firewalls...',
      'Syncing local storage node...',
      'ACCESS GRANTED'
    ];

    steps.forEach((step, index) => {
      setTimeout(() => {
        setDecryptSteps(prev => [...prev, step]);
        if (index === steps.length - 1) {
          setTimeout(() => {
            navigate('/dashboard');
          }, 800);
        }
      }, (index + 1) * 400);
    });
  };

  // Switch between Login and Register
  const toggleForm = () => {
    setIsFlipped(!isFlipped);
    setErrorMsg('');
    setLoginPassword('');
    setRegisterPassword('');
    setRegisterConfirmPassword('');
  };

  // Background floating particles for "crazy" visual effect
  const particles = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    size: Math.random() * 8 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * -20
  }));

  return (
    <div style={{
      minHeight: '85vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      padding: '2rem 1rem',
      overflow: 'hidden'
    }}>
      {/* Dynamic matrix / cyber particles */}
      {theme === 'dark' && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 0 }}>
          {particles.map(p => (
            <motion.div
              key={p.id}
              style={{
                position: 'absolute',
                width: p.size,
                height: p.size,
                borderRadius: '50%',
                background: 'rgba(0, 240, 255, 0.15)',
                boxShadow: '0 0 8px rgba(0, 240, 255, 0.4)',
                left: `${p.x}%`,
                top: `${p.y}%`,
              }}
              animate={{
                y: ['-10vh', '110vh'],
                opacity: [0, 0.8, 0.8, 0]
              }}
              transition={{
                duration: p.duration,
                repeat: Infinity,
                delay: p.delay,
                ease: 'linear'
              }}
            />
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        {!isDecrypting ? (
          <div style={{ perspective: 1500, width: '100%', maxWidth: '480px', zIndex: 1 }}>
            <motion.div
              style={{
                width: '100%',
                transformStyle: 'preserve-3d',
                position: 'relative'
              }}
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            >
              {/* --- FRONT: LOGIN CARD --- */}
              <div style={{
                backfaceVisibility: 'hidden',
                width: '100%',
                WebkitBackfaceVisibility: 'hidden'
              }}>
                <div className="glass-panel" style={{
                  padding: '2.5rem',
                  border: theme === 'dark' ? '1px solid rgba(0, 240, 255, 0.2)' : '1px solid #e0e0e0',
                  boxShadow: theme === 'dark' ? '0 8px 32px rgba(0, 240, 255, 0.15), inset 0 0 15px rgba(0, 240, 255, 0.05)' : '0 10px 25px rgba(0,0,0,0.05)',
                  background: theme === 'dark' ? 'rgba(5, 7, 12, 0.85)' : '#ffffff'
                }}>
                  {/* Holographic scanner effect in dark mode */}
                  {theme === 'dark' && (
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '3px',
                      background: 'linear-gradient(to right, transparent, var(--primary), transparent)',
                      boxShadow: '0 0 10px var(--primary)',
                      animation: 'scan 4s linear infinite'
                    }} />
                  )}

                  <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ display: 'inline-flex', padding: '0.75rem', borderRadius: '50%', background: 'rgba(0, 240, 255, 0.08)', marginBottom: '1rem', border: '1px solid rgba(0, 240, 255, 0.2)' }}>
                      <Cpu size={32} color={theme === 'dark' ? 'var(--primary)' : '#2874f0'} />
                    </div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', fontFamily: theme === 'dark' ? 'Orbitron' : 'sans-serif', color: 'var(--text-main)' }}>SYS_ACCESS</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem', fontFamily: 'Space Grotesk' }}>Authorize connection credentials to proceed</p>
                  </div>

                  {errorMsg && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        padding: '0.75rem 1rem',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: '6px',
                        color: '#ef4444',
                        fontSize: '0.85rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '1.5rem',
                        fontFamily: 'Space Grotesk'
                      }}
                    >
                      <ShieldAlert size={18} />
                      <span>{errorMsg}</span>
                    </motion.div>
                  )}

                  <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem', letterSpacing: '1px', fontFamily: 'Space Grotesk' }}>PORT_EMAIL</label>
                      <div style={{ position: 'relative' }}>
                        <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: loginEmail ? (isValidEmail(loginEmail) ? '#10b981' : '#ef4444') : 'var(--text-muted)' }} />
                        <input
                          type="email"
                          placeholder="node@venture.network"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          disabled={isSubmitting}
                          style={{
                            width: '100%',
                            padding: '0.8rem 1rem 0.8rem 2.5rem',
                            borderRadius: '6px',
                            background: theme === 'dark' ? 'rgba(0,0,0,0.6)' : '#ffffff',
                            border: theme === 'dark' 
                              ? `1px solid ${loginEmail ? (isValidEmail(loginEmail) ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)') : 'var(--border-light)'}` 
                              : '1px solid #e0e0e0',
                            color: 'var(--text-main)',
                            outline: 'none',
                            fontSize: '0.95rem',
                            fontFamily: 'Space Grotesk',
                            transition: 'all 0.3s'
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem', letterSpacing: '1px', fontFamily: 'Space Grotesk' }}>KEYCODE_PASSWORD</label>
                      <div style={{ position: 'relative' }}>
                        <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••••••"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          disabled={isSubmitting}
                          style={{
                            width: '100%',
                            padding: '0.8rem 2.5rem 0.8rem 2.5rem',
                            borderRadius: '6px',
                            background: theme === 'dark' ? 'rgba(0,0,0,0.6)' : '#ffffff',
                            border: theme === 'dark' ? '1px solid var(--border-light)' : '1px solid #e0e0e0',
                            color: 'var(--text-main)',
                            outline: 'none',
                            fontSize: '0.95rem',
                            fontFamily: 'Space Grotesk',
                            transition: 'all 0.3s'
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      <div style={{ textAlign: 'right', marginTop: '0.5rem' }}>
                        <span 
                          onClick={() => useStore.getState().setToast('Decentralized password recovery active. Check link simulation.')} 
                          style={{ fontSize: '0.75rem', color: theme === 'dark' ? 'var(--primary)' : '#2874f0', cursor: 'pointer', fontFamily: 'Space Grotesk' }}
                        >
                          Recover Node Key?
                        </span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={isSubmitting}
                      style={{
                        padding: '0.85rem',
                        marginTop: '0.5rem',
                        fontSize: '0.95rem',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        background: theme === 'dark' ? 'var(--primary)' : '#2874f0',
                        color: theme === 'dark' ? '#000' : '#fff'
                      }}
                    >
                      {isSubmitting ? (
                        <span>DECRYPTING AUTHORIZATION...</span>
                      ) : (
                        <>
                          <ShieldCheck size={18} />
                          <span>DECRYPT & CONNECT</span>
                        </>
                      )}
                    </button>
                  </form>

                  {/* Social Simulators */}
                  <div style={{ marginTop: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                      <div style={{ flex: 1, height: '1px', background: 'var(--border-light)' }}></div>
                      <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '1px', fontFamily: 'Space Grotesk' }}>Federated Auth</span>
                      <div style={{ flex: 1, height: '1px', background: 'var(--border-light)' }}></div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <button
                        onClick={() => useStore.getState().setToast('Google Node auth linking simulated.')}
                        className="btn btn-glass"
                        style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.8rem', borderRadius: '6px', border: theme === 'dark' ? '1px solid rgba(255,255,255,0.05)' : '1px solid #e0e0e0' }}
                      >
                        <svg style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1 5.86 1 .7 6.16.7 12.5s5.16 11.5 11.54 11.5c6.65 0 11.08-4.68 11.08-11.27 0-.753-.08-1.332-.2-1.905H12.24z"/>
                        </svg> Google
                      </button>
                      <button
                        onClick={() => useStore.getState().setToast('Github Node auth linking simulated.')}
                        className="btn btn-glass"
                        style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.8rem', borderRadius: '6px', border: theme === 'dark' ? '1px solid rgba(255,255,255,0.05)' : '1px solid #e0e0e0' }}
                      >
                        <svg style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg> Github
                      </button>
                    </div>
                  </div>

                  <div style={{ marginTop: '2.5rem', textAlign: 'center', fontSize: '0.85rem', fontFamily: 'Space Grotesk' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Need connection permissions? </span>
                    <strong
                      onClick={toggleForm}
                      style={{ color: theme === 'dark' ? 'var(--primary)' : '#2874f0', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      Initialize Register Link
                    </strong>
                  </div>
                </div>
              </div>

              {/* --- BACK: REGISTER CARD --- */}
              <div style={{
                backfaceVisibility: 'hidden',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: 'rotateY(180deg)',
                WebkitBackfaceVisibility: 'hidden'
              }}>
                <div className="glass-panel" style={{
                  padding: '2.5rem',
                  border: theme === 'dark' ? '1px solid rgba(0, 240, 255, 0.2)' : '1px solid #e0e0e0',
                  boxShadow: theme === 'dark' ? '0 8px 32px rgba(0, 240, 255, 0.15), inset 0 0 15px rgba(0, 240, 255, 0.05)' : '0 10px 25px rgba(0,0,0,0.05)',
                  background: theme === 'dark' ? 'rgba(5, 7, 12, 0.85)' : '#ffffff'
                }}>
                  {theme === 'dark' && (
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '100%',
                      height: '3px',
                      background: 'linear-gradient(to right, transparent, var(--primary), transparent)',
                      boxShadow: '0 0 10px var(--primary)',
                      animation: 'scan-reverse 4s linear infinite'
                    }} />
                  )}

                  <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'inline-flex', padding: '0.75rem', borderRadius: '50%', background: 'rgba(0, 240, 255, 0.08)', marginBottom: '0.75rem', border: '1px solid rgba(0, 240, 255, 0.2)' }}>
                      <Sparkles size={28} color={theme === 'dark' ? 'var(--primary)' : '#2874f0'} />
                    </div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', fontFamily: theme === 'dark' ? 'Orbitron' : 'sans-serif', color: 'var(--text-main)' }}>SYS_INIT</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem', fontFamily: 'Space Grotesk' }}>Register new decentralized connection node</p>
                  </div>

                  {errorMsg && (
                    <div style={{
                      padding: '0.75rem 1rem',
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      borderRadius: '6px',
                      color: '#ef4444',
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginBottom: '1.25rem',
                      fontFamily: 'Space Grotesk'
                    }}>
                      <ShieldAlert size={18} />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.4rem', letterSpacing: '1px', fontFamily: 'Space Grotesk' }}>NODE_ALIAS</label>
                      <div style={{ position: 'relative' }}>
                        <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                          type="text"
                          placeholder="Operator Name"
                          value={registerName}
                          onChange={(e) => setRegisterName(e.target.value)}
                          disabled={isSubmitting}
                          style={{
                            width: '100%',
                            padding: '0.75rem 1rem 0.75rem 2.5rem',
                            borderRadius: '6px',
                            background: theme === 'dark' ? 'rgba(0,0,0,0.6)' : '#ffffff',
                            border: theme === 'dark' ? '1px solid var(--border-light)' : '1px solid #e0e0e0',
                            color: 'var(--text-main)',
                            outline: 'none',
                            fontSize: '0.9rem',
                            fontFamily: 'Space Grotesk',
                            transition: 'all 0.3s'
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.4rem', letterSpacing: '1px', fontFamily: 'Space Grotesk' }}>NODE_EMAIL</label>
                      <div style={{ position: 'relative' }}>
                        <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: registerEmail ? (isValidEmail(registerEmail) ? '#10b981' : '#ef4444') : 'var(--text-muted)' }} />
                        <input
                          type="email"
                          placeholder="operator@venture.tech"
                          value={registerEmail}
                          onChange={(e) => setRegisterEmail(e.target.value)}
                          disabled={isSubmitting}
                          style={{
                            width: '100%',
                            padding: '0.75rem 1rem 0.75rem 2.5rem',
                            borderRadius: '6px',
                            background: theme === 'dark' ? 'rgba(0,0,0,0.6)' : '#ffffff',
                            border: theme === 'dark' 
                              ? `1px solid ${registerEmail ? (isValidEmail(registerEmail) ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)') : 'var(--border-light)'}` 
                              : '1px solid #e0e0e0',
                            color: 'var(--text-main)',
                            outline: 'none',
                            fontSize: '0.9rem',
                            fontFamily: 'Space Grotesk',
                            transition: 'all 0.3s'
                          }}
                        />
                      </div>
                    </div>

                    {/* Interactive Avatar Picker */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.4rem', letterSpacing: '1px', fontFamily: 'Space Grotesk' }}>CHOOSE_AVATAR</label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '0.5rem' }}>
                        {AVATARS.map(av => (
                          <div
                            key={av.id}
                            onClick={() => setSelectedAvatar(av.url)}
                            style={{
                              position: 'relative',
                              borderRadius: '50%',
                              padding: '2px',
                              border: selectedAvatar === av.url ? `2px solid ${theme === 'dark' ? 'var(--primary)' : '#2874f0'}` : '2px solid transparent',
                              cursor: 'pointer',
                              overflow: 'hidden',
                              transition: 'all 0.2s',
                              transform: selectedAvatar === av.url ? 'scale(1.15)' : 'scale(1)'
                            }}
                          >
                            <img src={av.url} alt={av.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                            {selectedAvatar === av.url && (
                              <div style={{
                                position: 'absolute',
                                bottom: 0,
                                right: 0,
                                background: theme === 'dark' ? 'var(--primary)' : '#2874f0',
                                color: theme === 'dark' ? '#000' : '#fff',
                                borderRadius: '50%',
                                width: '12px',
                                height: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}>
                                <Check size={8} strokeWidth={4} />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.4rem', letterSpacing: '1px', fontFamily: 'Space Grotesk' }}>ACCESS_KEY</label>
                      <div style={{ position: 'relative' }}>
                        <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Min 6 characters"
                          value={registerPassword}
                          onChange={(e) => setRegisterPassword(e.target.value)}
                          disabled={isSubmitting}
                          style={{
                            width: '100%',
                            padding: '0.75rem 2.5rem 0.75rem 2.5rem',
                            borderRadius: '6px',
                            background: theme === 'dark' ? 'rgba(0,0,0,0.6)' : '#ffffff',
                            border: theme === 'dark' ? '1px solid var(--border-light)' : '1px solid #e0e0e0',
                            color: 'var(--text-main)',
                            outline: 'none',
                            fontSize: '0.9rem',
                            fontFamily: 'Space Grotesk',
                            transition: 'all 0.3s'
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      
                      {/* Password strength visualizer */}
                      {registerPassword && (
                        <div style={{ marginTop: '0.4rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                            <span>Security Strength:</span>
                            <span style={{ color: strength.color, fontWeight: 'bold' }}>{strength.label}</span>
                          </div>
                          <div style={{ display: 'flex', gap: '4px', height: '4px' }}>
                            {[1, 2, 3, 4, 5].map(barIndex => (
                              <div
                                key={barIndex}
                                style={{
                                  flex: 1,
                                  height: '100%',
                                  background: barIndex <= strength.score ? strength.color : 'rgba(255,255,255,0.1)',
                                  borderRadius: '2px',
                                  transition: 'background 0.3s'
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.4rem', letterSpacing: '1px', fontFamily: 'Space Grotesk' }}>VERIFY_KEY</label>
                      <div style={{ position: 'relative' }}>
                        <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: registerConfirmPassword ? (registerConfirmPassword === registerPassword ? '#10b981' : '#ef4444') : 'var(--text-muted)' }} />
                        <input
                          type="password"
                          placeholder="Re-enter password"
                          value={registerConfirmPassword}
                          onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                          disabled={isSubmitting}
                          style={{
                            width: '100%',
                            padding: '0.75rem 1rem 0.75rem 2.5rem',
                            borderRadius: '6px',
                            background: theme === 'dark' ? 'rgba(0,0,0,0.6)' : '#ffffff',
                            border: theme === 'dark' 
                              ? `1px solid ${registerConfirmPassword ? (registerConfirmPassword === registerPassword ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)') : 'var(--border-light)'}`
                              : '1px solid #e0e0e0',
                            color: 'var(--text-main)',
                            outline: 'none',
                            fontSize: '0.9rem',
                            fontFamily: 'Space Grotesk',
                            transition: 'all 0.3s'
                          }}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={isSubmitting}
                      style={{
                        padding: '0.8rem',
                        marginTop: '0.5rem',
                        fontSize: '0.9rem',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        background: theme === 'dark' ? 'var(--primary)' : '#2874f0',
                        color: theme === 'dark' ? '#000' : '#fff'
                      }}
                    >
                      {isSubmitting ? (
                        <span>INITIALIZING PROTOCOLS...</span>
                      ) : (
                        <>
                          <Cpu size={18} />
                          <span>PROVISION NEW NODE</span>
                        </>
                      )}
                    </button>
                  </form>

                  <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem', fontFamily: 'Space Grotesk' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Registered network node? </span>
                    <strong
                      onClick={toggleForm}
                      style={{ color: theme === 'dark' ? 'var(--primary)' : '#2874f0', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      Decrypt Signature Log
                    </strong>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : (
          /* --- DECRYPTING/SUCCESS DECRYPT TERMINAL SCREEN --- */
          <motion.div
            key="success-decrypt"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel"
            style={{
              width: '100%',
              maxWidth: '480px',
              padding: '2.5rem',
              textAlign: 'left',
              border: theme === 'dark' ? '2px solid #10b981' : '2px solid #388e3c',
              boxShadow: theme === 'dark' ? '0 0 25px rgba(16, 185, 129, 0.4)' : '0 10px 20px rgba(56, 142, 60, 0.1)',
              background: theme === 'dark' ? '#020617' : '#ffffff',
              fontFamily: 'monospace',
              color: theme === 'dark' ? '#10b981' : '#388e3c',
              position: 'relative',
              zIndex: 1
            }}
          >
            {/* Pulsing glow */}
            {theme === 'dark' && (
              <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                boxShadow: 'inset 0 0 30px rgba(16, 185, 129, 0.15)',
                pointerEvents: 'none'
              }} />
            )}
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(16, 185, 129, 0.2)', paddingBottom: '0.75rem' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: theme === 'dark' ? '#10b981' : '#388e3c', animation: 'pulse 1s infinite' }} />
              <span style={{ fontWeight: 'bold', fontSize: '1rem', letterSpacing: '1px' }}>SYS_DECRYPT_LOG</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', minHeight: '140px' }}>
              {decryptSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    color: step.includes('ACCESS GRANTED') 
                      ? (theme === 'dark' ? '#10b981' : '#388e3c') 
                      : (theme === 'dark' ? '#34d399' : '#4caf50'),
                    fontWeight: step.includes('ACCESS GRANTED') ? 'bold' : 'normal',
                    textTransform: step.includes('ACCESS GRANTED') ? 'uppercase' : 'none'
                  }}
                >
                  &gt; {step}
                </motion.div>
              ))}
            </div>

            <div style={{ marginTop: '2rem', fontSize: '0.8rem', opacity: 0.7, textAlign: 'right' }}>
              SECURE PROTOCOL V3.8 // READY
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes scan {
          0% { top: 0; }
          50% { top: 100%; }
          100% { top: 0; }
        }
        @keyframes scan-reverse {
          0% { bottom: 0; }
          50% { bottom: 100%; }
          100% { bottom: 0; }
        }
        @keyframes pulse {
          0% { transform: scale(0.9); opacity: 0.7; }
          50% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(0.9); opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}
