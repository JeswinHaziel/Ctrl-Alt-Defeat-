import React from 'react';
import { AnalysisType } from '../types';
import { LinkIcon, FileTextIcon, ZapIcon } from './icons';

interface InputFormProps {
  analysisType: AnalysisType;
  setAnalysisType: (type: AnalysisType) => void;
  inputValue: string;
  setInputValue: (value: string) => void;
  handleAnalyze: () => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({
  analysisType,
  setAnalysisType,
  inputValue,
  setInputValue,
  handleAnalyze,
  isLoading,
}) => {
  const isUrl = analysisType === AnalysisType.URL;

  return (
    <div className="w-full max-w-3xl mx-auto bg-gray-800/50 rounded-lg p-6 border border-gray-700/60 shadow-lg">
      <div className="flex border-b border-gray-700 mb-4">
        <button
          onClick={() => setAnalysisType(AnalysisType.URL)}
          className={`flex-1 py-3 px-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors duration-200 ${
            isUrl
              ? 'text-green-400 border-b-2 border-green-400'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <LinkIcon className="h-5 w-5" />
          Analyze URL
        </button>
        <button
          onClick={() => setAnalysisType(AnalysisType.TEXT)}
          className={`flex-1 py-3 px-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors duration-200 ${
            !isUrl
              ? 'text-green-400 border-b-2 border-green-400'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <FileTextIcon className="h-5 w-5" />
          Analyze Text
        </button>
      </div>
      <div>
        {isUrl ? (
          <input
            type="url"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="https://example.com"
            className="w-full bg-gray-900/70 border border-gray-600 rounded-md p-3 text-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-200 font-mono"
            disabled={isLoading}
          />
        ) : (
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Paste email body or suspicious text here..."
            className="w-full bg-gray-900/70 border border-gray-600 rounded-md p-3 text-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-200 h-36 resize-none font-mono"
            disabled={isLoading}
          />
        )}
      </div>
      <div className="mt-5 text-center">
        <button
          onClick={handleAnalyze}
          disabled={isLoading || !inputValue.trim()}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 bg-green-500 text-gray-900 font-bold rounded-md hover:bg-green-400 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:text-gray-400 transition-all duration-200 shadow-lg hover:shadow-green-500/30 transform hover:-translate-y-0.5"
        >
          {isLoading ? (
             <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
             </>
          ) : (
            <>
              <ZapIcon className="h-5 w-5" />
              Scan Now
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default InputForm;