"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Environment, OrbitControls } from "@react-three/drei";
import OfficeScene from "@/components/OfficeScene";
import ServicesScene from "@/components/ServicesScene";
import AudioController from "@/components/AudioController";
import "./globals.css";

const TOTAL_DURATION_MS = 34000; // ~34s
const SCENE_1_END = 18000; // 18s for office intro

export default function Page() {
  const [started, setStarted] = useState(false);
  const [timeMs, setTimeMs] = useState(0);
  const startTsRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  const onStart = useCallback(() => {
    if (started) return;
    setStarted(true);
    startTsRef.current = performance.now();
    const tick = () => {
      const now = performance.now();
      if (startTsRef.current == null) return;
      const t = now - startTsRef.current;
      setTimeMs(t);
      if (t < TOTAL_DURATION_MS) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [started]);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const scene1Weight = useMemo(() => {
    const fadeOutStart = SCENE_1_END - 2000;
    if (timeMs <= fadeOutStart) return 1;
    if (timeMs >= SCENE_1_END) return 0;
    return 1 - (timeMs - fadeOutStart) / 2000;
  }, [timeMs]);

  const scene2Weight = useMemo(() => {
    const fadeInStart = SCENE_1_END - 1000;
    if (timeMs <= fadeInStart) return 0;
    const v = Math.min(1, (timeMs - fadeInStart) / 2500);
    return v;
  }, [timeMs]);

  return (
    <main className="container">
      <div className="title">Excel Service Hub ? 3D Cinematic Promo</div>
      <Canvas camera={{ position: [8, 6, 12], fov: 38 }} shadows>
        <color attach="background" args={[0x0b/255, 0x0f/255, 0x14/255]} />
        <Suspense fallback={null}>
          <group>
            <group visible={scene1Weight > 0}>
              <OfficeScene timeMs={timeMs} weight={scene1Weight} />
            </group>
            <group visible={scene2Weight > 0}>
              <ServicesScene timeMs={timeMs} weight={scene2Weight} />
            </group>
            <Environment preset="city" />
          </group>
        </Suspense>
        {/* <OrbitControls />  // Uncomment to inspect */}
      </Canvas>

      <div className="overlay">
        {!started && (
          <button className="btn" onClick={onStart}>Start Cinematic</button>
        )}
        <div className="cta">
          <a className="btn" href="#contact">Contact Us</a>
        </div>
      </div>

      <AudioController started={started} />
    </main>
  );
}
