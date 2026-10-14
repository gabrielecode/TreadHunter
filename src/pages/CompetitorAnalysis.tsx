import React, { useState } from 'react';
import { analyzeCompetitorsApi } from '../lib/api';
import { CompetitorAnalysisResult, AppCategory } from '../types';
import { Search, ShieldAlert, TrendingUp, CheckCircle, XCircle, Lightbulb, Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

const CATEGORIES: AppCategory[] = ['AI', 'Fintech', 'Health', 'Produttività', 'Gaming', 'E-commerce', 'Education', 'Social'];

export const CompetitorAnalysis: React.FC = () => {
  const [category, setCategory] = useState<AppCategory>('AI');
  const [query, setQuery] = useState<string>('Assistente vocale per riunioni aziendali');
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<CompetitorAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const data = await analyzeCompetitorsApi(category, query);
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Errore durante l analisi dei competitor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Analisi Competitor & Market Gaps</h2>
        <p className="text-sm text-slate-400 mt-1">
          Analizza la concorrenza esistente, i punti di forza e individua i gap di mercato non ancora coperti.
        </p>
      </div>

      {/* Search Input Form */}
      <form onSubmit={handleAnalyze} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Categoria Mercato</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as AppCategory)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Nome App o Idea da Analizzare</label>
            <div className="flex gap-3">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Es. App per budgeting familiare con AI o Fitness tracker per senior"
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-semibold text-sm rounded-xl hover:from-cyan-400 hover:to-indigo-500 shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2 disabled:opacity-50 shrink-0 cursor-pointer"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                <span>Analizza</span>
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-950/50 border border-red-800 text-red-200 text-xs">
            {error}
          </div>
        )}
      </form>

      {/* Analysis Results */}
      {result && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          {/* Market Overview & Strategic Advice */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-7 space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">Panoramica di Mercato</span>
              <h3 className="text-lg font-bold text-white">{query}</h3>
              <p className="text-sm text-slate-300 leading-relaxed">{result.marketOverview}</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-7 space-y-3 bg-gradient-to-br from-slate-900 via-cyan-950/30 to-slate-900">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase">
                <Lightbulb className="w-4 h-4" />
                <span>Consiglio Strategico AI</span>
              </div>
              <p className="text-sm text-slate-200 leading-relaxed">{result.strategicAdvice}</p>
            </div>
          </div>

          {/* Top Competitors */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Competitor Principali sul Mercato</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {result.topCompetitors.map((comp, idx) => (
                <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-white text-base">{comp.name}</h4>
                      <span className="text-xs font-mono bg-slate-950 text-cyan-400 px-2.5 py-1 rounded-lg border border-slate-800">
                        {comp.pricing}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400">Quota di mercato stimata: <strong className="text-white">{comp.marketShare}</strong></div>

                    <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
                      <div className="space-y-1">
                        <strong className="text-emerald-400 flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" /> Punti di Forza:
                        </strong>
                        <ul className="list-disc list-inside text-slate-300 space-y-0.5 pl-1">
                          {comp.strengths.map((s, i) => <li key={i}>{s}</li>)}
                        </ul>
                      </div>

                      <div className="space-y-1 pt-1">
                        <strong className="text-red-400 flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5" /> Debolezze:
                        </strong>
                        <ul className="list-disc list-inside text-slate-300 space-y-0.5 pl-1">
                          {comp.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Market Gaps */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Gap di Mercato & Opportunità</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {result.marketGaps.map((gap, idx) => (
                <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-white text-base flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-cyan-400" />
                      {gap.gapTitle}
                    </h4>
                    <span className="text-xs font-mono bg-emerald-950/80 text-emerald-300 px-2.5 py-1 rounded-lg border border-emerald-800/50">
                      Opportunità: {gap.opportunityScore}/100
                    </span>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">{gap.description}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
