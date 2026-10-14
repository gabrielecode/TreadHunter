import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MarketTrend, AppIdea, WatchlistItem, GeneratorInputs, AppCategory, CustomSectorResearchResult } from '../types';

export const INITIAL_TRENDS: MarketTrend[] = [
  {
    id: 'trend-1',
    name: 'AI Agentic Personal Assistants',
    category: 'AI',
    growthRate: 185,
    searchVolume: '4.8M/mo',
    competition: 'Media',
    saturation: 42,
    hotRegions: ['Nord America', 'Europa Occidentale', 'Giappone'],
    description: 'Agenti AI autonomi capaci di eseguire flussi di lavoro complessi (prenotazioni, gestione email, report finanziari) senza supervisione costante.',
    trendData: [
      { month: 'Gen', value: 2100 },
      { month: 'Feb', value: 3400 },
      { month: 'Mar', value: 5200 },
      { month: 'Apr', value: 7800 },
      { month: 'Mag', value: 11200 },
      { month: 'Giu', value: 16500 },
    ],
  },
  {
    id: 'trend-2',
    name: 'Micro-SaaS per Creator Economy',
    category: 'Produttività',
    growthRate: 110,
    searchVolume: '2.1M/mo',
    competition: 'Bassa',
    saturation: 31,
    hotRegions: ['Europa', 'USA', 'Sud America'],
    description: 'Strumenti verticali per content creator focalizzati su repurposing automatico video e gestione sponsorizzazioni multi-piattaforma.',
    trendData: [
      { month: 'Gen', value: 1500 },
      { month: 'Feb', value: 2100 },
      { month: 'Mar', value: 3000 },
      { month: 'Apr', value: 4200 },
      { month: 'Mag', value: 5800 },
      { month: 'Giu', value: 7900 },
    ],
  },
  {
    id: 'trend-3',
    name: 'Fintech Preventivo & AI Budgeting',
    category: 'Fintech',
    growthRate: 95,
    searchVolume: '3.5M/mo',
    competition: 'Alta',
    saturation: 68,
    hotRegions: ['UK', 'Germania', 'Singapore'],
    description: 'App di finanza personale che anticipano spese impreviste e ottimizzano automaticamente abbonamenti e investimenti a basso rischio.',
    trendData: [
      { month: 'Gen', value: 4000 },
      { month: 'Feb', value: 4800 },
      { month: 'Mar', value: 5500 },
      { month: 'Apr', value: 6800 },
      { month: 'Mag', value: 8100 },
      { month: 'Giu', value: 9900 },
    ],
  },
  {
    id: 'trend-4',
    name: 'Longevity & Biohacking Trackers',
    category: 'Health',
    growthRate: 140,
    searchVolume: '3.1M/mo',
    competition: 'Media',
    saturation: 45,
    hotRegions: ['USA', 'Scandinavia', 'Svizzera'],
    description: 'Applicazioni integrate con wearable per il monitoraggio dei biomarcatori di longevità, sonno profondo e protocolli di digiuno.',
    trendData: [
      { month: 'Gen', value: 3000 },
      { month: 'Feb', value: 4200 },
      { month: 'Mar', value: 5900 },
      { month: 'Apr', value: 7500 },
      { month: 'Mag', value: 10200 },
      { month: 'Giu', value: 13800 },
    ],
  },
  {
    id: 'trend-5',
    name: 'EdTech Gamified Language Immersion',
    category: 'Education',
    growthRate: 80,
    searchVolume: '1.9M/mo',
    competition: 'Alta',
    saturation: 75,
    hotRegions: ['Asia', 'Europa', 'America Latina'],
    description: 'Piattaforme di apprendimento linguistico immersive basate su conversazioni VR/AR e dialoghi con personaggi AI realistici.',
    trendData: [
      { month: 'Gen', value: 5000 },
      { month: 'Feb', value: 5600 },
      { month: 'Mar', value: 6200 },
      { month: 'Apr', value: 7000 },
      { month: 'Mag', value: 7800 },
      { month: 'Giu', value: 8900 },
    ],
  },
  {
    id: 'trend-6',
    name: 'Social Communities per Digital Nomad',
    category: 'Social',
    growthRate: 125,
    searchVolume: '1.4M/mo',
    competition: 'Bassa',
    saturation: 28,
    hotRegions: ['Portogallo', 'Indonesia', 'Spagna', 'Messico'],
    description: 'Network geolocalizzati per lavoratori da remoto con focus su co-living, coworking e matching di competenze.',
    trendData: [
      { month: 'Gen', value: 1200 },
      { month: 'Feb', value: 1800 },
      { month: 'Mar', value: 2600 },
      { month: 'Apr', value: 3900 },
      { month: 'Mag', value: 5400 },
      { month: 'Giu', value: 7200 },
    ],
  },
];

