import React, { useState } from 'react';
import { useStore } from '../store';
import { Trash2, Users, CreditCard, Share2, MapPin, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Cart() {
  const { cart, removeFromCart, collaborators, sharedCartId, emptyCart, budgetLimit, totalExpenses, addExpense, addCollaborator } = useStore();
  const [splitPayment, setSplitPayment] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [shippingAddress, setShippingAddress] = useState('');
  const [showInviteList, setShowInviteList] = useState(false);
  const [manualInvite, setManualInvite] = useState('');
  const MOCK_CONTACTS = ['Alice Smith', 'Bob Johnson', 'Charlie Brown', 'Diana Prince'];

  const subtotal = cart.reduce((acc, item) => acc + (item.isRental ? item.rentPrice * item.duration : item.price), 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const handleCheckout = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      
      // Generate Bill Text
      let billText = "🛍️ *Venture Invoice* 🛍️\n\n";
      cart.forEach((item, index) => {
        billText += `${index + 1}. ${item.name}\n`;
        billText += `   Type: ${item.isRental ? 'Rent (' + item.duration + ' mo)' : 'Buy'}\n`;
        billText += `   Price: ₹${(item.isRental ? item.rentPrice * item.duration : item.price).toLocaleString('en-IN')}\n`;
      });
      billText += `\n*Subtotal:* ₹${subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}\n`;
      billText += `*Tax (8%):* ₹${tax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}\n`;
      billText += `*Total Amount:* ₹${total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}\n`;
      
      if (splitPayment) {
        billText += `\n*Your Share (1/3):* ₹${(total / 3).toLocaleString('en-IN', { minimumFractionDigits: 2 })}\n`;
      }

      if (shippingAddress) {
        billText += `\n*Shipping Address:*\n${shippingAddress}\n`;
      }

      billText += "\nThank you for shopping at Venture!";
      
      // Add items to expenses history
      cart.forEach((item) => {
        const itemCost = item.isRental ? item.rentPrice * item.duration : item.price;
        const itemTotalCost = itemCost * 1.08;
        const actualCost = splitPayment ? (itemTotalCost / 3) : itemTotalCost;
        addExpense(
          `${item.name} (${item.isRental ? 'Rental' : 'Purchase'})${splitPayment ? ' - Shared' : ''}`,
          Math.round(actualCost),
          item.isRental ? 'Rental' : 'Purchase'
        );
      });

      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(billText)}`;
      window.open(whatsappUrl, '_blank');
      
      emptyCart();
      useStore.getState().setToast("Bill sent to WhatsApp. Cart cleared.");
      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);
    }, 1500);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem' }}>Shared Cart</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f1f5f9', padding: '0.5rem 1rem', borderRadius: '9999px' }}>
              <Users size={16} color="var(--success)" />
              <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{collaborators.length + 1} active</span>
            </div>
          <div style={{ position: 'relative' }}>
            <button 
              className="btn btn-glass" 
              style={{ padding: '0.5rem 1rem', gap: '0.5rem', fontSize: '0.875rem' }}
              onClick={() => setShowInviteList(!showInviteList)}
            >
              <Share2 size={16} /> Invite
            </button>
            <AnimatePresence>
              {showInviteList && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="glass-panel"
                  style={{ position: 'absolute', top: '100%', right: 0, marginTop: '0.5rem', padding: '1rem', width: '220px', zIndex: 100 }}
                >
                  <h4 style={{ marginBottom: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)', fontFamily: 'Space Grotesk', textTransform: 'uppercase', letterSpacing: '1px' }}>Invite Collaborators</h4>
                  
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                    <input 
                      type="text" 
                      value={manualInvite}
                      onChange={(e) => setManualInvite(e.target.value)}
                      placeholder="Phone or Email..."
                      style={{ 
                        flex: 1, 
                        padding: '0.5rem', 
                        background: 'rgba(0,0,0,0.2)', 
                        border: '1px solid var(--border-light)', 
                        color: 'var(--text-main)', 
                        outline: 'none', 
                        fontFamily: 'Space Grotesk',
                        borderRadius: '4px',
                        width: '100%'
                      }}
                    />
                    <button 
                      className="btn btn-primary" 
                      style={{ padding: '0.5rem', fontSize: '0.875rem' }}
                      disabled={!manualInvite.trim()}
                      onClick={() => {
                        setShowInviteList(false);
                        const inviteTarget = manualInvite.trim();
                        setManualInvite('');
                        
                        // Compose Invite Text
                        const inviteText = `Hey! I'm shopping on Venture. Join my collaborative cart room 'cart-x789' to shop together! Open http://localhost:5173/ to start!`;
                        
                        // Check if email or phone
                        if (inviteTarget.includes('@')) {
                          // Trigger email mailto
                          const subject = encodeURIComponent("Join my collaborative shopping room on Venture");
                          const body = encodeURIComponent(inviteText);
                          window.location.href = `mailto:${inviteTarget}?subject=${subject}&body=${body}`;
                          useStore.getState().setToast(`Email client opened to invite ${inviteTarget}!`);
                        } else {
                          // Trigger WhatsApp message link
                          const cleanDigits = inviteTarget.replace(/\D/g, '');
                          const whatsappUrl = cleanDigits.length >= 10 
                            ? `https://wa.me/${cleanDigits}?text=${encodeURIComponent(inviteText)}` 
                            : `https://wa.me/?text=${encodeURIComponent(inviteText)}`;
                          window.open(whatsappUrl, '_blank');
                          useStore.getState().setToast(`WhatsApp opened to invite ${inviteTarget}!`);
                        }
                        
                        // Simulate the collaborator joining the local session
                        const friendlyName = inviteTarget.includes('@') 
                          ? inviteTarget.split('@')[0] 
                          : inviteTarget;
                        setTimeout(() => {
                          addCollaborator(friendlyName);
                          useStore.getState().setToast(`👥 ${friendlyName} joined the shopping session!`);
                        }, 2500);
                      }}
                    >
                      Send
                    </button>
                  </div>

                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Or Select from Contacts</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {MOCK_CONTACTS.map(contact => (
                      <button
                        key={contact}
                        onClick={() => {
                          setShowInviteList(false);
                          useStore.getState().setToast(`Invitation sent to ${contact}!`);
                          // Simulate real-time collaborator joining after 2.5 seconds
                          setTimeout(() => {
                            addCollaborator(contact);
                            useStore.getState().setToast(`👥 ${contact} joined the shopping session!`);
                          }, 2500);
                        }}
                        style={{
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid var(--border-light)',
                          padding: '0.5rem 0.75rem',
                          borderRadius: '4px',
                          color: 'var(--text-main)',
                          cursor: 'pointer',
                          textAlign: 'left',
                          fontFamily: 'Space Grotesk',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(0,240,255,0.2)';
                          e.currentTarget.style.borderColor = 'var(--primary)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                          e.currentTarget.style.borderColor = 'var(--border-light)';
                        }}
                      >
                        {contact}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          </div>
        </div>

        {cart.length === 0 ? (
          <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            Your shared cart is empty. Start adding some futuristic gear!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <AnimatePresence>
              {cart.map((item) => (
                <motion.div 
                  key={item.id} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="glass-panel" 
                  style={{ display: 'flex', alignItems: 'center', padding: '1rem', gap: '1.5rem' }}
                >
                  <div style={{ width: '80px', height: '80px', background: `radial-gradient(circle, ${item.color}22 0%, transparent 70%)`, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src={item.image} alt={item.name} style={{ width: '90%', height: '90%', objectFit: 'contain' }} />
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <h3 style={{ fontSize: '1.25rem' }}>{item.name}</h3>
                      <button onClick={() => removeFromCart(item.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                        <Trash2 size={20} />
                      </button>
                    </div>
                    <div style={{ marginTop: '0.25rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                      {item.isRental ? `Renting for ${item.duration} month(s)` : 'Buying Outright'}
                    </div>
                    <div style={{ marginTop: '0.75rem', fontWeight: 'bold', color: 'var(--primary)', fontSize: '1.25rem' }}>
                      ₹{(item.isRental ? item.rentPrice * item.duration : item.price).toLocaleString('en-IN')}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <div className="glass-panel" style={{ padding: '2rem', height: 'fit-content', position: 'sticky', top: '100px' }}>
        <h2 style={{ marginBottom: '1.5rem', fontFamily: 'Orbitron', textTransform: 'uppercase' }}>
          {checkoutStep === 1 ? 'Shipping Info' : 'Checkout'}
        </h2>
        
        {checkoutStep === 1 ? (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
                <MapPin size={18} /> Delivery Address
              </label>
              <textarea
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                placeholder="Enter full shipping address with pincode..."
                rows={4}
                style={{
                  width: '100%',
                  padding: '1rem',
                  borderRadius: '4px',
                  border: '1px solid var(--border-light)',
                  background: 'rgba(0,0,0,0.2)',
                  color: 'var(--text-main)',
                  fontFamily: 'Space Grotesk',
                  outline: 'none',
                  resize: 'none'
                }}
              />
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
              <span>Cart Total</span>
              <span style={{ color: 'var(--primary)', fontFamily: 'Orbitron' }}>₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>

            <button 
              className="btn btn-primary" 
              style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', position: 'relative' }} 
              disabled={cart.length === 0 || shippingAddress.trim().length < 10}
              onClick={() => setCheckoutStep(2)}
            >
              <ArrowRight style={{ marginRight: '0.5rem' }} /> Proceed to Billing
            </button>
            {cart.length > 0 && shippingAddress.trim().length < 10 && (
              <p style={{ color: '#ef4444', fontSize: '0.8rem', textAlign: 'center', marginTop: '0.5rem' }}>Please enter a valid address to continue.</p>
            )}
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
                <span style={{ fontFamily: 'Orbitron' }}>₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Tax (8%)</span>
                <span style={{ fontFamily: 'Orbitron' }}>₹{tax.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 'bold', marginTop: '0.5rem' }}>
                <span>Total</span>
                <span style={{ color: 'var(--primary)', fontFamily: 'Orbitron', textShadow: '0 0 5px rgba(0,240,255,0.5)' }}>₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontFamily: 'Space Grotesk' }}>
                <input 
                  type="checkbox" 
                  checked={splitPayment} 
                  onChange={(e) => setSplitPayment(e.target.checked)} 
                  style={{ width: '1.2rem', height: '1.2rem', accentColor: 'var(--primary)' }}
                />
                Split payment with collaborators
              </label>
              
              {splitPayment && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: 'auto' }} 
                  style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '4px', border: '1px solid var(--primary)', boxShadow: 'inset 0 0 10px rgba(0,240,255,0.1)' }}
                >
                  <div style={{ fontSize: '0.875rem', color: 'var(--primary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Your Share (1/3)</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', fontFamily: 'Orbitron' }}>₹{(total / 3).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                </motion.div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                className="btn btn-glass"
                style={{ padding: '1rem' }}
                onClick={() => setCheckoutStep(1)}
              >
                Back
              </button>
              <button 
                onClick={handleCheckout}
                className="btn btn-primary" 
                style={{ flex: 1, padding: '1rem', fontSize: '1.1rem', position: 'relative' }} 
                disabled={cart.length === 0 || isProcessing || isSuccess}
              >
                {isProcessing ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                      <CreditCard style={{ marginRight: '0.5rem' }} />
                    </motion.div>
                    PROCESSING...
                  </span>
                ) : isSuccess ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#000' }}>
                    PAYMENT SECURED
                  </span>
                ) : (
                  <>
                    <CreditCard style={{ marginRight: '0.5rem' }} /> SEND BILL TO WHATSAPP
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {/* Smart Budget Tracker Indicator */}
        {cart.length > 0 && (() => {
          const currentOrderShare = splitPayment ? total / 3 : total;
          const projectedTotal = totalExpenses + currentOrderShare;
          const isExceeded = projectedTotal > budgetLimit;
          const percentUsed = Math.min(100, (projectedTotal / budgetLimit) * 100);
          return (
            <div 
              className="glass-panel" 
              style={{ 
                marginTop: '1.5rem', 
                padding: '1.25rem', 
                border: isExceeded ? '1px solid #ef4444' : '1px solid var(--border-light)', 
                background: isExceeded ? 'rgba(239, 68, 68, 0.05)' : 'rgba(0,0,0,0.05)',
                borderRadius: '8px' 
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 'bold', letterSpacing: '0.5px', color: isExceeded ? '#ef4444' : 'var(--text-muted)' }}>
                  {isExceeded ? '⚠️ BUDGET BREACH WARNING' : '💳 SMART BUDGET STATUS'}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Limit: ₹{budgetLimit.toLocaleString('en-IN')}
                </span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                <span>Spent so far:</span>
                <span style={{ fontWeight: '600' }}>₹{totalExpenses.toLocaleString('en-IN')}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                <span>This order:</span>
                <span style={{ fontWeight: '600', color: splitPayment ? 'var(--success)' : 'inherit' }}>
                  ₹{currentOrderShare.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  {splitPayment && ' (1/3 share)'}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', fontWeight: 'bold', margin: '0.5rem 0', paddingTop: '0.5rem', borderTop: '1px dashed var(--border-light)' }}>
                <span>Projected Total:</span>
                <span style={{ color: isExceeded ? '#ef4444' : 'var(--success)' }}>
                  ₹{projectedTotal.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </span>
              </div>

              {/* Progress Bar */}
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden', marginTop: '0.75rem', marginBottom: '0.75rem' }}>
                <div 
                  style={{ 
                    height: '100%', 
                    width: `${percentUsed}%`, 
                    background: isExceeded ? 'linear-gradient(to right, #f59e0b, #ef4444)' : 'linear-gradient(to right, #10b981, #3b82f6)', 
                    borderRadius: '4px',
                    transition: 'width 0.4s ease'
                  }} 
                />
              </div>

              {isExceeded ? (
                <p style={{ fontSize: '0.75rem', color: '#ef4444', lineHeight: '1.4' }}>
                  This purchase will exceed your set budget by <strong>₹{(projectedTotal - budgetLimit).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</strong>. Consider renting instead of buying, or remove items to stay within limit.
                </p>
              ) : (
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                  You are safe! You will have <strong>₹{(budgetLimit - projectedTotal).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</strong> remaining in your budget after this order.
                </p>
              )}
            </div>
          );
        })()}
      </div>
    </div>
  );
}
