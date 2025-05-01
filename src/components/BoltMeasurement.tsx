
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import BoltInstructions from './BoltInstructions';
import BreathingTutorial from './BreathingTutorial';
import WaterCircle from './WaterCircle';

type MeasurementMode = 'instructions' | 'tutorial' | 'measuring' | 'results';

const BoltMeasurement = () => {
  const [mode, setMode] = useState<MeasurementMode>('instructions');
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [scores, setScores] = useState<{ created_at: string; score_seconds: number; }[]>([]);
  const [showOptions, setShowOptions] = useState(false);
  const [fillLevel, setFillLevel] = useState(50);
  const { toast } = useToast();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    fetchScores();
  }, []);

  const fetchScores = async () => {
    const { data, error } = await supabase
      .from('bolt_scores')
      .select('created_at, score_seconds')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron cargar tus mediciones anteriores.",
      });
    } else if (data) {
      setScores(data);
    }
  };

  const handleStartMeasurement = () => {
    setMode('tutorial');
  };
  
  const handleStartTest = () => {
    setTime(0);
    setIsRunning(true);
    setMode('measuring');
    setShowOptions(false);
    
    // Start animation for water fill
    setFillLevel(20);
    const fillInterval = setInterval(() => {
      setFillLevel(prev => {
        if (prev >= 65) {
          clearInterval(fillInterval);
          return 65;
        }
        return prev + 1;
      });
    }, 500);
  };

  const handleStop = () => {
    setIsRunning(false);
    setShowOptions(true);
    setMode('results');
  };

  const handleSave = async () => {
    const { error } = await supabase
      .from('bolt_scores')
      .insert({
        score_seconds: time,
        user_id: (await supabase.auth.getUser()).data.user?.id
      });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo guardar tu medición.",
      });
      console.error("Error saving score:", error);
    } else {
      toast({
        title: "¡Éxito!",
        description: `Tu puntuación BOLT es de ${time} segundos.`,
      });
      fetchScores();
      setShowOptions(false);
      setMode('instructions');
    }
  };

  const handleRetry = () => {
    setMode('tutorial');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };
  
  const renderContent = () => {
    switch (mode) {
      case 'instructions':
        return <BoltInstructions onStartMeasurement={handleStartMeasurement} />;
        
      case 'tutorial':
        return <BreathingTutorial onComplete={handleStartTest} />;
        
      case 'measuring':
        return (
          <div className="w-full max-w-md mx-auto space-y-8 animate-fade-in">
            <div className="text-center">
              <h2 className="text-3xl font-unbounded text-white mb-4">
                Detén al primer deseo de respirar
              </h2>
              <div className="text-5xl font-unbounded text-white mb-6">
                {time} segundos
              </div>
            </div>
            
            <div className="relative mb-8">
              <WaterCircle fillPercentage={fillLevel} />
            </div>
            
            <Button 
              onClick={handleStop}
              className="bg-[#E57373] hover:bg-[#D32F2F] text-white w-full py-6 text-lg rounded-full"
            >
              DETENER
            </Button>
          </div>
        );
        
      case 'results':
        return (
          <div className="w-full max-w-md mx-auto space-y-8 animate-fade-in">
            <div className="text-center">
              <h2 className="text-3xl font-unbounded text-white mb-4">
                Tu puntuación BOLT
              </h2>
              <div className="text-6xl font-unbounded text-white mb-6">
                {time} segundos
              </div>
            </div>
            
            <div className="bg-white/10 p-6 rounded-lg">
              {showOptions && (
                <div className="flex flex-col space-y-4">
                  <div className="text-white text-lg text-center mb-4">
                    ¿Guardar esta medición o intentar de nuevo?
                  </div>
                  <div className="flex flex-col md:flex-row gap-4">
                    <Button 
                      onClick={handleRetry}
                      variant="outline" 
                      className="flex-1 border-[#B0B0B0] text-[#B0B0B0] hover:bg-white/5"
                    >
                      Repetir
                    </Button>
                    <Button 
                      onClick={handleSave}
                      className="flex-1 bg-[#00B383] hover:bg-[#00956D] text-white"
                    >
                      Guardar
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {renderContent()}
      
      {scores.length > 0 && mode === 'instructions' && (
        <div className="mt-12 animate-fade-in">
          <h3 className="text-xl font-unbounded text-white mb-4">Historial</h3>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={scores.slice().reverse()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                <XAxis 
                  dataKey="created_at" 
                  tickFormatter={formatDate}
                  stroke="#B0B0B0"
                />
                <YAxis stroke="#B0B0B0" />
                <Tooltip 
                  labelFormatter={formatDate}
                  contentStyle={{ backgroundColor: '#132737', border: 'none' }}
                  labelStyle={{ color: '#B0B0B0' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="score_seconds" 
                  stroke="#00B383" 
                  name="Segundos"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default BoltMeasurement;
