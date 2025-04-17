
import React from 'react';
import BoltMeasurement from '../components/BoltMeasurement';
import BottomNavigation from '../components/BottomNavigation';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const BoltPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-[#132737] text-white relative">
      <div className="absolute top-4 right-4">
        <Button 
          variant="ghost" 
          className="text-white hover:bg-white/10"
          onClick={() => navigate('/profile')}
        >
          <Settings className="h-6 w-6" />
        </Button>
      </div>
      
      <div className="container max-w-lg mx-auto pt-20 px-4 pb-24">
        <h1 className="text-3xl font-unbounded mb-4">Mide Tu BOLT</h1>
        <p className="mb-8 text-[#B0B0B0]">
          La prueba BOLT (Body Oxygen Level Test) mide tu tolerancia al CO2. 
          Una mayor puntuación indica mejor salud respiratoria.
        </p>
        
        <BoltMeasurement />
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default BoltPage;
