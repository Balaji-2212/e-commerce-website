import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useStore } from '../store';
import * as THREE from 'three';

function AntiGravityParticles({ theme }) {
  const meshRef = useRef();
  
  // Create 1500 particles for the anti-gravity effect
  const count = 1500;
  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20; // x
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20; // y
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10; // z
      spd[i] = Math.random() * 0.02 + 0.01; // upward speed
    }
    return [pos, spd];
  }, []);

  const color = theme === 'dark' ? '#00f0ff' : '#2874f0'; // Cyber cyan or Flipkart blue

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const posAttribute = meshRef.current.geometry.attributes.position;
    
    // Move particles upwards (anti-gravity)
    for (let i = 0; i < count; i++) {
      let y = posAttribute.getY(i);
      y += speeds[i];
      if (y > 10) {
        y = -10; // reset to bottom
      }
      posAttribute.setY(i, y);
    }
    posAttribute.needsUpdate = true;
    
    // Slow camera rotation effect
    meshRef.current.rotation.y += delta * 0.05;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color={color}
        transparent={true}
        opacity={theme === 'dark' ? 0.8 : 0.2}
        sizeAttenuation={true}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export default function Background3D() {
  const theme = useStore(state => state.theme);
  
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -2, pointerEvents: 'none', background: theme === 'dark' ? 'radial-gradient(circle at center, #0a0a1a 0%, #000000 100%)' : 'none' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <fog attach="fog" args={[theme === 'dark' ? '#000000' : '#f1f3f6', 2, 15]} />
        <AntiGravityParticles theme={theme} />
      </Canvas>
    </div>
  );
}
