import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { LayoutDashboard, Sparkles, Search, BookmarkCheck, BotMessageSquare, Flame, ShieldAlert } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { currentTab, setCurrentTab, watchlist } = useAppStore();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard Trend', icon: LayoutDashboard },
    { id: 'generator', label: 'Generatore Idee AI', icon: Sparkles, badge: 'PRO' },
    { id: 'competitor', label: 'Analisi Competitor', icon: Search },
    { id: 'watchlist', label: 'Watchlist Personale', icon: BookmarkCheck, count: watchlist.length },
    { id: 'advisor', label: 'Consulente AI', icon: BotMessageSquare },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 hidden md:flex">
      {/* Brand Header */}
      <div className="h-16 px-6 flex items-center gap-3 border-b border-slate-800">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
          <Flame className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
            TrendHunter <span className="text-cyan-400 text-xs font-mono px-1.5 py-0.5 bg-cyan-950/80 rounded border border-cyan-800/50">AI</span>
          </h1>
          <p className="text-xs text-slate-400">Market Intelligence</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5">
        <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          Menu Principale
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id as any)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/15 to-indigo-500/10 text-cyan-400 border border-cyan-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-300'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span className="px-1.5 py-0.5 text-[10px] font-mono bg-cyan-500/20 text-cyan-300 rounded border border-cyan-500/30">
                  {item.badge}
                </span>
              )}
              {item.count !== undefined && item.count > 0 && (
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs flex items-center justify-center font-mono font-semibold">
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Info Box */}
      <div className="p-4 m-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-2">
        <div className="flex items-center gap-2 text-cyan-400 font-medium">
          <ShieldAlert className="w-4 h-4" />
          <span>Gemini 3.8 Powered</span>
        </div>
        <p className="text-slate-400 leading-relaxed text-[11px]">
          Analisi in tempo reale su store globali e community di developer.
        </p>
      </div>
    </aside>
  );
};
