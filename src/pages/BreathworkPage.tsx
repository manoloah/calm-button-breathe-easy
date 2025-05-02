
import React, { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import BreathingGuide from '../components/BreathingGuide';
import BottomNavigation from '../components/BottomNavigation';
import { useBreathPatterns } from '@/hooks/useBreathPatterns';
import { BreathingPattern } from '@/lib/dbTypes';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

const BreathworkPage = () => {
  const navigate = useNavigate();
  const [breathingDuration, setBreathingDuration] = useState(180); // Default 3 minutes (180 seconds)
  const [selectedPatternId, setSelectedPatternId] = useState<string | null>(null);
  const { data: breathingPatterns, isLoading, error } = useBreathPatterns();
  
  // Set the first pattern as default when data is loaded
  useEffect(() => {
    if (breathingPatterns.length > 0 && !selectedPatternId) {
      setSelectedPatternId(breathingPatterns[0].id);
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
  };
  
  const selectedPattern = selectedPatternId 
    ? breathingPatterns.find(p => p.id === selectedPatternId) as BreathingPattern
    : null;

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
        
        {/* Only show BreathingGuide when no pattern is selected or loading */}
        {(!selectedPattern || isLoading) ? (
          <BreathingGuide breathingDuration={breathingDuration} />
        ) : (
          <div className="flex flex-col items-center justify-center">
            <div 
              className={`
                w-52 h-52 md:w-60 md:h-60 rounded-full 
                bg-panic-accent flex items-center justify-center
                mb-6
              `}
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
