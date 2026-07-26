import React from 'react';
import { Search, MessageSquare, Code, Zap, Trash2, Bell, Settings, Database, BrainCircuit, Sparkles } from 'lucide-react';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import { useChat } from '../../hooks/useChat';
import { cn } from '../../utils/cn';

function ChatBox({ activeRepo }) {
  const { messages, isThinking, sendMessage, clearChat, messagesEndRef } = useChat(activeRepo);

  const suggestionChips = [
    { title: "Where is the auth middleware?", icon: MessageSquare, color: "blue" },
    { title: "Explain the folder structure", icon: Code, color: "yellow" },
    { title: "Find performance bottlenecks", icon: Zap, color: "orange" }
  ];

  return (
    <div className="flex flex-col h-full bg-transparent relative">
      {/* Top Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700/50 bg-slate-900/30 backdrop-blur-md z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <Database size={18} className="text-slate-400 hidden sm:block" />
          <span className="text-slate-400 text-sm font-medium">Selected:</span>
          <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-lg text-sm font-semibold border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
            {activeRepo || 'No repo selected'}
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          {messages.length > 0 && (
            <button 
              onClick={clearChat}
              className="flex items-center gap-2 text-rose-400 hover:text-rose-300 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 hover:border-rose-500/50 px-3 py-1.5 rounded-lg text-sm transition-all shadow-sm"
            >
              <Trash2 size={16} />
              <span className="hidden sm:inline">Clear Chat</span>
            </button>
          )}
          <div className="h-6 w-px bg-slate-700 hidden sm:block"></div>
          <button className="text-slate-400 hover:text-white transition-colors hidden sm:block">
            <Bell size={18} />
          </button>
          <button className="text-slate-400 hover:text-white transition-colors">
            <Settings size={18} />
          </button>
        </div>
      </div>

      {/* Chat History Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 scroll-smooth z-0">
        <div className="max-w-4xl mx-auto h-full flex flex-col">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
              <div className="relative mb-8 group">
                <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full group-hover:bg-emerald-500/30 transition-all duration-700"></div>
                <div className="w-20 h-20 bg-slate-900/80 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-slate-600/50 shadow-[0_0_20px_rgba(16,185,129,0.2)] relative z-10">
                  <BrainCircuit size={40} className="text-emerald-400" />
                </div>
                <Sparkles size={20} className="absolute -top-2 -right-2 text-amber-400 animate-pulse" />
              </div>
              
              <h2 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent mb-4 tracking-tight">
                Interact with Your Codebase
              </h2>
              <p className="text-slate-400 max-w-lg mb-12 text-base leading-relaxed">
                Experience AI-powered code analysis. Ask complex architectural questions, find hidden bugs, or trace implementation details across your entire repository instantly.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-4xl">
                {suggestionChips.map((chip, index) => (
                  <button
                    key={index}
                    onClick={() => sendMessage(chip.title)}
                    className={cn(
                      "flex flex-col items-start p-5 bg-slate-900/40 backdrop-blur-md rounded-2xl transition-all duration-300 text-left group border shadow-lg hover:shadow-xl hover:-translate-y-1 relative overflow-hidden",
                      chip.color === 'blue' && "border-slate-700/60 hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]",
                      chip.color === 'yellow' && "border-slate-700/60 hover:border-amber-500/50 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]",
                      chip.color === 'orange' && "border-slate-700/60 hover:border-orange-500/50 hover:shadow-[0_0_20px_rgba(249,115,22,0.15)]"
                    )}
                  >
                    {/* Subtle gradient background on hover */}
                    <div className={cn(
                      "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500",
                      chip.color === 'blue' && "bg-gradient-to-br from-blue-500 to-transparent",
                      chip.color === 'yellow' && "bg-gradient-to-br from-amber-500 to-transparent",
                      chip.color === 'orange' && "bg-gradient-to-br from-orange-500 to-transparent"
                    )} />
                    
                    <chip.icon size={22} className={cn(
                      "mb-3 relative z-10 transition-transform group-hover:scale-110 duration-300",
                      chip.color === 'blue' && "text-blue-400",
                      chip.color === 'yellow' && "text-amber-400",
                      chip.color === 'orange' && "text-orange-400"
                    )} />
                    <span className="text-[15px] font-medium text-slate-300 group-hover:text-white relative z-10 leading-snug">
                      "{chip.title}"
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="pb-4">
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
              {isThinking && (
                <div className="flex w-full mb-6 justify-start">
                  <div className="flex max-w-[85%] gap-4 rounded-2xl p-4 bg-slate-800/80 text-slate-200 border border-slate-700/50 items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center animate-pulse">
                        <Search size={16} />
                      </div>
                    </div>
                    <div className="flex gap-1.5 items-center">
                      <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} className="h-4" />
            </div>
          )}
        </div>
      </div>

      {/* Input Box */}
      <ChatInput onSendMessage={sendMessage} isThinking={isThinking} />
    </div>
  );
}

export default ChatBox;
