
import React from 'react';
import { useNavigate } from 'react-router-dom';
import PanicButton from '../components/PanicButton';
import Navigation from '../components/Navigation';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#132737] p-4 relative">
      <Navigation />
      <h1 className="text-4xl font-unbounded text-white mb-12">
        PanicButton
      </h1>
      <PanicButton />
      <p className="mt-12 font-cabin text-[#B0B0B0] text-center max-w-sm">
        Cuando sientas ansiedad, presiona el botón para iniciar un ejercicio de respiración guiada de 3 minutos.
      </p>
    </div>
  );
};

export default Index;
