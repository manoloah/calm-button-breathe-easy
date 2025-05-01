
import React from 'react';
import { Button } from '@/components/ui/button';

interface MeasuringCounterProps {
  time: number;
  onStop: () => void;
}

const MeasuringCounter: React.FC<MeasuringCounterProps> = ({ time, onStop }) => {
  return (
    <div className="w-full max-w-md mx-auto space-y-8 animate-fade-in">
      <div className="text-center">
        <h2 className="text-3xl font-unbounded text-white mb-4">
          Detén al primer deseo de respirar
        </h2>
        <div className="text-7xl font-unbounded text-white mb-6">
          {time}
        </div>
        <p className="text-[#B0B0B0] text-lg">segundos</p>
      </div>
      
      <Button 
        onClick={onStop}
        className="bg-[#E57373] hover:bg-[#D32F2F] text-white w-full py-6 text-lg rounded-full"
      >
        DETENER
      </Button>
    </div>
  );
};

export default MeasuringCounter;
