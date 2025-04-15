
import React from 'react';
import BackButton from '../components/BackButton';
import BreathingGuide from '../components/BreathingGuide';

const BreathworkPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#132737] p-4 relative">
      <BackButton />
      <BreathingGuide />
    </div>
  );
};

export default BreathworkPage;
