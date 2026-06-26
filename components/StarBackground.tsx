"use client";

import { useMemo } from "react";
import Particles, { ParticlesProvider } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const initParticles = async (engine: Parameters<typeof loadSlim>[0]) => {
  await loadSlim(engine);
};

export default function StarBackground() {
  const options = useMemo(
    () => ({
      background: { color: { value: "transparent" } },
      fullScreen: { enable: false },
      fpsLimit: 60,
      detectRetina: true,
      particles: {
        number: {
          value: 200,
          density: { enable: true, width: 1200, height: 800 },
        },
        color: { value: ["#ffffff", "#e7f1ff", "#c7dbff", "#b8ceff"] },
        shape: { type: "circle" },
        opacity: {
          value: { min: 0.06, max: 0.78 },
          animation: { enable: true, speed: 0.35, minimumValue: 0.03 },
        },
        size: { value: { min: 0.3, max: 2.1 } },
        move: {
          enable: true,
          speed: 0.5,
          direction: "none" as const,
          random: true,
          straight: false,
          outModes: "out" as const,
        },
        twinkle: {
          particles: {
            enable: true,
            frequency: 0.02,
            color: { value: "#ffffff" },
            opacity: 1,
          },
        },
      },
      interactivity: {
        events: { onHover: { enable: false, mode: "bubble" as const } },
        modes: {
          bubble: { distance: 70, size: 2.2, duration: 0.7, opacity: 1 },
        },
      },
    }),
    [],
  );

  return (
    <ParticlesProvider init={initParticles}>
      <div className="pointer-events-none fixed inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 18% 24%, rgba(69, 121, 255, 0.16) 0%, rgba(69, 121, 255, 0.05) 30%, transparent 58%), radial-gradient(ellipse at 82% 14%, rgba(97, 150, 255, 0.13) 0%, rgba(97, 150, 255, 0.045) 24%, transparent 56%), radial-gradient(ellipse at 64% 74%, rgba(56, 116, 255, 0.14) 0%, rgba(56, 116, 255, 0.05) 26%, transparent 54%)",
            filter: "blur(2px)",
            opacity: 0.32,
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(8, 16, 38, 0.18) 0%, rgba(4, 8, 20, 0.04) 40%, rgba(3, 5, 12, 0.2) 100%)",
            mixBlendMode: "screen",
            opacity: 0.5,
          }}
        />
        <Particles
          id="tsparticles"
          options={options}
          className="h-full w-full"
        />
      </div>
    </ParticlesProvider>
  );
}
