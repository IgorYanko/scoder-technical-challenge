import { useState } from 'react';
import SimulationForm from '../components/simulation/SimulationForm';
import SavingsResult, { SavingsData } from '../components/result/SavingsResult';

export default function HomePage() {
  const [simulationResult, setSimulationResult] = useState<SavingsData | null>(null);

  const handleSuccess = (data: SavingsData) => {
    setSimulationResult(data);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-2xl">
        {simulationResult ? (
          <SavingsResult result={simulationResult} />
        ) : (
          <SimulationForm onSuccess={handleSuccess} />
        )}
      </div>
    </div>
  );
}