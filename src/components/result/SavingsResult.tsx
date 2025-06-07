import { useState } from 'react';
import { Bar } from 'react-chartjs-2';

import {
   Chart as ChartJS,
   CategoryScale,
   LinearScale,
   BarElement,
   Title,
   Tooltip,
   Legend,
   plugins,
} from 'chart.js';

ChartJS.register(
   CategoryScale,
   LinearScale,
   BarElement,
   Title,
   Tooltip,
   Legend
);

export interface SavingsData {
   totalPaidIn1Year: number;
   savedIn1Year: number;
   totalPaidIn3Years: number;
   savedIn3Years: number;
   totalPaidIn5Years: number;
   savedIn5Years: number;
}

interface SavingsResultProps {
   result: SavingsData;
}

const formatCurrency = (value: number) => {
   return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
   }).format(value);
};

export default function SavingsResult({ result }: SavingsResultProps) {
   const [selectedPeriod, setSelectedPeriod] = useState<1 | 3 | 5>(1);
   const multipleYears = selectedPeriod === 1 ? "" : "s";

   const chartData = {
      labels: ['Custo Original', 'Com a Clean Energy'],
      datasets: [
         {
            label: `Economia em ${selectedPeriod} ano${multipleYears}`,
            data: [
               result[`totalPaidIn${selectedPeriod}Year${multipleYears}`],
               result[`totalPaidIn${selectedPeriod}Year${multipleYears}`] - result[`savedIn${selectedPeriod}Year${multipleYears}`],
            ],
            backgroundColor: [
               'rgba(188, 0, 45, 0.9)',
               'rgba(0, 188, 125, 0.9)',
            ],
            borderColor: [
               'rgba(188, 0, 45, 1)',
               'rgba(0, 188, 125, 1)',
            ],
            borderWidth: 1,
         },
      ],
   };

   const charOptions = {
      responsive: true,
      plugins: {
         legend: {
            display: false,
         },
         title: {
            display: true,
            text: `Comparação de gastos em ${selectedPeriod} ano${multipleYears}`,
         },
      },
   };

   const textData = {
      total: result[`totalPaidIn${selectedPeriod}Year${multipleYears}`],
      saved: result[`savedIn${selectedPeriod}Year${multipleYears}`],
   };

   return (
      <div className="space-y-6 p-8 bg-white shadow-md rounded-lg">
         <h2 className="text-2xl font-bold text-emerald-600 text-center"></h2>

         <div className="text-center">
            <p className="text-xl font-bold text-gray-800">Você pagaria um total de <strong className="text-red-600">{formatCurrency(textData.total)}</strong></p>
            <p className="text-xl font-bold text-gray-800">Com a Clean Energy, você paga: <strong className="text-emerald-500">{formatCurrency(textData.total - textData.saved)}</strong></p>
            <p className="mt-4 text-3xl font-extrabold text-emerald-500"> Sua economia em {selectedPeriod} ano{multipleYears} é de {formatCurrency(textData.saved)}</p>
         </div>

         <div>
            <Bar options={charOptions} data={chartData}/>
         </div>

         <div className="flex justify-center space-x-2">
            <button onClick={() => setSelectedPeriod(1)} className={`px-4 py-2 text-sm font-medium rounded-md ${selectedPeriod === 1 ? 'bg-emerald-500 text-white' : 'bg-gray-200'}`}>1 Ano</button>
            <button onClick={() => setSelectedPeriod(3)} className={`px-4 py-2 text-sm font-medium rounded-md ${selectedPeriod === 3 ? 'bg-emerald-500 text-white' : 'bg-gray-200'}`}>3 anos</button>
            <button onClick={() => setSelectedPeriod(5)} className={`px-4 py-2 text-sm font-medium rounded-md ${selectedPeriod === 5 ? 'bg-emerald-500 text-white' : 'bg-gray-200'}`}>5 anos</button>
         </div>
      </div>
   )
}