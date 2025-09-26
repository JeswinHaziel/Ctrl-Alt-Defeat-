import React from 'react';
import { ShieldCheckIcon } from './icons';

const Header: React.FC = () => {
  return (
    <header className="py-6 border-b border-gray-700/50">
      <div className="container mx-auto px-4 flex items-center justify-center space-x-3">
        <ShieldCheckIcon className="h-8 w-8 text-green-400" />
        <h1 className="text-3xl font-bold text-gray-50 tracking-tight">
          Trap<span className="text-green-400">Shield</span>
        </h1>
      </div>
       <p className="text-center text-gray-400 mt-2">Real-Time Link Security Analysis</p>
    </header>
  );
};

export default Header;