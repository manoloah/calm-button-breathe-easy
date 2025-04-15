
import React from 'react';
import { useNavigate } from 'react-router-dom';
import BoltMeasurement from '../components/BoltMeasurement';
import Navigation from '../components/Navigation';

const BoltPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#132737] p-4 relative">
      <Navigation />
      <BoltMeasurement />
    </div>
  );
};

export default BoltPage;
