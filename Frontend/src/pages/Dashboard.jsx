import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Sidebar from '../components/UI/Sidebar';
import ChatBox from '../components/Chat/ChatBox';

function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeRepo, setActiveRepo] = useState(null);

  return (
    <div className="flex h-screen w-full bg-slate-900 text-slate-100 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed md:static inset-y-0 left-0 z-50 w-3/4 md:w-1/4 max-w-sm bg-slate-900 border-r border-slate-800 transition-transform duration-300 ease-in-out transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <Sidebar 
          closeSidebar={() => setIsSidebarOpen(false)} 
          activeRepo={activeRepo}
          setActiveRepo={setActiveRepo}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full relative min-w-0">
        {/* Mobile Header for Sidebar Toggle */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900">
          <div className="flex items-center gap-2 font-bold text-indigo-400">
            <span className="text-xl">RepoChat AI</span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-slate-400 hover:text-slate-200"
          >
            <Menu size={24} />
          </button>
        </div>

        <ChatBox activeRepo={activeRepo} />
      </div>
    </div>
  );
}

export default Dashboard;
