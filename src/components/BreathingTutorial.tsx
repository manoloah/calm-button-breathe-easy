
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface BreathingTutorialProps {
  onComplete: () => void;
}

const BreathingTutorial: React.FC<BreathingTutorialProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [countdown, setCountdown] = useState(3);
  
  const steps = [
    {
      title: "Cálmate y respira de forma normal",
      instruction: "Toma tu tiempo para calmarte y respirar normalmente por la nariz",
      buttonText: "SIGUIENTE",
      icon: "/lovable-uploads/27ff5298-c61c-4f29-8f6c-6f6be195a651.png"
    },
    {
      title: "Inhala normal",
      instruction: "Sigue las instrucciones...",
      duration: 5,
      buttonText: null
    },
    {
      title: "Exhala normal",
      instruction: "Sigue las instrucciones...",
      duration: 5,
      buttonText: null
    },
    {
      title: "Pincha tu nariz o retén la respiración",
      instruction: "Sigue las instrucciones...",
      buttonText: null,
      icon: "/lovable-uploads/23d68024-3f71-416d-b4be-c6c9cab506e4.png",
      duration: 3
    }
  ];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (currentStep === 1) {
      // Inhale animation - 5 seconds
      setCountdown(5);
      let timeElapsed = 0;
      
      timer = setInterval(() => {
        timeElapsed += 1000;
        setCountdown(prev => {
          const newValue = 5 - Math.floor(timeElapsed / 1000);
          if (newValue <= 0) {
            clearInterval(timer);
            setTimeout(() => setCurrentStep(prev => prev + 1), 200);
            return 0;
          }
          return newValue;
        });
      }, 1000);
    }
    else if (currentStep === 2) {
      // Exhale animation - 5 seconds
      setCountdown(5);
      let timeElapsed = 0;
      
      timer = setInterval(() => {
        timeElapsed += 1000;
        setCountdown(prev => {
          const newValue = 5 - Math.floor(timeElapsed / 1000);
          if (newValue <= 0) {
            clearInterval(timer);
            setTimeout(() => setCurrentStep(prev => prev + 1), 200);
            return 0;
          }
          return newValue;
        });
      }, 1000);
    }
    else if (currentStep === 3) {
      // Hold for 3 seconds then proceed to measurement
      setCountdown(3);
      timer = setTimeout(() => {
        onComplete();
      }, 3000);
    }
    
    return () => {
      clearInterval(timer);
      clearTimeout(timer);
    };
  }, [currentStep, onComplete]);
  
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete();
    }
  };
  
  const currentStepData = steps[currentStep];
  
  // Get the animation state for breathing visualization
  const getAnimationState = () => {
    if (currentStep === 1) return "animate-[breatheIn_5s_ease-in-out_forwards]";
    if (currentStep === 2) return "animate-[breatheOut_5s_ease-in-out_forwards]";
    return "";
  };
  
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
            <div 
              className={`
                w-52 h-52 md:w-60 md:h-60 rounded-full 
                bg-panic-accent bg-opacity-30
                flex items-center justify-center
                ${getAnimationState()}
              `}
            >
              <div className="w-36 h-36 md:w-40 md:h-40 rounded-full bg-panic-accent flex items-center justify-center text-panic-background">
                <div className="text-center">
                  <p className="text-6xl md:text-8xl font-unbounded text-white">{countdown}</p>
                  <p className="text-sm font-cabin mt-1 text-white">{currentStep === 1 ? "Inhala" : "Exhala"}</p>
                </div>
              </div>
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
