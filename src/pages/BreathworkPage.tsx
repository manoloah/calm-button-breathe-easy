
import React from 'react';
import Navigation from '../components/Navigation';
import BreathingGuide from '../components/BreathingGuide';

const BreathworkPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#132737] p-4 relative">
      <Navigation />
      <BreathingGuide />
    </div>
  );
};

export default BreathworkPage;
