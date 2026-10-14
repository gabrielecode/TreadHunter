import React, { useState } from 'react';
import { sendAiChatMessage } from '../lib/api';
import { BotMessageSquare, Send, Sparkles, User, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export const AiAdvisor: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      content: 'Ciao! Sono il tuo consulente strategico di TrendHunter AI. Chiedimi qualsiasi consiglio su come validare un MVP, scegliere il modello di monetizzazione ideale o scalare la tua app mobile/web.',
    },
  ]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: userMsg }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const reply = await sendAiChatMessage(newMessages);
      setMessages([...newMessages, { role: 'model', content: reply }]);
    } catch (err: any) {
      setMessages([...newMessages, { role: 'model', content: 'Mi dispiace, si è verificato un errore di connessione. Riprova tra poco.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-5xl mx-auto h-[calc(100vh-4rem)] flex flex-col">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Consulente Strategico AI</h2>
        <p className="text-sm text-slate-400 mt-1">
          Chat interattiva in tempo reale alimentata da Gemini 3.8 per accelerare la crescita del tuo business.
        </p>
      </div>

      {/* Chat Box */}
      <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between overflow-hidden shadow-xl">
        {/* Messages List */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map((m, idx) => {
            const isUser = m.role === 'user';
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    isUser ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white shadow-md'
                  }`}
                >
                  {isUser ? <User className="w-5 h-5" /> : <BotMessageSquare className="w-5 h-5" />}
                </div>
                <div
                  className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                    isUser
                      ? 'bg-cyan-500 text-slate-950 rounded-tr-none font-medium'
                      : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none'
                  }`}
                >
                  {m.content}
                </div>
              </motion.div>
            );
          })}

          {loading && (
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white flex items-center justify-center shadow-md">
                <BotMessageSquare className="w-5 h-5" />
              </div>
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl text-slate-400 text-sm flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                <span>Analisi in corso...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} className="mt-4 pt-4 border-t border-slate-800 flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Chiedi un consiglio su pricing, marketing o tech stack..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-semibold text-sm rounded-xl hover:from-cyan-400 hover:to-indigo-500 shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer shrink-0"
          >
            <span>Invia</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
