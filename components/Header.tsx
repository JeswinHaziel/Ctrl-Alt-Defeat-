import React from 'react';
import { ActivityIcon } from './icons';

const Header: React.FC = () => {
  return (
    <header className="py-6 border-b border-gray-700/50">
      <div className="container mx-auto px-4 flex items-center justify-center space-x-3">
        <ActivityIcon className="h-8 w-8 text-green-400" />
        <h1 className="text-3xl font-bold text-gray-50 tracking-tight">
          Ctrl Alt <span className="text-green-400">Defeat !</span>
        </h1>
      </div>
       <p className="text-center text-gray-400 mt-2">Real-Time Phishing & Threat Defeat Framework</p>
    </header>
  );
};

export default Header;