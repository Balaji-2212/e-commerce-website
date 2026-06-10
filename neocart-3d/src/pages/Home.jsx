import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Float, ContactShadows, RoundedBox } from '@react-three/drei';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Users, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

function GlowCube() {
  const meshRef = useRef();

  useFrame((state) => {
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.2;
    meshRef.current.rotation.y += 0.01;
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <RoundedBox ref={meshRef} args={[1.5, 1.5, 1.5]} radius={0.15} smoothness={4}>
        <meshStandardMaterial
          color="#00f0ff"
          emissive="#00f0ff"
          emissiveIntensity={2}
          toneMapped={false}
          roughness={0.1}
          metalness={0.9}
        />
      </RoundedBox>
    </Float>
  );
}

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <section className="hero-section">
        <div className="hero-text">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{ display: 'inline-block', padding: '0.5rem 1rem', background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: '20px', color: 'var(--text-main)', marginBottom: '1.5rem', fontFamily: 'Orbitron', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}
          >
            ✨ The Future of E-Commerce
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Welcome to<br />Venture
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Experience Venture. Explore products interactively, collaborate in real-time with shared carts, and seamlessly switch between buying and renting.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{ display: 'flex', gap: '1rem' }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/shop" className="btn btn-primary" style={{ gap: '0.5rem', textDecoration: 'none' }}>
                Start Exploring <ArrowRight size={20} />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/dashboard" className="btn btn-glass" style={{ textDecoration: 'none' }}>
                View Analytics
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            style={{ display: 'flex', gap: '2rem', marginTop: '3rem' }}
          >
            {[
              { icon: Users, color: 'var(--text-main)', text: 'Shared Carts' },
              { icon: Zap, color: 'var(--text-main)', text: 'AI Insights' },
              { icon: ShoppingBag, color: 'var(--text-main)', text: 'Buy or Rent' }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -5 }}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontFamily: 'Space Grotesk' }}
              >
                <feature.icon color={feature.color} />
                <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{feature.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="hero-3d-container glass-panel"
        >
          <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
            <GlowCube />
            <Environment preset="city" />
            <ContactShadows position={[0, -1.5, 0]} opacity={0.5} scale={10} blur={2} far={4} />
            <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
          </Canvas>
        </motion.div>
      </section>
    </motion.div>
  );
}
