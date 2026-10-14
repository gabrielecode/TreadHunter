import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { Sparkles, Flame, Menu } from 'lucide-react';

export const Header: React.FC = () => {
  const { currentTab, setCurrentTab } = useAppStore();

  return (
    <header className="h-16 px-6 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-8 shrink-0">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3 shrink-0 md:hidden">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center">
          <Flame className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-white tracking-tight">TrendHunter AI</span>
      </div>

      <div className="hidden md:flex items-center gap-2">
        <span className="text-sm font-semibold text-slate-300 capitalize">
          {currentTab === 'dashboard' && 'Dashboard Trend di Mercato'}
          {currentTab === 'generator' && 'Generatore Idee App con AI'}
          {currentTab === 'competitor' && 'Analisi Competitor & Market Gaps'}
          {currentTab === 'watchlist' && 'Watchlist & Idee Salvate'}
          {currentTab === 'advisor' && 'Consulente Strategico AI'}
        </span>
      </div>

      {/* Zone 2: 4-5 clean single-line navigation links */}
      <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-400">
        <button
          onClick={() => setCurrentTab('dashboard')}
          className={`transition-colors whitespace-nowrap shrink-0 ${currentTab === 'dashboard' ? 'text-cyan-400 font-semibold' : 'hover:text-slate-200'}`}
        >
          Trend
        </button>
        <button
          onClick={() => setCurrentTab('generator')}
          className={`transition-colors whitespace-nowrap shrink-0 ${currentTab === 'generator' ? 'text-cyan-400 font-semibold' : 'hover:text-slate-200'}`}
        >
          Generatore
        </button>
        <button
          onClick={() => setCurrentTab('competitor')}
          className={`transition-colors whitespace-nowrap shrink-0 ${currentTab === 'competitor' ? 'text-cyan-400 font-semibold' : 'hover:text-slate-200'}`}
        >
          Competitor
        </button>
        <button
          onClick={() => setCurrentTab('watchlist')}
          className={`transition-colors whitespace-nowrap shrink-0 ${currentTab === 'watchlist' ? 'text-cyan-400 font-semibold' : 'hover:text-slate-200'}`}
        >
          Watchlist
        </button>
        <button
          onClick={() => setCurrentTab('advisor')}
          className={`transition-colors whitespace-nowrap shrink-0 ${currentTab === 'advisor' ? 'text-cyan-400 font-semibold' : 'hover:text-slate-200'}`}
        >
          Advisor
        </button>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={() => setCurrentTab('generator')}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 to-indigo-600 rounded-xl hover:from-cyan-400 hover:to-indigo-500 transition-all shadow-lg shadow-cyan-500/20 whitespace-nowrap shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Genera Nuova Idea</span>
        </button>
      </div>
    </header>
  );
};
