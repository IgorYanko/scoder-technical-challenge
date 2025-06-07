import SimulationForm from '../components/simulation/SimulationForm';

export default function HomePage() {
   return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
         <div className="w-full max-w-2xl">
            <SimulationForm />
         </div>
      </main>
   )
}