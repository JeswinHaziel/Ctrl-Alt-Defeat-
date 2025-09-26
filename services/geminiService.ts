import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisReport, AnalysisType } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analysisSchema = {
    type: Type.OBJECT,
    properties: {
        riskScore: { type: Type.INTEGER, description: "A score from 0 to 100 representing the phishing risk. 0 is safe, 100 is malicious." },
        verdict: { type: Type.STRING, enum: ["Safe", "Suspicious", "Malicious"], description: "A single-word verdict." },
        summary: { type: Type.STRING, description: "A concise, one-sentence summary of the findings." },
        textualAnalysis: {
            type: Type.OBJECT,
            properties: {
                sentiment: { type: Type.STRING, description: "Overall sentiment (e.g., 'Urgent', 'Fear-inducing', 'Professional')." },
                urgencyDetected: { type: Type.BOOLEAN, description: "Whether urgent or time-sensitive language was detected." },
                suspiciousPhrases: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of specific phrases that are red flags." },
                grammarIssues: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of grammatical errors or awkward phrasings found." },
            },
            required: ["sentiment", "urgencyDetected", "suspiciousPhrases", "grammarIssues"]
        },
        urlAnalysis: {
            type: Type.OBJECT,
            properties: {
                domainAge: { type: Type.STRING, description: "Simulated age of the domain (e.g., 'Newly Registered', '3 years old')." },
                sslCertificate: { type: Type.STRING, description: "Simulated status of the SSL certificate (e.g., 'Valid and Trusted', 'Invalid', 'Missing')." },
                redFlags: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of URL-specific red flags (e.g., 'Contains homoglyph characters', 'Uses a non-standard TLD')." },
            },
            required: ["domainAge", "sslCertificate", "redFlags"]
        },
    },
    required: ["riskScore", "verdict", "summary", "textualAnalysis", "urlAnalysis"]
};

export const analyzeContent = async (
    type: AnalysisType,
    content: string
): Promise<AnalysisReport> => {
    const systemInstruction = `
        You are TrapShield, an advanced AI-powered phishing detection framework. Your task is to analyze the provided content and return a detailed security analysis in the specified JSON format. 
        Your analysis should be comprehensive, covering textual, structural, and reputational aspects.
        - If the type is URL, analyze the URL structure and infer potential textual content that might be on the page. 
        - If the type is TEXT, analyze the language, links, and overall message. 
        - Fabricate realistic but simulated details for domain age and SSL certificates as if you were looking them up. 
        - Return your findings strictly in the provided JSON schema. Do not add any markdown formatting.
    `;
    
    const userPrompt = `
        Analysis type: ${type}
        Content to analyze:
        ---
        ${content}
        ---
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: userPrompt,
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
                responseSchema: analysisSchema,
            },
        });
        
        const jsonText = response.text.trim();
        const report = JSON.parse(jsonText) as AnalysisReport;
        
        if (Array.isArray(report)) {
            return report[0];
        }

        return report;
    } catch (error) {
        console.error("Error analyzing content with Gemini:", error);
        throw new Error("Failed to get analysis from AI. Please check the console for details.");
    }
};