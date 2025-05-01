
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
      icon: "/lovable-uploads/27ff5298-c61c-4f29-8f6c-6f6be195a651.png" // Updated wave icon
    },
    {
      title: "Inhala normal",
      instruction: "Sigue las instrucciones...",
      duration: 5,
      fillTarget: 85,
      buttonText: null
    },
    {
      title: "Exhala normal",
      instruction: "Sigue las instrucciones...",
      duration: 5,
      fillTarget: 15,
      buttonText: null
    },
    {
      title: "Pincha tu nariz o retén la respiración",
      instruction: "Sigue las instrucciones...",
      buttonText: null,
      icon: "/lovable-uploads/23d68024-3f71-416d-b4be-c6c9cab506e4.png", // Updated nose pinching icon
      duration: 3
    }
  ];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (currentStep === 1) {
      // Inhale animation - 5 seconds
      setFillLevel(15);
      let timeElapsed = 0;
      const stepTime = 100; // update every 100ms
      const totalSteps = 5000 / stepTime; // 5 seconds
      const increment = (85 - 15) / totalSteps;
      
      timer = setInterval(() => {
        timeElapsed += stepTime;
        setFillLevel(prev => {
          const newValue = prev + increment;
          if (timeElapsed >= 5000) {
            clearInterval(timer);
            setTimeout(() => setCurrentStep(prev => prev + 1), 200);
            return 85;
          }
          return newValue;
        });
        
        setCountdown(prev => {
          const newValue = 5 - Math.floor(timeElapsed / 1000);
          return Math.max(newValue, 0);
        });
      }, stepTime);
    }
    else if (currentStep === 2) {
      // Exhale animation - 5 seconds
      setFillLevel(85);
      let timeElapsed = 0;
      const stepTime = 100; // update every 100ms
      const totalSteps = 5000 / stepTime; // 5 seconds
      const decrement = (85 - 15) / totalSteps;
      
      timer = setInterval(() => {
        timeElapsed += stepTime;
        setFillLevel(prev => {
          const newValue = prev - decrement;
          if (timeElapsed >= 5000) {
            clearInterval(timer);
            setTimeout(() => setCurrentStep(prev => prev + 1), 200);
            return 15;
          }
          return newValue;
        });
        
        setCountdown(prev => {
          const newValue = 5 - Math.floor(timeElapsed / 1000);
          return Math.max(newValue, 0);
        });
      }, stepTime);
    }
    else if (currentStep === 3) {
      // Hold for 3 seconds then proceed to measurement
      timer = setTimeout(() => {
        onComplete();
      }, 3000);
    }
    
    return () => {
      clearInterval(timer);
      clearTimeout(timer);
    };
  }, [currentStep, onComplete]);
  
  useEffect(() => {
    if (currentStep === 1 || currentStep === 2) {
      setCountdown(5); // Reset to 5 seconds for breathing steps
    } else if (currentStep === 3) {
      setCountdown(3); // 3 seconds for nose pinch step
    } else {
      setCountdown(3);
    }
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
          className="bg-[#00B383] hover:bg-[#00956D] text-white px-10 py-6 text-lg rounded-full"
        >
          {currentStepData.buttonText}
        </Button>
      )}
    </div>
  );
};

export default BreathingTutorial;
