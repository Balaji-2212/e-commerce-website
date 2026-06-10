import React, { useState } from 'react';
import { Activity, Package, Clock, DollarSign, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const TABS = ['Overview', 'My Rentals', 'Admin Analytics'];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('Overview');

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
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>₹4,25,000</div>
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
