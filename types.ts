export enum AnalysisType {
  URL = 'URL',
  TEXT = 'TEXT',
}

export interface TextualAnalysis {
  sentiment: string;
  urgencyDetected: boolean;
  suspiciousPhrases: string[];
  grammarIssues: string[];
}

export interface UrlAnalysis {
  domainAge: string;
  sslCertificate: string;
  redFlags: string[];
}

export interface AnalysisReport {
  riskScore: number;
  verdict: 'Safe' | 'Suspicious' | 'Malicious';
  summary: string;
  textualAnalysis: TextualAnalysis;
  urlAnalysis: UrlAnalysis;
}