interface AppState {
  currentTab: 'dashboard' | 'generator' | 'competitor' | 'watchlist' | 'advisor';
  setCurrentTab: (tab: 'dashboard' | 'generator' | 'competitor' | 'watchlist' | 'advisor') => void;
  
  trends: MarketTrend[];
  selectedCategoryFilter: AppCategory | 'All';
  setSelectedCategoryFilter: (cat: AppCategory | 'All') => void;
  
  generatedIdeas: AppIdea[];
  setGeneratedIdeas: (ideas: AppIdea[]) => void;
  isGenerating: boolean;
  setIsGenerating: (val: boolean) => void;
  
  watchlist: WatchlistItem[];
  addToWatchlist: (idea: AppIdea) => void;
  removeFromWatchlist: (id: string) => void;
  updateWatchlistItem: (id: string, updates: Partial<WatchlistItem>) => void;
  
  generatorInputs: GeneratorInputs;
  setGeneratorInputs: (inputs: Partial<GeneratorInputs>) => void;

  customSectorResult: CustomSectorResearchResult | null;
  setCustomSectorResult: (res: CustomSectorResearchResult | null) => void;
  recentSearches: string[];
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentTab: 'dashboard',
      setCurrentTab: (tab) => set({ currentTab: tab }),

      trends: INITIAL_TRENDS,
      selectedCategoryFilter: 'All',
      setSelectedCategoryFilter: (cat) => set({ selectedCategoryFilter: cat }),

      generatedIdeas: [],
      setGeneratedIdeas: (ideas) => set({ generatedIdeas: ideas }),
      isGenerating: false,
      setIsGenerating: (val) => set({ isGenerating: val }),

      watchlist: [],
      addToWatchlist: (idea) => {
        const existing = get().watchlist.find((item) => item.idea.id === idea.id);
        if (!existing) {
          const newItem: WatchlistItem = {
            id: 'watch-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
            idea,
            notes: '',
            status: 'da-valutare',
            addedAt: new Date().toISOString().split('T')[0],
          };
          set({ watchlist: [newItem, ...get().watchlist] });
        }
      },
      removeFromWatchlist: (id) => {
        set({ watchlist: get().watchlist.filter((item) => item.id !== id) });
      },
      updateWatchlistItem: (id, updates) => {
        set({
          watchlist: get().watchlist.map((item) => (item.id === id ? { ...item, ...updates } : item)),
        });
      },

      generatorInputs: {
        budget: '€5.000 - €15.000',
        timeCommitment: 'Part-time (15-20h/settimana)',
        skills: 'Developer Full-Stack',
        niche: 'AI',
        monetization: 'Abbonamento mensile (SaaS)',
      },
      setGeneratorInputs: (inputs) =>
        set({ generatorInputs: { ...get().generatorInputs, ...inputs } }),

      customSectorResult: null,
      setCustomSectorResult: (res) => set({ customSectorResult: res }),
      recentSearches: [],
      addRecentSearch: (query) => {
        const cleaned = query.trim();
        if (!cleaned) return;
        const filtered = get().recentSearches.filter((s) => s.toLowerCase() !== cleaned.toLowerCase());
        set({ recentSearches: [cleaned, ...filtered].slice(0, 5) });
      },
      clearRecentSearches: () => set({ recentSearches: [] }),
    }),
    {
      name: 'trendhunter-storage',
      partialize: (state) => ({
        watchlist: state.watchlist,
        generatorInputs: state.generatorInputs,
        recentSearches: state.recentSearches,
        customSectorResult: state.customSectorResult,
      }),
    }
  )
);
