import React, { useState, useEffect } from 'react';
import { BrainCircuit, X, Trash2, Instagram, Linkedin, Mail } from 'lucide-react';
import RepoInputForm from '../Repo/RepoInputForm';
import { cn } from '../../utils/cn';

function Sidebar({ closeSidebar, activeRepo, setActiveRepo }) {
  // Load repos from local storage, or start empty
  const [repos, setRepos] = useState(() => {
    const saved = localStorage.getItem('repoHistory');
    return saved ? JSON.parse(saved) : [];
  });

  // Save to local storage whenever repos list changes
  useEffect(() => {
    localStorage.setItem('repoHistory', JSON.stringify(repos));
  }, [repos]);

  const handleDeleteRepo = (e, repoName) => {
    e.stopPropagation();
    const updatedRepos = repos.filter(r => r !== repoName);
    setRepos(updatedRepos);
    localStorage.removeItem(`chat_${repoName}`);
    if (activeRepo === repoName) {
      setActiveRepo(updatedRepos.length > 0 ? updatedRepos[0] : null);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/40 backdrop-blur-xl border-r border-slate-700/50 shadow-2xl z-20">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-700/50 relative overflow-hidden">
        {/* Subtle background glow for the header */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-emerald-500/10 to-teal-500/10 blur-xl opacity-50 pointer-events-none" />
        
        <div className="flex items-center gap-3 relative z-10">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-600/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <BrainCircuit size={22} className="text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          </div>
          <h1 className="text-xl font-bold tracking-tight bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent">
            GitChatAI
          </h1>
        </div>
        <button 
          onClick={closeSidebar}
          className="md:hidden text-slate-400 hover:text-slate-200 relative z-10 p-2 hover:bg-slate-800 rounded-lg transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Repo Input Section */}
      <div className="p-5 border-b border-slate-700/50 bg-slate-950/20">
        <RepoInputForm onAnalyze={(repoName) => {
          if (!repos.includes(repoName)) {
            setRepos([repoName, ...repos]);
          }
          setActiveRepo(repoName);
          if (closeSidebar) closeSidebar();
        }} />
      </div>

      {/* History */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-2 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500/50 border border-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></span>
          Recent Repositories
        </h2>
        
        <div className="flex flex-col gap-2">
          {repos.map((repo) => {
            const isActive = activeRepo === repo;
            const [owner, name] = repo.split('/');
            
            return (
              <div 
                key={repo} 
                className={cn(
                  "group relative flex items-center rounded-xl overflow-hidden transition-all duration-300 border",
                  isActive 
                    ? "bg-slate-800/80 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]" 
                    : "bg-slate-900/40 border-slate-700/40 hover:border-slate-600/80 hover:bg-slate-800/60"
                )}
              >
                <button
                  onClick={() => {
                    setActiveRepo(repo);
                    if (closeSidebar) closeSidebar();
                  }}
                  className="flex-1 flex flex-col items-start text-left px-4 py-3 transition-colors overflow-hidden pr-10"
                >
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                  )}
                  <div className="flex items-center gap-2 w-full">
                    <span className={cn(
                      "text-sm font-semibold truncate",
                      isActive ? "text-emerald-400" : "text-slate-200 group-hover:text-white"
                    )}>
                      {name || repo}
                    </span>
                  </div>
                  {owner && name && (
                    <span className="text-xs text-slate-500 font-medium truncate mt-0.5">
                      {owner}
                    </span>
                  )}
                </button>
                <button
                  onClick={(e) => handleDeleteRepo(e, repo)}
                  className="absolute right-3 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-all p-2 rounded-lg"
                  title="Delete Chat"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700/50 bg-slate-900/80 backdrop-blur-sm mt-auto">
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Developed by Bhavesh</span>
          <div className="flex gap-4">
            <a href="https://www.instagram.com/bhaavesh.dev/" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-emerald-400 transition-colors" title="Instagram">
              <Instagram size={16} />
            </a>
            <a href="https://www.linkedin.com/in/bhavesh-chawke-607785317/?isSelfProfile=true" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-emerald-400 transition-colors" title="LinkedIn">
              <Linkedin size={16} />
            </a>
            <a href="mailto:bhaveshchawke4321@gmail.com" className="text-slate-500 hover:text-emerald-400 transition-colors" title="Email">
              <Mail size={16} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
