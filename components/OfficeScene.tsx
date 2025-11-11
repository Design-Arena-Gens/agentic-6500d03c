"use client";

import * as THREE from "three";
import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";

function createDashboardTexture(width: number, height: number) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#0e1520";
  ctx.fillRect(0, 0, width, height);

  const bars = 12;
  for (let i = 0; i < bars; i++) {
    const w = (width - 40) / bars - 4;
    const h = Math.random() * (height * 0.6) + 30;
    const x = 20 + i * ((width - 40) / bars);
    const y = height - h - 20;
    const hue = [140, 50, 10][i % 3];
    ctx.fillStyle = `hsl(${hue},70%,50%)`;
    ctx.fillRect(x, y, w, h);
  }

  ctx.fillStyle = "#89a3c7";
  ctx.font = "bold 28px Inter, sans-serif";
  ctx.fillText("Quarterly KPI Dashboard", 20, 40);

  const grid = ctx.createLinearGradient(0, 0, 0, height);
  grid.addColorStop(0, "rgba(255,255,255,0.06)");
  grid.addColorStop(1, "rgba(255,255,255,0.02)");
  ctx.fillStyle = grid;
  for (let y = 60; y < height; y += 24) {
    ctx.fillRect(0, y, width, 1);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export default function OfficeScene({ timeMs, weight }: { timeMs: number; weight: number }) {
  const rig = useRef<THREE.Group>(null!);
  const dashboards = useMemo(() => [
    createDashboardTexture(1024, 512),
    createDashboardTexture(1024, 512),
    createDashboardTexture(1024, 512)
  ], []);

  useEffect(() => {
    return () => {
      dashboards.forEach(d => d.dispose());
    };
  }, [dashboards]);

  useFrame((_, dt) => {
    const t = timeMs / 1000;
    if (rig.current) {
      const x = Math.sin(t * 0.25) * 2.2;
      const z = Math.cos(t * 0.2) * 1.2;
      rig.current.position.set(x, 0, z);
      rig.current.rotation.y = Math.sin(t * 0.15) * 0.15;
    }
  });

  return (
    <group>
      <group ref={rig}>
        {/* Floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, -0.01, 0]}>
          <planeGeometry args={[40, 24]} />
          <meshStandardMaterial color="#0f1722" roughness={1} metalness={0} />
        </mesh>

        {/* Desks */}
        {Array.from({ length: 3 }).map((_, r) => (
          <group key={r} position={[0, 0, -6 + r * 6]}>
            {Array.from({ length: 3 }).map((_, c) => (
              <group key={c} position={[-8 + c * 8, 0, 0]}>
                <mesh castShadow position={[0, 0.4, 0]}>
                  <boxGeometry args={[5.5, 0.2, 2.4]} />
                  <meshStandardMaterial color="#192334" metalness={0.1} roughness={0.8} />
                </mesh>
                {/* Monitor */}
                <group position={[0, 1.5, -0.9]}>
                  <mesh>
                    <boxGeometry args={[2.8, 1.7, 0.06]} />
                    <meshStandardMaterial color="#0b1220" />
                  </mesh>
                  <mesh position={[0, 0, 0.04]}>
                    <planeGeometry args={[2.6, 1.5]} />
                    <meshBasicMaterial map={dashboards[(r * 3 + c) % dashboards.length]} />
                  </mesh>
                </group>
                {/* Typing person (low poly) */}
                <group position={[0, 0.95, 0.2]}>
                  <mesh castShadow position={[0, 0.8, 0]}>
                    <sphereGeometry args={[0.28, 16, 16]} />
                    <meshStandardMaterial color="#b9d6ff" />
                  </mesh>
                  <mesh castShadow position={[0, 0.35, 0]}>
                    <cylinderGeometry args={[0.22, 0.25, 0.6, 12]} />
                    <meshStandardMaterial color="#6aa9ff" />
                  </mesh>
                  {/* Hands */}
                  <mesh castShadow position={[0.35, 0.45 + Math.sin((timeMs/200 + r + c)) * 0.05, 0.1]}>
                    <boxGeometry args={[0.12, 0.12, 0.4]} />
                    <meshStandardMaterial color="#b9d6ff" />
                  </mesh>
                  <mesh castShadow position={[-0.35, 0.45 + Math.cos((timeMs/210 + r + c)) * 0.05, 0.1]}>
                    <boxGeometry args={[0.12, 0.12, 0.4]} />
                    <meshStandardMaterial color="#b9d6ff" />
                  </mesh>
                </group>
              </group>
            ))}
          </group>
        ))}

        {/* Lights */}
        <ambientLight intensity={0.3 * weight} />
        <directionalLight position={[6, 10, 6]} intensity={0.9 * weight} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
        <spotLight position={[-8, 12, -6]} angle={0.5} intensity={0.5 * weight} penumbra={0.5} />
      </group>

      <Html position={[0, 5, 0]} center style={{ pointerEvents: 'none', opacity: 0.9 * weight }}>
        <div style={{
          padding: "10px 14px",
          background: "linear-gradient(180deg, rgba(13,23,36,0.8), rgba(13,23,36,0.3))",
          border: "1px solid rgba(75,134,255,0.35)",
          borderRadius: 12,
          boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
          backdropFilter: "blur(6px)",
          fontWeight: 700,
          letterSpacing: 0.5
        }}>
          Excel Dashboards ? Data Entry ? Validation ? Import
        </div>
      </Html>
    </group>
  );
}
