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
    const initialScan = async () => {
      setIsLoading(true);
      setError(null);
      setAnalysisReport(null);
      try {
        // Simulate analyzing the current tab by using a known safe URL
        const report = await analyzeContent(AnalysisType.URL, 'https://www.google.com');
        setAnalysisReport(report);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred during the initial scan.');
        }
      } finally {
        setIsLoading(false);
        setShowInput(true); // Show the input form after the initial scan is complete
      }
    };

    initialScan();
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
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-8 sm:py-12">
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
              isLoading={isLoading}
            />
          )}

          {isLoading && (
            <AnalysisInProgress
              title={!showInput ? "Automatically Analyzing Current Tab..." : "Analysis in Progress"}
            />
          )}

          {error && (
            <div className="w-full max-w-3xl mx-auto bg-red-900/50 border border-red-700/60 rounded-lg p-4 text-center text-red-300">
              <p className="font-semibold">Analysis Failed</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {analysisReport && !isLoading && <ResultsDisplay report={analysisReport} />}
        </div>
      </main>
        <footer className="text-center py-6 text-gray-500 text-sm">
            <p>Powered by Gemini. Ctrl Alt Defeat ! is for informational purposes only.</p>
        </footer>
    </div>
  );
};

export default App;