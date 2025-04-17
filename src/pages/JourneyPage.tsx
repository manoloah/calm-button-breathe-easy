
import React from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNavigation from '../components/BottomNavigation';
import { Medal, Lock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface JourneyStepProps {
  number: number;
  title: string;
  description: string;
  isCompleted: boolean;
  isLocked: boolean;
  onStart: () => void;
}

const JourneyStep = ({ number, title, description, isCompleted, isLocked, onStart }: JourneyStepProps) => {
  return (
    <div className={`
      relative p-6 rounded-lg mb-4 border flex items-center
      ${isCompleted ? 'bg-[#1A392A] border-[#00B383]' : isLocked ? 'bg-[#1A1F2C]/50 border-[#444]' : 'bg-[#1A2A3C] border-[#336699]'}
    `}>
      {/* Status indicator */}
      <div className="absolute -left-4 -top-4 h-8 w-8 rounded-full flex items-center justify-center">
        {isCompleted ? (
          <CheckCircle className="h-8 w-8 text-[#00B383]" />
        ) : isLocked ? (
          <Lock className="h-8 w-8 text-[#777]" />
        ) : (
          <div className="h-8 w-8 rounded-full bg-[#336699] flex items-center justify-center text-white font-bold">
            {number}
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="flex-1 ml-4">
        <h3 className={`font-unbounded text-lg ${isLocked ? 'text-[#777]' : 'text-white'}`}>
          {title}
        </h3>
        <p className={`text-sm mt-1 ${isLocked ? 'text-[#666]' : 'text-[#B0B0B0]'}`}>
          {description}
        </p>
      </div>
      
      {/* Action button */}
      {isCompleted ? (
        <div className="flex items-center text-[#00B383]">
          <Medal className="h-5 w-5 mr-2" />
          <span className="text-sm font-medium">Completado</span>
        </div>
      ) : (
        <Button 
          onClick={onStart} 
          disabled={isLocked}
          className={isLocked ? "bg-[#444] text-[#777]" : "bg-[#00B383] hover:bg-[#00956D]"}
        >
          {isLocked ? "Bloqueado" : "Comenzar"}
        </Button>
      )}
    </div>
  );
};

const JourneyPage = () => {
  const navigate = useNavigate();
  
  // Example journey data
  const journeySteps = [
    {
      id: 1,
      title: "Respiración Consciente",
      description: "Aprende los fundamentos de la respiración consciente con este ejercicio de 2 minutos.",
      isCompleted: true,
      isLocked: false,
    },
    {
      id: 2,
      title: "Respiración 4-7-8",
      description: "Domina la técnica de respiración 4-7-8 para calmar tu sistema nervioso.",
      isCompleted: false,
      isLocked: false,
    },
    {
      id: 3,
      title: "Respiración Alterna",
      description: "Aprende a equilibrar tu energía con la respiración alterna por la nariz.",
      isCompleted: false,
      isLocked: true,
    },
    {
      id: 4,
      title: "Respiración de Fuego",
      description: "Aumenta tu energía y vitalidad con la poderosa técnica de respiración de fuego.",
      isCompleted: false,
      isLocked: true,
    },
    {
      id: 5,
      title: "Retención Avanzada",
      description: "Desbloquea el siguiente nivel de calma con técnicas avanzadas de retención de respiración.",
      isCompleted: false,
      isLocked: true,
    },
  ];

  const handleStartExercise = (id: number) => {
    navigate('/breathwork', { state: { exerciseId: id } });
  };

  return (
    <div className="min-h-screen bg-[#132737] text-white">
      <div className="max-w-lg mx-auto pt-10 px-4 pb-24">
        <h1 className="text-3xl font-unbounded mb-2">Tu Camino</h1>
        <p className="text-[#B0B0B0] mb-8">Construye tu resiliencia día a día con estos ejercicios progresivos</p>
        
        <div className="relative">
          {/* Vertical line connecting journey steps */}
          <div className="absolute left-4 top-10 bottom-10 w-0.5 bg-gradient-to-b from-[#00B383] to-[#444]"></div>
          
          {/* Journey steps */}
          <div className="ml-8">
            {journeySteps.map((step) => (
              <JourneyStep
                key={step.id}
                number={step.id}
                title={step.title}
                description={step.description}
                isCompleted={step.isCompleted}
                isLocked={step.isLocked}
                onStart={() => handleStartExercise(step.id)}
              />
            ))}
          </div>
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default JourneyPage;
