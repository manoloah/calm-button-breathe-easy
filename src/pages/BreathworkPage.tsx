
import React, { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import BreathingGuide from '../components/BreathingGuide';
import BottomNavigation from '../components/BottomNavigation';
import { useBreathPatterns, useBreathingSession } from '@/hooks/useBreathPatterns';
import { BreathingPattern, ExpandedPattern } from '@/lib/dbTypes';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

const BreathworkPage = () => {
  const navigate = useNavigate();
  const [breathingDuration, setBreathingDuration] = useState(180); // Default 3 minutes (180 seconds)
  const [selectedPatternId, setSelectedPatternId] = useState<string | null>(null);
  const { data: breathingPatterns, isLoading, error } = useBreathPatterns();
  const [exerciseStarted, setExerciseStarted] = useState(false);
  
  // Find the selected pattern
  const selectedPattern = selectedPatternId 
    ? breathingPatterns.find(p => p.id === selectedPatternId) as ExpandedPattern
    : null;
  
  // Initialize breathing session hook
  const { 
    isActive, 
    currentStep, 
    secondsRemaining, 
    totalSeconds, 
    elapsedSeconds,
    startSession, 
    stopSession 
  } = useBreathingSession(selectedPattern);
  
  // Set the first pattern as default when data is loaded
  useEffect(() => {
    if (breathingPatterns.length > 0 && !selectedPatternId) {
      setSelectedPatternId(breathingPatterns[0].id);
      console.log("Setting default pattern:", breathingPatterns[0].name);
    }
  }, [breathingPatterns, selectedPatternId]);

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
    const pattern = breathingPatterns.find(p => p.id === value);
    console.log("Selected pattern:", pattern?.name);
  };
  
  const handleStartExercise = () => {
    if (!selectedPattern) {
      console.error("No breathing pattern selected!");
      return;
    }
    
    console.log("Starting exercise with pattern:", selectedPattern.name);
    console.log("Pattern steps:", selectedPattern.steps);
    
    setExerciseStarted(true);
    startSession(0); // Start from the first step
  };
  
  const handleStopExercise = () => {
    setExerciseStarted(false);
    stopSession();
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
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
              breathingDuration={breathingDuration}
              currentStep={currentStep}
              secondsRemaining={secondsRemaining}
              isActive={isActive}
              totalTime={elapsedSeconds}
              maxTime={totalSeconds > 0 ? totalSeconds : breathingDuration}
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
            <div 
              className={`
                w-52 h-52 md:w-60 md:h-60 rounded-full 
                bg-panic-accent flex items-center justify-center
                mb-6 cursor-pointer transition-transform hover:scale-105
              `}
              onClick={handleStartExercise}
            >
              <div className="text-center px-4">
                <p className="text-xl font-unbounded text-white">Presiona para comenzar</p>
              </div>
            </div>
            
            <h2 className="text-3xl font-unbounded text-white mt-8">
              {formatTime(breathingDuration)}
            </h2>
            
            {/* Exercise type selection */}
            <div className="mt-8 w-full max-w-xs px-4">
              <h3 className="text-sm text-[#B0B0B0] mb-2">OBJETIVOS:</h3>
              
              <Select onValueChange={handlePatternChange} value={selectedPatternId || undefined}>
                <SelectTrigger className="bg-transparent border-[#00B383] text-white">
                  <SelectValue placeholder="Seleccionar ejercicio" />
                </SelectTrigger>
                <SelectContent>
                  {isLoading ? (
                    <SelectItem value="loading">Cargando...</SelectItem>
                  ) : error ? (
                    <SelectItem value="error">Error al cargar ejercicios</SelectItem>
                  ) : (
                    breathingPatterns.map((pattern) => (
                      <SelectItem key={pattern.id} value={pattern.id}>
                        {pattern.name}
                      </SelectItem>
                    ))
                  )}
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
