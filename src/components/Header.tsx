import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Icon } from './Icon';
import { CATEGORIES } from '../lib/tools';

interface HeaderProps {
  onHome: () => void;
  onLoginClick: () => void;
  onProfileClick: () => void;
  onMyFilesClick: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export default function Header({ onHome, onLoginClick, onProfileClick, onMyFilesClick, searchQuery, setSearchQuery }: HeaderProps) {
  const { currentUser, userProfile, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    onHome();
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-[#0f172a] border-b border-slate-800/50 z-50 flex items-center justify-between px-4 md:px-8">
      <div className="flex items-center space-x-2 cursor-pointer" onClick={onHome}>
        <div className="bg-[#6366f1] p-1.5 rounded-lg flex items-center justify-center">
          <Icon name="FileText" className="w-5 h-5 text-white stroke-[2.5]" />
        </div>
        <span className="text-white font-bold text-[1.3rem] tracking-tight">PDFSala</span>
      </div>

      <nav className="hidden md:flex items-center space-x-6 text-[0.9rem] font-medium text-slate-300">
        <button onClick={onHome} className="hover:text-white transition-colors">Home</button>
        
        <div className="relative group">
          <button className="flex items-center hover:text-white transition-colors">
            All Tools <Icon name="ChevronDown" className="w-4 h-4 ml-1" />
          </button>
          <div className="absolute top-full left-0 mt-2 w-48 bg-[#1e293b] border border-slate-700/50 shadow-lg rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
            <div className="py-2">
              {CATEGORIES.map(c => (
                <button key={c} onClick={() => scrollToSection(`category-${c.replace(/\s+/g,'-')}`)} className="block w-full text-left px-4 py-2 hover:bg-slate-700 text-slate-300 hover:text-white text-sm">
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <button onClick={() => scrollToSection('seo-articles')} className="hover:text-white transition-colors">Blogs</button>
        <button onClick={() => scrollToSection('faq')} className="hover:text-white transition-colors">FAQ</button>
        {currentUser && (
          <button onClick={onMyFilesClick} className="hover:text-white transition-colors">My Files</button>
        )}
      </nav>

      <div className="hidden md:flex items-center space-x-4">
        <div className="relative tutorial-search w-64">
           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
             <Icon name="Search" className="h-[1.1rem] w-[1.1rem] text-slate-400" />
           </div>
           <input 
             type="text" 
             className="block w-full pl-9 pr-4 py-1.5 rounded-full border border-slate-700/50 bg-[#1e293b] placeholder-slate-400 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all" 
             placeholder="Search tools..." 
             value={searchQuery}
             onChange={e => setSearchQuery(e.target.value)}
           />
        </div>

        {currentUser ? (
          <>
            <button onClick={onProfileClick} className="flex items-center space-x-2 hover:bg-slate-800 px-3 py-1.5 rounded-full transition-colors tutorial-profile border border-transparent hover:border-slate-700">
              <img src={userProfile?.photoURL || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'} alt="Avatar" className="w-8 h-8 rounded-full bg-slate-700 object-cover" />
              <span className="text-sm font-medium text-slate-200">{userProfile?.name || 'User'}</span>
            </button>
            <button onClick={logout} className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Log Out</button>
          </>
        ) : (
          <button onClick={onLoginClick} className="bg-[#4f46e5] text-white px-5 py-[0.4rem] rounded-full text-[0.95rem] font-medium hover:bg-indigo-500 transition-colors">
            Sign In
          </button>
        )}
      </div>

      {/* Mobile Menu Toggle */}
      <button className="md:hidden p-2 text-slate-300" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
        <Icon name={mobileMenuOpen ? 'X' : 'Menu'} />
      </button>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-[#0f172a] border-b border-slate-800 shadow-lg flex flex-col p-4 md:hidden z-50">
          <div className="mb-4">
             <div className="relative">
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                 <Icon name="Search" className="h-4 w-4 text-slate-400" />
               </div>
               <input 
                 type="text" 
                 className="block w-full pl-9 pr-4 py-2 rounded-lg border border-slate-700 bg-slate-800 placeholder-slate-400 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm" 
                 placeholder="Search tools..." 
                 value={searchQuery}
                 onChange={e => setSearchQuery(e.target.value)}
               />
             </div>
          </div>
          
          <button onClick={() => scrollToSection('top')} className="py-3 text-left border-b border-slate-800 font-medium text-slate-300">Home</button>
          <div className="py-3 border-b border-slate-800">
            <span className="font-medium text-slate-300 mb-2 block">All Tools</span>
            <div className="pl-4 space-y-2">
              {CATEGORIES.map(c => (
                <button key={c} onClick={() => scrollToSection(`category-${c.replace(/\s+/g,'-')}`)} className="block w-full text-left text-sm text-slate-400 hover:text-white">
                  {c}
                </button>
              ))}
            </div>
          </div>
          <button onClick={() => scrollToSection('seo-articles')} className="py-3 text-left border-b border-slate-800 font-medium text-slate-300">Blogs</button>
          <button onClick={() => scrollToSection('faq')} className="py-3 text-left border-b border-slate-800 font-medium text-slate-300">FAQ</button>
          {currentUser && (
            <button onClick={() => { setMobileMenuOpen(false); onMyFilesClick(); }} className="py-3 text-left border-b border-slate-800 font-medium text-slate-300">My Files</button>
          )}
          
          <div className="pt-4 pb-2">
            {currentUser ? (
               <div className="flex flex-col space-y-3">
                 <button onClick={() => { setMobileMenuOpen(false); onProfileClick(); }} className="flex items-center space-x-3 w-full p-2 bg-slate-800 rounded-lg">
                    <img src={userProfile?.photoURL || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'} alt="Avatar" className="w-10 h-10 rounded-full bg-slate-700 object-cover" />
                    <span className="font-medium text-white">{userProfile?.name || 'User'}</span>
                 </button>
                 <button onClick={() => { setMobileMenuOpen(false); logout(); }} className="w-full text-center py-2 text-indigo-400 font-medium">Log Out</button>
               </div>
            ) : (
               <button onClick={() => { setMobileMenuOpen(false); onLoginClick(); }} className="w-full bg-[#4f46e5] text-white rounded-lg py-3 font-medium hover:bg-indigo-500">Sign In</button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
