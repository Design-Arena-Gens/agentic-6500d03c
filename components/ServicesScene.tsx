"use client";

import { Html, Text3D } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";

export default function ServicesScene({ timeMs, weight }: { timeMs: number; weight: number }) {
  const glow = useMemo(() => new THREE.Color("#2dd4bf"), []);
  const t = timeMs / 1000;

  return (
    <group position={[0, 0, 0]}>
      <ambientLight intensity={0.5 * weight} />
      <directionalLight position={[4, 8, 6]} intensity={0.9 * weight} />

      {/* Central card */}
      <mesh position={[0, 2.2, 0]} rotation={[0, Math.sin(t * 0.3) * 0.08, 0]} castShadow>
        <boxGeometry args={[7.5, 4.2, 0.2]} />
        <meshStandardMaterial color="#0e1726" metalness={0.2} roughness={0.6} emissive={glow} emissiveIntensity={0.12 * weight} />
      </mesh>
      <Html position={[0, 2.2, 0]} center style={{ pointerEvents: 'none', textAlign: 'center', width: 680, transform: 'translateY(-4px)' }}>
        <div style={{ padding: 20, opacity: weight }}>
          <div style={{ fontSize: 28, fontWeight: 800, marginBottom: 10 }}>Excel Service Hub</div>
          <div style={{ fontSize: 16, opacity: 0.8, marginBottom: 14 }}>
            Your Data, Our Responsibility
          </div>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
            {[
              { k: 'Data Entry', d: 'Fast and accurate input' },
              { k: 'Data Validation', d: 'Clean, consistent, trustworthy' },
              { k: 'Bulk Import', d: 'Google Sheets at scale' }
            ].map((s, i) => (
              <div key={s.k} style={{
                background: 'linear-gradient(180deg, rgba(20,32,52,0.9), rgba(20,32,52,0.5))',
                border: '1px solid rgba(45,212,191,0.4)',
                borderRadius: 12,
                padding: '12px 16px',
                width: 200
              }}>
                <div style={{ fontWeight: 700 }}>{s.k}</div>
                <div style={{ fontSize: 12, opacity: 0.8 }}>{s.d}</div>
              </div>
            ))}
          </div>
        </div>
      </Html>

      {/* Floating boxes */}
      {Array.from({ length: 16 }).map((_, i) => (
        <mesh key={i} position={[Math.sin(t * 0.5 + i) * (4 + (i % 4)), 0.6 + (i % 5) * 0.4, Math.cos(t * 0.4 + i) * (4.5 + (i % 3))]} rotation={[t * 0.2 + i, t * 0.1 + i, 0]} castShadow>
          <boxGeometry args={[0.35 + (i % 3) * 0.08, 0.35 + ((i+1) % 3) * 0.08, 0.35]} />
          <meshStandardMaterial color={i % 3 === 0 ? "#22c55e" : i % 3 === 1 ? "#eab308" : "#ef4444"} emissive="#0a1626" emissiveIntensity={0.06 * weight} />
        </mesh>
      ))}

      {/* CTA */}
      <Html position={[0, -2.8, 0]} center style={{ pointerEvents: 'auto', opacity: 0.95 * weight }}>
        <a id="contact" href="mailto:hello@excelservicehub.example" className="btn">Get a Quote</a>
      </Html>
    </group>
  );
}
