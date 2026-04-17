import React from 'react';
import { TOOLS } from '../lib/tools';
import { Icon } from '../components/Icon';
import AIChatTool from './AIChatTool';
import AISummarizerTool from './AISummarizerTool';
import AIHumanizer from './AIHumanizer';
import GenericPDFTool from './GenericPDFTool';

export default function ToolWorkspace({ toolId, onClose }: { toolId: string, onClose: () => void }) {
  const tool = TOOLS.find(t => t.id === toolId);

  if (!tool) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-6">
      {/* Left Ad Banner sidebar (desktop) */}
      <div className="hidden lg:flex w-48 flex-col space-y-4">
        <div id="ad-left-sidebar" className="w-full h-[600px] border border-dashed border-slate-700 bg-slate-800/30 flex items-center justify-center text-xs text-slate-500 rounded uppercase tracking-widest font-medium text-center">
          Ad Banner
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 bg-[#1e293b] rounded-2xl shadow-sm border border-slate-700 p-6 md:p-8 min-h-[600px] flex flex-col relative">
        <div className="flex items-center space-x-4 mb-8">
          <button onClick={onClose} className="p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
            <Icon name="ArrowLeft" className="w-5 h-5" />
          </button>
          <div className={`p-2 rounded-lg ${tool.isAI ? 'bg-indigo-600/20 text-indigo-400' : 'bg-slate-700 text-slate-300'}`}>
            <Icon name={tool.icon} className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{tool.name}</h2>
            <p className="text-sm text-slate-400">{tool.description}</p>
          </div>
        </div>

        {/* Dynamic Tool Content */}
        <div className="flex-1">
          {tool.id === 'ai-chat' && <AIChatTool />}
          {tool.id === 'ai-summarize' && <AISummarizerTool />}
          {tool.id === 'ai-humanize' && <AIHumanizer />}
          {!['ai-chat', 'ai-summarize', 'ai-humanize'].includes(tool.id) && (
            <GenericPDFTool toolId={tool.id} />
          )}
        </div>
        
        {/* Bottom Ad Banner */}
        <div id="ad-workspace-bottom" className="w-full h-24 border border-dashed border-slate-700 bg-slate-800/30 mt-8 flex items-center justify-center text-xs text-slate-500 rounded uppercase tracking-widest font-medium">
          Ad Banner
        </div>
      </div>

      {/* Right Ad Banner sidebar (desktop) */}
      <div className="hidden lg:flex w-48 flex-col space-y-4">
        <div id="ad-right-sidebar" className="w-full h-[600px] border border-dashed border-slate-700 bg-slate-800/30 flex items-center justify-center text-xs text-slate-500 rounded uppercase tracking-widest font-medium text-center">
          Ad Banner
        </div>
      </div>
    </div>
  );
}
