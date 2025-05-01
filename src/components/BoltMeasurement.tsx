
import React from 'react';
import { useBoltMeasurement } from '@/hooks/useBoltMeasurement';
import BoltInstructions from './BoltInstructions';
import BreathingTutorial from './BreathingTutorial';
import MeasuringCounter from './bolt/MeasuringCounter';
import MeasurementResults from './bolt/MeasurementResults';
import BoltHistory from './bolt/BoltHistory';

const BoltMeasurement = () => {
  const {
    mode,
    time,
    scores,
    showOptions,
    handleStartMeasurement,
    handleStartTest,
    handleStop,
    handleSave,
    handleRetry,
  } = useBoltMeasurement();

  const renderContent = () => {
    switch (mode) {
      case 'instructions':
        return <BoltInstructions onStartMeasurement={handleStartMeasurement} />;
        
      case 'tutorial':
        return <BreathingTutorial onComplete={handleStartTest} />;
        
      case 'measuring':
        return <MeasuringCounter time={time} onStop={handleStop} />;
        
      case 'results':
        return (
          <MeasurementResults
            time={time}
            showOptions={showOptions}
            onRetry={handleRetry}
            onSave={handleSave}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {renderContent()}
      
      {scores.length > 0 && mode === 'instructions' && (
        <BoltHistory scores={scores} />
      )}
    </div>
  );
};

export default BoltMeasurement;
