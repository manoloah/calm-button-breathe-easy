
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  destination?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ destination = "/" }) => {
  const navigate = useNavigate();

  return (
    <button
      className="absolute top-6 left-6 p-2 rounded-full bg-white bg-opacity-10 hover:bg-opacity-20 transition-all"
      onClick={() => navigate(destination)}
      aria-label="Go back"
    >
      <ArrowLeft className="h-6 w-6 text-[#00B383]" />
    </button>
  );
};

export default BackButton;
