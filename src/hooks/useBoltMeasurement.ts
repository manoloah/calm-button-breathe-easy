
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export type MeasurementMode = 'instructions' | 'tutorial' | 'measuring' | 'results';

export interface BoltScore {
  created_at: string;
  score_seconds: number;
}

export const useBoltMeasurement = () => {
  const [mode, setMode] = useState<MeasurementMode>('instructions');
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [scores, setScores] = useState<BoltScore[]>([]);
  const [showOptions, setShowOptions] = useState(false);
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

  return {
    mode,
    isRunning,
    time,
    scores,
    showOptions,
    handleStartMeasurement,
    handleStartTest,
    handleStop,
    handleSave,
    handleRetry,
  };
};
