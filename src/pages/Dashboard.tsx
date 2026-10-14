import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { AppCategory } from '../types';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Flame, TrendingUp, Users, ShieldAlert, Globe, ArrowUpRight, Search, Sparkles, CheckCircle2, Bookmark, Cpu, DollarSign, Target, X } from 'lucide-react';
import { motion } from 'motion/react';

const CATEGORIES: (AppCategory | 'All')[] = ['All', 'AI', 'Fintech', 'Health', 'Produttività', 'Gaming', 'E-commerce', 'Education', 'Social'];

export const Dashboard: React.FC = () => {
  const {
    trends,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
    setCurrentTab,
    customSectorResult,
    setCustomSectorResult,
    recentSearches,
    addRecentSearch,
    addToWatchlist,
    watchlist
  } = useAppStore();

  const [activeTrendId, setActiveTrendId] = useState<string>(trends[0]?.id || '');
  const [customInput, setCustomInput] = useState<string>('');
  const [isSearchingCustom, setIsSearchingCustom] = useState<boolean>(false);
  const [customError, setCustomError] = useState<string>('');

  const filteredTrends = selectedCategoryFilter === 'All'
    ? trends
    : trends.filter((t) => t.category === selectedCategoryFilter);

  const activeTrend = trends.find((t) => t.id === activeTrendId) || trends[0];

  const handleCustomSearch = async (sectorToSearch?: string) => {
    const query = sectorToSearch || customInput;
    if (!query.trim()) return;
    setIsSearchingCustom(true);
    setCustomError('');
    try {
      const res = await fetch('/api/custom-sector-research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sector: query }),
      });
      const data = await res.json();
      if (data.success && data.research) {
        setCustomSectorResult(data.research);
        addRecentSearch(query);
        if (!sectorToSearch) setCustomInput('');
      } else {
        setCustomError(data.error || "Errore durante l'analisi del settore.");
      }
    } catch (err: any) {
      setCustomError(err.message || "Errore di connessione al server.");
    } finally {
      setIsSearchingCustom(false);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Dashboard Trend di Mercato</h2>
          <p className="text-sm text-slate-400 mt-1">
            Monitora i trend emergenti e ricerca qualsiasi settore di mercato in tempo reale con l'AI.
          </p>
        </div>
        <button
          onClick={() => setCurrentTab('generator')}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-semibold text-sm rounded-xl hover:from-cyan-400 hover:to-indigo-500 shadow-lg shadow-cyan-500/20 transition-all self-start md:self-auto"
        >
          <Sparkles className="w-4 h-4" />
          <span>Generatore Idee Avanzato</span>
        </button>
      </div>

      {/* Manual Sector Search Bar (Prominently placed at top as requested) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Search className="w-5 h-5 text-cyan-400" />
              <span>Ricerca Manuale Settore o Nicchia</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Inserisci qualsiasi settore (es. PropTech, Pet Care, Legal AI, Micro-SaaS) per ottenere un'analisi di mercato e idee su misura.
            </p>
          </div>
          {customSectorResult && (
            <button
              onClick={() => setCustomSectorResult(null)}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 self-start md:self-auto px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700"
            >
              <X className="w-3.5 h-3.5" />
              <span>Chiudi Analisi Custom</span>
            </button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCustomSearch()}
              placeholder="Es. EdTech per scuole superiori, AI per ristoranti, FinTech crypto..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
          <button
            onClick={() => handleCustomSearch()}
            disabled={isSearchingCustom || !customInput.trim()}
            className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 whitespace-nowrap"
          >
            {isSearchingCustom ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Analisi in corso...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Analizza Settore</span>
              </>
            )}
          </button>
        </div>

        {customError && (
          <div className="text-xs text-rose-400 bg-rose-950/40 p-3 rounded-xl border border-rose-900/50">
            {customError}
          </div>
        )}

        {recentSearches.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="text-slate-500 font-medium">Ricerche recenti:</span>
            {recentSearches.map((term) => (
              <button
                key={term}
                onClick={() => handleCustomSearch(term)}
                className="px-3 py-1 rounded-lg bg-slate-950 text-slate-300 hover:text-cyan-400 border border-slate-800 hover:border-slate-700 transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Custom Sector Research Results (If available) */}
      {customSectorResult && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900 border border-cyan-500/40 rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  Analisi Settore Personalizzato
                </span>
                <span className="text-xs font-mono text-slate-400">Crescita: <strong className="text-emerald-400">{customSectorResult.growthRate}</strong></span>
              </div>
              <h3 className="text-2xl font-bold text-white mt-2">{customSectorResult.sectorName}</h3>
              <p className="text-sm text-slate-300 mt-2 leading-relaxed max-w-4xl">{customSectorResult.marketOverview}</p>
            </div>

            {/* AI Feasibility Score & Metrics */}
            <div className="flex items-center gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800 shrink-0">
              <div className="relative flex items-center justify-center w-14 h-14 rounded-full bg-cyan-500/10 border-2 border-cyan-500">
                <span className="text-base font-bold font-mono text-cyan-400">{customSectorResult.aiFeasibilityScore}%</span>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 block">AI Feasibility Score</span>
                <span className="text-xs text-emerald-400 font-medium">Alta fattibilità MVP</span>
              </div>
            </div>
          </div>

          {/* Breakdown Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400">
                <DollarSign className="w-4 h-4" />
                <span>Monetizzazione & Prezzo</span>
              </div>
              <div className="text-sm font-bold text-white">{customSectorResult.monetizationBreakdown.primaryModel}</div>
              <div className="text-xs text-slate-400 font-mono">Consigliato: {customSectorResult.monetizationBreakdown.recommendedPricing}</div>
              <p className="text-xs text-slate-500 pt-1">{customSectorResult.monetizationBreakdown.notes}</p>
            </div>

            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400">
                <Target className="w-4 h-4" />
                <span>Gap di Mercato Principale</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{customSectorResult.marketGap}</p>
            </div>

            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                <Users className="w-4 h-4" />
                <span>Top Competitors & Volume</span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {customSectorResult.topCompetitors.map((comp) => (
                  <span key={comp} className="px-2 py-0.5 text-xs bg-slate-900 text-slate-300 rounded-md border border-slate-800">
                    {comp}
                  </span>
                ))}
              </div>
              <div className="text-xs text-slate-400 pt-1">Volume: <strong className="text-white font-mono">{customSectorResult.searchVolume}</strong></div>
            </div>
          </div>

          {/* Ideas Generated for Custom Sector */}
          <div className="space-y-4 pt-4">
            <h4 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <span>Idee di App Validate per {customSectorResult.sectorName}</span>
            </h4>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {customSectorResult.ideas.map((idea) => {
                const isWatchlisted = watchlist.some((w) => w.idea.title === idea.title);
                return (
                  <div key={idea.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-900 text-cyan-400 border border-slate-800">
                          {idea.category}
                        </span>
                        <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-800/50">
                          MRR Est: {idea.estimatedMRR}
                        </span>
                      </div>
                      <div>
                        <h5 className="text-lg font-bold text-white">{idea.title}</h5>
                        <p className="text-xs text-slate-400 mt-1">{idea.tagline}</p>
                      </div>
                      <p className="text-xs text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 leading-relaxed">
                        <strong>Problema:</strong> {idea.problem}
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                          <span className="text-slate-500 block">Tempo MVP</span>
                          <strong className="text-white font-mono">{idea.mvpTimeWeeks} settimane</strong>
                        </div>
                        <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                          <span className="text-slate-500 block">Difficoltà</span>
                          <strong className="text-white font-mono">{idea.difficultyLevel}/5</strong>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-900 flex items-center justify-between">
                      <span className="text-xs text-slate-400">Validazione: <strong className="text-cyan-400 font-mono">{idea.marketValidationScore}%</strong></span>
                      <button
                        onClick={() => addToWatchlist(idea)}
                        disabled={isWatchlisted}
                        className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 ${
                          isWatchlisted
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800 cursor-default'
                            : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20'
                        }`}
                      >
                        {isWatchlisted ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Nel Watchlist</span>
                          </>
                        ) : (
                          <>
                            <Bookmark className="w-3.5 h-3.5" />
                            <span>Salva nel Watchlist</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none pt-4">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategoryFilter === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategoryFilter(cat)}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Overview Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Trend Monitorati</span>
            <Flame className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">6 Macro-Settori</div>
          <div className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+14.2% crescita media mensile</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Volume di Ricerca Totale</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">17.2M / mo</div>
          <div className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Altissima domanda globale</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Competizione Media</span>
            <ShieldAlert className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">Bassa - Media</div>
          <div className="text-xs text-cyan-400 font-medium">Ampio spazio per nuovi entranti</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Regioni Hot Spot</span>
            <Globe className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">EU, USA, UK</div>
          <div className="text-xs text-slate-400 font-medium">Mercati con altissimo ARPU</div>
        </div>
      </div>

      {/* Main Chart & Trend Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Chart */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">Analisi Temporale</span>
              <h3 className="text-lg font-bold text-white mt-0.5">{activeTrend?.name}</h3>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
              <span className="text-slate-400">Crescita:</span>
              <span className="text-emerald-400 font-bold">+{activeTrend?.growthRate}%</span>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activeTrend?.trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" textAnchor="end" tick={{ fontSize: 12 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ color: '#38bdf8' }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#06b6d4"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#06b6d4' }}
                  activeDot={{ r: 8, fill: '#38bdf8' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Categoria: <strong className="text-white">{activeTrend?.category}</strong></span>
            <span>Volume Ricerca: <strong className="text-white">{activeTrend?.searchVolume}</strong></span>
            <span>Saturazione: <strong className="text-white">{activeTrend?.saturation}%</strong></span>
          </div>
        </div>

        {/* Trend Quick List */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col">
          <h3 className="text-base font-bold text-white mb-4">Trend Selezionati ({filteredTrends.length})</h3>
          <div className="space-y-3 overflow-y-auto max-h-[340px] pr-1">
            {filteredTrends.map((trend) => {
              const isSelected = trend.id === activeTrendId;
              return (
                <div
                  key={trend.id}
                  onClick={() => setActiveTrendId(trend.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-500/10 border-cyan-500/50 shadow-sm'
                      : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-cyan-400">{trend.category}</span>
                    <span className="text-xs font-mono font-bold text-emerald-400">+{trend.growthRate}%</span>
                  </div>
                  <h4 className="text-sm font-bold text-white truncate">{trend.name}</h4>
                  <p className="text-xs text-slate-400 line-clamp-1 mt-1">{trend.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Detailed Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTrends.map((trend, idx) => (
          <motion.div
            key={trend.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700 transition-all"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-800 text-cyan-400 border border-slate-700">
                  {trend.category}
                </span>
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-800/50">
                  +{trend.growthRate}% YoY
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">{trend.name}</h3>
                <p className="text-sm text-slate-400 mt-2 leading-relaxed">{trend.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block">Ricerca</span>
                  <strong className="text-white font-mono">{trend.searchVolume}</strong>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block">Saturazione</span>
                  <strong className="text-white font-mono">{trend.saturation}%</strong>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {trend.hotRegions.map((reg) => (
                  <span key={reg} className="px-2 py-0.5 text-[11px] bg-slate-950 text-slate-300 rounded-md border border-slate-800">
                    {reg}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-xs text-slate-400">Competizione: <strong className="text-white">{trend.competition}</strong></span>
              <button
                onClick={() => {
                  setActiveTrendId(trend.id);
                  setCurrentTab('generator');
                }}
                className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 group"
              >
                <span>Sviluppa Idea</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
