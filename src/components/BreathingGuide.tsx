
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

interface BreathingGuideProps {
  breathingDuration?: number; // in seconds
  patternId?: string;
  currentStep?: {
    action: "inhale" | "hold" | "exhale" | "hold-out";
    seconds: number;
    method?: string;
    cue?: string | null;
  } | null;
  secondsRemaining?: number;
  isActive?: boolean;
  totalTime?: number;
  maxTime?: number;
  onComplete?: () => void;
}

type BreathState = "inhale" | "hold" | "exhale" | "complete";

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
  // Use props if available, otherwise use local state (for backward compatibility)
  const usingPatternMode = Boolean(currentStep);
  
  const [breathState, setBreathState] = useState<BreathState>("inhale");
  const [timer, setTimer] = useState(0);
  const [localTotalTime, setLocalTotalTime] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Default values for simple mode
  const inhaleDuration = 4;
  const holdDuration = 2;
  const exhaleDuration = 6;
  const cycleDuration = inhaleDuration + holdDuration + exhaleDuration;

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
    if (audioLoaded && (isActive || localTotalTime < breathingDuration)) {
      audioRef.current?.play().catch(e => console.log('Audio play failed:', e));
    }
    
    // Cleanup
    return () => {
      audio.pause();
      audio.src = '';
    };
  }, [audioLoaded, isActive, localTotalTime, breathingDuration]);

  // For simple mode (no pattern)
  useEffect(() => {
    // Skip this effect if we're using the pattern mode
    if (usingPatternMode) return;
    
    let interval: ReturnType<typeof setInterval>;
    
    if (localTotalTime < breathingDuration) {
      interval = setInterval(() => {
        const newTimer = (timer + 1) % cycleDuration;
        const newTotalTime = localTotalTime + 1;
        
        setTimer(newTimer);
        setLocalTotalTime(newTotalTime);
        
        if (newTimer === 0) {
          setBreathState("inhale");
          setCycleCount(c => c + 1);
          vibrate(100); // Short vibration for inhale
        } else if (newTimer === inhaleDuration) {
          setBreathState("hold");
          vibrate([100, 100, 100]); // Triple short vibration for hold
        } else if (newTimer === inhaleDuration + holdDuration) {
          setBreathState("exhale");
          vibrate(300); // Longer vibration for exhale
        }
        
        if (newTotalTime >= breathingDuration) {
          setBreathState("complete");
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
        }
      }, 1000);
    } else if (breathState === "complete") {
      // Session is complete
      const timeout = setTimeout(() => {
        if (onComplete) {
          onComplete();
        } else {
          navigate("/");
        }
      }, 5000);
      return () => clearTimeout(timeout);
    }
    
    return () => clearInterval(interval);
  }, [timer, localTotalTime, breathingDuration, breathState, navigate, onComplete, usingPatternMode]);
  
  // Detect completion via pattern mode
  useEffect(() => {
    if (usingPatternMode && !isActive && totalTime > 0) {
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
        } else {
          navigate("/");
        }
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [isActive, totalTime, navigate, onComplete, usingPatternMode]);
  
  // Calculate progress percentage for the progress bar
  const progress = Math.min(((usingPatternMode ? totalTime : localTotalTime) / (usingPatternMode ? maxTime : breathingDuration)) * 100, 100);
  
  // Get the current animation state based on mode
  const getAnimationState = () => {
    if (usingPatternMode) {
      if (!currentStep) return "";
      if (currentStep.action === "inhale") return "animate-[breatheIn_4s_ease-in-out_forwards]";
      if (currentStep.action === "hold") return "animate-[hold_2s_ease-in-out_forwards]";
      if (currentStep.action === "exhale") return "animate-[breatheOut_6s_ease-in-out_forwards]";
      if (currentStep.action === "hold-out") return "animate-[hold_2s_ease-in-out_forwards]";
      return "";
    } else {
      if (breathState === "inhale") return "animate-[breatheIn_4s_ease-in-out_forwards]";
      if (breathState === "hold") return "animate-[hold_2s_ease-in-out_forwards]";
      if (breathState === "exhale") return "animate-[breatheOut_6s_ease-in-out_forwards]";
      return "";
    }
  };
  
  // Get the instruction text
  const getInstructionText = () => {
    if (usingPatternMode) {
      if (!currentStep) return "Preparando...";
      switch (currentStep.action) {
        case "inhale": return "Inhala";
        case "hold": return "Retén";
        case "exhale": return "Exhala";
        case "hold-out": return "Retén";
        default: return "";
      }
    } else {
      if (breathState === "inhale") return "Inhala";
      if (breathState === "hold") return "Retén";
      if (breathState === "exhale") return "Exhala";
      if (breathState === "complete") return "Completado";
      return "";
    }
  };

  // Get current countdown value
  const getCurrentCount = () => {
    if (usingPatternMode) {
      return secondsRemaining || 0;
    } else {
      if (breathState === "inhale") return inhaleDuration - (timer % inhaleDuration);
      if (breathState === "hold") return holdDuration - (timer - inhaleDuration); 
      if (breathState === "exhale") return exhaleDuration - (timer - inhaleDuration - holdDuration);
      return 0;
    }
  };

  // Information about time left
  const timeLeft = usingPatternMode ? maxTime - totalTime : breathingDuration - localTotalTime;
  const minutesLeft = Math.floor(timeLeft / 60);
  const secondsLeft = timeLeft % 60;
  
  // Check if completed
  const isCompleted = usingPatternMode ? (!isActive && totalTime > 0) : (breathState === "complete");
  
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
            {!usingPatternMode && (
              <p className="text-sm font-cabin-italic text-panic-text-secondary mt-1">
                Ciclo {cycleCount + 1}
              </p>
            )}
            {usingPatternMode && currentStep?.cue && (
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
                <p className="text-3xl font-unbounded">{getCurrentCount()}</p>
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
