import React, { useState, useEffect } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  speed: number;
  color: string;
}

interface ConfettiProps {
  isActive: boolean;
}

const Confetti: React.FC<ConfettiProps> = ({ isActive }) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (isActive) {
      const newParticles = Array.from({ length: 50 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: -10,
        rotation: Math.random() * 360,
        scale: Math.random() * 0.6 + 0.4,
        speed: Math.random() * 3 + 2,
        color: ['#FFD700', '#FF69B4', '#4169E1', '#32CD32', '#FF4500'][Math.floor(Math.random() * 5)]
      }));
      setParticles(newParticles);
    } else {
      setParticles([]);
    }
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-4 h-4 opacity-90"
          style={{
            left: `${particle.x}%`,
            transform: `translateY(${particle.y}vh) rotate(${particle.rotation}deg) scale(${particle.scale})`,
            animation: `fall ${particle.speed}s linear infinite`,
            backgroundColor: particle.color,
            clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
          }}
        />
      ))}
    </div>
  );
};

export default Confetti;