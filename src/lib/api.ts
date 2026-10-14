import { AppIdea, CompetitorAnalysisResult, GeneratorInputs } from '../types';

export async function generateIdeasApi(inputs: GeneratorInputs): Promise<AppIdea[]> {
  const res = await fetch('/api/generate-ideas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(inputs),
  });

  const data = await res.json();
  if (!data.success) {
    throw new Error(data.error || 'Errore nella generazione delle idee.');
  }
  return data.ideas;
}

export async function analyzeCompetitorsApi(category: string, query: string): Promise<CompetitorAnalysisResult> {
  const res = await fetch('/api/competitor-analysis', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ category, query }),
  });

  const data = await res.json();
  if (!data.success) {
    throw new Error(data.error || 'Errore durante l analisi competitor.');
  }
  return data.analysis;
}

export async function sendAiChatMessage(messages: { role: 'user' | 'model'; content: string }[]): Promise<string> {
  const res = await fetch('/api/ai-chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  });

  const data = await res.json();
  if (!data.success) {
    throw new Error(data.error || 'Errore di comunicazione con l assistente AI.');
  }
  return data.reply;
}
