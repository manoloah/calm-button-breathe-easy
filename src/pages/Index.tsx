
import React from 'react';
import PanicButton from '../components/PanicButton';
import BottomNavigation from '../components/BottomNavigation';
import { Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#132737] p-4 relative">
      <div className="absolute top-4 right-4">
        <Button 
          variant="ghost" 
          className="text-white hover:bg-white/10"
          onClick={() => navigate('/profile')}
        >
          <Settings className="h-6 w-6" />
        </Button>
      </div>
      
      <h1 className="text-4xl font-unbounded text-white mb-12">
        PanicButton
      </h1>
      
      <PanicButton />
      
      <p className="mt-12 font-cabin text-[#B0B0B0] text-center max-w-sm">
        Cuando sientas ansiedad, presiona el botón para iniciar un ejercicio de respiración guiada de 3 minutos.
      </p>
      
      <BottomNavigation />
    </div>
  );
};

export default Index;
