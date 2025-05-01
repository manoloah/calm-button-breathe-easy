
import React from 'react';

interface WaterCircleProps {
  fillPercentage: number;
  size?: number;
}

const WaterCircle: React.FC<WaterCircleProps> = ({ fillPercentage, size = 300 }) => {
  // Ensure fillPercentage is between 0 and 100
  const normalizedFill = Math.min(100, Math.max(0, fillPercentage));
  
  // Calculate wave parameters
  const waveHeight = size * 0.05; // Height of the wave
  
  return (
    <div 
      className="relative mx-auto"
      style={{ width: size, height: size }}
    >
      <div className="w-full h-full rounded-full overflow-hidden bg-[#132737] shadow-lg border border-[#1e3a4c]">
        {/* Water container */}
        <div 
          className="absolute bottom-0 w-full transition-all duration-500 ease-in-out"
          style={{ 
            height: `${normalizedFill}%`, 
            backgroundColor: '#00B383',
            borderRadius: '0 0 50% 50%'
          }}
        >
          {/* Top wave effect */}
          <div 
            className="absolute top-0 left-0 w-full overflow-hidden"
            style={{ height: waveHeight * 2 }}
          >
            <svg 
              className="absolute top-0 left-0" 
              width="100%" 
              height={waveHeight * 2}
              preserveAspectRatio="none"
            >
              <path
                d={`M0,${waveHeight} 
                   C${size/4},0 
                   ${size/2},${waveHeight * 2} 
                   ${size},${waveHeight} 
                   L${size},${size} 
                   L0,${size} 
                   Z`}
                fill="#2b9d7e"
              />
            </svg>
          </div>
        </div>
        
        {/* Glow effect */}
        <div 
          className="absolute top-0 left-0 w-full h-full rounded-full"
          style={{ 
            boxShadow: 'inset 0 0 30px rgba(0, 179, 131, 0.3)',
            opacity: normalizedFill / 100
          }}
        />
      </div>
    </div>
  );
};

export default WaterCircle;
