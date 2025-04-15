
import React from 'react';
import { useNavigate } from 'react-router-dom';
import PanicButton from '../components/PanicButton';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { LogOut } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#132737] p-4 relative">
      <Button
        variant="ghost"
        className="absolute top-4 right-4 text-white hover:bg-white/10"
        onClick={handleLogout}
      >
        <LogOut className="h-5 w-5" />
      </Button>
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
