import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { generateIdeasApi } from '../lib/api';
import { AppCategory, AppIdea } from '../types';
import { Sparkles, DollarSign, Clock, Wrench, Target, ShieldCheck, BookmarkCheck, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion } from 'motion/react';

const CATEGORIES: (AppCategory | 'Qualsiasi')[] = ['Qualsiasi', 'AI', 'Fintech', 'Health', 'Produttività', 'Gaming', 'E-commerce', 'Education', 'Social'];
const BUDGETS = ['€0 - €5.000', '€5.000 - €15.000', '€15.000 - €50.000', '€50.000+'];
const TIME_OPTIONS = ['Part-time (10-15h/settimana)', 'Part-time (15-20h/settimana)', 'Full-time (40h+/settimana)'];
const SKILLS_OPTIONS = ['Nessuna (No-code / Founder)', 'Developer Full-Stack', 'Designer UX/UI & Prototyping', 'Product Manager & Marketing'];
const MONETIZATION_OPTIONS = ['Abbonamento mensile (SaaS)', 'In-App Purchases (IAP)', 'Annunci Pubblicitari (Ads)', 'One-time Purchase'];

export const IdeasGenerator: React.FC = () => {
  const { generatorInputs, setGeneratorInputs, generatedIdeas, setGeneratedIdeas, isGenerating, setIsGenerating, addToWatchlist, watchlist } = useAppStore();
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setError(null);

    try {
      const ideas = await generateIdeasApi(generatorInputs);
      setGeneratedIdeas(ideas);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    } catch (err: any) {
      setError(err.message || 'Errore durante la generazione delle idee.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveIdea = (idea: AppIdea) => {
    addToWatchlist(idea);
    confetti({ particleCount: 50, spread: 50, origin: { y: 0.8 } });
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono mb-1">
          <Sparkles className="w-4 h-4" />
          <span>Gemini 3.8 Intelligent Engine</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Generatore di Idee App & Startup</h2>
        <p className="text-sm text-slate-400 mt-1">
          Inserisci il tuo profilo e le tue risorse per ricevere 5 idee di app ad alto potenziale di profitto validate dall'AI.
        </p>
      </div>

      {/* Input Form Card */}
      <form onSubmit={handleGenerate} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Budget */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-cyan-400" />
              <span>Budget Iniziale</span>
            </label>
            <select
              value={generatorInputs.budget}
              onChange={(e) => setGeneratorInputs({ budget: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
            >
              {BUDGETS.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* Time Commitment */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-indigo-400" />
              <span>Tempo Disponibile</span>
            </label>
            <select
              value={generatorInputs.timeCommitment}
              onChange={(e) => setGeneratorInputs({ timeCommitment: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
            >
              {TIME_OPTIONS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Skills */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Wrench className="w-4 h-4 text-emerald-400" />
              <span>Skill Tecniche</span>
            </label>
            <select
              value={generatorInputs.skills}
              onChange={(e) => setGeneratorInputs({ skills: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
            >
              {SKILLS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Niche */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Target className="w-4 h-4 text-amber-400" />
              <span>Nicchia Preferita</span>
            </label>
            <select
              value={generatorInputs.niche}
              onChange={(e) => setGeneratorInputs({ niche: e.target.value as any })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Monetization */}
          <div className="space-y-2 lg:col-span-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span>Modello di Monetizzazione</span>
            </label>
            <select
              value={generatorInputs.monetization}
              onChange={(e) => setGeneratorInputs({ monetization: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
            >
              {MONETIZATION_OPTIONS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800">
          <p className="text-xs text-slate-400">
            L'AI analizzerà i dati di mercato per generare 5 concept originali e completi di stime MRR.
          </p>
          <button
            type="submit"
            disabled={isGenerating}
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-sm rounded-xl hover:from-cyan-400 hover:to-indigo-500 shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-55 cursor-pointer"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generazione Idee in corso...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Genera 5 Idee con AI</span>
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-950/50 border border-red-800 text-red-200 text-xs">
            {error}
          </div>
        )}
      </form>

      {/* Generated Ideas Section */}
      {generatedIdeas.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">Idee Generate per Te ({generatedIdeas.length})</h3>
            <span className="text-xs font-mono text-cyan-400">Printe & Validate con Gemini AI</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {generatedIdeas.map((idea, idx) => {
              const isInWatchlist = watchlist.some((w) => w.idea.id === idea.id || w.idea.title === idea.title);
              return (
                <motion.div
                  key={idea.id || idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-7 flex flex-col justify-between space-y-6 shadow-xl hover:border-slate-700 transition-all"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 text-xs font-semibold rounded-lg bg-slate-950 text-cyan-400 border border-slate-800">
                        {idea.category}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono bg-emerald-950/80 text-emerald-300 px-2.5 py-1 rounded-lg border border-emerald-800/50">
                          MRR: {idea.estimatedMRR}
                        </span>
                        <span className="text-xs font-mono bg-indigo-950/80 text-indigo-300 px-2 py-1 rounded-lg border border-indigo-800/50">
                          Score: {idea.marketValidationScore}/100
                        </span>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-bold text-white">{idea.title}</h4>
                      <p className="text-sm font-medium text-cyan-300 mt-1">{idea.tagline}</p>
                    </div>

                    <div className="space-y-2 text-xs text-slate-300 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                      <p><strong>Problema:</strong> {idea.problem}</p>
                      <p><strong>Target:</strong> {idea.targetAudience}</p>
                      <p><strong>USP:</strong> {idea.usp}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                        <span className="text-slate-500 block mb-0.5">Tempo MVP</span>
                        <strong className="text-white font-mono">{idea.mvpTimeWeeks} settimane</strong>
                      </div>
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                        <span className="text-slate-500 block mb-0.5">Difficoltà Tecnica</span>
                        <strong className="text-white font-mono">Livello {idea.difficultyLevel} / 5</strong>
                      </div>
                    </div>

                    <div>
                      <span className="text-xs font-semibold text-slate-400 block mb-1.5">Tech Stack Consigliato:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {idea.techStack.map((tech) => (
                          <span key={tech} className="px-2.5 py-1 text-xs font-mono bg-slate-950 text-slate-300 rounded-lg border border-slate-800">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-xs font-semibold text-slate-400 block mb-1">Competitor Principali:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {idea.competitors.map((comp) => (
                          <span key={comp} className="px-2.5 py-0.5 text-xs bg-slate-800/80 text-slate-300 rounded-md">
                            {comp}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-5 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-slate-400">Modello: <strong className="text-white">{idea.businessModel}</strong></span>
                    <button
                      onClick={() => handleSaveIdea(idea)}
                      disabled={isInWatchlist}
                      className={`px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all ${
                        isInWatchlist
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800 cursor-default'
                          : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-md shadow-cyan-500/20 cursor-pointer'
                      }`}
                    >
                      {isInWatchlist ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>Salvato in Watchlist</span>
                        </>
                      ) : (
                        <>
                          <BookmarkCheck className="w-4 h-4" />
                          <span>Salva in Watchlist</span>
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
