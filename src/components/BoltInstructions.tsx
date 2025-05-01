
import React from 'react';
import { Button } from '@/components/ui/button';
import { CircleIcon } from 'lucide-react';

interface BoltInstructionsProps {
  onStartMeasurement: () => void;
}

const BoltInstructions: React.FC<BoltInstructionsProps> = ({ onStartMeasurement }) => {
  return (
    <div className="bg-[#132737]/60 rounded-lg p-6 backdrop-blur-sm border border-[#1e3a4c]">
      <h2 className="text-2xl md:text-3xl font-unbounded text-white mb-4 text-center">
        Instrucciones para medir tu BOLT
      </h2>
      <p className="text-[#B0B0B0] mb-8 text-center">
        Para mejores resultados, realiza esta medición al despertar por la mañana.
      </p>
      
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#00B383] flex items-center justify-center text-white">
            1
          </div>
          <p className="text-[#B0B0B0]">Cálmate y respira normal por la nariz durante 10 segundos</p>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#00B383] flex items-center justify-center text-white">
            2
          </div>
          <p className="text-[#B0B0B0]">Realiza una inhalación NORMAL durante 5 segundos</p>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#00B383] flex items-center justify-center text-white">
            3
          </div>
          <p className="text-[#B0B0B0]">Realiza una exhalación NORMAL durante 5 segundos</p>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#00B383] flex items-center justify-center text-white">
            4
          </div>
          <p className="text-[#B0B0B0]">Pincha tu nariz o retén la respiración</p>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#00B383] flex items-center justify-center text-white">
            5
          </div>
          <p className="text-[#B0B0B0]">Inicia el cronómetro</p>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#00B383] flex items-center justify-center text-white">
            6
          </div>
          <p className="text-[#B0B0B0]">Espera hasta sentir la PRIMERA necesidad de respirar o falta de aire (normalmente sientes como la garganta se contrae o el pecho brinca, no tiene que ser al máximo)</p>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#00B383] flex items-center justify-center text-white">
            7
          </div>
          <p className="text-[#B0B0B0]">Detén el contador en ese momento</p>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#00B383] flex items-center justify-center text-white">
            8
          </div>
          <p className="text-[#B0B0B0]">Recupera tu respiración normal, lenta y controlada</p>
        </div>
      </div>
      
      <div className="mt-8 flex justify-center">
        <Button 
          onClick={onStartMeasurement}
          className="bg-[#00B383] hover:bg-[#00956D] text-white px-10 py-6 text-lg rounded-full"
        >
          COMIENZA LA MEDICIÓN
        </Button>
      </div>
    </div>
  );
};

export default BoltInstructions;
