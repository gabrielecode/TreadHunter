/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useAppStore } from './store/useAppStore';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './pages/Dashboard';
import { IdeasGenerator } from './pages/IdeasGenerator';
import { CompetitorAnalysis } from './pages/CompetitorAnalysis';
import { Watchlist } from './pages/Watchlist';
import { AiAdvisor } from './pages/AiAdvisor';

export default function App() {
  const { currentTab } = useAppStore();

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto">
          {currentTab === 'dashboard' && <Dashboard />}
          {currentTab === 'generator' && <IdeasGenerator />}
          {currentTab === 'competitor' && <CompetitorAnalysis />}
          {currentTab === 'watchlist' && <Watchlist />}
          {currentTab === 'advisor' && <AiAdvisor />}
        </main>
      </div>
    </div>
  );
}
