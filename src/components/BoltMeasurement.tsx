
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

const BoltMeasurement = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [scores, setScores] = useState<{ created_at: string; score_seconds: number; }[]>([]);
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

  const handleStart = () => {
    setTime(0);
    setIsRunning(true);
    setShowOptions(false);
  };

  const handleStop = () => {
    setIsRunning(false);
    setShowOptions(true);
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
    }
  };

  const handleRetry = () => {
    handleStart();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-unbounded text-white mb-4">
          Mide tu nivel de pánico
        </h2>
        <p className="text-[#B0B0B0] mb-8">
          Exhala normalmente y mantén la respiración hasta que sientas la primera necesidad de respirar.
        </p>
      </div>

      <div className="bg-white/10 p-6 rounded-lg text-center">
        <div className="text-4xl font-unbounded text-white mb-4">
          {time}s
        </div>
        
        {!isRunning && !showOptions ? (
          <Button 
            onClick={handleStart}
            className="bg-[#00B383] hover:bg-[#00956D] text-white w-full"
          >
            Comenzar
          </Button>
        ) : isRunning ? (
          <Button 
            onClick={handleStop}
            variant="destructive"
            className="w-full"
          >
            Detener
          </Button>
        ) : showOptions && (
          <div className="flex flex-col space-y-4">
            <div className="text-white text-lg">
              ¿Guardar esta medición o intentar de nuevo?
            </div>
            <div className="flex space-x-4">
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

      {scores.length > 0 && (
        <div className="mt-8">
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
