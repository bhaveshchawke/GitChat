import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Sidebar from '../components/UI/Sidebar';
import ChatBox from '../components/Chat/ChatBox';

function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeRepo, setActiveRepo] = useState(null);

  return (
    <div className="flex h-screen w-full bg-black text-white overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed md:static inset-y-0 left-0 z-50 w-3/4 md:w-1/4 max-w-sm bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out transform ${
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
        <ChatBox 
          activeRepo={activeRepo} 
          onMenuClick={() => setIsSidebarOpen(true)} 
        />
      </div>
    </div>
  );
}

export default Dashboard;
