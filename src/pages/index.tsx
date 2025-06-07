import { useState } from 'react';
import SimulationForm from '../components/simulation/SimulationForm';
import SavingsResult, { SavingsData } from '../components/result/SavingsResult';
import LoginPage from './admin/login';

export default function HomePage() {
  const [simulationResult, setSimulationResult] = useState<SavingsData | null>(null);

  const handleSuccess = (data: SavingsData) => {
    setSimulationResult(data);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-2xl">
        {/* {simulationResult ? (
          <SavingsResult result={simulationResult} />
        ) : (
          <SimulationForm onSuccess={handleSuccess} />
        )} */}
        <LoginPage></LoginPage>
      </div>
    </main>
  );
}