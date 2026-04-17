import React, { useState } from 'react';
import { Icon } from '../components/Icon';
import { extractTextFromPDF, parsePageSelection } from '../lib/pdfjsHelper';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default function AIChatTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pdfTextBlocks, setPdfTextBlocks] = useState<string[]>([]);
  const [questions, setQuestions] = useState<{ q: string; a: string }[]>([]);
  const [currentQuery, setCurrentQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageSelection, setPageSelection] = useState('');
  const [error, setError] = useState('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setLoading(true);
    setError('');
    try {
      const texts = await extractTextFromPDF(f);
      setPdfTextBlocks(texts);
    } catch (e: any) {
      setError('Failed to process PDF: ' + e.message);
    }
    setLoading(false);
  };

  const handleQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentQuery.trim() || pdfTextBlocks.length === 0) return;

    setLoading(true);
    try {
       const selectedIndices = parsePageSelection(pageSelection, pdfTextBlocks.length);
       const selectedText = selectedIndices.map(i => `--- PAGE ${i} ---\n${pdfTextBlocks[i - 1] || ''}`).join('\n\n');

       const prompt = `You are a helpful AI assistant analyzing a PDF document. Here is the text from the selected pages of the document:\n\n${selectedText}\n\nUser Question: ${currentQuery}\n\nAnswer the user securely and accurately.`;
       
       const response = await ai.models.generateContent({
         model: 'gemini-3.1-flash-lite-preview',
         contents: prompt
       });

       setQuestions([...questions, { q: currentQuery, a: response.text || 'No response.' }]);
       setCurrentQuery('');
    } catch (e: any) {
      setError('Failed to get answer: ' + e.message);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col md:flex-row h-full gap-6">
      {/* Left Panel: Upload & Preview */}
      <div className="w-full md:w-1/2 flex flex-col">
        {!file ? (
           <label className="flex-1 border-2 border-dashed border-indigo-500/30 rounded-xl flex flex-col items-center justify-center bg-indigo-500/10 hover:bg-indigo-500/20 transition-colors cursor-pointer p-8 text-center min-h-[400px]">
             <input type="file" accept="application/pdf" className="hidden" onChange={handleFileUpload} />
             <Icon name="UploadCloud" className="w-12 h-12 text-indigo-400 mb-4" />
             <p className="font-semibold text-white text-lg mb-2">Upload PDF to Chat</p>
             <p className="text-slate-400 text-sm">Select a PDF file to begin analysis</p>
           </label>
        ) : (
           <div className="flex-1 flex flex-col border border-slate-700 rounded-xl bg-slate-800 overflow-hidden">
             <div className="p-4 bg-slate-800/80 border-b border-slate-700 flex justify-between items-center">
               <span className="font-medium text-slate-200 truncate">{file.name}</span>
               <button onClick={() => { setFile(null); setPdfTextBlocks([]); setQuestions([]); }} className="text-red-400 text-sm hover:underline">Remove</button>
             </div>
             <div className="flex-1 p-4 overflow-y-auto">
               <p className="text-sm font-medium text-slate-300 mb-2">Pages Selection:</p>
               <input 
                 type="text" 
                 value={pageSelection}
                 onChange={e => setPageSelection(e.target.value)}
                 placeholder={`e.g. 1-3, 5, 8-${pdfTextBlocks.length}`}
                 className="w-full px-3 py-2 border border-slate-600 bg-slate-700 text-white rounded mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-slate-400"
               />
               <p className="text-xs text-slate-500 mb-4">Leave empty to analyze all {pdfTextBlocks.length} pages.</p>
               
               <div className="border border-slate-700 bg-slate-900 p-4 rounded text-xs text-slate-400 font-mono h-48 overflow-y-auto whitespace-pre-wrap">
                 {pdfTextBlocks[0]?.substring(0, 500)}...<br/><br/>[PDF Content extracted and ready]
               </div>
             </div>
           </div>
        )}
      </div>

      {/* Right Panel: Chat Interface */}
      <div className="w-full md:w-1/2 flex flex-col border border-slate-700 rounded-xl bg-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-700 bg-slate-800/80">
          <h3 className="font-semibold text-white flex items-center">
            <Icon name="MessageSquare" className="w-4 h-4 mr-2 text-indigo-400" />
            AI Assistant
          </h3>
        </div>
        
        <div className="flex-1 p-4 overflow-y-auto space-y-4 max-h-[400px]">
          {questions.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500">
              <Icon name="Bot" className="w-12 h-12 mb-2 opacity-50" />
              <p>Upload a PDF and ask me anything!</p>
            </div>
          ) : (
            questions.map((q, i) => (
              <div key={i} className="flex flex-col space-y-2">
                <div className="self-end bg-indigo-600 text-white p-3 rounded-2xl rounded-tr-sm max-w-[85%] text-sm">
                  {q.q}
                </div>
                <div className="self-start bg-slate-700 text-slate-200 p-3 rounded-2xl rounded-tl-sm max-w-[90%] text-sm whitespace-pre-wrap">
                  {q.a}
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className="flex items-center space-x-2 text-indigo-400 p-2">
              <Icon name="Loader2" className="w-4 h-4 animate-spin" />
              <span className="text-sm">Analyzing...</span>
            </div>
          )}
          {error && <div className="text-sm text-red-400 p-2">{error}</div>}
        </div>

        <div className="p-4 border-t border-slate-700">
          <form onSubmit={handleQuery} className="flex space-x-2">
            <input 
              type="text" 
              value={currentQuery}
              onChange={e => setCurrentQuery(e.target.value)}
              disabled={!file || loading}
              placeholder={file ? "Ask about your PDF..." : "Upload a PDF first"}
              className="flex-1 px-4 py-2 border border-slate-600 bg-slate-700 text-white rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none disabled:opacity-50 text-sm placeholder-slate-400"
            />
            <button 
              type="submit" 
              disabled={!file || loading || !currentQuery.trim()}
              className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-500 transition-colors disabled:opacity-50 w-10 h-10 flex items-center justify-center"
            >
              <Icon name="Send" className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
