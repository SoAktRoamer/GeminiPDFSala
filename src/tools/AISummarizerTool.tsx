import React, { useState } from 'react';
import { Icon } from '../components/Icon';
import { extractTextFromPDF } from '../lib/pdfjsHelper';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default function AISummarizerTool() {
  const [file, setFile] = useState<File | null>(null);
  const [summary, setSummary] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setLoading(true);
    setError('');
    setSummary('');

    try {
      const texts = await extractTextFromPDF(f);
      const fullText = texts.join('\n\n');

      const prompt = `Analyze the following PDF text and provide a concise, 5-bullet point summary of its core contents:\n\n${fullText.substring(0, 30000)}`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite-preview',
        contents: prompt
      });

      setSummary(response.text || 'No summary could be generated.');
    } catch (e: any) {
      setError('Failed to summarize PDF: ' + e.message);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full gap-6 max-w-3xl mx-auto">
      {!file ? (
         <label className="w-full border-2 border-dashed border-indigo-500/30 rounded-xl flex flex-col items-center justify-center bg-indigo-500/10 hover:bg-indigo-500/20 transition-colors cursor-pointer p-12 text-center min-h-[300px]">
           <input type="file" accept="application/pdf" className="hidden" onChange={handleFileUpload} />
           <Icon name="FileText" className="w-16 h-16 text-indigo-400 mb-6" />
           <p className="font-bold text-white text-2xl mb-2">Upload to Summarize</p>
           <p className="text-slate-400">Get a 5-bullet summary instantly</p>
         </label>
      ) : (
         <div className="w-full flex flex-col border border-slate-700 rounded-xl bg-slate-800 overflow-hidden shadow-sm">
           <div className="p-4 bg-slate-800/80 border-b border-slate-700 flex justify-between items-center">
             <span className="font-medium text-slate-200 truncate">{file.name}</span>
             <button onClick={() => { setFile(null); setSummary(''); }} className="text-red-400 text-sm hover:underline">Start Over</button>
           </div>
           
           <div className="p-8">
             {loading ? (
               <div className="flex flex-col items-center justify-center py-12 text-indigo-400">
                 <Icon name="Loader2" className="w-12 h-12 animate-spin mb-4" />
                 <p className="text-lg font-medium">Reading and Summarizing...</p>
               </div>
             ) : error ? (
               <div className="text-red-400 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-center">{error}</div>
             ) : summary ? (
               <div className="prose prose-invert max-w-none">
                 <h3 className="text-xl font-bold mb-4 flex items-center text-white">
                   <Icon name="Sparkles" className="w-5 h-5 mr-2 text-indigo-400" />
                   AI Summary
                 </h3>
                 <div className="text-slate-300 whitespace-pre-wrap leading-relaxed bg-slate-700 p-6 rounded-xl border border-slate-600">
                   {summary}
                 </div>
               </div>
             ) : null}
           </div>
         </div>
      )}
    </div>
  );
}
