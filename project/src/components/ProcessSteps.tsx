import React from 'react';
import { ListOrdered } from 'lucide-react';

interface ProcessStepsProps {
  steps: string[];
}

const ProcessSteps: React.FC<ProcessStepsProps> = ({ steps }) => {
  if (steps.length === 0) return null;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 mb-6 hover-scale">
      <div className="flex items-center mb-4">
        <div className="w-8 h-8 bg-blue-600 dark:bg-blue-700 text-white rounded-full flex items-center justify-center mr-2">
          <ListOrdered className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-semibold dark:text-white">Process Steps:</h2>
      </div>
      
      <div className="space-y-3">
        {steps.map((step, index) => (
          <div 
            key={index}
            className="p-3 bg-gray-50 dark:bg-slate-700 rounded-lg border border-gray-200 dark:border-gray-600 dark:text-white transform transition-all hover:shadow-md"
            style={{animationDelay: `${index * 100}ms`, animation: 'fadeIn 0.5s ease forwards'}}
          >
            <p>
              <span className="font-medium">{index + 1}.</span> {step}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProcessSteps;