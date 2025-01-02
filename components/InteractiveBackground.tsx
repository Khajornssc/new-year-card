import React, { useState } from 'react';

interface ClickEffect {
  id: number;
  x: number;
  y: number;
}

const ClickEffect = ({ x, y }: { x: number; y: number }) => {
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: x,
        top: y,
        transform: 'translate(-50%, -50%)'
      }}
    >
      <div className="relative">
        <div className="absolute inset-0 animate-ping">
          <div className="w-4 h-4 bg-yellow-300 rounded-full opacity-75" />
        </div>
        <div className="relative w-3 h-3 bg-yellow-400 rounded-full" />
      </div>
    </div>
  );
};

const InteractiveBackground = () => {
  const [effects, setEffects] = useState<ClickEffect[]>([]);

  const handleClick = (e: React.MouseEvent) => {
    const newEffect = {
      id: Date.now(),
      x: e.clientX,
      y: e.clientY
    };
    setEffects(prev => [...prev, newEffect]);
    setTimeout(() => {
      setEffects(prev => prev.filter(effect => effect.id !== newEffect.id));
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-0" onClick={handleClick}>
      {effects.map(effect => (
        <ClickEffect key={effect.id} x={effect.x} y={effect.y} />
      ))}
    </div>
  );
};

export default InteractiveBackground;