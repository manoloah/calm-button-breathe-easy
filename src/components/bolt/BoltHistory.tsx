
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import type { BoltScore } from '@/hooks/useBoltMeasurement';

interface BoltHistoryProps {
  scores: BoltScore[];
}

const BoltHistory: React.FC<BoltHistoryProps> = ({ scores }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  if (scores.length === 0) {
    return null;
  }

  return (
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
  );
};

export default BoltHistory;
