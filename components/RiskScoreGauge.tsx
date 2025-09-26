import React from 'react';

interface RiskScoreGaugeProps {
  score: number;
}

const RiskScoreGauge: React.FC<RiskScoreGaugeProps> = ({ score }) => {
  const circumference = 2 * Math.PI * 52;
  const offset = circumference - (score / 100) * circumference;

  let colorClass = 'text-green-400';
  if (score > 40) colorClass = 'text-yellow-400';
  if (score > 75) colorClass = 'text-red-500';

  return (
    <div className="relative flex items-center justify-center w-40 h-40">
      <svg className="w-full h-full" viewBox="0 0 120 120">
        <circle
          className="text-gray-700"
          strokeWidth="8"
          stroke="currentColor"
          fill="transparent"
          r="52"
          cx="60"
          cy="60"
        />
        <circle
          className={`${colorClass} transition-all duration-1000 ease-out`}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r="52"
          cx="60"
          cy="60"
          transform="rotate(-90 60 60)"
        />
      </svg>
      <div className={`absolute flex flex-col items-center justify-center ${colorClass}`}>
        <span className="text-4xl font-bold">{score}</span>
        <span className="text-sm font-medium -mt-1">/ 100</span>
      </div>
    </div>
  );
};

export default RiskScoreGauge;
