import { useState } from 'react';
import SimulationForm from '../components/simulation/SimulationForm';
import SavingsResult, { SavingsData } from '../components/result/SavingsResult';

const seed: SavingsData = {
  totalPaidIn1Year: 1200,
  savedIn1Year:300,
  totalPaidIn3Years:3600,
  savedIn3Years:900,
  totalPaidIn5Years:6000,
  savedIn5Years:1500,
};

export default function HomePage() {
  const [simulationResult, setSimulationResult] = useState<SavingsData | null>(null);

  const handleSuccess = (data: SavingsData) => {
    setSimulationResult(data);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-2xl">
        {simulationResult ? (
          <SavingsResult result={simulationResult} />
        ) : (
          <SimulationForm onSuccess={handleSuccess} />
        )}
        {/* <SavingsResult result={seed}/> */}
      </div>
    </main>
  );
}