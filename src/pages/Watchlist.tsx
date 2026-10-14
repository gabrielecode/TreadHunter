import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { BookmarkCheck, Trash2, Edit3, CheckCircle2, AlertCircle, XCircle, Download, Sparkles } from 'lucide-react';

export const Watchlist: React.FC = () => {
  const { watchlist, removeFromWatchlist, updateWatchlistItem, setCurrentTab } = useAppStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState<string>('');

  const handleStartEdit = (id: string, currentNotes: string) => {
    setEditingId(id);
    setNoteText(currentNotes);
  };

  const handleSaveNotes = (id: string) => {
    updateWatchlistItem(id, { notes: noteText });
    setEditingId(null);
  };

  const exportWatchlist = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(watchlist, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `trendhunter_watchlist_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Watchlist Personale</h2>
          <p className="text-sm text-slate-400 mt-1">
            Gestisci le idee di app salvate, aggiungi note personali e monitora lo stato di avanzamento.
          </p>
        </div>
        {watchlist.length > 0 && (
          <button
            onClick={exportWatchlist}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 border border-slate-800 text-slate-200 text-xs font-semibold rounded-xl hover:bg-slate-800 transition-colors self-start md:self-auto cursor-pointer"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Esporta Watchlist (JSON)</span>
          </button>
        )}
      </div>

      {watchlist.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400">
            <BookmarkCheck className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">La tua Watchlist è vuota</h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              Genera nuove idee di app tramite il Generatore AI e salvale qui per pianificare lo sviluppo del tuo MVP.
            </p>
          </div>
          <button
            onClick={() => setCurrentTab('generator')}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-semibold text-sm rounded-xl hover:from-cyan-400 hover:to-indigo-500 shadow-lg shadow-cyan-500/20 transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Vai al Generatore Idee</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {watchlist.map((item) => {
            const idea = item.idea;
            const isEditing = editingId === item.id;
            return (
              <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-7 flex flex-col justify-between space-y-6 shadow-xl">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 text-xs font-semibold rounded-lg bg-slate-950 text-cyan-400 border border-slate-800">
                      {idea.category}
                    </span>

                    {/* Status Selector */}
                    <select
                      value={item.status}
                      onChange={(e) => updateWatchlistItem(item.id, { status: e.target.value as any })}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-lg border focus:outline-none transition-colors ${
                        item.status === 'in-sviluppo'
                          ? 'bg-amber-950/80 text-amber-300 border-amber-800'
                          : item.status === 'da-valutare'
                          ? 'bg-cyan-950/80 text-cyan-300 border-cyan-800'
                          : 'bg-red-950/80 text-red-300 border-red-800'
                      }`}
                    >
                      <option value="da-valutare">Da Valutare</option>
                      <option value="in-sviluppo">In Sviluppo</option>
                      <option value="scartata">Scartata</option>
                    </select>
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-white">{idea.title}</h4>
                    <p className="text-sm font-medium text-cyan-300 mt-1">{idea.tagline}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-slate-500 block">Stima MRR</span>
                      <strong className="text-emerald-400 font-mono">{idea.estimatedMRR}</strong>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-slate-500 block">Tempo MVP</span>
                      <strong className="text-white font-mono">{idea.mvpTimeWeeks} settimane</strong>
                    </div>
                  </div>

                  {/* Personal Notes Section */}
                  <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                      <span>Note Personali</span>
                      {!isEditing && (
                        <button
                          onClick={() => handleStartEdit(item.id, item.notes)}
                          className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Modifica</span>
                        </button>
                      )}
                    </div>

                    {isEditing ? (
                      <div className="space-y-2">
                        <textarea
                          value={noteText}
                          onChange={(e) => setNoteText(e.target.value)}
                          rows={3}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                          placeholder="Aggiungi note su task, validazione o feedback..."
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                          >
                            Annulla
                          </button>
                          <button
                            onClick={() => handleSaveNotes(item.id)}
                            className="px-3 py-1.5 bg-cyan-500 text-slate-950 text-xs font-semibold rounded-lg hover:bg-cyan-400"
                          >
                            Salva
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-300 italic">
                        {item.notes ? item.notes : 'Nessuna nota aggiunta. Clicca su modifica per inserire appunti.'}
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>Aggiunto il: <strong className="text-white">{item.addedAt}</strong></span>
                  <button
                    onClick={() => removeFromWatchlist(item.id)}
                    className="text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer font-medium"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Elimina</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
