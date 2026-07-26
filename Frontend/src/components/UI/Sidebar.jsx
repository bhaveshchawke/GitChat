import React, { useState, useEffect } from 'react';
import { BrainCircuit, X, Trash2, Mail } from 'lucide-react';
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
    <div className="flex flex-col h-full bg-white border-r border-gray-200 z-20">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-black">
            <BrainCircuit size={22} className="text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-black">
            GitChatAI
          </h1>
        </div>
        <button 
          onClick={closeSidebar}
          className="md:hidden text-gray-500 hover:text-black p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Repo Input Section */}
      <div className="p-5 border-b border-gray-200 bg-gray-50/50">
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
        <h2 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest px-2 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-black"></span>
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
                    ? "bg-gray-100 border-gray-300" 
                    : "bg-white border-transparent hover:border-gray-200 hover:bg-gray-50"
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
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-black" />
                  )}
                  <div className="flex items-center gap-2 w-full">
                    <span className={cn(
                      "text-sm font-semibold truncate",
                      isActive ? "text-black" : "text-gray-700 group-hover:text-black"
                    )}>
                      {name || repo}
                    </span>
                  </div>
                  {owner && name && (
                    <span className="text-xs text-gray-500 font-medium truncate mt-0.5">
                      {owner}
                    </span>
                  )}
                </button>
                <button
                  onClick={(e) => handleDeleteRepo(e, repo)}
                  className="absolute right-3 text-gray-400 hover:text-black hover:bg-gray-200 opacity-0 group-hover:opacity-100 transition-all p-2 rounded-lg"
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
      <div className="p-4 border-t border-gray-200 bg-white mt-auto">
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-gray-500 font-medium">Developed by Bhavesh</span>
          <div className="flex gap-4">
            <a href="https://www.instagram.com/bhaavesh.dev/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-black transition-colors" title="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </a>
            <a href="https://www.linkedin.com/in/bhavesh-chawke-607785317/?isSelfProfile=true" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-black transition-colors" title="LinkedIn">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
            </a>
            <a href="mailto:bhaveshchawke4321@gmail.com" className="text-gray-400 hover:text-black transition-colors" title="Email">
              <Mail size={16} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
