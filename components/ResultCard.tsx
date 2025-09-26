import React from 'react';

interface ResultCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const ResultCard: React.FC<ResultCardProps> = ({ title, icon, children }) => {
  return (
    <div className="bg-gray-800/40 border border-gray-700/60 rounded-lg p-5">
      <div className="flex items-center mb-3">
        {icon}
        <h4 className="text-lg font-semibold text-gray-200 ml-2">{title}</h4>
      </div>
      <div className="text-gray-300 text-sm space-y-2">{children}</div>
    </div>
  );
};

export default ResultCard;
