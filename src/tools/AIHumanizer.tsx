import React, { useState } from 'react';
import { Icon } from '../components/Icon';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default function AIHumanizer() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleHumanize = async () => {
    if (!inputText.trim()) return;
    
    setLoading(true);
    setError('');
    try {
      const prompt = `You are an expert humanizer. Rewrite the following AI-generated text to sound completely natural, conversational, and human-written. Remove robotic phrasing, vary sentence length, and add natural flow.\n\nText to humanize:\n${inputText}`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite-preview',
        contents: prompt
      });

      setOutputText(response.text || 'Could not humanize.');
    } catch (e: any) {
      setError('Failed to process text: ' + e.message);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col">
          <label className="font-semibold text-white mb-2">Original AI Text</label>
          <textarea 
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder="Paste your AI-generated text here..."
            className="w-full h-80 p-4 border border-slate-700 bg-slate-800 text-white rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none placeholder-slate-500"
          ></textarea>
        </div>
        
        <div className="flex flex-col">
          <label className="font-semibold text-white mb-2">Humanized Result</label>
          <div className="w-full h-80 p-4 border border-slate-700 rounded-xl bg-slate-800/80 overflow-y-auto whitespace-pre-wrap text-slate-300">
            {loading ? (
              <div className="flex items-center justify-center h-full text-indigo-400">
                <Icon name="Loader2" className="w-8 h-8 animate-spin" />
              </div>
            ) : outputText ? (
              outputText
            ) : (
              <span className="text-slate-500 italic">Your humanized text will appear here...</span>
            )}
          </div>
        </div>
      </div>

      {error && <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 py-2 px-4 rounded">{error}</div>}

      <div className="flex justify-center">
        <button 
          onClick={handleHumanize}
          disabled={!inputText.trim() || loading}
          className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-indigo-500 transition-colors disabled:opacity-50 flex items-center space-x-2 shadow-sm"
        >
          <Icon name="Wand2" className="w-5 h-5" />
          <span>Humanize Text</span>
        </button>
      </div>
    </div>
  );
}
