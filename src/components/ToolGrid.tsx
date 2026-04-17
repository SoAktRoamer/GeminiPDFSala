import React from 'react';
import { TOOLS, CATEGORIES, ToolCategory } from '../lib/tools';
import { Icon } from './Icon';

interface ToolGridProps {
  searchQuery: string;
  onSelectTool: (id: string) => void;
}

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

export default function ToolGrid({ searchQuery, onSelectTool }: ToolGridProps) {
  const filteredTools = TOOLS.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.description.toLowerCase().includes(searchQuery.toLowerCase()));

  const toolsByCategory = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = filteredTools.filter(t => t.category === cat);
    return acc;
  }, {} as Record<ToolCategory, typeof TOOLS>);

  return (
    <div className="max-w-7xl mx-auto pb-20">
      {CATEGORIES.map((category, index) => {
        const catTools = toolsByCategory[category];
        if (catTools.length === 0) return null;

        return (
          <div key={category} id={`category-${category.replace(/\s+/g,'-')}`} className="mb-12">
            <h2 className="text-[1.65rem] font-bold text-white mb-6 tracking-tight flex items-center">
              {category === 'PDF Security' ? 'Security' : category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {catTools.map(tool => (
                <div 
                  key={tool.id} 
                  onClick={() => onSelectTool(tool.id)}
                  className={`relative bg-[#1e293b] rounded-[1rem] p-6 border border-slate-700/50 hover:border-slate-600/80 cursor-pointer transition-all duration-300 ${tool.isAI ? 'tutorial-ai-tool box-border' : ''}`}
                >
                  {tool.isAI && (
                     <div className="absolute top-0 right-0 overflow-hidden rounded-tr-[1rem] rounded-bl-xl">
                       <span className="block bg-[#8b5cf6] text-white text-[10px] tracking-[0.05em] uppercase font-bold px-3 py-1.5">
                         AI Powered
                       </span>
                     </div>
                  )}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 text-white ${getCategoryColor(tool.category)}`}>
                    <Icon name={tool.icon} className="h-6 w-6" />
                  </div>
                  <h3 className="text-[1.1rem] font-bold text-white mb-2">{tool.name}</h3>
                  <p className="text-[0.9rem] text-slate-400 leading-relaxed">{tool.description}</p>
                </div>
              ))}
            </div>

            {/* Slim Banner Between Categories */}
            {index < CATEGORIES.length - 1 && (
              <div className="w-full h-16 border border-dashed border-slate-700/50 bg-[#1e293b] flex items-center justify-center text-xs text-slate-500 mt-12 mb-4 rounded-xl uppercase tracking-widest font-semibold">
                Advertisement
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
