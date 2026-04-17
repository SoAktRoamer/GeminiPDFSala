import React, { useState } from 'react';
import { TOOLS, ToolCategory } from '../lib/tools';
import { Icon } from './Icon';

const getCategoryColor = (category: ToolCategory) => {
  switch (category) {
    case 'AI Tools':
      return 'bg-[#6366f1]';
    case 'Organize PDF':
    case 'Optimize PDF':
      return 'bg-[#3b82f6]';
    case 'Convert to PDF':
      return 'bg-[#10b981]';
    case 'Convert from PDF':
      return 'bg-[#f97316]';
    case 'Edit PDF':
      return 'bg-[#a855f7]';
    case 'PDF Security':
      return 'bg-[#ef4444]';
    default:
      return 'bg-slate-700';
  }
};

export default function SEOArticles() {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    const next = new Set(openIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setOpenIds(next);
  };

  return (
    <div id="seo-articles" className="max-w-[50rem] mx-auto px-4 py-16">
      <div className="text-center mb-10">
        <h2 className="text-[2.2rem] font-bold text-white mb-4 tracking-tight">Everything You Need to Know About Our PDF Tools</h2>
        <p className="text-[1.1rem] text-slate-400">Discover how PDFSala can transform your document workflow. Read our comprehensive guides on each tool to maximize your productivity and efficiency.</p>
      </div>

      <div className="space-y-4">
        {TOOLS.map(tool => {
          const isOpen = openIds.has(tool.id);
          return (
            <div key={tool.id} className="border border-slate-700/50 rounded-xl bg-[#1e293b] overflow-hidden">
              <button 
                onClick={() => toggle(tool.id)}
                className="w-full px-6 py-4 flex items-center justify-between bg-[#1e293b] hover:bg-slate-700/80 transition-colors"
                aria-expanded={isOpen}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-white ${getCategoryColor(tool.category)}`}>
                    <Icon name={tool.icon} className="w-5 h-5" />
                  </div>
                  <span className="text-[1.1rem] font-bold text-white text-left">{tool.name} Guide</span>
                </div>
                <Icon name={isOpen ? 'ChevronUp' : 'ChevronDown'} className="w-5 h-5 text-slate-400" />
              </button>
              
              {isOpen && (
                <div className="px-6 pb-6 pt-2 text-slate-400 text-sm">
                  <h4 className="font-semibold text-slate-200 mb-2">Why use the {tool.name} tool?</h4>
                  <p className="mb-4">The {tool.name} is built entirely using cutting-edge processing {tool.isAI ? 'paired with advanced AI' : 'paired with fast client-side JavaScript'} to ensure your files are processed securely. Whether you're looking for a Free online PDF editor, a Secure PDF merger, or an AI PDF chat tool, PDFSala is the best choice.</p>
                  
                  <h4 className="font-semibold text-slate-200 mb-2">How to use {tool.name}:</h4>
                  <ol className="list-decimal pl-5 space-y-1 text-slate-400">
                    <li>Upload your file using the "Add File" or direct upload button.</li>
                    <li>Wait for the tool to process your document securely.</li>
                    <li>Download your optimized, merged, or converted PDF without losing quality.</li>
                  </ol>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
