'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Loader2, User, ClipboardList, FileText, Zap, Activity, 
  Stethoscope, Pill, Microscope, AlertTriangle, BookOpen, CheckCircle2
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function Diagnose() {
  const [symptoms, setSymptoms] = useState('');
  const [age, setAge] = useState(25);
  const [loading, setLoading] = useState(false);
  const [aiReport, setAiReport] = useState<string>('');
  const [error, setError] = useState('');

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim()) return;

    setLoading(true);
    setError('');
    setAiReport('');

    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/analyze-deep-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms, age: Number(age) })
      });

      if (!response.body) return;
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedReport = "";
      setLoading(false); 

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        accumulatedReport += chunk;
        setAiReport(accumulatedReport); 
      }
    } catch (err: any) {
      setError('Connection Error. Ensure FastAPI is running on port 8000.');
      setLoading(false);
    }
  };

  // Custom Markdown Renderers for a "Beautiful" UI
  const MarkdownComponents = {
    h1: ({ children }: any) => (
      <h1 className="text-4xl font-black text-white mb-8 pb-4 border-b-2 border-blue-500/30 flex items-center gap-3 tracking-tighter uppercase italic">
        <FileText className="text-blue-400 w-10 h-10" /> {children}
      </h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-2xl font-bold text-blue-300 mt-12 mb-6 flex items-center gap-2 bg-blue-500/10 p-3 rounded-xl border-l-4 border-blue-500 shadow-sm">
         <Activity size={22} className="text-blue-400" /> {children}
      </h2>
    ),
    h3: ({ children }: any) => {
      const text = String(children).toLowerCase();
      let Icon = Stethoscope;
      let colorClass = "text-emerald-400";
      let bgClass = "bg-emerald-500/5";
      
      if (text.includes('treatment') || text.includes('medication')) {
        Icon = Pill;
        colorClass = "text-purple-400";
        bgClass = "bg-purple-500/5";
      } else if (text.includes('test') || text.includes('diagnostic')) {
        Icon = Microscope;
        colorClass = "text-cyan-400";
        bgClass = "bg-cyan-500/5";
      } else if (text.includes('care') || text.includes('emergency') || text.includes('red flag')) {
        Icon = AlertTriangle;
        colorClass = "text-red-400 animate-pulse";
        bgClass = "bg-red-500/10 border border-red-500/20";
      } else if (text.includes('reference')) {
        Icon = BookOpen;
        colorClass = "text-yellow-400";
      }

      return (
        <h3 className={`text-xl font-bold ${colorClass} mt-8 mb-4 flex items-center gap-2 p-3 rounded-lg ${bgClass}`}>
          <Icon size={20} /> {children}
        </h3>
      );
    },
    p: ({ children }: any) => (
      <p className="text-gray-300 leading-relaxed mb-4 text-lg font-medium opacity-90">{children}</p>
    ),
    strong: ({ children }: any) => (
      <strong className="text-white font-black bg-white/10 px-1.5 py-0.5 rounded border border-white/10">{children}</strong>
    ),
    li: ({ children }: any) => (
      <li className="flex items-start gap-3 mb-3 text-gray-300 group">
        <CheckCircle2 size={18} className="mt-1 text-emerald-500 flex-shrink-0 group-hover:scale-125 transition-transform" />
        <span className="text-lg">{children}</span>
      </li>
    ),
    ul: ({ children }: any) => <ul className="list-none space-y-1 my-6">{children}</ul>,
  };

  return (
    <div className="pt-24 pb-20 px-4 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-6 shadow-lg shadow-blue-500/10">
           <Zap size={14} className="fill-blue-400" /> Advanced Medical Intelligence
        </div>
        <h2 className="text-5xl font-black text-white mb-4 tracking-tighter uppercase italic">
          PulmoCare <span className="text-blue-500">Expert</span> Analysis
        </h2>
        <p className="text-gray-500 text-xl font-medium">Precision clinical reasoning powered by Gemini 2.5 Flash</p>
      </motion.div>

      <div className="space-y-12">
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="p-10 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <form onSubmit={handlePredict} className="space-y-8">
            <div className="relative">
              <label className="block text-sm font-bold text-gray-500 mb-3 uppercase tracking-widest flex items-center gap-2">
                <ClipboardList size={16} className="text-blue-500" /> Patient Presentation
              </label>
              <textarea 
                value={symptoms} 
                onChange={(e) => setSymptoms(e.target.value)} 
                placeholder="Detail symptoms (e.g. chronic non-productive cough, exertional dyspnea, pleuritic chest pain)..." 
                className="w-full bg-black/40 border border-white/10 rounded-3xl p-6 text-white placeholder-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 text-xl transition-all min-h-[160px] shadow-inner" 
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-6 items-end">
              <div className="w-full sm:w-1/3">
                <label className="block text-sm font-bold text-gray-500 mb-3 uppercase tracking-widest flex items-center gap-2"><User size={16} className="text-blue-500" /> Patient Age</label>
                <input type="number" value={age} onChange={(e) => setAge(Number(e.target.value))} className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-white text-xl font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/20 shadow-inner" />
              </div>
              <button disabled={loading} className="w-full sm:flex-1 h-[72px] bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white rounded-3xl font-black text-xl uppercase tracking-wider flex items-center justify-center gap-4 shadow-[0_10px_30px_rgba(37,99,235,0.4)] transition-all disabled:opacity-50 hover:scale-[1.02] active:scale-95 group">
                {loading ? <Loader2 className="animate-spin" /> : <><Activity size={24} className="group-hover:rotate-12 transition-transform" /> Run Diagnostics</>}
              </button>
            </div>
          </form>
          {error && <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-center text-sm font-bold">{error}</div>}
        </motion.div>

        <AnimatePresence>
          {(loading || aiReport) && (
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="p-1 md:p-12 rounded-[3rem] bg-gradient-to-b from-white/[0.07] to-transparent border border-white/10 backdrop-blur-md shadow-2xl relative overflow-hidden min-h-[400px]">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 via-purple-500 to-emerald-500" />
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/10 blur-[150px] -z-10 rounded-full" />
              
              <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-6 border-b border-white/10 pb-10">
                <div className="flex items-center gap-5">
                  <div className="p-4 bg-blue-600 rounded-3xl shadow-xl shadow-blue-900/40">
                      <Stethoscope className="text-white w-8 h-8" />
                  </div>
                  <div>
                      <h3 className="text-3xl font-black text-white tracking-tighter uppercase italic">Clinical Narrative</h3>
                      <div className="flex gap-3 mt-1">
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 font-black tracking-widest uppercase">Validated</span>
                        <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20 font-black tracking-widest uppercase">Gemini 2.5 Flash</span>
                      </div>
                  </div>
                </div>
              </div>

              <div className="max-w-none">
                <ReactMarkdown components={MarkdownComponents} remarkPlugins={[remarkGfm]}>
                  {aiReport}
                </ReactMarkdown>
                
                {loading && !aiReport && (
                  <div className="space-y-8 animate-pulse">
                    <div className="h-12 w-1/2 bg-white/5 rounded-2xl" />
                    <div className="space-y-3">
                        <div className="h-4 w-full bg-white/5 rounded-full" />
                        <div className="h-4 w-[95%] bg-white/5 rounded-full" />
                        <div className="h-4 w-[90%] bg-white/5 rounded-full" />
                    </div>
                    <div className="h-10 w-1/3 bg-white/5 rounded-xl mt-12" />
                  </div>
                )}
              </div>

              {aiReport && !loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="mt-20 pt-10 border-t border-white/10">
                   <div className="flex flex-col items-center gap-6">
                      <div className="flex gap-4">
                        {['CDC', 'WHO', 'GINA', 'BTS'].map(ref => (
                          <span key={ref} className="text-[10px] font-black text-gray-600 tracking-widest border border-white/5 px-4 py-1.5 rounded-full uppercase hover:text-white hover:border-blue-500/50 transition-colors cursor-default">
                            {ref} Protocol
                          </span>
                        ))}
                      </div>
                      <p className="text-[10px] text-gray-600 font-bold italic text-center max-w-xl leading-relaxed uppercase tracking-tighter">
                        This AI-generated clinical report is for decision support only. 
                        Clinical judgment and confirmatory diagnostic testing must be prioritized.
                      </p>
                   </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
