import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface BreathingGuideProps {
  breathingDuration?: number; // in seconds
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

const BreathingGuide: React.FC<BreathingGuideProps> = ({ breathingDuration = 180 }) => {
  const [breathState, setBreathState] = useState<BreathState>("inhale");
  const [timer, setTimer] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const navigate = useNavigate();
  
  const inhaleDuration = 4;
  const holdDuration = 2;
  const exhaleDuration = 6;
  const cycleDuration = inhaleDuration + holdDuration + exhaleDuration;

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (totalTime < breathingDuration) {
      interval = setInterval(() => {
        const newTimer = (timer + 1) % cycleDuration;
        const newTotalTime = totalTime + 1;
        
        setTimer(newTimer);
        setTotalTime(newTotalTime);
        
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
        }
      }, 1000);
    } else if (breathState === "complete") {
      // Session is complete
      const timeout = setTimeout(() => {
        navigate("/");
      }, 5000);
      return () => clearTimeout(timeout);
    }
    
    return () => clearInterval(interval);
  }, [timer, totalTime, breathingDuration, breathState, navigate]);
  
  // Calculate progress percentage for the progress bar
  const progress = Math.min((totalTime / breathingDuration) * 100, 100);
  
  // Get the current animation state
  const getAnimationState = () => {
    if (breathState === "inhale") return "animate-[breatheIn_4s_ease-in-out_forwards]";
    if (breathState === "hold") return "animate-[hold_2s_ease-in-out_forwards]";
    if (breathState === "exhale") return "animate-[breatheOut_6s_ease-in-out_forwards]";
    return "";
  };
  
  // Get the instruction text
  const getInstructionText = () => {
    if (breathState === "inhale") return "Inhala";
    if (breathState === "hold") return "Retén";
    if (breathState === "exhale") return "Exhala";
    if (breathState === "complete") return "Completado";
    return "";
  };

  // Information about time left
  const timeLeft = breathingDuration - totalTime;
  const minutesLeft = Math.floor(timeLeft / 60);
  const secondsLeft = timeLeft % 60;
  
  return (
    <div className="flex flex-col items-center justify-center h-full gap-8">
      {breathState === "complete" ? (
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
            <p className="text-sm font-cabin-italic text-panic-text-secondary mt-1">
              Ciclo {cycleCount + 1}
            </p>
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
                <p className="text-3xl font-unbounded">{
                  breathState === "inhale" ? inhaleDuration - (timer % inhaleDuration) : 
                  breathState === "hold" ? holdDuration - (timer - inhaleDuration) : 
                  breathState === "exhale" ? exhaleDuration - (timer - inhaleDuration - holdDuration) : 0
                }</p>
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
