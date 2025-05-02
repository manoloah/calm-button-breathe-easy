
import { useEffect, useState } from "react";
import { getAllBreathingPatterns, getPatternsByGoalSlug, logPatternRun } from "@/lib/breathQueries";
import { BreathingPattern, ExpandedPattern } from "@/lib/dbTypes";

export function useBreathPatterns(goalSlug?: string) {
  const [patterns, setPatterns] = useState<BreathingPattern[] | ExpandedPattern[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchPatterns() {
      setIsLoading(true);
      try {
        if (goalSlug) {
          const data = await getPatternsByGoalSlug(goalSlug);
          setPatterns(data);
        } else {
          const data = await getAllBreathingPatterns();
          setPatterns(data);
        }
      } catch (err) {
        console.error("Error fetching breathing patterns:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    }

    fetchPatterns();
  }, [goalSlug]);

  return { data: patterns, isLoading, error };
}

type BreathStep = {
  action: "inhale" | "hold" | "exhale" | "hold-out";
  seconds: number;
  method?: string;
  cue?: string | null;
};

export function useBreathingSession(pattern?: ExpandedPattern) {
  const [isActive, setIsActive] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [currentStep, setCurrentStep] = useState<BreathStep | null>(null);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Prepare step queue when pattern changes
  useEffect(() => {
    if (!pattern || !pattern.steps || pattern.steps.length === 0) {
      return;
    }
    
    console.log("Pattern in useBreathingSession:", pattern.name);
    console.log("Pattern steps:", pattern.steps);
    
    // Calculate total seconds for the session based on pattern
    let seconds = 0;
    
    pattern.steps.forEach(patternStep => {
      if (!patternStep.step) return;
      
      const reps = patternStep.repetitions || 1;
      const stepDuration = (
        patternStep.step.inhaleSeconds +
        patternStep.step.holdInSeconds +
        patternStep.step.exhaleSeconds +
        patternStep.step.holdOutSeconds
      );
      
      seconds += stepDuration * reps;
    });
    
    console.log("Total calculated seconds:", seconds);
    setTotalSeconds(seconds);
  }, [pattern]);

  // Start the breathing session
  const startSession = (initialStepIndex = 0) => {
    console.log("Starting session with pattern:", pattern?.name);
    
    if (!pattern || !pattern.steps || pattern.steps.length === 0) {
      console.error("Cannot start session: No pattern or steps provided");
      return;
    }
    
    setStepIndex(initialStepIndex);
    setIsActive(true);
    setElapsedSeconds(0);
    
    // Initialize with the first step
    const firstStep = pattern.steps[initialStepIndex];
    if (firstStep && firstStep.step) {
      console.log("First step:", firstStep.step);
      
      setCurrentStep({
        action: "inhale",
        seconds: firstStep.step.inhaleSeconds,
        method: firstStep.step.inhaleMethod,
        cue: firstStep.step.cueText
      });
      
      setSecondsRemaining(firstStep.step.inhaleSeconds);
    } else {
      console.error("First step is invalid:", firstStep);
    }
    
    // Log this session if we have a user ID (simplified for now)
    try {
      // This would be replaced with actual user ID in a real app
      const mockUserId = "00000000-0000-0000-0000-000000000000"; 
      if (pattern.id) {
        logPatternRun(mockUserId, pattern.id);
      }
    } catch (error) {
      console.error("Failed to log pattern run:", error);
    }
  };

  // Stop the breathing session
  const stopSession = () => {
    setIsActive(false);
    setCurrentStep(null);
  };

  // Timer effect to manage the breathing sequence
  useEffect(() => {
    if (!isActive || !pattern || !pattern.steps || pattern.steps.length === 0) return;
    
    const timer = setInterval(() => {
      // Update remaining time for current step
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          // Time to move to the next phase or step
          const currentPatternStep = pattern.steps[stepIndex];
          if (!currentPatternStep || !currentPatternStep.step) {
            console.error("Invalid current pattern step", currentPatternStep);
            stopSession();
            return 0;
          }
          
          const step = currentPatternStep.step;
          console.log("Current step action:", currentStep?.action, "Next:", step);
          
          // Determine the next action based on the current action
          if (currentStep?.action === "inhale") {
            // After inhale comes hold (if any)
            if (step.holdInSeconds > 0) {
              console.log("Moving to HOLD phase, duration:", step.holdInSeconds);
              setCurrentStep({
                action: "hold",
                seconds: step.holdInSeconds,
                cue: step.cueText
              });
              return step.holdInSeconds;
            } else {
              // Skip to exhale if no hold
              console.log("Moving to EXHALE phase, duration:", step.exhaleSeconds);
              setCurrentStep({
                action: "exhale",
                seconds: step.exhaleSeconds,
                method: step.exhaleMethod,
                cue: step.cueText
              });
              return step.exhaleSeconds;
            }
          }
          
          else if (currentStep?.action === "hold") {
            // After hold comes exhale
            console.log("Moving to EXHALE phase, duration:", step.exhaleSeconds);
            setCurrentStep({
              action: "exhale",
              seconds: step.exhaleSeconds,
              method: step.exhaleMethod,
              cue: step.cueText
            });
            return step.exhaleSeconds;
          }
          
          else if (currentStep?.action === "exhale") {
            // After exhale comes hold-out (if any)
            if (step.holdOutSeconds > 0) {
              console.log("Moving to HOLD-OUT phase, duration:", step.holdOutSeconds);
              setCurrentStep({
                action: "hold-out",
                seconds: step.holdOutSeconds,
                cue: step.cueText
              });
              return step.holdOutSeconds;
            } else {
              // Move to next step or cycle back to beginning of current step
              const nextStepIndex = stepIndex + 1;
              if (nextStepIndex < pattern.steps.length) {
                // Move to next step
                console.log("Moving to next step, index:", nextStepIndex);
                setStepIndex(nextStepIndex);
                const nextStep = pattern.steps[nextStepIndex].step;
                if (nextStep) {
                  setCurrentStep({
                    action: "inhale",
                    seconds: nextStep.inhaleSeconds,
                    method: nextStep.inhaleMethod,
                    cue: nextStep.cueText
                  });
                  return nextStep.inhaleSeconds;
                }
              } else {
                // End of pattern
                console.log("End of pattern reached");
                stopSession();
                return 0;
              }
            }
          }
          
          else if (currentStep?.action === "hold-out") {
            // After hold-out, either restart the same step (for repetitions) or go to next step
            const nextStepIndex = stepIndex + 1;
            if (nextStepIndex < pattern.steps.length) {
              // Move to next step
              console.log("Moving to next step after hold-out, index:", nextStepIndex);
              setStepIndex(nextStepIndex);
              const nextStep = pattern.steps[nextStepIndex].step;
              if (nextStep) {
                setCurrentStep({
                  action: "inhale",
                  seconds: nextStep.inhaleSeconds,
                  method: nextStep.inhaleMethod,
                  cue: nextStep.cueText
                });
                return nextStep.inhaleSeconds;
              }
            } else {
              // End of pattern
              console.log("End of pattern reached after hold-out");
              stopSession();
              return 0;
            }
          }
          
          return 0; // Default fallback
        }
        return prev - 1;
      });
      
      // Update total elapsed time
      setElapsedSeconds(prev => prev + 1);
      
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isActive, pattern, stepIndex, currentStep]);

  return {
    isActive,
    currentStep,
    secondsRemaining, 
    totalSeconds,
    elapsedSeconds,
    startSession,
    stopSession
  };
}
