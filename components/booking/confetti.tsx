"use client";

const COLORS = ["#f472b6", "#a855f7", "#f59e0b", "#10b981", "#3b82f6"];
const PARTICLE_COUNT = 40;

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function getParticle(id: number) {
  return {
    id,
    x: seededRandom(id * 3 + 1) * 100,
    y: -10,
    color: COLORS[id % COLORS.length],
    size: 6 + seededRandom(id * 3 + 2) * 6,
    delay: seededRandom(id * 3 + 3) * 0.6,
    duration: 1.5 + seededRandom(id * 3 + 4) * 1.5,
    rotation: seededRandom(id * 3 + 5) * 360,
  };
}

const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => getParticle(i));

export function Confetti() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
      {particles.map((p) => (
        <div
          key={p.id}
          className="confetti-particle"
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size * 0.6,
            backgroundColor: p.color,
            borderRadius: 2,
            animation: `confetti-fall ${p.duration}s ease-in ${p.delay}s forwards`,
            transform: `rotate(${p.rotation}deg)`,
          }}
        />
      ))}
    </div>
  );
}
