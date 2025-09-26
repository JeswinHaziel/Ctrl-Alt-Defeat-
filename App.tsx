// Fix for "Cannot find name 'chrome'" error. This declares the chrome global for TypeScript.
declare const chrome: any;

import React, { useState, useCallback, useEffect } from 'react';
import { AnalysisReport, AnalysisType } from './types';
import { analyzeContent } from './services/geminiService';
import Header from './components/Header';
import InputForm from './components/InputForm';
import AnalysisInProgress from './components/AnalysisInProgress';
import ResultsDisplay from './components/ResultsDisplay';

const App: React.FC = () => {
  const [analysisType, setAnalysisType] = useState<AnalysisType>(AnalysisType.URL);
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true); // Start loading immediately for initial scan
  const [analysisReport, setAnalysisReport] = useState<AnalysisReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showInput, setShowInput] = useState<boolean>(false); // Control when to show the manual input form

  // Effect for initial automatic scan on mount
  useEffect(() => {
    // Check if running as a Chrome extension
    if (typeof chrome === 'undefined' || !chrome.tabs) {
      setError("This doesn't seem to be running in a Chrome extension. Please use manual analysis.");
      setIsLoading(false);
      setShowInput(true);
      return;
    }

    const initialScan = async (url: string) => {
      setIsLoading(true);
      setError(null);
      setAnalysisReport(null);
      try {
        const report = await analyzeContent(AnalysisType.URL, url);
        setAnalysisReport(report);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred during the initial scan.');
        }
      } finally {
        setIsLoading(false);
        setShowInput(true);
      }
    };

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      // Check for a valid, analyzable URL (http or https)
      if (currentTab && currentTab.url && (currentTab.url.startsWith('http://') || currentTab.url.startsWith('https://'))) {
        initialScan(currentTab.url);
      } else {
        // No analyzable URL (e.g., newtab, settings), just show the input form.
        setIsLoading(false);
        setShowInput(true);
      }
    });
  }, []); // Empty array ensures this runs only once on mount

  const handleManualAnalyze = useCallback(async () => {
    if (!inputValue.trim()) return;

    setIsLoading(true);
    setAnalysisReport(null);
    setError(null);

    try {
      const report = await analyzeContent(analysisType, inputValue);
      setAnalysisReport(report);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [analysisType, inputValue]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 w-[500px]">
      <Header />
      <main className="px-6 py-8">
        <div className="space-y-8">
          {showInput && (
            <InputForm
              analysisType={analysisType}
              setAnalysisType={(type) => {
                setAnalysisType(type);
                setInputValue(''); // Clear input when switching types
                setError(null);
              }}
              inputValue={inputValue}
              setInputValue={setInputValue}
              handleAnalyze={handleManualAnalyze}
              isLoading={isLoading && showInput} // Pass loading state only for manual analysis
            />
          )}

          {isLoading && !analysisReport && (
            <AnalysisInProgress
              title={!showInput ? "Analyzing Current Tab..." : "Analysis in Progress"}
            />
          )}

          {error && (
            <div className="w-full bg-red-900/50 border border-red-700/60 rounded-lg p-4 text-center text-red-300">
              <p className="font-semibold">Analysis Failed</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {analysisReport && !isLoading && <ResultsDisplay report={analysisReport} />}
        </div>
      </main>
        <footer className="text-center py-6 text-gray-500 text-sm">
            <p>Powered by Gemini. TrapShield is for informational purposes only.</p>
        </footer>
    </div>
  );
};

export default App;