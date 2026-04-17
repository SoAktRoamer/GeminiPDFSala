import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ToolGrid from './components/ToolGrid';
import ToolWorkspace from './tools/ToolWorkspace';
import SEOArticles from './components/SEOArticles';
import FAQ from './components/FAQ';
import AuthModal from './components/AuthModal';
import ProfileModal from './components/ProfileModal';
import MyFiles from './components/MyFiles';
import { useAuth } from './contexts/AuthContext';

export default function App() {
  const { currentUser } = useAuth();
  const [activeToolId, setActiveToolId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showMyFiles, setShowMyFiles] = useState(false);

  const resetView = () => {
    setActiveToolId(null);
    setShowMyFiles(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 font-sans">
      <Header 
        onHome={resetView}
        onLoginClick={() => setShowAuthModal(true)}
        onProfileClick={() => setShowProfileModal(true)}
        onMyFilesClick={() => setShowMyFiles(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <div className="pt-20 pb-8 max-w-7xl mx-auto px-4">
        {!showMyFiles && !activeToolId && (
          <div id="ad-above-header" className="w-[80%] mx-auto h-24 mb-10 mt-6 border border-dashed border-slate-700/50 bg-[#1e293b] flex items-center justify-center text-sm text-slate-500 rounded-xl tracking-widest font-semibold uppercase">
            Advertisement Banner
          </div>
        )}

        {showMyFiles ? (
          <MyFiles onClose={resetView} />
        ) : activeToolId ? (
          <ToolWorkspace toolId={activeToolId} onClose={resetView} />
        ) : (
          <>
            <Hero />
            <ToolGrid searchQuery={searchQuery} onSelectTool={setActiveToolId} />
            <SEOArticles />
            <FAQ />
          </>
        )}

        {!showMyFiles && !activeToolId && (
          <div id="ad-above-footer" className="w-[80%] mx-auto h-24 mt-4 mb-20 border border-dashed border-slate-700/50 bg-[#1e293b] flex items-center justify-center text-sm text-slate-500 rounded-xl tracking-widest font-semibold uppercase">
            Advertisement
          </div>
        )}
      </div>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
      {showProfileModal && <ProfileModal onClose={() => setShowProfileModal(false)} />}
    </div>
  );
}
