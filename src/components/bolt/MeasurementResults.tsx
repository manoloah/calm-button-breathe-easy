
import React from 'react';
import { Button } from '@/components/ui/button';
import type { MeasurementMode } from '@/hooks/useBoltMeasurement';

interface MeasurementResultsProps {
  time: number;
  showOptions: boolean;
  onRetry: () => void;
  onSave: () => void;
}

const MeasurementResults: React.FC<MeasurementResultsProps> = ({
  time,
  showOptions,
  onRetry,
  onSave,
}) => {
  return (
    <div className="w-full max-w-md mx-auto space-y-8 animate-fade-in">
      <div className="text-center">
        <h2 className="text-3xl font-unbounded text-white mb-4">
          Tu puntuación BOLT
        </h2>
        <div className="text-6xl font-unbounded text-white mb-6">
          {time} segundos
        </div>
      </div>
      
      <div className="bg-white/10 p-6 rounded-lg">
        {showOptions && (
          <div className="flex flex-col space-y-4">
            <div className="text-white text-lg text-center mb-4">
              ¿Guardar esta medición o intentar de nuevo?
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <Button 
                onClick={onRetry}
                variant="outline" 
                className="flex-1 border-[#B0B0B0] text-[#B0B0B0] hover:bg-white/5"
              >
                Repetir
              </Button>
              <Button 
                onClick={onSave}
                className="flex-1 bg-[#00B383] hover:bg-[#00956D] text-white"
              >
                Guardar
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MeasurementResults;
