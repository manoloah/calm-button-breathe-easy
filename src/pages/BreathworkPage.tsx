
import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import BreathingGuide from '../components/BreathingGuide';
import BottomNavigation from '../components/BottomNavigation';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

// Define the breathing pattern types
type BreathAction = "inhale" | "hold" | "exhale" | "hold-out";

interface BreathStep {
  action: BreathAction;
  seconds: number;
  cue?: string;
}

interface BreathPattern {
  id: string;
  name: string;
  description: string;
  category: 'equilibrio' | 'calma' | 'concentracion';
  steps: BreathStep[];
}

const BreathworkPage = () => {
  const navigate = useNavigate();
  const [breathingDuration, setBreathingDuration] = useState(180); // Default 3 minutes (180 seconds)
  const [activeCategory, setActiveCategory] = useState<'equilibrio' | 'calma' | 'concentracion'>('equilibrio');
  const [selectedPatternId, setSelectedPatternId] = useState<string | null>(null);
  const [exerciseStarted, setExerciseStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState<BreathStep | null>(null);
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [intervalId, setIntervalId] = useState<number | null>(null);
  
  // Predefined breathing patterns
  const breathingPatterns: BreathPattern[] = [
    // Equilibrio (Box Breathing)
    {
      id: 'equilibrio-3',
      name: '3×3×3×3',
      description: 'Respiración cuadrada - inhala 3s, retén 3s, exhala 3s, retén 3s',
      category: 'equilibrio',
      steps: [
        { action: 'inhale', seconds: 3, cue: 'Inhala por la nariz' },
        { action: 'hold', seconds: 3, cue: 'Retén el aire' },
        { action: 'exhale', seconds: 3, cue: 'Exhala por la boca' },
        { action: 'hold-out', seconds: 3, cue: 'Mantén los pulmones vacíos' }
      ]
    },
    {
      id: 'equilibrio-4',
      name: '4×4×4×4',
      description: 'Respiración cuadrada - inhala 4s, retén 4s, exhala 4s, retén 4s',
      category: 'equilibrio',
      steps: [
        { action: 'inhale', seconds: 4, cue: 'Inhala por la nariz' },
        { action: 'hold', seconds: 4, cue: 'Retén el aire' },
        { action: 'exhale', seconds: 4, cue: 'Exhala por la boca' },
        { action: 'hold-out', seconds: 4, cue: 'Mantén los pulmones vacíos' }
      ]
    },
    {
      id: 'equilibrio-5',
      name: '5×5×5×5',
      description: 'Respiración cuadrada - inhala 5s, retén 5s, exhala 5s, retén 5s',
      category: 'equilibrio',
      steps: [
        { action: 'inhale', seconds: 5, cue: 'Inhala por la nariz' },
        { action: 'hold', seconds: 5, cue: 'Retén el aire' },
        { action: 'exhale', seconds: 5, cue: 'Exhala por la boca' },
        { action: 'hold-out', seconds: 5, cue: 'Mantén los pulmones vacíos' }
      ]
    },
    {
      id: 'equilibrio-6',
      name: '6×6×6×6',
      description: 'Respiración cuadrada - inhala 6s, retén 6s, exhala 6s, retén 6s',
      category: 'equilibrio',
      steps: [
        { action: 'inhale', seconds: 6, cue: 'Inhala por la nariz' },
        { action: 'hold', seconds: 6, cue: 'Retén el aire' },
        { action: 'exhale', seconds: 6, cue: 'Exhala por la boca' },
        { action: 'hold-out', seconds: 6, cue: 'Mantén los pulmones vacíos' }
      ]
    },
    
    // Calma (No hold breathing)
    {
      id: 'calma-3-3',
      name: '3-3',
      description: 'Respiración calmante - inhala 3s, exhala 3s',
      category: 'calma',
      steps: [
        { action: 'inhale', seconds: 3, cue: 'Inhala lentamente' },
        { action: 'exhale', seconds: 3, cue: 'Exhala completamente' }
      ]
    },
    {
      id: 'calma-4-4',
      name: '4-4',
      description: 'Respiración calmante - inhala 4s, exhala 4s',
      category: 'calma',
      steps: [
        { action: 'inhale', seconds: 4, cue: 'Inhala lentamente' },
        { action: 'exhale', seconds: 4, cue: 'Exhala completamente' }
      ]
    },
    {
      id: 'calma-4-6',
      name: '4-6',
      description: 'Respiración calmante - inhala 4s, exhala 6s',
      category: 'calma',
      steps: [
        { action: 'inhale', seconds: 4, cue: 'Inhala lentamente' },
        { action: 'exhale', seconds: 6, cue: 'Exhala completamente' }
      ]
    },
    {
      id: 'calma-3-7',
      name: '3-7',
      description: 'Respiración calmante - inhala 3s, exhala 7s',
      category: 'calma',
      steps: [
        { action: 'inhale', seconds: 3, cue: 'Inhala lentamente' },
        { action: 'exhale', seconds: 7, cue: 'Exhala completamente' }
      ]
    },
    
    // Concentración
    {
      id: 'concentracion-4-0-4-4',
      name: '4-0-4-4',
      description: 'Mejora la concentración - inhala 4s, exhala 4s, retén 4s',
      category: 'concentracion',
      steps: [
        { action: 'inhale', seconds: 4, cue: 'Inhala profundamente' },
        { action: 'exhale', seconds: 4, cue: 'Exhala completamente' },
        { action: 'hold-out', seconds: 4, cue: 'Mantén los pulmones vacíos' }
      ]
    },
    {
      id: 'concentracion-4-0-4-6',
      name: '4-0-4-6',
      description: 'Mejora la concentración - inhala 4s, exhala 4s, retén 6s',
      category: 'concentracion',
      steps: [
        { action: 'inhale', seconds: 4, cue: 'Inhala profundamente' },
        { action: 'exhale', seconds: 4, cue: 'Exhala completamente' },
        { action: 'hold-out', seconds: 6, cue: 'Mantén los pulmones vacíos' }
      ]
    },
    {
      id: 'concentracion-4-0-4-7',
      name: '4-0-4-7',
      description: 'Mejora la concentración - inhala 4s, exhala 4s, retén 7s',
      category: 'concentracion',
      steps: [
        { action: 'inhale', seconds: 4, cue: 'Inhala profundamente' },
        { action: 'exhale', seconds: 4, cue: 'Exhala completamente' },
        { action: 'hold-out', seconds: 7, cue: 'Mantén los pulmones vacíos' }
      ]
    },
    {
      id: 'concentracion-5-0-5-5',
      name: '5-0-5-5',
      description: 'Mejora la concentración - inhala 5s, exhala 5s, retén 5s',
      category: 'concentracion',
      steps: [
        { action: 'inhale', seconds: 5, cue: 'Inhala profundamente' },
        { action: 'exhale', seconds: 5, cue: 'Exhala completamente' },
        { action: 'hold-out', seconds: 5, cue: 'Mantén los pulmones vacíos' }
      ]
    }
  ];

  // Filter patterns by selected category
  const filteredPatterns = breathingPatterns.filter(pattern => pattern.category === activeCategory);
  
  // Get the selected pattern
  const selectedPattern = selectedPatternId 
    ? breathingPatterns.find(p => p.id === selectedPatternId) 
    : null;

  // Format time helper function
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  // Duration options
  const durationOptions = [
    { label: '1min', value: 60 },
    { label: '2min', value: 120 },
    { label: '3min', value: 180 },
    { label: '5min', value: 300 },
    { label: '10min', value: 600 },
  ];
  
  const handleDurationChange = (value: string) => {
    setBreathingDuration(parseInt(value));
  };
  
  const handlePatternChange = (value: string) => {
    setSelectedPatternId(value);
    console.log("Selected pattern ID:", value);
  };
  
  const handleCategoryChange = (category: 'equilibrio' | 'calma' | 'concentracion') => {
    setActiveCategory(category);
    setSelectedPatternId(null); // Reset selected pattern when changing category
  };

  // Function to move to the next step in the breathing cycle
  const moveToNextStep = () => {
    if (!selectedPattern) return;
    
    let currentIndex = 0;
    if (currentStep) {
      const stepIndex = selectedPattern.steps.findIndex(
        step => step.action === currentStep.action && step.seconds === currentStep.seconds
      );
      currentIndex = (stepIndex + 1) % selectedPattern.steps.length;
    }
    
    const nextStep = selectedPattern.steps[currentIndex];
    setCurrentStep(nextStep);
    setSecondsRemaining(nextStep.seconds);
  };
  
  // Handle starting the breathing exercise
  const handleStartExercise = () => {
    if (!selectedPattern) {
      console.error("No breathing pattern selected!");
      return;
    }
    
    console.log("Starting exercise with pattern:", selectedPattern.name);
    
    setExerciseStarted(true);
    setIsActive(true);
    setElapsedSeconds(0);
    
    // Start with the first step
    const firstStep = selectedPattern.steps[0];
    setCurrentStep(firstStep);
    setSecondsRemaining(firstStep.seconds);
    
    // Set up interval for the timer
    const id = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          moveToNextStep();
          return 0; // Will be reset by moveToNextStep
        }
        return prev - 1;
      });
      
      setElapsedSeconds(prev => {
        const newElapsed = prev + 1;
        if (newElapsed >= breathingDuration) {
          handleStopExercise();
        }
        return newElapsed;
      });
    }, 1000) as unknown as number;
    
    setIntervalId(id);
  };
  
  // Handle stopping the breathing exercise
  const handleStopExercise = () => {
    if (intervalId) {
      clearInterval(intervalId);
    }
    
    setExerciseStarted(false);
    setIsActive(false);
    setCurrentStep(null);
    setIntervalId(null);
  };
  
  return (
    <div className="min-h-screen bg-[#132737] text-white relative">
      <div className="absolute top-4 right-4 z-10">
        <Button 
          variant="ghost" 
          className="text-white hover:bg-white/10"
          onClick={() => navigate('/profile')}
        >
          <Settings className="h-6 w-6" />
        </Button>
      </div>
      
      <div className="pt-16 pb-24 flex flex-col items-center justify-start">
        <h1 className="text-4xl font-unbounded text-white mb-4">
          PanicButton
        </h1>
        
        {/* Show BreathingGuide when exercise has started */}
        {exerciseStarted ? (
          <div className="w-full flex flex-col items-center">
            <BreathingGuide 
              currentStep={currentStep}
              secondsRemaining={secondsRemaining}
              isActive={isActive}
              totalTime={elapsedSeconds}
              maxTime={breathingDuration}
              onComplete={handleStopExercise}
            />
            
            <Button 
              variant="outline" 
              className="mt-8 border-[#00B383] text-white hover:bg-[#00B383]/20"
              onClick={handleStopExercise}
            >
              Terminar ejercicio
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            {/* Category Selection */}
            <div className="mb-8 w-full max-w-xs px-4">
              <h3 className="text-sm text-[#B0B0B0] mb-2">MODO:</h3>
              <ToggleGroup 
                type="single" 
                value={activeCategory} 
                onValueChange={(value) => {
                  if (value) handleCategoryChange(value as 'equilibrio' | 'calma' | 'concentracion');
                }}
                className="justify-start"
              >
                <ToggleGroupItem 
                  value="equilibrio"
                  className={`px-3 rounded-full border border-[#00B383] 
                    ${activeCategory === 'equilibrio' ? 'bg-[#00B383] text-white' : 'bg-transparent text-white'}`}
                >
                  Equilibrio
                </ToggleGroupItem>
                <ToggleGroupItem 
                  value="calma"
                  className={`px-3 rounded-full border border-[#00B383] 
                    ${activeCategory === 'calma' ? 'bg-[#00B383] text-white' : 'bg-transparent text-white'}`}
                >
                  Calma
                </ToggleGroupItem>
                <ToggleGroupItem 
                  value="concentracion"
                  className={`px-3 rounded-full border border-[#00B383] 
                    ${activeCategory === 'concentracion' ? 'bg-[#00B383] text-white' : 'bg-transparent text-white'}`}
                >
                  Concentración
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
            
            <div 
              className={`
                w-52 h-52 md:w-60 md:h-60 rounded-full 
                bg-panic-accent flex items-center justify-center
                mb-6 cursor-pointer transition-transform hover:scale-105
                ${!selectedPatternId ? 'opacity-50 pointer-events-none' : ''}
              `}
              onClick={selectedPatternId ? handleStartExercise : undefined}
            >
              <div className="text-center px-4">
                <p className="text-xl font-unbounded text-white">
                  {selectedPatternId ? 'Presiona para comenzar' : 'Selecciona un ejercicio'}
                </p>
              </div>
            </div>
            
            <h2 className="text-3xl font-unbounded text-white mt-8">
              {formatTime(breathingDuration)}
            </h2>
            
            {/* Pattern Selection */}
            <div className="mt-8 w-full max-w-xs px-4">
              <h3 className="text-sm text-[#B0B0B0] mb-2">EJERCICIO:</h3>
              
              <Select onValueChange={handlePatternChange} value={selectedPatternId || undefined}>
                <SelectTrigger className="bg-transparent border-[#00B383] text-white">
                  <SelectValue placeholder="Seleccionar ejercicio" />
                </SelectTrigger>
                <SelectContent>
                  {filteredPatterns.map((pattern) => (
                    <SelectItem key={pattern.id} value={pattern.id}>
                      {pattern.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {selectedPattern && (
                <p className="text-sm text-[#B0B0B0] mt-2 italic">
                  {selectedPattern.description}
                </p>
              )}
              
              {/* Duration selection */}
              <div className="mt-6">
                <h3 className="text-sm text-[#B0B0B0] mb-2">DURACIÓN:</h3>
                <div className="flex flex-wrap gap-2">
                  <ToggleGroup 
                    type="single" 
                    value={breathingDuration.toString()} 
                    onValueChange={(value) => {
                      if (value) handleDurationChange(value);
                    }}
                    className="justify-start"
                  >
                    {durationOptions.map((option) => (
                      <ToggleGroupItem 
                        key={option.value} 
                        value={option.value.toString()}
                        variant="outline"
                        className={`
                          px-3 rounded-full border border-[#00B383] 
                          ${breathingDuration === option.value ? 'bg-[#00B383] text-white' : 'bg-transparent text-white'}
                        `}
                      >
                        {option.label}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default BreathworkPage;
