import React from 'react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps }) => {
    return (
      <div className="flex justify-center space-x-2 mb-4">
        {[...Array(totalSteps)].map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full ${
              index < currentStep ? 'bg-blue-500' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };
export default StepIndicator;
