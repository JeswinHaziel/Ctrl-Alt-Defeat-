import React from 'react';
import { AnalysisReport } from '../types';
import { ShieldCheckIcon, ShieldAlertIcon, ShieldXIcon, FileTextIcon, LinkIcon } from './icons';
import RiskScoreGauge from './RiskScoreGauge';
import ResultCard from './ResultCard';

interface ResultsDisplayProps {
  report: AnalysisReport;
}

const ListItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <li className="flex items-start">
        <span className="text-green-400 mr-2 mt-1">&#8227;</span>
        <span>{children}</span>
    </li>
);

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ report }) => {
  const { verdict, riskScore, summary, textualAnalysis, urlAnalysis } = report;

  const verdictConfig = {
    Safe: {
      icon: <ShieldCheckIcon className="h-10 w-10 text-green-400" />,
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30',
      textColor: 'text-green-400',
      title: 'Content is Safe',
    },
    Suspicious: {
      icon: <ShieldAlertIcon className="h-10 w-10 text-yellow-400" />,
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/30',
      textColor: 'text-yellow-400',
      title: 'Content is Suspicious',
    },
    Malicious: {
      icon: <ShieldXIcon className="h-10 w-10 text-red-500" />,
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/30',
      textColor: 'text-red-500',
      title: 'Content is Malicious',
    },
  };

  const currentVerdict = verdictConfig[verdict];

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Verdict Header */}
      <div className={`rounded-lg p-6 border ${currentVerdict.bgColor} ${currentVerdict.borderColor}`}>
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          {currentVerdict.icon}
          <div className="text-center sm:text-left">
            <h2 className={`text-2xl font-bold ${currentVerdict.textColor}`}>{currentVerdict.title}</h2>
            <p className="text-gray-300 mt-1">{summary}</p>
          </div>
        </div>
      </div>

      {/* Main Report */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 flex flex-col items-center justify-center bg-gray-800/40 border border-gray-700/60 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-200">Overall Risk Score</h3>
          <RiskScoreGauge score={riskScore} />
        </div>
        <div className="md:col-span-2 space-y-6">
          <ResultCard title="Textual Analysis" icon={<FileTextIcon className="h-5 w-5 text-green-400" />}>
            <p><strong>Sentiment:</strong> <span className="font-mono text-gray-400">{textualAnalysis.sentiment}</span></p>
            <p><strong>Urgency Detected:</strong> <span className={`font-mono ${textualAnalysis.urgencyDetected ? 'text-yellow-400' : 'text-green-400'}`}>{textualAnalysis.urgencyDetected ? 'Yes' : 'No'}</span></p>
            {textualAnalysis.suspiciousPhrases.length > 0 && (
                <div>
                    <strong>Suspicious Phrases:</strong>
                    <ul className="list-none pl-0 mt-1 space-y-1">
                        {textualAnalysis.suspiciousPhrases.map((phrase, i) => <ListItem key={i}>{phrase}</ListItem>)}
                    </ul>
                </div>
            )}
            {textualAnalysis.grammarIssues.length > 0 && (
                 <div>
                    <strong>Grammar/Style Issues:</strong>
                    <ul className="list-none pl-0 mt-1 space-y-1">
                        {textualAnalysis.grammarIssues.map((issue, i) => <ListItem key={i}>{issue}</ListItem>)}
                    </ul>
                </div>
            )}
          </ResultCard>

           <ResultCard title="URL & Domain Analysis" icon={<LinkIcon className="h-5 w-5 text-green-400" />}>
            <p><strong>Simulated Domain Age:</strong> <span className="font-mono text-gray-400">{urlAnalysis.domainAge}</span></p>
            <p><strong>Simulated SSL Certificate:</strong> <span className="font-mono text-gray-400">{urlAnalysis.sslCertificate}</span></p>
            {urlAnalysis.redFlags.length > 0 && (
                 <div>
                    <strong>Red Flags:</strong>
                    <ul className="list-none pl-0 mt-1 space-y-1">
                        {urlAnalysis.redFlags.map((flag, i) => <ListItem key={i}>{flag}</ListItem>)}
                    </ul>
                </div>
            )}
          </ResultCard>
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;