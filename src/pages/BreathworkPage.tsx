
import React from 'react';
import BreathingGuide from '../components/BreathingGuide';
import BottomNavigation from '../components/BottomNavigation';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const BreathworkPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-[#132737] text-white relative">
      <div className="absolute top-4 right-4 z-10">
        <Button 
          variant="ghost" 
          className="text-white hover:bg-white/10"
          onClick={() => navigate('/profile')}
        >
          <Settings className="h-6 w-6" />
        </Button>
      </div>
      
      <BreathingGuide />
      <BottomNavigation />
    </div>
  );
};

export default BreathworkPage;
