
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import WaterCircle from './WaterCircle';

interface BreathingTutorialProps {
  onComplete: () => void;
}

const BreathingTutorial: React.FC<BreathingTutorialProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [fillLevel, setFillLevel] = useState(50);
  const [countdown, setCountdown] = useState(3);
  
  const steps = [
    {
      title: "Cálmate y respira de forma normal",
      instruction: "Toma tu tiempo para calmarte y respirar normalmente por la nariz",
      buttonText: "SIGUIENTE",
      icon: "/lovable-uploads/6d0b6d06-83bd-49f1-a1f3-c1569c9b1eda.png" // Wave icon
    },
    {
      title: "Inhala normal",
      instruction: "Sigue las instrucciones...",
      duration: 5,
      fillTarget: 80,
      buttonText: null
    },
    {
      title: "Exhala normal",
      instruction: "Sigue las instrucciones...",
      duration: 5,
      fillTarget: 20,
      buttonText: null
    },
    {
      title: "Pincha tu nariz o retén la respiración",
      instruction: "Sigue las instrucciones...",
      buttonText: "SIGUIENTE",
      icon: "/lovable-uploads/268d82a8-c3a3-43c0-8083-c1e4fcd837bb.png" // Hand pinching nose
    },
    {
      title: "Detén al primer deseo de respirar",
      instruction: "Segundos",
      buttonText: "DETENER",
    }
  ];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (currentStep === 1) {
      // Inhale animation
      setFillLevel(20);
      timer = setInterval(() => {
        setFillLevel(prev => {
          const newValue = prev + 3;
          if (newValue >= 80) {
            clearInterval(timer);
            setTimeout(() => setCurrentStep(prev => prev + 1), 500);
            return 80;
          }
          return newValue;
        });
        setCountdown(prev => {
          if (prev <= 1) {
            return 0;
          }
          return prev - 1;
        });
      }, 240);
    }
    else if (currentStep === 2) {
      // Exhale animation
      setFillLevel(80);
      timer = setInterval(() => {
        setFillLevel(prev => {
          const newValue = prev - 3;
          if (newValue <= 20) {
            clearInterval(timer);
            setTimeout(() => setCurrentStep(prev => prev + 1), 500);
            return 20;
          }
          return newValue;
        });
        setCountdown(prev => {
          if (prev <= 1) {
            return 0;
          }
          return prev - 1;
        });
      }, 240);
    }
    
    return () => {
      clearInterval(timer);
    };
  }, [currentStep]);
  
  useEffect(() => {
    setCountdown(currentStep === 1 || currentStep === 2 ? 5 : 3);
  }, [currentStep]);
  
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete();
    }
  };
  
  const currentStepData = steps[currentStep];
  
  return (
    <div className="flex flex-col items-center justify-center space-y-8 animate-fade-in">
      <h1 className="text-3xl md:text-4xl font-unbounded text-white text-center">
        {currentStepData.title}
      </h1>
      
      {currentStep === 0 || currentStep === 3 ? (
        <div className="flex flex-col items-center justify-center">
          <img 
            src={currentStepData.icon} 
            alt={currentStepData.title} 
            className="w-40 h-40 object-contain mb-8"
          />
          <p className="text-[#B0B0B0] text-center text-lg mb-6">
            {currentStepData.instruction}
          </p>
        </div>
      ) : currentStep === 4 ? (
        <div className="flex flex-col items-center justify-center">
          <div className="text-6xl md:text-8xl font-unbounded text-white my-8">
            {countdown}
          </div>
          <p className="text-[#B0B0B0] text-center">{currentStepData.instruction}</p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <div className="relative">
            <WaterCircle fillPercentage={fillLevel} />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-6xl md:text-8xl font-unbounded text-white">
              {countdown}
            </div>
          </div>
          <p className="text-[#B0B0B0] text-center mt-4">{currentStepData.instruction}</p>
        </div>
      )}
      
      {currentStepData.buttonText && (
        <Button 
          onClick={handleNext}
          className={`${
            currentStep === 4 
              ? 'bg-[#E57373] hover:bg-[#D32F2F] text-white' 
              : 'bg-[#00B383] hover:bg-[#00956D] text-white'
          } px-10 py-6 text-lg rounded-full`}
        >
          {currentStepData.buttonText}
        </Button>
      )}
    </div>
  );
};

export default BreathingTutorial;
