
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

interface BreathingGuideProps {
  breathingDuration?: number; // in seconds
  currentStep?: {
    action: "inhale" | "hold" | "exhale" | "hold-out";
    seconds: number;
    cue?: string | null;
  } | null;
  secondsRemaining?: number;
  isActive?: boolean;
  totalTime?: number;
  maxTime?: number;
  onComplete?: () => void;
}

// Helper function for vibration
const vibrate = (pattern?: number | number[]) => {
  if ('vibrate' in navigator) {
    try {
      navigator.vibrate(pattern || 200);
    } catch (e) {
      console.log('Vibration not supported');
    }
  }
};

const BreathingGuide: React.FC<BreathingGuideProps> = ({
  breathingDuration = 180,
  currentStep,
  secondsRemaining = 0,
  isActive = false,
  totalTime = 0,
  maxTime = 180,
  onComplete
}) => {
  const navigate = useNavigate();
  const [audioLoaded, setAudioLoaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Initialize audio
  useEffect(() => {
    // Create audio element for wave sounds
    const audio = new Audio('/lovable-uploads/ocean-waves.mp3');
    audio.loop = true;
    audio.volume = 0.5;
    audioRef.current = audio;
    
    // Load the audio
    audio.addEventListener('canplaythrough', () => {
      setAudioLoaded(true);
    });
    
    // Start playing when loaded
    if (audioLoaded && isActive) {
      audioRef.current?.play().catch(e => console.log('Audio play failed:', e));
    }
    
    // Cleanup
    return () => {
      audio.pause();
      audio.src = '';
    };
  }, [audioLoaded, isActive]);

  // Handle vibration on step change
  useEffect(() => {
    if (currentStep && secondsRemaining === currentStep.seconds) {
      if (currentStep.action === 'inhale') {
        vibrate(100); // Short vibration for inhale
      } else if (currentStep.action === 'hold' || currentStep.action === 'hold-out') {
        vibrate([100, 100, 100]); // Triple short vibration for hold
      } else if (currentStep.action === 'exhale') {
        vibrate(300); // Longer vibration for exhale
      }
    }
  }, [currentStep, secondsRemaining]);

  // Detect completion
  useEffect(() => {
    if (!isActive && totalTime > 0) {
      console.log("Exercise complete detected");
      // Fade out audio when complete
      if (audioRef.current) {
        const fadeOut = setInterval(() => {
          if (audioRef.current && audioRef.current.volume > 0.1) {
            audioRef.current.volume -= 0.1;
          } else {
            clearInterval(fadeOut);
            audioRef.current?.pause();
          }
        }, 200);
      }
      
      const timeout = setTimeout(() => {
        if (onComplete) {
          onComplete();
        }
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [isActive, totalTime, onComplete]);
  
  // Calculate progress percentage for the progress bar
  const progress = Math.min((totalTime / maxTime) * 100, 100);
  
  // Get the current animation state
  const getAnimationState = () => {
    if (!currentStep) return "";
      
    // Calculate dynamic animation duration based on seconds remaining
    const duration = currentStep.seconds;
    
    if (currentStep.action === "inhale") 
      return `animate-[breatheIn_${duration}s_ease-in-out_forwards]`;
    if (currentStep.action === "hold") 
      return `animate-[hold_${duration}s_ease-in-out_forwards]`;
    if (currentStep.action === "exhale") 
      return `animate-[breatheOut_${duration}s_ease-in-out_forwards]`;
    if (currentStep.action === "hold-out") 
      return `animate-[hold_${duration}s_ease-in-out_forwards]`;
    return "";
  };
  
  // Get the instruction text
  const getInstructionText = () => {
    if (!currentStep) return "Preparando...";
    switch (currentStep.action) {
      case "inhale": return "Inhala";
      case "hold": return "Retén";
      case "exhale": return "Exhala";
      case "hold-out": return "Retén";
      default: return "";
    }
  };

  // Information about time left
  const timeLeft = maxTime - totalTime;
  const minutesLeft = Math.floor(timeLeft / 60);
  const secondsLeft = timeLeft % 60;
  
  // Check if completed
  const isCompleted = !isActive && totalTime > 0;

  console.log("BreathingGuide rendering:", {
    currentStep: currentStep?.action,
    secondsRemaining,
    isActive,
    animationState: getAnimationState()
  });
  
  return (
    <div className="flex flex-col items-center justify-center h-full gap-8">
      {isCompleted ? (
        <div className="text-center animate-fade-in">
          <h2 className="text-3xl font-unbounded text-panic-text-primary mb-4">Respiración Completada</h2>
          <p className="text-xl font-cabin text-panic-text-secondary">¿Te sientes mejor?</p>
          <p className="text-lg font-cabin-italic text-panic-text-secondary mt-2">Regresando a la pantalla principal...</p>
        </div>
      ) : (
        <>
          <div className="text-center mb-2">
            <h2 className="text-3xl font-unbounded text-panic-text-primary mb-4">{getInstructionText()}</h2>
            <p className="text-lg font-cabin text-panic-text-secondary">
              {minutesLeft}:{secondsLeft < 10 ? `0${secondsLeft}` : secondsLeft} restantes
            </p>
            {currentStep?.cue && (
              <p className="text-sm font-cabin-italic text-panic-text-secondary mt-1">
                {currentStep.cue}
              </p>
            )}
          </div>
          
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
                <p className="text-3xl font-unbounded">{secondsRemaining}</p>
                <p className="text-sm font-cabin mt-1">{getInstructionText()}</p>
              </div>
            </div>
          </div>
          
          <div className="w-4/5 max-w-sm bg-white/10 rounded-full h-2.5 mt-6">
            <div 
              className="bg-panic-accent h-2.5 rounded-full" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default BreathingGuide;
