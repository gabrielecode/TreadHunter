export type AppCategory = 'AI' | 'Fintech' | 'Health' | 'Produttività' | 'Gaming' | 'E-commerce' | 'Education' | 'Social';

export interface MarketTrend {
  id: string;
  name: string;
  category: AppCategory;
  growthRate: number; // percentage es. +145%
  searchVolume: string; // es. "1.2M/mo"
  competition: 'Bassa' | 'Media' | 'Alta';
  saturation: number; // percentage 0-100
  hotRegions: string[];
  description: string;
  trendData: { month: string; value: number }[];
}

export interface AppIdea {
  id: string;
  title: string;
  tagline: string;
  category: AppCategory;
  problem: string;
  targetAudience: string;
  usp: string;
  businessModel: string;
  estimatedMRR: string;
  mvpTimeWeeks: number;
  competitors: string[];
  difficultyLevel: number; // 1 to 5
  techStack: string[];
  marketValidationScore: number; // 0 to 100
}

export interface Competitor {
  name: string;
  pricing: string;
  strengths: string[];
  weaknesses: string[];
  marketShare: string;
}

export interface MarketGap {
  gapTitle: string;
  description: string;
  opportunityScore: number;
}

export interface CompetitorAnalysisResult {
  marketOverview: string;
  topCompetitors: Competitor[];
  marketGaps: MarketGap[];
  strategicAdvice: string;
}

export interface WatchlistItem {
  id: string;
  idea: AppIdea;
  notes: string;
  status: 'da-valutare' | 'in-sviluppo' | 'scartata';
  addedAt: string;
}

export interface GeneratorInputs {
  budget: string;
  timeCommitment: string;
  skills: string;
  niche: AppCategory | 'Qualsiasi';
  monetization: string;
}

export interface CustomSectorResearchResult {
  sectorName: string;
  marketOverview: string;
  aiFeasibilityScore: number;
  growthRate: string;
  searchVolume: string;
  competitionLevel: string;
  monetizationBreakdown: {
    primaryModel: string;
    recommendedPricing: string;
    arpuEstimate: string;
    notes: string;
  };
  topCompetitors: string[];
  marketGap: string;
  ideas: AppIdea[];
}

