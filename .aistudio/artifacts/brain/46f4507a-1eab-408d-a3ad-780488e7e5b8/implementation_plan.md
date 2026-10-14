# Custom Sector Trend Research & Analysis Plan

Enable users to manually enter any custom sector or niche to generate professional market analysis, business ideas, monetization models, and AI feasibility breakdowns, with automatic saving to recent searches and watchlist.

## User Review & Critical Decisions

> [!IMPORTANT]
> - **Confirmed UI Placement**: Manual sector trend search bar is located at the top of the dashboard.
> - **Confirmed Insights**: Highlights AI feasibility score, monetization breakdown, competitor mapping, and estimated MRR.
> - **Confirmed Data Management**: Custom searches are saved to recent searches and can be added instantly to the watchlist.

---

## 1. Overview & Core Concept

- **What It Does**: Allows users to type any custom industry, niche, or app sector (e.g. "Pet Healthcare", "AI Legal Tech", "Micro-SaaS for Freelancers") and generate validated business ideas with accurate market analysis, revenue estimations, and risk factors.
- **Target Audience / Persona**: Mobile & web app entrepreneurs, product managers, and venture capital analysts.
- **Key Value**: Instant AI-powered market research tailored to any custom sector, complete with professional monetization models and feasibility scoring.

---

## 2. User Experience & Visual Design

- **Key User Flows**:
  1. User views the Dashboard and sees a prominent "Search Custom Sector Trend" input bar at the top.
  2. User types a sector (or clicks a trending tag) and triggers AI research.
  3. Results display comprehensive business ideas, AI feasibility score, monetization breakdown, and risk factors.
  4. User can save the search to recent searches and add ideas directly to their Watchlist or Ideas Generator.
- **Visual Identity & Theme**:
  - *Aesthetic Direction*: Professional, clean B2B SaaS dashboard style (Slate neutrals, indigo/emerald accents, tabular figures).
  - *Typography & Hierarchy*: Plus Jakarta Sans / DM Sans, tabular-nums for metrics.
  - *Component Styling*: Clean unboxed metadata, single-elevation depth cards, smooth transitions.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Server-Side Gemini API Integration**
  - *Chosen Approach*: Use `@google/genai` on the server (`server.ts` or `/api/analyze-sector`) to generate structured JSON market analysis.
  - *Why*: Secure API key handling, reliable JSON response parsing.
- **Decision 2: State Persistence & Watchlist Sync**
  - *Chosen Approach*: Store custom searches in Zustand state and persist to localStorage, allowing seamless addition to Watchlist.
  - *Why*: Fast client-side responsiveness without losing user research.

---

## 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────┐        ┌──────────────────────────────┐
│  Dashboard UI (Client)      │───────>│  Express API (/api/market)   │
│  - Custom Sector Search Bar │        │  - @google/genai SDK         │
│  - Feasibility & MRR Metrics│        │  - Structured JSON response  │
└─────────────────────────────┘        └──────────────────────────────┘
              │                                       │
              ▼                                       ▼
┌─────────────────────────────┐        ┌──────────────────────────────┐
│  Zustand Store / Watchlist  │<───────│  Gemini 3.8 Flash Model      │
└─────────────────────────────┘        └──────────────────────────────┘
```

- **Data Model**:
  - `SectorIdea`: name, problema_risolto, target_utente, usp, modello_business, prezzo_consigliato, stima_mrr_min, stima_mrr_max, tempo_mvp_giorni, difficolta, competitor_principali, gap_di_mercato, stack_consigliato, rischio_principale, ai_feasibility_score.
- **State & Storage**:
  - Extended Zustand store (`useAppStore`) with actions for `searchCustomSector`, `addToWatchlist`, and `recentSearches`.
