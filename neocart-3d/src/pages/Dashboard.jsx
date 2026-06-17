import React, { useState } from 'react';
import { Activity, Package, Clock, DollarSign, ArrowUpRight, ShieldCheck, Sliders, AlertTriangle, TrendingUp, Wallet, Bell, Trash2, PlusCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../store';

const TABS = ['Overview', 'Budget Planner', 'My Rentals', 'Admin Analytics'];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('Overview');
  const { 
    budgetLimit, 
    totalExpenses, 
    expensesHistory, 
    alertAt80, 
    alertAt100, 
    setBudgetLimit, 
    setAlertAt80, 
    setAlertAt100, 
    addExpense, 
    removeExpense 
  } = useStore();

  const [newLimit, setNewLimit] = useState(budgetLimit.toString());
  const [customExpenseName, setCustomExpenseName] = useState('');
  const [customExpenseAmount, setCustomExpenseAmount] = useState('');
  const [customExpenseType, setCustomExpenseType] = useState('Purchase');

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '4rem' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', fontFamily: 'Orbitron', textTransform: 'uppercase' }}>My Profile</h1>

      <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '2rem', padding: '2rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <div style={{ width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden', border: '3px solid var(--border-light)', boxShadow: '0 4px 10px rgba(0,0,0,0.3)', flexShrink: 0 }}>
          <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=250&q=80" alt="Alex Mercer" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.25rem', fontFamily: 'Orbitron', textTransform: 'uppercase', letterSpacing: '1px' }}>Alex Mercer</h2>
          <div style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontFamily: 'Space Grotesk' }}>alex.mercer@venture.tech</div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span style={{ padding: '0.25rem 0.75rem', background: 'rgba(255, 255, 255, 0.1)', border: '1px solid var(--border-light)', color: 'var(--text-main)', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Pro Tier</span>
            <span style={{ padding: '0.25rem 0.75rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--success)', color: 'var(--success)', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Identity Verified</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', minWidth: '150px' }}>
          <button className="btn btn-primary" style={{ padding: '0.75rem 1rem', width: '100%' }}>Edit Profile</button>
          <button className="btn btn-glass" style={{ padding: '0.75rem 1rem', width: '100%' }}>Security</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem' }}>
        {TABS.map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{ 
              background: 'transparent',
              border: 'none',
              color: activeTab === tab ? 'var(--text-main)' : 'var(--text-muted)',
              fontSize: '1.1rem',
              fontWeight: activeTab === tab ? '700' : '500',
              cursor: 'pointer',
              position: 'relative',
              padding: '0.5rem 1rem'
            }}
          >
            {tab}
            {activeTab === tab && (
              <motion.div 
                layoutId="activeTabIndicator"
                style={{ position: 'absolute', bottom: '-17px', left: 0, right: 0, height: '2px', background: 'var(--primary)' }} 
              />
            )}
          </button>
        ))}
      </div>

      {activeTab === 'Overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ color: 'var(--text-muted)' }}>Total Spent</h3>
              <DollarSign color="#16a34a" />
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>₹{totalExpenses.toLocaleString('en-IN')}</div>
            <div style={{ marginTop: '0.5rem', color: '#16a34a', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem' }}>
              <ArrowUpRight size={16} /> +12% from last month
            </div>
          </div>
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ color: 'var(--text-muted)' }}>Active Orders</h3>
              <Package color="#3b82f6" />
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>3</div>
            <div style={{ marginTop: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              2 arriving this week
            </div>
          </div>
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ color: 'var(--text-muted)' }}>Saved by Renting</h3>
              <ShieldCheck color="#8b5cf6" />
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>₹1,84,000</div>
            <div style={{ marginTop: '0.5rem', color: '#8b5cf6', fontSize: '0.875rem' }}>
              AI insights optimizing your spend
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Budget Planner' && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginTop: '1rem' }}>
          {/* Left Column: Progress & Expense Log */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Progress & Insights */}
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Wallet color="var(--primary)" size={20} /> Budget Utilization
              </h3>
              
              {/* Stat Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Budget Limit</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 'bold', fontFamily: 'Orbitron' }}>
                    ₹{budgetLimit.toLocaleString('en-IN')}
                  </div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Total Spent</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 'bold', fontFamily: 'Orbitron', color: totalExpenses > budgetLimit ? '#ef4444' : 'var(--text-main)' }}>
                    ₹{totalExpenses.toLocaleString('en-IN')}
                  </div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Remaining</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 'bold', fontFamily: 'Orbitron', color: budgetLimit - totalExpenses < 0 ? '#ef4444' : 'var(--success)' }}>
                    {budgetLimit - totalExpenses < 0 ? '-' : ''}₹{Math.abs(budgetLimit - totalExpenses).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              {(() => {
                const pct = (totalExpenses / budgetLimit) * 100;
                const progressPct = Math.min(100, pct);
                const isOver = totalExpenses > budgetLimit;
                return (
                  <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                      <span>Utilization Rate</span>
                      <span style={{ color: isOver ? '#ef4444' : 'var(--primary)' }}>{pct.toFixed(1)}%</span>
                    </div>
                    <div style={{ height: '14px', background: 'rgba(255,255,255,0.1)', borderRadius: '7px', overflow: 'hidden', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)' }}>
                      <div 
                        style={{ 
                          height: '100%', 
                          width: `${progressPct}%`, 
                          background: isOver 
                            ? 'linear-gradient(to right, #f59e0b, #ef4444)' 
                            : 'linear-gradient(to right, #10b981, #3b82f6)', 
                          borderRadius: '7px',
                          boxShadow: isOver ? '0 0 8px #ef4444' : 'none',
                          transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                        }} 
                      />
                    </div>
                  </div>
                );
              })()}

              {/* AI Insight Box */}
              <div 
                style={{ 
                  padding: '1.25rem', 
                  background: 'rgba(255,255,255,0.03)', 
                  borderLeft: `4px solid ${totalExpenses > budgetLimit ? '#ef4444' : totalExpenses >= budgetLimit * 0.8 ? '#f59e0b' : 'var(--success)'}`,
                  borderRadius: '0 8px 8px 0'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                  <TrendingUp size={16} color={totalExpenses > budgetLimit ? '#ef4444' : totalExpenses >= budgetLimit * 0.8 ? '#f59e0b' : 'var(--success)'} />
                  <span>AI BUDGET RECOMMENDATION</span>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                  {totalExpenses > budgetLimit ? (
                    <>
                      You have breached your set budget by <strong>₹{(totalExpenses - budgetLimit).toLocaleString('en-IN')}</strong>. Consider cancelling or returning active rental devices early to lower expenses, or choose split-payment options for shared orders to reduce your direct billing.
                    </>
                  ) : totalExpenses >= budgetLimit * 0.8 ? (
                    <>
                      You have utilized over <strong>80%</strong> of your total budget. We recommend opting for rentals rather than buying high-ticket items. Renting the Apple Vision Pro instead of purchasing outright saved you ₹3,20,000 this month!
                    </>
                  ) : (
                    <>
                      Your expenses are well within limits. You have <strong>₹{(budgetLimit - totalExpenses).toLocaleString('en-IN')}</strong> of headroom remaining. Consider trying out new VR headsets or hoverboards in our <strong>Shop & Rent</strong> catalog.
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Expense Log */}
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <h3 style={{ marginBottom: '1.5rem' }}>Expense History</h3>
              
              {/* Expense Table */}
              <div style={{ overflowX: 'auto', marginBottom: '2rem' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '500px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-light)', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                      <th style={{ padding: '0.75rem 1rem' }}>Description</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Type</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Date</th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Amount</th>
                      <th style={{ padding: '0.75rem 1rem', width: '50px' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {expensesHistory.length === 0 ? (
                      <tr>
                        <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                          No expenses tracked yet. Start shopping!
                        </td>
                      </tr>
                    ) : (
                      expensesHistory.map((item) => (
                        <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)', fontSize: '0.95rem' }}>
                          <td style={{ padding: '1rem', fontWeight: 500 }}>{item.name}</td>
                          <td style={{ padding: '1rem' }}>
                            <span 
                              style={{ 
                                padding: '0.2rem 0.5rem', 
                                background: item.type === 'Rental' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                                border: `1px solid ${item.type === 'Rental' ? 'var(--success)' : '#3b82f6'}`,
                                color: item.type === 'Rental' ? 'var(--success)' : '#3b82f6',
                                borderRadius: '4px',
                                fontSize: '0.75rem',
                                fontWeight: 'bold'
                              }}
                            >
                              {item.type}
                            </span>
                          </td>
                          <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{item.date}</td>
                          <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 'bold', fontFamily: 'Orbitron' }}>
                            ₹{item.amount.toLocaleString('en-IN')}
                          </td>
                          <td style={{ padding: '1rem', textAlign: 'center' }}>
                            <button 
                              onClick={() => {
                                removeExpense(item.id);
                                useStore.getState().setToast("Expense deleted");
                              }}
                              style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Add Custom Expense Form */}
              <h4 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-muted)' }}>Log External Expense</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1.2fr auto', gap: '1rem', alignItems: 'end' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Item Name / Description</label>
                  <input 
                    type="text" 
                    value={customExpenseName}
                    onChange={(e) => setCustomExpenseName(e.target.value)}
                    placeholder="e.g. VR Controller Accessories"
                    style={{ width: '100%', padding: '0.65rem', border: '1px solid var(--border-light)', borderRadius: '4px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Amount (₹)</label>
                  <input 
                    type="number" 
                    value={customExpenseAmount}
                    onChange={(e) => setCustomExpenseAmount(e.target.value)}
                    placeholder="e.g. 1500"
                    style={{ 
                      width: '100%', 
                      padding: '0.65rem', 
                      background: 'rgba(0,0,0,0.5)', 
                      border: '1px solid var(--border-light)', 
                      color: 'var(--text-main)', 
                      borderRadius: '4px',
                      fontFamily: 'Space Grotesk'
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Category</label>
                  <select 
                    value={customExpenseType}
                    onChange={(e) => setCustomExpenseType(e.target.value)}
                    style={{ 
                      width: '100%', 
                      padding: '0.65rem', 
                      background: 'rgba(0,0,0,0.5)', 
                      border: '1px solid var(--border-light)', 
                      color: 'var(--text-main)', 
                      borderRadius: '4px',
                      fontFamily: 'Space Grotesk',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="Purchase" style={{ background: '#000' }}>Purchase</option>
                    <option value="Rental" style={{ background: '#000' }}>Rental</option>
                  </select>
                </div>
                <button 
                  className="btn btn-primary"
                  style={{ padding: '0.65rem 1.2rem', display: 'flex', gap: '0.25rem', height: '38px', borderRadius: '4px' }}
                  onClick={() => {
                    if (!customExpenseName.trim() || !customExpenseAmount.trim()) {
                      useStore.getState().setToast("Please fill in name and amount");
                      return;
                    }
                    addExpense(customExpenseName, Number(customExpenseAmount), customExpenseType);
                    useStore.getState().setToast(`Added expense: ${customExpenseName}`);
                    setCustomExpenseName('');
                    setCustomExpenseAmount('');
                  }}
                >
                  <PlusCircle size={16} /> Add
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Settings & Limits */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Configure Budget */}
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sliders size={20} color="var(--primary)" /> Budget Settings
              </h3>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ fontSize: '0.875rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
                  Set Budget Limit (₹)
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input 
                    type="number" 
                    value={newLimit}
                    onChange={(e) => setNewLimit(e.target.value)}
                    style={{ 
                      flex: 1, 
                      padding: '0.65rem', 
                      background: 'rgba(0,0,0,0.5)', 
                      border: '1px solid var(--border-light)', 
                      color: 'var(--text-main)', 
                      borderRadius: '4px',
                      fontFamily: 'Space Grotesk'
                    }}
                  />
                  <button 
                    className="btn btn-primary"
                    style={{ padding: '0.65rem 1rem', borderRadius: '4px' }}
                    onClick={() => {
                      if (!newLimit || isNaN(newLimit) || Number(newLimit) <= 0) {
                        useStore.getState().setToast("Enter a valid positive number");
                        return;
                      }
                      setBudgetLimit(Number(newLimit));
                      useStore.getState().setToast(`Budget limit updated to ₹${Number(newLimit).toLocaleString()}`);
                    }}
                  >
                    Save
                  </button>
                </div>
              </div>

              {/* Alert Configuration */}
              <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1.5rem' }}>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Bell size={16} /> Budget Intimations
                </h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer', fontSize: '0.9rem', lineHeight: '1.4' }}>
                    <input 
                      type="checkbox" 
                      checked={alertAt80} 
                      onChange={(e) => setAlertAt80(e.target.checked)}
                      style={{ width: '1.1rem', height: '1.1rem', marginTop: '0.15rem', accentColor: 'var(--primary)' }}
                    />
                    <div>
                      <div>Alert at 80% Capacity</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Send warning notification when spending crosses 80% of budget.</div>
                    </div>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer', fontSize: '0.9rem', lineHeight: '1.4' }}>
                    <input 
                      type="checkbox" 
                      checked={alertAt100} 
                      onChange={(e) => setAlertAt100(e.target.checked)}
                      style={{ width: '1.1rem', height: '1.1rem', marginTop: '0.15rem', accentColor: 'var(--primary)' }}
                    />
                    <div>
                      <div>Alert at 100% Capacity</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Send critical alert when spending exceeds 100% of budget.</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Smart renting advice */}
            <div className="glass-panel" style={{ padding: '1.5rem', border: '1px solid rgba(16, 185, 129, 0.2)', background: 'rgba(16, 185, 129, 0.02)' }}>
              <h4 style={{ color: 'var(--success)', fontSize: '0.9rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                🌱 RENT & STAY GREEN
              </h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                Our 3D rental system allows you to use premium devices on demand. Renting products prevents electronic waste, keeps your carbon footprint low, and protects your capital/budget by up to <strong>85% monthly</strong>.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'My Rentals' && (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>Active Rentals</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[1, 2].map(i => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(0,0,0,0.02)', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '50px', height: '50px', background: `radial-gradient(circle, ${i === 1 ? '#f8cb46' : '#16a34a'}22 0%, transparent 70%)`, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src={i === 1 ? '/images/vr_headset.png' : '/images/hoverboard.png'} alt="Product" style={{ width: '90%', height: '90%', objectFit: 'contain' }} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.1rem' }}>{i === 1 ? 'Apple Vision Pro' : 'Segway Ninebot S'}</h4>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>Rented for 3 months</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fbbf24', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                    <Clock size={14} /> 12 days remaining
                  </div>
                  <button className="btn btn-glass" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}>Extend</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'Admin Analytics' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>
                <Activity size={20} /> <h3 style={{ color: 'var(--text-main)' }}>Live Traffic (Global)</h3>
              </div>
              <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', gap: '1rem', paddingTop: '2rem' }}>
                {[40, 70, 45, 90, 65, 85, 100].map((h, i) => (
                  <motion.div 
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    style={{ flex: 1, background: 'linear-gradient(to top, rgba(248, 203, 70, 0.2), #f8cb46)', borderRadius: '4px 4px 0 0' }}
                  />
                ))}
              </div>
            </div>
            
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <h3 style={{ marginBottom: '1.5rem' }}>Buy vs Rent Ratio</h3>
              <div style={{ display: 'flex', height: '30px', borderRadius: '15px', overflow: 'hidden' }}>
                <div style={{ flex: 6, background: '#f8cb46', display: 'flex', alignItems: 'center', paddingLeft: '1rem', fontSize: '0.75rem', fontWeight: 'bold' }}>60% Buy</div>
                <div style={{ flex: 4, background: '#16a34a', display: 'flex', alignItems: 'center', paddingRight: '1rem', justifyContent: 'flex-end', fontSize: '0.75rem', fontWeight: 'bold', color: 'white' }}>40% Rent</div>
              </div>
              <p style={{ marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                Rentals are up 15% this quarter, driven by AI recommendation nudges.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
