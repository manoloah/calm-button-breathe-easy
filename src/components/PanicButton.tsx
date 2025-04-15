
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PanicButton = () => {
  const [isPressing, setIsPressing] = useState(false);
  const navigate = useNavigate();

  const startBreathwork = () => {
    navigate("/breathwork");
  };

  return (
    <button
      className={`
        flex items-center justify-center
        rounded-full
        bg-[#00B383]
        text-[#132737] font-unbounded font-bold text-xl
        transition-all duration-300 ease-in-out
        w-56 h-56 md:w-64 md:h-64
        shadow-lg
        ${isPressing ? "scale-95 shadow-inner" : "hover:scale-105 animate-[pulse_2.5s_cubic-bezier(0.4,0,0.6,1)_infinite]"}
      `}
      onMouseDown={() => setIsPressing(true)}
      onMouseUp={() => { 
        setIsPressing(false);
        startBreathwork();
      }}
      onTouchStart={() => setIsPressing(true)}
      onTouchEnd={() => {
        setIsPressing(false);
        startBreathwork();
      }}
      aria-label="Start breathing exercise"
    >
      <div className="px-6 py-10 text-center">
        <span className="block">Presiona y</span>
        <span className="block">encuentra</span>
        <span className="block">la calma</span>
      </div>
    </button>
  );
};

export default PanicButton;
