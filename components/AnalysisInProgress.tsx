import React, { useState, useEffect } from 'react';

const analysisSteps = [
  "Initializing scan...",
  "Parsing content...",
  "Analyzing semantics with NLP models...",
  "Checking domain reputation...",
  "Querying threat intelligence databases...",
  "Scanning for structural anomalies...",
  "Compiling report...",
];

interface AnalysisInProgressProps {
  title?: string;
}

const AnalysisInProgress: React.FC<AnalysisInProgressProps> = ({ title = "Analysis in Progress" }) => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prevStep) => (prevStep + 1) % analysisSteps.length);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-gray-800/50 rounded-lg p-6 border border-gray-700/60 shadow-lg text-center">
        <div className="flex justify-center items-center mb-4">
            <svg className="animate-spin h-8 w-8 text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        </div>
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <p className="text-gray-400 mt-2 font-mono text-sm transition-opacity duration-500">
        {analysisSteps[currentStep]}
      </p>
    </div>
  );
};

export default AnalysisInProgress;